"""
Data Agent — Multi-Agent Data Analyst
======================================
Converts natural language analytical questions into safe SQL queries,
executes them against the in-process DuckDB engine, and provides automated
1-turn self-correction if syntax errors occur.

Per Master Plan Section 5.3 & 12.3:
  - Strict read-only SELECT-only allow-list
  - Automated self-correction retry
  - Returns raw result table + exact query executed
"""

import re
import time
import pandas as pd
from typing import Dict, Any, Optional, Tuple, List

from backend.config import settings, get_llm
from backend.db.duckdb_loader import DuckDBEngine, QuerySafetyError, QueryTimeoutError
from data.loaders.csv_loader import (
    load_dataset,
    MEASURE_COLUMNS,
    DIMENSION_COLUMNS,
    BOOLEAN_COLUMNS,
    DATETIME_COLUMNS
)

# ── SQL Generation Templates (Fast, Deterministic Fallback) ──
TEMPLATE_PATTERNS = [
    # Cost Savings (must be before the generic 'total' pattern)
    {
        "pattern": r"cost saving|savings by|total savings",
        "builder": lambda m, q: (
            "SELECT Department, SUM(Cost_Savings_USD) AS total_cost_savings, "
            "AVG(Cost_Savings_USD) AS avg_savings, COUNT(*) AS transactions "
            "FROM enterprise_data GROUP BY Department ORDER BY total_cost_savings DESC;"
            if "department" in q.lower() else
            "SELECT Business_Unit, SUM(Cost_Savings_USD) AS total_cost_savings, "
            "COUNT(*) AS transactions FROM enterprise_data "
            "GROUP BY Business_Unit ORDER BY total_cost_savings DESC;"
        )
    },
    # SLA Breach Rate
    {
        "pattern": r"sla breach|breach rate|breached",
        "builder": lambda m, q: (
            "SELECT Department, AVG(CAST(SLA_Breached AS INT)) * 100 AS sla_breach_pct, COUNT(*) AS total FROM enterprise_data "
            "GROUP BY Department ORDER BY sla_breach_pct DESC;"
            if "department" in q.lower() else
            "SELECT Assigned_Agent, AVG(CAST(SLA_Breached AS INT)) * 100 AS sla_breach_pct, COUNT(*) AS total FROM enterprise_data "
            "GROUP BY Assigned_Agent ORDER BY sla_breach_pct DESC;"
        )
    },
    # Human Review / Bottleneck Rate
    {
        "pattern": r"human review|requires.human|bottleneck",
        "builder": lambda m, q: (
            "SELECT Assigned_Agent, AVG(CAST(Requires_Human_Review AS INT)) * 100 AS review_rate, "
            "SUM(CAST(Human_Bottleneck AS INT)) AS bottleneck_count FROM enterprise_data "
            "GROUP BY Assigned_Agent ORDER BY review_rate DESC;"
        )
    },
    # Escalation Level
    {
        "pattern": r"escalation|escalation level",
        "builder": lambda m, q: (
            "SELECT Escalation_Level, COUNT(*) AS count, AVG(Processing_Time_Sec) AS avg_delay, "
            "AVG(CAST(SLA_Breached AS INT)) * 100 AS breach_pct FROM enterprise_data "
            "GROUP BY Escalation_Level ORDER BY count DESC;"
        )
    },
    # Input / Output Tokens
    {
        "pattern": r"input token|output token|token volume|processes.*token",
        "builder": lambda m, q: (
            "SELECT Assigned_Agent, SUM(Input_Tokens) AS total_input_tokens, SUM(Output_Tokens) AS total_output_tokens, "
            "SUM(Total_Tokens) AS total_tokens FROM enterprise_data "
            "GROUP BY Assigned_Agent ORDER BY total_input_tokens DESC;"
        )
    },
    # Revenue Impact
    {
        "pattern": r"revenue impact|revenue.+business unit|business unit.+revenue",
        "builder": lambda m, q: (
            "SELECT Business_Unit, SUM(Revenue_Impact_USD) AS net_revenue_impact, COUNT(*) AS transactions FROM enterprise_data "
            "GROUP BY Business_Unit ORDER BY net_revenue_impact DESC;"
        )
    },
    # Automation / Auto-resolved by quarter
    {
        "pattern": r"automation rate|auto.resolv|autonomous resolution",
        "builder": lambda m, q: (
            "SELECT Quarter, AVG(CASE WHEN Decision_Outcome = 'Auto-Resolved' THEN 1.0 ELSE 0.0 END) * 100 AS automation_pct, "
            "COUNT(*) AS total FROM enterprise_data GROUP BY Quarter ORDER BY Quarter;"
            if "quarter" in q.lower() else
            "SELECT Assigned_Agent, AVG(CASE WHEN Decision_Outcome = 'Auto-Resolved' THEN 1.0 ELSE 0.0 END) * 100 AS automation_pct, "
            "COUNT(*) AS total FROM enterprise_data GROUP BY Assigned_Agent ORDER BY automation_pct DESC;"
        )
    },
    # False Confidence
    {
        "pattern": r"false confidence|silent failure|false.confid",
        "builder": lambda m, q: (
            "SELECT Assigned_Agent, SUM(CAST(False_Confidence_Flag AS INT)) AS false_confidence_count, "
            "COUNT(*) AS total FROM enterprise_data GROUP BY Assigned_Agent ORDER BY false_confidence_count DESC;"
        )
    },
    # Anomaly Score / Anomalous records (SQL analytics, not full scan)
    {
        "pattern": r"anomaly score|anomalous|highest anomaly|most anomal",
        "builder": lambda m, q: (
            "SELECT Assigned_Agent, AVG(Anomaly_Score) AS avg_anomaly_score, SUM(CAST(Anomaly_Detected AS INT)) AS anomaly_count "
            "FROM enterprise_data GROUP BY Assigned_Agent ORDER BY avg_anomaly_score DESC LIMIT 10;"
        )
    },
    # Risk Level breakdown
    {
        "pattern": r"risk level|high risk transaction|by risk",
        "builder": lambda m, q: (
            "SELECT Department, Risk_Level, COUNT(*) AS count, AVG(Anomaly_Score) AS avg_anomaly_score "
            "FROM enterprise_data WHERE Risk_Level = 'High' GROUP BY Department, Risk_Level ORDER BY count DESC;"
            if "high risk" in q.lower() else
            "SELECT Risk_Level, COUNT(*) AS count, AVG(Anomaly_Score) AS avg_anomaly_score "
            "FROM enterprise_data GROUP BY Risk_Level ORDER BY avg_anomaly_score DESC;"
        )
    },
    # Cost Per Token
    {
        "pattern": r"cost per token|cost.+token|token cost",
        "builder": lambda m, q: (
            "SELECT Business_Unit, AVG(Cost_Per_Token) AS avg_cost_per_token, SUM(Transaction_Amount_USD) AS total_spend "
            "FROM enterprise_data GROUP BY Business_Unit ORDER BY avg_cost_per_token DESC;"
        )
    },
    # Top/Worst N by Metric
    {
        "pattern": r"(highest|lowest|top|worst|best)\s+(token efficiency|latency|processing time|cost savings|revenue|sla breach)",
        "builder": lambda m, q: _build_ranking_query(q)
    },
    # Average Metric by Dimension
    {
        "pattern": r"(average|mean|avg)\s+(token efficiency|processing time|cost|confidence|anomaly score|savings)",
        "builder": lambda m, q: _build_group_aggregation(q)
    },
    # Total / Sum Metrics
    {
        "pattern": r"(total|sum)\s+(cost savings|revenue impact|tokens|input tokens|output tokens|transactions)",
        "builder": lambda m, q: _build_sum_aggregation(q)
    },
    # Distribution / Breakdown
    {
        "pattern": r"(distribution|breakdown|by department|by agent|by business unit|by region|by priority)",
        "builder": lambda m, q: _build_breakdown_query(q)
    }
]


