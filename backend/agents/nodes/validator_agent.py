from typing import Dict, Any
import pandas as pd
from agents.base import BaseEnterpriseAgent
from agents.state import EnterpriseAgentState
from agents.validator_agent import validator_agent
from agents.analysis_agent import InsightSkeleton

class ValidatorAgent(BaseEnterpriseAgent):
    def __init__(self):
        super().__init__("validator_agent")

    def execute(self, state: EnterpriseAgentState) -> Dict[str, Any]:
        narrative = state.get("narrative", "")
        analysis_data = state.get("analysis", {})
        data = state.get("data_results", [])
        
        skeleton = None
        if analysis_data:
            skeleton = InsightSkeleton(**analysis_data)
            
        df = pd.DataFrame(data) if data else pd.DataFrame()
        sql_error = state.get("errors", [None])[0] if state.get("errors") else None

        sanitized_narrative, val_report, requires_human_approval = validator_agent.validate(
            narrative=narrative,
            skeleton=skeleton,
            df=df,
            sql_error=sql_error
        )

        return {
            "narrative": sanitized_narrative,
            "validation_status": "passed" if val_report.is_valid else "failed",
            "confidence": val_report.confidence_score,
            "metadata": {
                "validator_agent_status": "success",
                "requires_human_approval": requires_human_approval,
                "validation_report": val_report.dict()
            }
        }
