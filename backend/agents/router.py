from agents.state import EnterpriseAgentState
from typing import Literal
import structlog

logger = structlog.get_logger("enterprise_backend")

def intent_router(state: EnterpriseAgentState) -> Literal["data_agent", "simulation_agent", "report_agent", "risk_agent", "narrative_agent"]:
    """
    Examines the state and determines the next node to execute.
    This acts as the conditional edge logic in LangGraph.
    """
    intent = state.get("intent", "").lower()
    
    if "simulate" in intent or "what if" in intent:
        logger.info("Routing to simulation_agent")
        return "simulation_agent"
    elif "report" in intent:
        logger.info("Routing to report_agent")
        return "report_agent"
    elif "risk" in intent or "anomaly" in intent:
        logger.info("Routing to risk_agent")
        return "risk_agent"
    elif "narrative" in intent or "explain" in intent:
        logger.info("Routing to narrative_agent")
        return "narrative_agent"
    else:
        # Default path
        logger.info("Routing to data_agent")
        return "data_agent"
