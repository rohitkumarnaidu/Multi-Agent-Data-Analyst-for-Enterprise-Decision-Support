from agents.base import BaseEnterpriseAgent
from typing import Dict, Type

class AgentRegistry:
    def __init__(self):
        self._agents: Dict[str, BaseEnterpriseAgent] = {}

    def register(self, agent: BaseEnterpriseAgent):
        self._agents[agent.name] = agent

    def get(self, name: str) -> BaseEnterpriseAgent:
        if name not in self._agents:
            raise ValueError(f"Agent '{name}' not found in registry.")
        return self._agents[name]

    def get_all(self) -> Dict[str, BaseEnterpriseAgent]:
        return self._agents
        
    def check_health(self) -> Dict[str, str]:
        return {name: "healthy" for name in self._agents}

registry = AgentRegistry()
