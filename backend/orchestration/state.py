"""
Agent State Schema — LangGraph Orchestration
=============================================
Defines the shared typed state dictionary flowing across all 8 nodes
in the Multi-Agent Decision Support System.
"""

from typing import TypedDict, List, Dict, Any, Optional
from pydantic import BaseModel


class AgentState(TypedDict, total=False):
    # User Input & Session Metadata
    question: str
    session_id: Optional[str]
    session_history: Optional[List[Dict[str, str]]]

    # Orchestrator Node Output
    intent: str
    intent_confidence: float
    intent_reason: str
    entities: Dict[str, Any]
    resolved_question: str

    # Knowledge & RAG Node Output
    retrieved_docs: List[Dict[str, Any]]
    retrieved_context: str
    rag_triggered: bool

    # Data Agent Node Output
    sql_query: Optional[str]
    query_result_records: Optional[List[Dict[str, Any]]]
    sql_error: Optional[str]

    # Analysis Agent Node Output
    insight_skeleton: Optional[Dict[str, Any]]
    chart_spec: Optional[Dict[str, Any]]

    # Anomaly & Risk Agent Output
    anomaly_data: Optional[Dict[str, Any]]

    # Simulation Agent Output
    simulation_data: Optional[Dict[str, Any]]

    # Narrative Agent Output
    raw_answer: str
    recommended_action: Optional[str]

    # Validator Agent Output
    sanitized_answer: str
    confidence_score: float
    confidence_level: str
    validation_report: Optional[Dict[str, Any]]
    requires_human_approval: bool
    approval_reason: Optional[str]
    human_approved: Optional[bool]

    # Report Agent Output
    pdf_report_available: bool

    # Audit & Tracing
    execution_steps: List[str]
    start_timestamp: float
    total_latency_sec: float
