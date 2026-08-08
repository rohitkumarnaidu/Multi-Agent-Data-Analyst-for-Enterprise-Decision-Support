"""
Dataset Discovery & Business Domain Detection — Dynamic Enterprise Platform
=============================================================================
The brain of the dynamic system. Analyzes the loaded dataset and:
1. Returns full column metadata (types, stats, nulls, uniques)
2. Auto-classifies business domains (HR, Sales, Finance, Security, AI, Support, etc.)
3. Generates dynamic KPI definitions per domain
4. Recommends chart types per column combination
"""
import re
from typing import Dict, List, Any, Optional, Tuple
from fastapi import APIRouter
from pydantic import BaseModel, Field
from agents.data_agent import data_agent
import structlog
import numpy as np

logger = structlog.get_logger("enterprise_backend.api.discovery")
router = APIRouter()


# ─── Domain Detection Rules ─── #

DOMAIN_RULES: Dict[str, Dict[str, Any]] = {
    "hr": {
        "keywords": ["employee", "salary", "department", "attendance", "leave", "performance",
                      "recruitment", "designation", "attrition", "hire", "headcount", "payroll",
                      "benefit", "training", "tenure", "promotion", "termination", "onboarding"],
        "label": "HR Analytics",
        "icon": "Users",
        "color": "#8b5cf6",
    },
    "sales": {
        "keywords": ["revenue", "profit", "order", "product", "region", "customer", "salesperson",
                      "sales", "discount", "margin", "quota", "pipeline", "deal", "conversion",
                      "cart", "purchase", "invoice", "billing", "subscription"],
        "label": "Sales Analytics",
        "icon": "TrendingUp",
        "color": "#10b981",
    },
    "finance": {
        "keywords": ["budget", "expense", "cost", "investment", "roi", "capital", "asset",
                      "liability", "balance", "cash_flow", "depreciation", "tax", "ledger",
                      "accounts", "fiscal", "revenue_impact", "cost_savings", "transaction_amount"],
        "label": "Finance Analytics",
        "icon": "DollarSign",
        "color": "#0ea5e9",
    },
    "operations": {
        "keywords": ["processing_time", "sla", "throughput", "utilization", "capacity",
                      "efficiency", "queue", "backlog", "cycle_time", "downtime", "uptime",
                      "incident", "outage", "maintenance", "shipment", "logistics", "inventory"],
        "label": "Operations Analytics",
        "icon": "Activity",
        "color": "#f59e0b",
    },
    "risk": {
        "keywords": ["risk", "anomaly", "fraud", "threat", "severity", "vulnerability",
                      "compliance", "audit", "violation", "breach", "escalation", "alert",
                      "risk_level", "risk_score", "anomaly_score", "anomaly_detected"],
        "label": "Risk & Compliance",
        "icon": "ShieldAlert",
        "color": "#ef4444",
    },
    "customer": {
        "keywords": ["customer", "satisfaction", "nps", "churn", "retention", "lifetime_value",
                      "segment", "feedback", "complaint", "loyalty", "engagement", "acquisition",
                      "customer_segment"],
        "label": "Customer Analytics",
        "icon": "UserCheck",
        "color": "#ec4899",
    },
    "ai_analytics": {
        "keywords": ["token", "llm", "prompt", "latency", "automation", "human_review",
                      "confidence", "prediction", "model", "accuracy", "precision", "recall",
                      "input_tokens", "output_tokens", "confidence_score", "false_confidence",
                      "agent", "query_complexity", "token_efficiency", "cost_per_token"],
        "label": "AI & Automation",
        "icon": "BrainCircuit",
        "color": "#6366f1",
    },
    "support": {
        "keywords": ["ticket", "sla", "escalation", "support", "queue", "agent", "resolution",
                      "response_time", "first_contact", "satisfaction", "priority", "assigned",
                      "escalation_level", "priority_level"],
        "label": "Support Analytics",
        "icon": "Headphones",
        "color": "#0d9488",
    },
    "security": {
        "keywords": ["incident", "attack", "threat", "severity", "vulnerability", "malware",
                      "firewall", "intrusion", "encryption", "access", "authentication",
                      "authorization", "security"],
        "label": "Security Dashboard",
        "icon": "Shield",
        "color": "#dc2626",
    },
}

