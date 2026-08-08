"""
Memory API — Enterprise Decision Support Platform
===================================================
Exposes conversation threads and memory usage statistics.
"""
import os
from fastapi import APIRouter
from memory.session_store import SQLiteSessionStore
import structlog

logger = structlog.get_logger("enterprise_backend.api.memory")
router = APIRouter()

store = SQLiteSessionStore()


@router.get("/threads")
async def list_threads():
    """List all conversation threads."""
    try:
        sessions = store.list_sessions() if hasattr(store, 'list_sessions') else []
        if sessions:
            return sessions
        # If list_sessions not available, return empty with note
        return []
    except Exception as e:
        logger.error("Thread listing failed", error=str(e))
        return []


@router.get("/usage")
async def get_memory_usage():
    """Return memory usage statistics."""
    result = {
        "total_threads": 0,
        "total_checkpoints": 0,
        "db_size_mb": 0.0,
        "checkpoint_db_size_mb": 0.0,
    }

    # Check session store DB
    memory_db = ".memory.db"
    if os.path.exists(memory_db):
        result["db_size_mb"] = round(os.path.getsize(memory_db) / (1024 * 1024), 2)

    # Check LangGraph checkpoint DB
    checkpoint_db = ".langgraph_checkpoints.db"
    if os.path.exists(checkpoint_db):
        result["checkpoint_db_size_mb"] = round(os.path.getsize(checkpoint_db) / (1024 * 1024), 2)

    # WAL file
    wal_file = checkpoint_db + "-wal"
    if os.path.exists(wal_file):
        result["checkpoint_db_size_mb"] += round(os.path.getsize(wal_file) / (1024 * 1024), 2)

    return result
