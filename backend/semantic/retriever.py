"""
Hybrid RAG Retriever — Multi-Agent Data Analyst
=================================================
Combines dense semantic search (ChromaDB) with sparse keyword search (BM25)
using Reciprocal Rank Fusion (RRF) to retrieve schema context, metric definitions,
SQL templates, and enterprise business rules.

Per Master Plan Section 6:
  - ChromaDB in-process vector store
  - BM25 (rank_bm25) for exact keyword/code matches
  - Agentic conditional retrieval trigger (retrieves only when needed)
"""

import re
from pathlib import Path
from typing import List, Dict, Any, Optional
import chromadb
from rank_bm25 import BM25Okapi

from backend.config import settings

# ── Knowledge Base Content ──
KNOWLEDGE_DOCUMENTS = [
    # ── AI Efficiency Metrics & Rules ──
    {
        "id": "metric_token_efficiency",
        "category": "metric_definition",
        "domain": "AI Efficiency",
        "title": "Token Efficiency",
        "content": "Token Efficiency measures output tokens generated per second of processing time. Formula: Output_Tokens / Processing_Time_Sec. Higher is better. Target SLA threshold is > 50 tokens/sec. Used to evaluate model throughput across departments.",
        "sql_template": "SELECT Department, AVG(Token_Efficiency) AS avg_token_efficiency FROM enterprise_data GROUP BY Department ORDER BY avg_token_efficiency DESC;"
    },
    {
        "id": "metric_avg_processing_time",
        "category": "metric_definition",
        "domain": "AI Efficiency",
        "title": "Average Processing Time & Latency",
        "content": "Processing Time (Sec) measures query execution latency from request to response. Lower is better. SLA target is under 3.5 seconds per request. Spikes indicate backend resource congestion or oversized input token context.",
        "sql_template": "SELECT Assigned_Agent, AVG(Processing_Time_Sec) AS avg_latency FROM enterprise_data GROUP BY Assigned_Agent ORDER BY avg_latency DESC;"
    },
    {
        "id": "metric_cost_per_token",
        "category": "metric_definition",
        "domain": "AI Efficiency",
        "title": "Cost Per Token",
        "content": "Cost per token measures unit economic expenditure per processed token. Formula: Transaction_Amount_USD / (Input_Tokens + Output_Tokens). Used for chargeback modeling across business units and agent architectures.",
        "sql_template": "SELECT Business_Unit, AVG(Cost_Per_Token) AS avg_unit_cost FROM enterprise_data GROUP BY Business_Unit ORDER BY avg_unit_cost DESC;"
    },

    # ── Governance Metrics & Rules ──
    {
        "id": "metric_sla_breach_rate",
        "category": "metric_definition",
        "domain": "Governance",
        "title": "SLA Breach Rate",
        "content": "SLA Breach Rate represents the percentage of queries exceeding guaranteed latency or accuracy standards (SLA_Breached = True). Formula: AVG(CAST(SLA_Breached AS INT)) * 100. Lower is better. Executive tolerance threshold is < 3.0%.",
        "sql_template": "SELECT Department, AVG(CAST(SLA_Breached AS INT)) * 100 AS sla_breach_pct FROM enterprise_data GROUP BY Department ORDER BY sla_breach_pct DESC;"
    },
    {
        "id": "metric_human_review_rate",
        "category": "metric_definition",
        "domain": "Governance",
        "title": "Human Review Rate & Bottlenecking",
        "content": "Human Review Rate measures queries requiring human approval or intervention (Requires_Human_Review = True). High review rates (>25%) indicate low agent autonomous confidence or high operational risk. Human_Bottleneck = True flags queues where manual review delays exceed SLA.",
        "sql_template": "SELECT Assigned_Agent, AVG(CAST(Requires_Human_Review AS INT)) * 100 AS review_rate FROM enterprise_data GROUP BY Assigned_Agent ORDER BY review_rate DESC;"
    },
    {
        "id": "metric_escalation_distribution",
        "category": "metric_definition",
        "domain": "Governance",
        "title": "Escalation Level Distribution",
        "content": "Escalation Levels categorize intervention severity: None, Level 1 (Peer review), Level 2 (Supervisor), Level 3 (Executive). High Level 3 escalations indicate critical risk or severe SLA failure.",
        "sql_template": "SELECT Escalation_Level, COUNT(*) AS count, AVG(Processing_Time_Sec) AS avg_delay FROM enterprise_data GROUP BY Escalation_Level ORDER BY count DESC;"
    },

    # ── Business Impact Metrics & Rules ──
    {
        "id": "metric_cost_savings",
        "category": "metric_definition",
        "domain": "Business Impact",
        "title": "Cost Savings Potential & Automation ROI",
        "content": "Total Cost Savings Potential aggregates financial value generated when queries are resolved autonomously without manual human labour. Formula: SUM(Cost_Savings_Potential_USD) WHERE Decision_Outcome = 'Auto-Resolved'. Key metric for AI ROI.",
        "sql_template": "SELECT Department, SUM(Cost_Savings_Potential_USD) AS total_savings FROM enterprise_data WHERE Decision_Outcome = 'Auto-Resolved' GROUP BY Department ORDER BY total_savings DESC;"
    },
    {
        "id": "metric_revenue_impact",
        "category": "metric_definition",
        "domain": "Business Impact",
        "title": "Revenue Impact USD",
        "content": "Revenue Impact USD calculates the net monetary impact of AI agent decisions on commercial outcomes (upsells, retention, transaction processing). Can be positive or negative depending on decision accuracy.",
        "sql_template": "SELECT Business_Unit, SUM(Revenue_Impact_USD) AS net_revenue_impact FROM enterprise_data GROUP BY Business_Unit ORDER BY net_revenue_impact DESC;"
    },
    {
        "id": "metric_automation_rate",
        "category": "metric_definition",
        "domain": "Business Impact",
        "title": "Autonomous Resolution Rate",
        "content": "Automation Rate measures the percentage of transactions resolved end-to-end by AI agents without human touch (Decision_Outcome = 'Auto-Resolved'). Formula: AVG(CASE WHEN Decision_Outcome = 'Auto-Resolved' THEN 1.0 ELSE 0.0 END) * 100.",
        "sql_template": "SELECT Quarter, AVG(CASE WHEN Decision_Outcome = 'Auto-Resolved' THEN 1.0 ELSE 0.0 END) * 100 AS automation_pct FROM enterprise_data GROUP BY Quarter ORDER BY Quarter;"
    },

    # ── Risk & Anomaly Metrics & Rules ──
    {
        "id": "metric_anomaly_detection",
        "category": "metric_definition",
        "domain": "Risk",
        "title": "Anomaly Detection & Risk Scoring",
        "content": "Anomaly_Detected indicates statistically irregular query characteristics (outlier tokens, extreme latency, or anomalous transaction amount). Anomaly_Score ranges 0.0 to 1.0. High risk queries (Anomaly_Score > 0.85) require scrutiny.",
        "sql_template": "SELECT Risk_Level, COUNT(*) AS count, AVG(Anomaly_Score) AS avg_anomaly_score FROM enterprise_data GROUP BY Risk_Level ORDER BY avg_anomaly_score DESC;"
    },
    {
        "id": "metric_false_confidence",
        "category": "metric_definition",
        "domain": "Risk",
        "title": "False Confidence Risk",
        "content": "False_Confidence_Flag = True identifies silent failures where an AI agent reported high confidence (>= 0.85) but the decision resulted in an SLA breach or anomaly. Highest priority audit target.",
        "sql_template": "SELECT Assigned_Agent, SUM(CAST(False_Confidence_Flag AS INT)) AS false_confidence_count FROM enterprise_data GROUP BY Assigned_Agent ORDER BY false_confidence_count DESC;"
    },

    # ── Schema & Architecture Context ──
    {
        "id": "schema_overview",
        "category": "schema_guide",
        "domain": "General",
        "title": "Enterprise Database Schema & Key Dimensions",
        "content": "Table: enterprise_data. Key Dimensions: Department (Finance, IT Operations, Marketing, Supply Chain, Sales, HR, Customer Service), Assigned_Agent (Finance_Agent, ITOps_Agent, Marketing_Agent, SupplyChain_Agent, Sales_Agent, HR_Agent, CustomerService_Agent), Business_Unit (North America, EMEA, APAC, LATAM), Priority_Level (Urgent, High, Medium, Low), Risk_Level (High, Medium, Low), Decision_Outcome (Auto-Resolved, Approved, Pending, Rejected). Measures: Input_Tokens, Output_Tokens, Processing_Time_Sec, Transaction_Amount_USD, Revenue_Impact_USD, Cost_Savings_Potential_USD, Confidence_Score.",
        "sql_template": "SELECT COUNT(*) AS total_records FROM enterprise_data;"
    },
    {
        "id": "rule_date_resolution",
        "category": "business_rule",
        "domain": "General",
        "title": "Temporal Reference & Date Resolution",
        "content": "Reference Date is fixed at 2025-12-30. 'Last Quarter' refers to Q4 2025 (or Quarter = 'Q4'). 'Year to Date' (YTD) covers all 2025 transactions. Relative date queries should filter on Transaction_Date, Month, Quarter, or Year columns.",
        "sql_template": "SELECT Quarter, COUNT(*) AS volume FROM enterprise_data WHERE Year = 2025 GROUP BY Quarter ORDER BY Quarter;"
    },
    {
        "id": "rule_pii_governance",
        "category": "business_rule",
        "domain": "Governance",
        "title": "PII & Privacy Protection Rule",
        "content": "Employee_ID_Handler and specific individual identifier columns are strictly governed under enterprise PII policies. Queries should aggregate by Department or Assigned_Agent rather than exposing raw handler IDs in executive presentations.",
        "sql_template": "SELECT Department, COUNT(DISTINCT Employee_ID_Handler) AS active_handlers FROM enterprise_data GROUP BY Department;"
    }
]