# ─── Chart Type Recommendation Rules ─── #

def _recommend_chart(col_a_type: str, col_b_type: str = "", question_hint: str = "") -> str:
    """Determine best chart type from column type combinations."""
    if col_a_type == "datetime":
        return "line"
    if col_a_type == "categorical" and col_b_type == "numeric":
        return "bar"
    if col_a_type == "numeric" and col_b_type == "numeric":
        return "scatter"
    if col_a_type == "categorical" and not col_b_type:
        return "pie"
    if col_a_type == "boolean":
        return "pie"
    return "bar"


def _classify_column_type(dtype_str: str, col_name: str, cardinality: int, total_rows: int) -> str:
    """Classify column into semantic type."""
    name_lower = col_name.lower()
    if any(t in name_lower for t in ["date", "time", "timestamp", "created", "updated"]):
        return "datetime"
    if "bool" in dtype_str.lower() or cardinality == 2:
        return "boolean"
    if any(t in dtype_str.lower() for t in ["float", "int", "double", "decimal", "numeric"]):
        if cardinality < 20 and total_rows > 100:
            return "categorical"  # Low-cardinality numeric (e.g., rating 1-5)
        return "numeric"
    if cardinality <= 50 or cardinality / max(total_rows, 1) < 0.05:
        return "categorical"
    return "text"


# ─── Models ─── #

class ColumnMeta(BaseModel):
    column_name: str
    dtype: str
    semantic_type: str  # datetime, numeric, categorical, boolean, text
    null_count: int = 0
    null_pct: float = 0.0
    unique_count: int = 0
    cardinality: int = 0
    # Numeric stats
    min_val: Optional[float] = None
    max_val: Optional[float] = None
    mean_val: Optional[float] = None
    median_val: Optional[float] = None
    std_val: Optional[float] = None
    # Categorical stats
    top_values: List[Dict[str, Any]] = Field(default_factory=list)
    # Classification
    is_dimension: bool = False
    is_measure: bool = False
    is_date: bool = False


class DetectedDomain(BaseModel):
    domain_id: str
    label: str
    icon: str
    color: str
    confidence: float
    matched_columns: List[str]
    kpi_definitions: List[Dict[str, Any]]
    chart_recommendations: List[Dict[str, Any]]


class DatasetDiscovery(BaseModel):
    table_name: str
    total_rows: int
    total_columns: int
    columns: List[ColumnMeta]
    date_columns: List[str]
    numeric_columns: List[str]
    categorical_columns: List[str]
    boolean_columns: List[str]
    detected_domains: List[DetectedDomain]


# ─── KPI Generation ─── #

