from typing import Any, Dict
from agents.state import EnterpriseAgentState
import time
import structlog

logger = structlog.get_logger("enterprise_backend")

class BaseEnterpriseAgent:
    def __init__(self, name: str):
        self.name = name

    def _log_start(self, state: EnterpriseAgentState):
        logger.info(f"Agent Started: {self.name}", session_id=state.get("session_id", "unknown"))

    def _log_end(self, state: EnterpriseAgentState, duration: float):
        logger.info(f"Agent Completed: {self.name}", duration=duration, session_id=state.get("session_id", "unknown"))

    def __call__(self, state: EnterpriseAgentState) -> Dict[str, Any]:
        self._log_start(state)
        start_time = time.perf_counter()
        
        try:
            updates = self.execute(state)
        except Exception as e:
            logger.error(f"Agent {self.name} failed", error=str(e))
            updates = {"errors": [f"{self.name} failed: {str(e)}"], "validation_status": "failed"}
            
        duration = time.perf_counter() - start_time
        
        # Merge timing and trace updates automatically
        if "timing" not in updates:
            updates["timing"] = {}
        updates["timing"][self.name] = duration
        
        if "trace" not in updates:
            updates["trace"] = []
        updates["trace"].append(f"{self.name} executed in {duration:.4f}s")
        
        self._log_end(state, duration)
        return updates

    def execute(self, state: EnterpriseAgentState) -> Dict[str, Any]:
        raise NotImplementedError("Each agent must implement the execute method.")
