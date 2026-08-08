from typing import Any, Dict
from agents.state import EnterpriseAgentState
import time
import structlog
import uuid

logger = structlog.get_logger("enterprise_backend")

class BaseEnterpriseAgent:
    def __init__(self, name: str):
        self.name = name

    def _log_start(self, state: EnterpriseAgentState, execution_id: str):
        logger.info(f"Agent Started: {self.name}", session_id=state.get("session_id", "unknown"), execution_id=execution_id)

    def _log_end(self, state: EnterpriseAgentState, duration: float, execution_id: str):
        logger.info(f"Agent Completed: {self.name}", duration=duration, session_id=state.get("session_id", "unknown"), execution_id=execution_id)

    # Security Hooks
    def _check_prompt_injection(self, state: EnterpriseAgentState):
        """Security framework hook for detecting prompt injections."""
        pass # To be implemented in Phase 6D

    def _sanitize_input(self, state: EnterpriseAgentState):
        """Security framework hook for sanitizing input state."""
        pass

    def _mask_pii(self, state: EnterpriseAgentState):
        """Security framework hook for masking PII."""
        pass

    def _validate_output_safety(self, updates: Dict[str, Any]):
        """Security framework hook for validating output safety."""
        pass

    def __call__(self, state: EnterpriseAgentState) -> Dict[str, Any]:
        execution_id = str(uuid.uuid4())
        self._log_start(state, execution_id)
        start_time = time.perf_counter()
        
        # Security Execution (Pre)
        self._check_prompt_injection(state)
        self._sanitize_input(state)
        self._mask_pii(state)
        
        metadata = state.get("metadata", {})
        # Native LangGraph `.with_retry()` doesn't inherently pass the retry count back into the node's state
        # but we can track manual retries or log it as "n/a" for natively handled retries in telemetry.
        retry_count = 0 
        failure_reason = None
        recovery_status = "n/a"

        try:
            updates = self.execute(state)
            
            # Security Execution (Post)
            self._validate_output_safety(updates)
            
        except Exception as e:
            logger.error(f"Agent {self.name} failed", error=str(e), execution_id=execution_id)
            failure_reason = str(e)
            recovery_status = "failed"
            # We raise so LangGraph's `.with_retry()` policy catches it
            raise e
            
        duration = time.perf_counter() - start_time
        
        # Merge timing and trace updates automatically
        if "timing" not in updates:
            updates["timing"] = {}
        updates["timing"][self.name] = duration
        
        if "trace" not in updates:
            updates["trace"] = []
        updates["trace"].append(f"{self.name} executed in {duration:.4f}s")
        
        # Append structured telemetry
        telemetry_event = {
            "agent_name": self.name,
            "execution_id": execution_id,
            "correlation_id": state.get("session_id", "unknown"),
            "latency_sec": duration,
            "retries": retry_count,
            "failure_reason": failure_reason,
            "recovery_status": recovery_status,
            "timestamp": time.time()
        }
        if "telemetry" not in updates:
            updates["telemetry"] = []
        updates["telemetry"].append(telemetry_event)
        
        self._log_end(state, duration, execution_id)
        return updates

    def execute(self, state: EnterpriseAgentState) -> Dict[str, Any]:
        raise NotImplementedError("Each agent must implement the execute method.")