def _generate_kpis_for_domain(domain_id: str, matched_cols: List[str], all_cols: List[ColumnMeta]) -> List[Dict[str, Any]]:
    """Generate KPI definitions dynamically based on matched columns."""
    kpis = []
    numeric_matched = [c for c in all_cols if c.column_name.lower() in [m.lower() for m in matched_cols] and c.semantic_type == "numeric"]
    categorical_matched = [c for c in all_cols if c.column_name.lower() in [m.lower() for m in matched_cols] and c.semantic_type == "categorical"]

    # All numeric columns in this domain get SUM and AVG KPIs
    for col in numeric_matched[:6]:
        clean_name = col.column_name.replace("_", " ").title()
        kpis.append({
            "id": f"total_{col.column_name.lower()}",
            "label": f"Total {clean_name}",
            "sql": f"SELECT SUM({col.column_name}) as value FROM enterprise_data",
            "format": "currency" if any(t in col.column_name.lower() for t in ["amount", "revenue", "cost", "salary", "price", "usd", "savings", "profit", "budget"]) else "number",
            "aggregation": "sum",
            "column": col.column_name,
        })
        kpis.append({
            "id": f"avg_{col.column_name.lower()}",
            "label": f"Avg {clean_name}",
            "sql": f"SELECT AVG({col.column_name}) as value FROM enterprise_data",
            "format": "currency" if any(t in col.column_name.lower() for t in ["amount", "revenue", "cost", "salary", "price", "usd", "savings", "profit", "budget"]) else "decimal",
            "aggregation": "avg",
            "column": col.column_name,
        })

    # Count KPIs for categorical columns
    for col in categorical_matched[:3]:
        clean_name = col.column_name.replace("_", " ").title()
        kpis.append({
            "id": f"count_{col.column_name.lower()}",
            "label": f"Unique {clean_name}s",
            "sql": f"SELECT COUNT(DISTINCT {col.column_name}) as value FROM enterprise_data",
            "format": "number",
            "aggregation": "count_distinct",
            "column": col.column_name,
        })

    # Rate KPIs for boolean columns
    bool_matched = [c for c in all_cols if c.column_name.lower() in [m.lower() for m in matched_cols] and c.semantic_type == "boolean"]
    for col in bool_matched[:3]:
        clean_name = col.column_name.replace("_", " ").title()
        kpis.append({
            "id": f"rate_{col.column_name.lower()}",
            "label": f"{clean_name} Rate",
            "sql": f"SELECT AVG(CAST({col.column_name} AS INT))*100 as value FROM enterprise_data",
            "format": "percent",
            "aggregation": "rate",
            "column": col.column_name,
        })

    # Total records
    kpis.insert(0, {
        "id": "total_records",
        "label": "Total Records",
        "sql": "SELECT COUNT(*) as value FROM enterprise_data",
        "format": "number",
        "aggregation": "count",
        "column": "*",
    })

    return kpis[:12]  # Cap at 12 KPIs


def _generate_charts_for_domain(domain_id: str, matched_cols: List[str], all_cols: List[ColumnMeta], date_cols: List[str]) -> List[Dict[str, Any]]:
    """Generate chart recommendations based on column types."""
    charts = []
    numeric_cols = [c for c in all_cols if c.semantic_type == "numeric"]
    categorical_cols = [c for c in all_cols if c.semantic_type == "categorical"]
    domain_numeric = [c for c in numeric_cols if c.column_name.lower() in [m.lower() for m in matched_cols]]
    domain_categorical = [c for c in categorical_cols if c.column_name.lower() in [m.lower() for m in matched_cols]]

    # Time series charts: date × numeric
    for date_col in date_cols[:1]:
        for num_col in domain_numeric[:3]:
            clean_metric = num_col.column_name.replace("_", " ").title()
            charts.append({
                "id": f"trend_{num_col.column_name.lower()}",
                "type": "line",
                "title": f"{clean_metric} Over Time",
                "sql": f"SELECT {date_col}, SUM({num_col.column_name}) as value FROM enterprise_data GROUP BY {date_col} ORDER BY {date_col}",
                "x_column": date_col,
                "y_column": num_col.column_name,
                "aggregation": "sum",
            })

    # Bar charts: categorical × numeric
    for cat_col in (domain_categorical or categorical_cols)[:2]:
        for num_col in domain_numeric[:2]:
            clean_dim = cat_col.column_name.replace("_", " ").title()
            clean_metric = num_col.column_name.replace("_", " ").title()
            charts.append({
                "id": f"bar_{cat_col.column_name}_{num_col.column_name}",
                "type": "bar",
                "title": f"{clean_metric} by {clean_dim}",
                "sql": f"SELECT {cat_col.column_name}, SUM({num_col.column_name}) as value FROM enterprise_data GROUP BY {cat_col.column_name} ORDER BY value DESC LIMIT 15",
                "x_column": cat_col.column_name,
                "y_column": num_col.column_name,
                "aggregation": "sum",
            })

    # Pie charts: categorical distribution
    for cat_col in (domain_categorical or categorical_cols)[:2]:
        if cat_col.cardinality <= 10:
            clean_dim = cat_col.column_name.replace("_", " ").title()
            charts.append({
                "id": f"pie_{cat_col.column_name}",
                "type": "pie",
                "title": f"{clean_dim} Distribution",
                "sql": f"SELECT {cat_col.column_name} as label, COUNT(*) as value FROM enterprise_data GROUP BY {cat_col.column_name} ORDER BY value DESC",
                "x_column": cat_col.column_name,
                "y_column": "count",
                "aggregation": "count",
            })

    # Heatmap: two categoricals × numeric
    if len(domain_categorical) >= 2 and len(domain_numeric) >= 1:
        charts.append({
            "id": f"heatmap_{domain_categorical[0].column_name}_{domain_categorical[1].column_name}",
            "type": "heatmap",
            "title": f"{domain_categorical[0].column_name.replace('_',' ').title()} × {domain_categorical[1].column_name.replace('_',' ').title()}",
            "sql": f"SELECT {domain_categorical[0].column_name}, {domain_categorical[1].column_name}, COUNT(*) as value FROM enterprise_data GROUP BY {domain_categorical[0].column_name}, {domain_categorical[1].column_name}",
            "x_column": domain_categorical[0].column_name,
            "y_column": domain_categorical[1].column_name,
            "aggregation": "count",
        })

    # Scatter: numeric × numeric
    if len(domain_numeric) >= 2:
        charts.append({
            "id": f"scatter_{domain_numeric[0].column_name}_{domain_numeric[1].column_name}",
            "type": "scatter",
            "title": f"{domain_numeric[0].column_name.replace('_',' ').title()} vs {domain_numeric[1].column_name.replace('_',' ').title()}",
            "sql": f"SELECT {domain_numeric[0].column_name}, {domain_numeric[1].column_name} FROM enterprise_data WHERE {domain_numeric[0].column_name} IS NOT NULL AND {domain_numeric[1].column_name} IS NOT NULL LIMIT 2000",
            "x_column": domain_numeric[0].column_name,
            "y_column": domain_numeric[1].column_name,
            "aggregation": "raw",
        })

    return charts[:12]  # Cap at 12 charts


