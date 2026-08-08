from typing import Dict, Any
from agents.base import BaseEnterpriseAgent
from agents.state import EnterpriseAgentState
from agents.narrative_agent import narrative_agent
from agents.analysis_agent import InsightSkeleton

class NarrativeAgent(BaseEnterpriseAgent):
    def __init__(self):
        super().__init__("narrative_agent")

    def execute(self, state: EnterpriseAgentState) -> Dict[str, Any]:
        question = state.get("question", "")
        analysis_data = state.get("analysis", {})
        
        skeleton = None
        if analysis_data:
            skeleton = InsightSkeleton(**analysis_data)
            
        narrative, recommended_action = narrative_agent.generate_narrative(
            question=question,
            skeleton=skeleton,
            retrieved_context="\n".join(state.get("retrieved_context", []))
        )

        return {
            "narrative": narrative,
            "metadata": {
                "narrative_agent_status": "success",
                "recommended_action": recommended_action
            }
        }
