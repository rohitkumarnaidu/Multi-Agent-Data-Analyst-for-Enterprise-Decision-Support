from typing import Dict, Any
import pandas as pd
from agents.base import BaseEnterpriseAgent
from agents.state import EnterpriseAgentState
from agents.analysis_agent import analysis_agent

class AnalysisAgent(BaseEnterpriseAgent):
    def __init__(self):
        super().__init__("analysis_agent")

    def execute(self, state: EnterpriseAgentState) -> Dict[str, Any]:
        data = state.get("data_results", [])
        df = pd.DataFrame(data) if data else pd.DataFrame()
        question = state.get("question", "")
        sql = state.get("sql_query", "")

        skeleton, chart_spec = analysis_agent.analyze(df, question, sql)

        return {
            "analysis": skeleton.dict() if skeleton else None,
            "charts": [chart_spec.dict()] if chart_spec else [],
            "metadata": {"analysis_agent_status": "success"}
        }