# ─── Main Discovery Endpoint ─── #

@router.get("/discover")
async def discover_dataset():
    """
    The core discovery endpoint. Analyzes the loaded dataset and returns:
    - Full column metadata with types and statistics
    - Auto-detected business domains
    - Dynamic KPI definitions per domain
    - Chart recommendations per domain
    """
    try:
        engine = data_agent.engine

        # 1. Get total rows
        total_df = engine.execute_query("SELECT COUNT(*) as total FROM enterprise_data")
        total_rows = int(total_df.iloc[0]["total"]) if not total_df.empty else 0

        # 2. Get column info
        sample_df = engine.execute_query("SELECT * FROM enterprise_data LIMIT 5000")
        if sample_df.empty:
            return DatasetDiscovery(
                table_name="enterprise_data", total_rows=0, total_columns=0,
                columns=[], date_columns=[], numeric_columns=[],
                categorical_columns=[], boolean_columns=[], detected_domains=[],
            )

        columns_meta: List[ColumnMeta] = []
        date_columns = []
        numeric_columns = []
        categorical_columns = []
        boolean_columns = []

        for col in sample_df.columns:
            series = sample_df[col]
            dtype_str = str(series.dtype)
            null_count = int(series.isna().sum())
            unique_count = int(series.nunique())
            cardinality = unique_count

            sem_type = _classify_column_type(dtype_str, col, cardinality, total_rows)

            meta = ColumnMeta(
                column_name=col,
                dtype=dtype_str,
                semantic_type=sem_type,
                null_count=null_count,
                null_pct=round(null_count / max(len(sample_df), 1) * 100, 2),
                unique_count=unique_count,
                cardinality=cardinality,
                is_dimension=sem_type in ("categorical", "datetime"),
                is_measure=sem_type == "numeric",
                is_date=sem_type == "datetime",
            )

            if sem_type == "numeric":
                numeric_data = series.dropna()
                if len(numeric_data) > 0:
                    meta.min_val = round(float(numeric_data.min()), 4)
                    meta.max_val = round(float(numeric_data.max()), 4)
                    meta.mean_val = round(float(numeric_data.mean()), 4)
                    meta.median_val = round(float(numeric_data.median()), 4)
                    meta.std_val = round(float(numeric_data.std()), 4) if len(numeric_data) > 1 else 0.0
                numeric_columns.append(col)

            elif sem_type == "categorical":
                vc = series.value_counts().head(8)
                meta.top_values = [{"value": str(k), "count": int(v)} for k, v in vc.items()]
                categorical_columns.append(col)

            elif sem_type == "datetime":
                date_columns.append(col)

            elif sem_type == "boolean":
                boolean_columns.append(col)

            columns_meta.append(meta)

        # 3. Detect business domains
        all_col_names_lower = [c.lower().replace(" ", "_") for c in sample_df.columns]
        detected_domains: List[DetectedDomain] = []

        for domain_id, rule in DOMAIN_RULES.items():
            matched = []
            for col_name in sample_df.columns:
                col_lower = col_name.lower().replace(" ", "_")
                for keyword in rule["keywords"]:
                    if keyword in col_lower or col_lower in keyword:
                        matched.append(col_name)
                        break

            if len(matched) >= 2:  # Need at least 2 column matches
                confidence = min(len(matched) / len(rule["keywords"]) * 100, 100)
                kpis = _generate_kpis_for_domain(domain_id, matched, columns_meta)
                charts = _generate_charts_for_domain(domain_id, matched, columns_meta, date_columns)

                detected_domains.append(DetectedDomain(
                    domain_id=domain_id,
                    label=rule["label"],
                    icon=rule["icon"],
                    color=rule["color"],
                    confidence=round(confidence, 1),
                    matched_columns=matched,
                    kpi_definitions=kpis,
                    chart_recommendations=charts,
                ))

        # Sort by confidence
        detected_domains.sort(key=lambda d: d.confidence, reverse=True)

        return DatasetDiscovery(
            table_name="enterprise_data",
            total_rows=total_rows,
            total_columns=len(sample_df.columns),
            columns=columns_meta,
            date_columns=date_columns,
            numeric_columns=numeric_columns,
            categorical_columns=categorical_columns,
            boolean_columns=boolean_columns,
            detected_domains=detected_domains,
        )

    except Exception as e:
        logger.error("Dataset discovery failed", error=str(e))
        return {"error": str(e)}


