# Dependency Injection Guide

## Overview
To support multi-tenant scaling and FastAPI route isolation in Phase 6D, the `AgentRegistry` has been upgraded from a strict singleton to a Dependency Injection Factory.

## Factory Registration
Agents are no longer instantiated at import time. Instead, their class references are registered as factories:
```python
registry.register_factory("data_agent", DataAgent)
```

## Instantiation
When the LangGraph orchestrator compiles, it requests instances from the factory:
```python
agent_instance = registry.get(name)
```

## FastAPI Compatibility
For future REST API integration, `registry.py` provides a globally accessible dependency provider:
```python
def get_agent_registry() -> AgentRegistry:
    return _global_registry
```
This allows API routes to explicitly inject the registry via `Depends(get_agent_registry)`.