def _build_ranking_query(query: str) -> str:
    """Builds deterministic ranking SQL query based on keywords."""
    q = query.lower()
    order = "ASC" if any(w in q for w in ["lowest", "worst", "slowest", "least"]) else "DESC"

    if "token efficiency" in q:
        dim = "Department" if "department" in q else ("Assigned_Agent" if "agent" in q else "Business_Unit")
        return f"SELECT {dim}, AVG(Token_Efficiency) AS avg_token_efficiency, COUNT(*) AS record_count FROM enterprise_data GROUP BY {dim} ORDER BY avg_token_efficiency {order} LIMIT 10;"

    if "processing time" in q or "latency" in q:
        dim = "Assigned_Agent" if "agent" in q else ("Department" if "department" in q else "Priority_Level")
        return f"SELECT {dim}, AVG(Processing_Time_Sec) AS avg_processing_time, COUNT(*) AS record_count FROM enterprise_data GROUP BY {dim} ORDER BY avg_processing_time {order} LIMIT 10;"

    if "sla breach" in q:
        dim = "Department" if "department" in q else ("Assigned_Agent" if "agent" in q else "Quarter")
        return f"SELECT {dim}, AVG(CAST(SLA_Breached AS INT)) * 100 AS sla_breach_rate, COUNT(*) AS record_count FROM enterprise_data GROUP BY {dim} ORDER BY sla_breach_rate {order} LIMIT 10;"

    if "savings" in q:
        dim = "Department" if "department" in q else "Business_Unit"
        return f"SELECT {dim}, SUM(Cost_Savings_Potential_USD) AS total_savings, COUNT(*) AS record_count FROM enterprise_data WHERE Decision_Outcome = 'Auto-Resolved' GROUP BY {dim} ORDER BY total_savings {order} LIMIT 10;"

    # Default fallback ranking
    return "SELECT Department, AVG(Token_Efficiency) AS avg_token_efficiency, SUM(Cost_Savings_Potential_USD) AS total_savings FROM enterprise_data GROUP BY Department ORDER BY avg_token_efficiency DESC LIMIT 10;"


