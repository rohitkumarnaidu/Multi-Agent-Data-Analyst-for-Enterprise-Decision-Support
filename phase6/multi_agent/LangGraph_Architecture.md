# LangGraph Architecture

## State Schema
The core of the architecture is the `EnterpriseAgentState`, a `TypedDict` equipped with reducer functions (e.g., `append_to_list`, `merge_dicts`) to handle parallel and sequential state mutations securely without race conditions.

## StateGraph Compilation
The `build_enterprise_graph()` function compiles the workflow:
1. It registers all agents from the `AgentRegistry`.
2. It sets a conditional entry point mapped to the `intent_router()`.
3. It defines linear sub-graphs (e.g., `Data` -> `Analysis` -> `Narrative`).
4. It funnels all final edges into the `ValidatorAgent` to enforce strict output integrity.
5. The `ValidatorAgent` outputs to the special `END` node.

This compilation allows the execution engine to handle retries and graph interruptions natively.
