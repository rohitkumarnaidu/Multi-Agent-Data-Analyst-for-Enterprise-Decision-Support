"""
API Response Contract — Multi-Agent Data Analyst
==================================================
Pydantic models defining the FastAPI /ask endpoint request/response.
Per 04-ENTERPRISE-AUDIT Section 2.4.

Usage:
    from backend.api_contract import AskRequest, AskResponse, TraceStep
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class AskRequest(BaseModel):
    """Request body for POST /ask endpoint."""
    question: str = Field(..., description="The natural language business question")
    session_id: str = Field(default="default", description="Session ID for memory/context")


class TraceStep(BaseModel):
    """A single step in the agent execution trace."""
    agent: str = Field(..., description="Agent name (e.g., 'Orchestrator', 'Data', 'Analysis')")
    action: str = Field(..., description="What the agent did")
    duration_sec: float = Field(..., description="Time taken for this step in seconds")
    details: Optional[dict] = Field(default=None, description="Additional details (SQL query, metrics computed, etc.)")


class ChartSpec(BaseModel):
    """Specification for a Plotly chart to render in the UI."""
    chart_type: str = Field(..., description="Chart type: 'bar', 'line', 'pie', 'scatter', 'heatmap', 'table'")
    title: str = Field(..., description="Chart title")
    data: dict = Field(..., description="Plotly-compatible data dict")
    layout: Optional[dict] = Field(default=None, description="Plotly layout overrides")


class ResponseMetadata(BaseModel):
    """Metadata about how the response was generated."""
    query_used: Optional[str] = Field(default=None, description="SQL query executed (if any)")
    records_analyzed: int = Field(default=0, description="Number of records in the result")
    processing_time_sec: float = Field(..., description="Total end-to-end processing time")
    agents_invoked: list[str] = Field(default_factory=list, description="List of agents that ran")
    steps_taken: int = Field(default=0, description="Total graph steps taken (max 8)")
    llm_provider: str = Field(default="", description="LLM provider used (groq/ollama)")
    model_used: str = Field(default="", description="Model name used")


class AskResponse(BaseModel):
    """Response body for POST /ask endpoint."""

    # ── Core Answer ──
    answer: str = Field(..., description="The plain-English answer to the question")

    # ── Confidence ──
    confidence: float = Field(..., ge=0.0, le=1.0, description="Confidence score (0.0-1.0)")
    confidence_label: str = Field(..., description="Human-readable label: 'High', 'Medium', 'Low'")
    confidence_reason: str = Field(default="", description="Why this confidence level was assigned")

    # ── Visualization ──
    chart_spec: Optional[ChartSpec] = Field(default=None, description="Chart specification for Plotly")

    # ── Trace / Explainability ──
    trace: list[TraceStep] = Field(default_factory=list, description="Agent execution trace for the UI panel")

    # ── Recommendations ──
    recommended_action: Optional[str] = Field(default=None, description="Actionable recommendation with owner")
    approval_required: bool = Field(default=False, description="Whether human approval is needed")

    # ── Flags ──
    low_sample_size: bool = Field(default=False, description="True if result is based on < 30 records")
    is_out_of_scope: bool = Field(default=False, description="True if question was refused as out-of-scope")
    is_degraded: bool = Field(default=False, description="True if running on fallback LLM")

    # ── Metadata ──
    metadata: ResponseMetadata = Field(..., description="Processing metadata")

    # ── Timestamps ──
    timestamp: str = Field(default_factory=lambda: datetime.now().isoformat(), description="Response timestamp")
    reference_date: str = Field(default="2025-12-30", description="'As of' date for relative time resolution")


class ApprovalRequest(BaseModel):
    """Request body for POST /approve endpoint."""
    session_id: str = Field(..., description="Session ID")
    approved: bool = Field(..., description="Whether the action was approved")
    modified_action: Optional[str] = Field(default=None, description="Modified action text, if edited")


class HealthResponse(BaseModel):
    """Response body for GET /health endpoint."""
    status: str = Field(default="ok")
    version: str = Field(default="1.0.0")
    data_loaded: bool = Field(default=False)
    model_loaded: bool = Field(default=False)
    llm_provider: str = Field(default="")
    reference_date: str = Field(default="")