def _build_group_aggregation(query: str) -> str:
    """Builds group aggregation query."""
    q = query.lower()
    group_col = "Department"
    if "agent" in q:
        group_col = "Assigned_Agent"
    elif "business unit" in q or "region" in q:
        group_col = "Business_Unit"
    elif "quarter" in q:
        group_col = "Quarter"
    elif "priority" in q:
        group_col = "Priority_Level"

    if "token efficiency" in q:
        return f"SELECT {group_col}, AVG(Token_Efficiency) AS avg_token_efficiency FROM enterprise_data GROUP BY {group_col} ORDER BY avg_token_efficiency DESC;"
    elif "processing time" in q or "latency" in q:
        return f"SELECT {group_col}, AVG(Processing_Time_Sec) AS avg_processing_time FROM enterprise_data GROUP BY {group_col} ORDER BY avg_processing_time ASC;"
    elif "cost" in q:
        return f"SELECT {group_col}, AVG(Cost_Per_Token) AS avg_cost_per_token, AVG(Transaction_Amount_USD) AS avg_transaction_usd FROM enterprise_data GROUP BY {group_col} ORDER BY avg_cost_per_token ASC;"
    elif "confidence" in q:
        return f"SELECT {group_col}, AVG(Confidence_Score) AS avg_confidence FROM enterprise_data GROUP BY {group_col} ORDER BY avg_confidence DESC;"

    return f"SELECT {group_col}, AVG(Token_Efficiency) AS avg_token_efficiency, AVG(Processing_Time_Sec) AS avg_processing_time FROM enterprise_data GROUP BY {group_col};"


def _build_sum_aggregation(query: str) -> str:
    q = query.lower()
    group_col = "Department" if "department" in q else ("Business_Unit" if "business unit" in q else "Quarter")
    if "savings" in q:
        return f"SELECT {group_col}, SUM(Cost_Savings_Potential_USD) AS total_cost_savings FROM enterprise_data WHERE Decision_Outcome = 'Auto-Resolved' GROUP BY {group_col} ORDER BY total_cost_savings DESC;"
    elif "revenue" in q:
        return f"SELECT {group_col}, SUM(Revenue_Impact_USD) AS total_revenue_impact FROM enterprise_data GROUP BY {group_col} ORDER BY total_revenue_impact DESC;"
    elif "tokens" in q:
        return f"SELECT {group_col}, SUM(Input_Tokens) AS total_input_tokens, SUM(Output_Tokens) AS total_output_tokens, SUM(Total_Tokens) AS total_tokens FROM enterprise_data GROUP BY {group_col} ORDER BY total_tokens DESC;"

    return f"SELECT {group_col}, SUM(Cost_Savings_Potential_USD) AS total_savings, SUM(Revenue_Impact_USD) AS total_revenue FROM enterprise_data GROUP BY {group_col};"


def _build_breakdown_query(query: str) -> str:
    q = query.lower()
    if "priority" in q:
        return "SELECT Priority_Level, COUNT(*) AS count, AVG(Processing_Time_Sec) AS avg_latency, AVG(CAST(SLA_Breached AS INT))*100 AS sla_breach_pct FROM enterprise_data GROUP BY Priority_Level ORDER BY count DESC;"
    if "decision" in q or "outcome" in q:
        return "SELECT Decision_Outcome, COUNT(*) AS count, SUM(Cost_Savings_Potential_USD) AS total_savings FROM enterprise_data GROUP BY Decision_Outcome ORDER BY count DESC;"
    if "agent" in q:
        return "SELECT Assigned_Agent, COUNT(*) AS volume, AVG(Token_Efficiency) AS avg_efficiency, AVG(CAST(SLA_Breached AS INT))*100 AS sla_breach_pct FROM enterprise_data GROUP BY Assigned_Agent ORDER BY volume DESC;"

    return "SELECT Department, COUNT(*) AS volume, AVG(Token_Efficiency) AS avg_efficiency, SUM(Cost_Savings_Potential_USD) AS total_savings FROM enterprise_data GROUP BY Department ORDER BY volume DESC;"


