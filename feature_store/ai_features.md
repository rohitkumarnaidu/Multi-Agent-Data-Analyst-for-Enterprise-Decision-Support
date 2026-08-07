# AI Features

This domain groups all features related to Large Language Model (LLM) performance, Agentic logic, and cognitive load.

## 1. `Tokens_Per_Second`
- **Concept**: Inference Metrics / Efficiency
- **Business Value**: Monitors cloud compute spend and user-facing latency. If this drops, the system is degrading.
- **AI Value**: Acts as a proxy for API health or context-window strain.
- **Model Usage**: Predicts SLA breaches.

## 2. `Complexity_Per_Agent`
- **Concept**: Reasoning Metrics / Agent Utilization
- **Business Value**: Identifies if we are throwing too many (or too few) agents at a complex problem.
- **AI Value**: Measures the distributed cognitive load of the LangGraph network.
- **Model Usage**: Early-stopping criteria for the graph router. If the score is too high, it routes to a human operator.
