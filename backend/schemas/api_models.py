from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class HealthResponse(BaseModel):
    status: str
    version: str
    environment: str
    duckdb_connected: bool
    ml_model_loaded: bool

class ErrorResponse(BaseModel):
    message: str
    type: str

class AskRequest(BaseModel):
    message: str = Field(..., description="The natural language query from the user.")
    thread_id: Optional[str] = Field(None, description="Optional thread ID for conversation continuity.")

class AskResponse(BaseModel):
    response: str
    citations: List[str] = []
    thread_id: str

class PredictionResponse(BaseModel):
    predictions: List[int]
    probabilities: List[float]
    threshold_applied: float