class DataAgent:
    """
    Translates natural language questions to validated DuckDB SQL queries,
    manages execution, and performs error self-correction.
    """

    def __init__(self, engine: Optional[DuckDBEngine] = None):
        self.engine = engine or DuckDBEngine()
        self.llm = None
        self._init_llm()
        self._ensure_data_loaded()

    def _init_llm(self):
        try:
            self.llm = get_llm(temperature=0.0)
        except Exception as e:
            print(f"[DataAgent] LLM initialization deferred/failed ({e}), using template engine.")

    def _ensure_data_loaded(self):
        """Ensure DuckDB engine has loaded the master cleaned dataset."""
        try:
            res = self.engine.execute_query("SELECT COUNT(*) AS cnt FROM enterprise_data")
            if res.iloc[0]["cnt"] > 0:
                return
        except Exception:
            pass

        # Load dataset into DuckDB
        data_path = settings.DATA_PATH
        if not data_path.exists():
            # Fallback to master cleaned dataset if available
            alt_path = settings.PROJECT_ROOT / "data" / "master_cleaned_dataset.csv"
            if alt_path.exists():
                data_path = alt_path

        print(f"[DataAgent] Pre-loading dataset {data_path} into DuckDB engine...")
        self.engine.load_data(str(data_path))

    def generate_sql(self, question: str, retrieved_context: str = "") -> str:
        """
        Generate SQL query for the question using LLM or template engine.
        """
        if self.llm:
            try:
                schema_hint = (
                    "Table: enterprise_data\n"
                    f"Dimensions: {', '.join(DIMENSION_COLUMNS[:8])}\n"
                    f"Measures: {', '.join(MEASURE_COLUMNS[:10])}\n"
                    f"Booleans: {', '.join(BOOLEAN_COLUMNS[:6])}\n"
                )
                prompt = (
                    f"You are an enterprise SQL expert for DuckDB.\n"
                    f"Write a single valid, read-only SELECT SQL query to answer the user's business question.\n"
                    f"Rules:\n"
                    f"1. ONLY write SQL. Do not include markdown or explanations.\n"
                    f"2. Use table name 'enterprise_data'.\n"
                    f"3. Do NOT use DROP, INSERT, DELETE, UPDATE, ALTER, CREATE.\n"
                    f"4. Filter on 2025 data if relative dates ('last quarter', 'this year') are mentioned.\n\n"
                    f"{schema_hint}\n"
                    f"{retrieved_context}\n\n"
                    f"Question: {question}\n"
                    f"SQL Query:"
                )
                response = self.llm.invoke(prompt)
                content = response.content if hasattr(response, "content") else str(response)
                # Clean markdown backticks
                cleaned_sql = re.sub(r"```(sql)?", "", content).strip().rstrip(";") + ";"
                if cleaned_sql.lower().startswith("select") or cleaned_sql.lower().startswith("with"):
                    return cleaned_sql
            except Exception as e:
                print(f"[DataAgent] LLM SQL generation failed ({e}), falling back to deterministic template.")

        # Deterministic Template Fallback
        for pattern_info in TEMPLATE_PATTERNS:
            if re.search(pattern_info["pattern"], question.lower()):
                return pattern_info["builder"](None, question)

        # Broad default aggregation
        return _build_breakdown_query(question)

    def execute_and_correct(self, sql: str, question: str) -> Tuple[pd.DataFrame, str, Optional[str]]:
        """
        Executes the SQL query. If syntax error occurs, attempts 1 self-correction turn.
        Returns: (result_df, final_sql, error_msg)
        """
        start_time = time.time()
        try:
            df = self.engine.execute_query(sql)
            return df, sql, None
        except Exception as first_error:
            print(f"[DataAgent] First execution error: {first_error}. Attempting 1-turn self-correction...")
            
            # Attempt 1-turn correction via LLM if available
            if self.llm:
                try:
                    correct_prompt = (
                        f"The following DuckDB SQL query failed with error: {first_error}\n"
                        f"Original SQL: {sql}\n"
                        f"Original Question: {question}\n"
                        f"Fix the SQL syntax error for DuckDB. Return ONLY the corrected SQL query starting with SELECT or WITH."
                    )
                    response = self.llm.invoke(correct_prompt)
                    content = response.content if hasattr(response, "content") else str(response)
                    corrected_sql = re.sub(r"```(sql)?", "", content).strip().rstrip(";") + ";"
                    df = self.engine.execute_query(corrected_sql)
                    return df, corrected_sql, None
                except Exception as second_error:
                    print(f"[DataAgent] Self-correction failed: {second_error}.")

            # Fallback to guaranteed template query
            fallback_sql = _build_breakdown_query(question)
            try:
                df = self.engine.execute_query(fallback_sql)
                return df, fallback_sql, None
            except Exception as final_error:
                return pd.DataFrame(), fallback_sql, str(final_error)


# Singleton instance
data_agent = DataAgent()