def _tokenize(text: str) -> List[str]:
    """Simple alphanumeric tokenizer for BM25."""
    return re.findall(r"\w+", text.lower())


class HybridRetriever:
    """
    Hybrid Retriever combining ChromaDB dense vector similarity
    and BM25 keyword matching with Reciprocal Rank Fusion.
    """

    def __init__(self, persist_dir: Optional[Path] = None):
        self.persist_dir = persist_dir or settings.CHROMA_PERSIST_DIR
        self.chroma_client = chromadb.Client()
        self.collection = self.chroma_client.get_or_create_collection(
            name="enterprise_knowledge_base",
            metadata={"hnsw:space": "cosine"}
        )
        self.docs = KNOWLEDGE_DOCUMENTS
        self.bm25: Optional[BM25Okapi] = None
        self._initialize_index()

    def _initialize_index(self):
        """Index all pre-configured knowledge documents."""
        # 1. Ingest into ChromaDB
        existing_count = self.collection.count()
        if existing_count == 0:
            ids = [doc["id"] for doc in self.docs]
            documents = [f"{doc['title']}: {doc['content']}" for doc in self.docs]
            metadatas = [
                {
                    "domain": doc["domain"],
                    "category": doc["category"],
                    "title": doc["title"],
                    "sql_template": doc.get("sql_template", "")
                }
                for doc in self.docs
            ]
            self.collection.add(ids=ids, documents=documents, metadatas=metadatas)

        # 2. Build BM25 Corpus
        tokenized_corpus = [_tokenize(f"{doc['title']} {doc['content']} {doc.get('sql_template', '')}") for doc in self.docs]
        self.bm25 = BM25Okapi(tokenized_corpus)

    def retrieve(self, query: str, top_k: int = 3, rrf_k: int = 60) -> List[Dict[str, Any]]:
        """
        Execute hybrid search using Reciprocal Rank Fusion (RRF).

        RRF Score formula:
            score(d) = sum(1.0 / (rrf_k + rank_i(d)))
        """
        query_tokens = _tokenize(query)
        doc_scores: Dict[str, float] = {doc["id"]: 0.0 for doc in self.docs}

        # ── 1. Dense ChromaDB Search ──
        chroma_res = self.collection.query(query_texts=[query], n_results=min(len(self.docs), top_k * 2))
        if chroma_res and chroma_res["ids"] and len(chroma_res["ids"][0]) > 0:
            for rank, doc_id in enumerate(chroma_res["ids"][0]):
                doc_scores[doc_id] += 1.0 / (rrf_k + (rank + 1))

        # ── 2. Sparse BM25 Search ──
        if self.bm25:
            bm25_scores = self.bm25.get_scores(query_tokens)
            bm25_ranked_indices = sorted(range(len(bm25_scores)), key=lambda i: bm25_scores[i], reverse=True)
            for rank, idx in enumerate(bm25_ranked_indices[: top_k * 2]):
                doc_id = self.docs[idx]["id"]
                doc_scores[doc_id] += 1.0 / (rrf_k + (rank + 1))

        # ── 3. Sort by combined RRF score ──
        sorted_doc_ids = sorted(doc_scores.keys(), key=lambda did: doc_scores[did], reverse=True)
        top_ids = sorted_doc_ids[:top_k]

        id_to_doc = {d["id"]: d for d in self.docs}
        results = []
        for did in top_ids:
            if doc_scores[did] > 0:
                doc_item = id_to_doc[did].copy()
                doc_item["rrf_score"] = round(doc_scores[did], 5)
                results.append(doc_item)

        return results

    def format_context_for_prompt(self, docs: List[Dict[str, Any]]) -> str:
        """Format retrieved documents into structured context for LLM prompt."""
        if not docs:
            return ""

        lines = ["--- ENTERPRISE KNOWLEDGE CONTEXT ---"]
        for idx, doc in enumerate(docs, 1):
            lines.append(f"[{idx}] {doc['title']} ({doc['domain']}):")
            lines.append(f"    Definition: {doc['content']}")
            if doc.get("sql_template"):
                lines.append(f"    Reference SQL: {doc['sql_template']}")
        lines.append("------------------------------------")
        return "\n".join(lines)


# ── Agentic Retrieval Trigger ──
TRIGGER_KEYWORDS = [
    "define", "definition", "what is", "meaning", "how is", "formula",
    "policy", "rule", "sla target", "threshold", "explain", "glossary",
    "ticket", "summary", "text", "unstructured", "why", "concept"
]


def should_retrieve(question: str, intent: str = "sql_query", confidence: float = 1.0) -> bool:
    """
    Agentic condition: Decide if RAG retrieval is required.
    Fires when:
      1. Question contains conceptual/definition/policy keywords
      2. Intent is explicitly 'rag_knowledge' or 'general_faq'
      3. Orchestrator confidence is borderline (< 0.75)
    """
    if intent in ("rag_knowledge", "general_faq"):
        return True

    if confidence < 0.75:
        return True

    lower_q = question.lower()
    for kw in TRIGGER_KEYWORDS:
        if kw in lower_q:
            return True

    return False


# Singleton instance
retriever = HybridRetriever()
