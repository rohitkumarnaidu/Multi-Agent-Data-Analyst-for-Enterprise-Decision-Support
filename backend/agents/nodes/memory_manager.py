"""
Memory Manager Node for LangGraph.
"""
from typing import Dict, Any
from agents.state import EnterpriseAgentState
from agents.base import BaseEnterpriseAgent
from memory.session_store import SQLiteSessionStore
import structlog

logger = structlog.get_logger("enterprise_backend.agents.memory")

class MemoryManager(BaseEnterpriseAgent):
    """
    Memory Manager Agent responsible for context compression,
    conversation summary, and maintaining the reasoning history auxiliary.
    """
    
    def __init__(self, store: SQLiteSessionStore):
        super().__init__("memory_manager")
        self.session_store = store
        
    def execute(self, state: EnterpriseAgentState) -> Dict[str, Any]:
        """Execute memory compression and state synchronization."""
        logger.info("Executing Memory Manager")
        
        session_id = state.get("session_id", "default_session")
        
        # In a full implementation, we'd compress previous 'messages' using an LLM.
        # Here we synchronize with long-term SQLite session metadata.
        meta = self.session_store.get_session(session_id)
        meta["last_intent"] = state.get("intent", "")
        self.session_store.update_session(session_id, meta)
        
        # Inject reasoning history into context if available
        reasoning_history = meta.get("reasoning_history", [])
        
        # If we had a deep chat history, we'd compress it here to avoid token limits.
        
        return {
            "session_id": session_id,
            # We don't overwrite the whole state, just return what changed
            # Reducers in EnterpriseAgentState will handle merging.
        }