@router.post("/compute-kpi")
async def compute_kpi(kpi: dict):
    """Execute a single KPI SQL and return the value."""
    try:
        engine = data_agent.engine
        sql = kpi.get("sql", "")
        if not sql:
            return {"value": 0, "error": "No SQL provided"}
        df = engine.execute_query(sql)
        if df.empty:
            return {"value": 0}
        return {"value": round(float(df.iloc[0]["value"]), 2) if "value" in df.columns else 0}
    except Exception as e:
        return {"value": 0, "error": str(e)}


@router.post("/compute-chart")
async def compute_chart(chart: dict):
    """Execute a chart SQL and return the data."""
    try:
        engine = data_agent.engine
        sql = chart.get("sql", "")
        if not sql:
            return {"data": [], "error": "No SQL provided"}
        df = engine.execute_query(sql)
        if df.empty:
            return {"data": []}
        return {"data": df.to_dict(orient="records"), "columns": df.columns.tolist()}
    except Exception as e:
        return {"data": [], "error": str(e)}


@router.post("/domain-insights")
async def get_domain_insights(request: dict):
    """Generate AI insights for a specific domain."""
    domain_id = request.get("domain_id", "")
    try:
        engine = data_agent.engine
        insights = []

        # Get basic stats
        total = engine.execute_query("SELECT COUNT(*) as cnt FROM enterprise_data")
        total_rows = int(total.iloc[0]["cnt"]) if not total.empty else 0

        # Find anomalies
        if "anomaly_detected" in [c.lower() for c in engine.execute_query("SELECT * FROM enterprise_data LIMIT 1").columns]:
            anom = engine.execute_query("SELECT AVG(CAST(Anomaly_Detected AS INT))*100 as rate FROM enterprise_data")
            rate = round(float(anom.iloc[0]["rate"]), 1) if not anom.empty else 0
            if rate > 5:
                insights.append({
                    "type": "warning",
                    "title": f"Anomaly rate at {rate}%",
                    "description": f"Anomaly detection rate is {rate}% across {total_rows:,} records.",
                    "recommendation": "Investigate high-anomaly segments and consider additional monitoring.",
                    "confidence": 94,
                    "priority": "high",
                })

        # Find SLA breaches
        if "sla_breached" in [c.lower() for c in engine.execute_query("SELECT * FROM enterprise_data LIMIT 1").columns]:
            sla = engine.execute_query("SELECT AVG(CAST(SLA_Breached AS INT))*100 as rate FROM enterprise_data")
            rate = round(float(sla.iloc[0]["rate"]), 1) if not sla.empty else 0
            if rate > 10:
                insights.append({
                    "type": "critical",
                    "title": f"SLA breach rate: {rate}%",
                    "description": f"SLA violations are occurring at {rate}%, exceeding the 10% threshold.",
                    "recommendation": "Deploy automated SLA throttling and prioritize breach departments.",
                    "confidence": 97,
                    "priority": "critical",
                })

        # Top performers
        for col in ["Department", "Region", "Business_Unit"]:
            try:
                rev_col = None
                for rc in ["Revenue_Impact_USD", "Transaction_Amount_USD", "revenue", "amount"]:
                    try:
                        engine.execute_query(f"SELECT {rc} FROM enterprise_data LIMIT 1")
                        rev_col = rc
                        break
                    except:
                        continue

                if rev_col:
                    top = engine.execute_query(f"SELECT {col}, SUM({rev_col}) as total FROM enterprise_data GROUP BY {col} ORDER BY total DESC LIMIT 1")
                    if not top.empty:
                        insights.append({
                            "type": "success",
                            "title": f"Top {col}: {top.iloc[0][col]}",
                            "description": f"{top.iloc[0][col]} leads with ${float(top.iloc[0]['total']):,.0f} in {rev_col.replace('_', ' ').lower()}.",
                            "recommendation": f"Replicate {top.iloc[0][col]}'s strategies across other {col.lower()}s.",
                            "confidence": 98,
                            "priority": "medium",
                        })
                        break
            except:
                continue

        # Growth trend
        for date_col in ["Quarter", "Month", "Year", "Transaction_Date"]:
            try:
                for rev_col in ["Revenue_Impact_USD", "Transaction_Amount_USD"]:
                    try:
                        trend = engine.execute_query(f"SELECT {date_col}, SUM({rev_col}) as total FROM enterprise_data GROUP BY {date_col} ORDER BY {date_col}")
                        if len(trend) >= 2:
                            first_val = float(trend.iloc[0]["total"])
                            last_val = float(trend.iloc[-1]["total"])
                            if first_val > 0:
                                change = ((last_val - first_val) / first_val) * 100
                                direction = "increasing" if change > 5 else "decreasing" if change < -5 else "stable"
                                insights.append({
                                    "type": "info" if direction == "stable" else ("success" if direction == "increasing" else "warning"),
                                    "title": f"Revenue trend is {direction}",
                                    "description": f"{rev_col.replace('_', ' ')} changed by {change:+.1f}% over the tracked period.",
                                    "recommendation": f"{'Maintain growth trajectory' if direction == 'increasing' else 'Investigate revenue decline and identify root causes'}.",
                                    "confidence": 91,
                                    "priority": "high" if abs(change) > 15 else "medium",
                                })
                                break
                    except:
                        continue
                break
            except:
                continue

        return {"domain_id": domain_id, "insights": insights}

    except Exception as e:
        logger.error("Domain insights failed", error=str(e))
        return {"domain_id": domain_id, "insights": [], "error": str(e)}
