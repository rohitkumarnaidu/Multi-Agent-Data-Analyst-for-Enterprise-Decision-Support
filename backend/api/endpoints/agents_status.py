"""
Agent Status API — Enterprise Decision Support Platform
========================================================
Exposes agent registry metadata and status.
"""
from fastapi import APIRouter
import structlog

logger = structlog.get_logger("enterprise_backend.api.agents")
router = APIRouter()

# Agent registry — metadata about each agent in the system
AGENT_REGISTRY = [
    {
        "name": "Orchestrator",
        "type": "Intent Router",
        "status": "idle",
        "description": "Classifies user intent, extracts entities, and routes queries to the appropriate agent pipeline.",
        "capabilities": ["Intent Classification", "Entity Extraction", "Query Routing", "Context Resolution"],
        "health": "healthy",
        "queue_depth": 0,
    },
    {
        "name": "Knowledge Agent",
        "type": "RAG Retriever",
        "status": "idle",
        "description": "Performs hybrid retrieval using ChromaDB vector search and BM25 keyword matching with RRF fusion.",
        "capabilities": ["Semantic Search", "BM25 Keyword Search", "RRF Fusion", "Context Formatting"],
        "health": "healthy",
        "queue_depth": 0,
    },
    {
        "name": "Data Agent",
        "type": "SQL Engine",
        "status": "idle",
        "description": "Translates natural language to SQL, executes against DuckDB, and performs self-correction on failures.",
        "capabilities": ["NL-to-SQL", "DuckDB Execution", "Self-Correction", "Template Fallback"],
        "health": "healthy",
        "queue_depth": 0,
    },
    {
        "name": "Analysis Agent",
        "type": "Deterministic Analytics",
        "status": "idle",
        "description": "Computes statistical metrics, aggregations, rankings, and generates chart specifications. Zero LLM.",
        "capabilities": ["Statistical Analysis", "Aggregation", "Trend Detection", "Chart Generation"],
        "health": "healthy",
        "queue_depth": 0,
    },
    {
        "name": "Anomaly Agent",
        "type": "ML Risk Scanner",
        "status": "idle",
        "description": "Runs certified Phase 5C champion ML model for anomaly detection, risk scoring, and SLA breach analysis.",
        "capabilities": ["Anomaly Detection", "Risk Scoring", "SLA Analysis", "False Confidence Detection"],
        "health": "healthy",
        "queue_depth": 0,
    },
    {
        "name": "Simulation Agent",
        "type": "What-If Engine",
        "status": "idle",
        "description": "Performs deterministic what-if scenario simulations by recomputing metrics under adjusted parameters.",
        "capabilities": ["What-If Simulation", "Sensitivity Analysis", "Scenario Modeling", "Impact Projection"],
        "health": "healthy",
        "queue_depth": 0,
    },
    {
        "name": "Narrative Agent",
        "type": "Report Generator",
        "status": "idle",
        "description": "Generates grounded executive narratives from insight skeletons. All numbers sourced from Analysis Agent.",
        "capabilities": ["Executive Narrative", "Insight Synthesis", "RAG-Grounded Response", "Out-of-Scope Detection"],
        "health": "healthy",
        "queue_depth": 0,
    },
    {
        "name": "Validator Agent",
        "type": "Zero-Trust Verifier",
        "status": "idle",
        "description": "Performs zero-trust numeric verification, confidence scoring, and human approval gating.",
        "capabilities": ["Numeric Verification", "Confidence Scoring", "Human Gating", "Hallucination Detection"],
        "health": "healthy",
        "queue_depth": 0,
    },
    {
        "name": "Report Agent",
        "type": "PDF Generator",
        "status": "idle",
        "description": "Generates formatted executive PDF reports with charts, insights, and recommendations.",
        "capabilities": ["PDF Generation", "Chart Embedding", "Executive Summary", "Export"],
        "health": "healthy",
        "queue_depth": 0,
    },
]


@router.get("/")
async def list_agents():
    """Return all registered agents with their metadata."""
    return AGENT_REGISTRY


@router.get("/{agent_name}/history")
async def get_agent_history(agent_name: str):
    """Return execution history for a specific agent."""
    # Agent execution history is not persisted yet — return empty
    agent = next((a for a in AGENT_REGISTRY if a["name"].lower().replace(" ", "_") == agent_name.lower().replace(" ", "_")), None)
    if not agent:
        agent = next((a for a in AGENT_REGISTRY if agent_name.lower() in a["name"].lower()), None)
    return {
        "agent": agent["name"] if agent else agent_name,
        "history": [],
        "note": "Per-agent execution history persistence is planned for a future release.",
    }
