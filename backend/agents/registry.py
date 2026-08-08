from agents.base import BaseEnterpriseAgent
from typing import Dict, Type, Callable

class AgentRegistry:
    def __init__(self):
        self._agent_factories: Dict[str, Callable[[], BaseEnterpriseAgent]] = {}
        self._instances: Dict[str, BaseEnterpriseAgent] = {}

    def register_factory(self, name: str, factory: Callable[[], BaseEnterpriseAgent]):
        self._agent_factories[name] = factory

    def get(self, name: str) -> BaseEnterpriseAgent:
        if name not in self._agent_factories:
            raise ValueError(f"Agent '{name}' not found in registry.")
        # Lazy initialization via factory
        if name not in self._instances:
            self._instances[name] = self._agent_factories[name]()
        return self._instances[name]

    def get_all(self) -> Dict[str, BaseEnterpriseAgent]:
        # Instantiate all
        return {name: self.get(name) for name in self._agent_factories}
        
    def check_health(self) -> Dict[str, str]:
        return {name: "healthy" for name in self._agent_factories}

# Dependency Injection Provider for FastAPI compatibility
_global_registry = AgentRegistry()

def get_agent_registry() -> AgentRegistry:
    """FastAPI dependency provider for the Agent Registry."""
    return _global_registry

