"""
Session and History API.
"""
from fastapi import APIRouter, Depends, HTTPException
from security.auth import get_current_user
from memory.session_store import SQLiteSessionStore
import structlog

logger = structlog.get_logger("enterprise_backend.api.session")
router = APIRouter()

store = SQLiteSessionStore()

@router.get("/{session_id}/history")
async def get_history(session_id: str, current_user: dict = Depends(get_current_user)):
    """Retrieve session history."""
    logger.info("Retrieving session history", session_id=session_id)
    session = store.get_session(session_id)
    if not session:
        return {"session_id": session_id, "messages": []}
    return session

@router.post("/{session_id}/feedback")
async def submit_feedback(session_id: str, feedback: dict, current_user: dict = Depends(get_current_user)):
    """Submit feedback for a session."""
    logger.info("Feedback received", session_id=session_id)
    session = store.get_session(session_id)
    if not session:
        session = {}
    
    feedbacks = session.get("feedback", [])
    feedbacks.append(feedback)
    session["feedback"] = feedbacks
    store.update_session(session_id, session)
    
    return {"status": "success"}
