# Agent Registry

## Discovery and Registration
The `AgentRegistry` (`backend/agents/registry.py`) implements a singleton registry pattern.

This eliminates circular dependencies and allows new agents to be injected dynamically at runtime. 
Each agent inherits from `BaseEnterpriseAgent`, guaranteeing they implement a common execution interface and tracking standards.

## Registered Agents
1. `data_agent`
2. `analysis_agent`
3. `narrative_agent`
4. `validator_agent`
5. `simulation_agent`
6. `report_agent`
7. `risk_agent`

The registry exposes a `check_health()` method to quickly probe the availability of all nodes.
