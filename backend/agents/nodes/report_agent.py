from typing import Dict, Any
from agents.base import BaseEnterpriseAgent
from agents.state import EnterpriseAgentState

class ReportAgent(BaseEnterpriseAgent):
    def __init__(self):
        super().__init__("report_agent")

    def execute(self, state: EnterpriseAgentState) -> Dict[str, Any]:
        return {
            "narrative": "# Executive Report\n\nAll metrics are nominal.",
            "metadata": {"report_agent_status": "success"}
        }
