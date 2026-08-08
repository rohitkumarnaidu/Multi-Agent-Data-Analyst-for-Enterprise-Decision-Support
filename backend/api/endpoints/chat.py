"""
FastAPI Endpoints for Chat, Ask, Simulate, Report, Anomaly.
"""
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import Dict, Any, Optional
from security.auth import get_current_user
from agents.graph import enterprise_graph
import uuid
import structlog

logger = structlog.get_logger("enterprise_backend.api.chat")
router = APIRouter()

class ChatRequest(BaseModel):
    query: str
    intent: Optional[str] = None
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    session_id: str
    response: Dict[str, Any]

@router.post("/ask", response_model=ChatResponse)
@router.post("/chat", response_model=ChatResponse)
async def ask_endpoint(
    request: ChatRequest,
    background_tasks: BackgroundTasks,
    current_user: dict = Depends(get_current_user)
):
    """
    Standard query endpoint for invoking the LangGraph multi-agent orchestrator.
    """
    session_id = request.session_id or str(uuid.uuid4())
    logger.info("Received chat request", session_id=session_id, user=current_user["username"])
    
    # Initialize state
    state = {
        "question": request.query,
        "intent": request.intent or "data",
        "session_id": session_id,
        "metadata": {"user": current_user["username"]},
        "trace": [],
        "telemetry": [],
    }
    
    try:
        # Execute the graph
        # For LangGraph 0.1.x checkpointing, we pass configurable thread_id
        config = {"configurable": {"thread_id": session_id}}
        result = enterprise_graph.invoke(state, config=config)
        
        return ChatResponse(
            session_id=session_id,
            response=result
        )
    except Exception as e:
        logger.error("Graph execution failed", session_id=session_id, error=str(e))
        raise HTTPException(status_code=500, detail=f"Execution failed: {str(e)}")

# Add stub endpoints for /simulate, /report, /anomaly which simply override intent
@router.post("/simulate", response_model=ChatResponse)
async def simulate_endpoint(request: ChatRequest, current_user: dict = Depends(get_current_user)):
    request.intent = "simulate"
    return await ask_endpoint(request, BackgroundTasks(), current_user)

@router.post("/report", response_model=ChatResponse)
async def report_endpoint(request: ChatRequest, current_user: dict = Depends(get_current_user)):
    request.intent = "report"
    return await ask_endpoint(request, BackgroundTasks(), current_user)

@router.post("/anomaly", response_model=ChatResponse)
async def anomaly_endpoint(request: ChatRequest, current_user: dict = Depends(get_current_user)):
    request.intent = "risk"
    return await ask_endpoint(request, BackgroundTasks(), current_user)
