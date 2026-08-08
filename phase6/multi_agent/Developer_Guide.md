# Developer Guide (Updated for DI & Security)

## Creating a New Agent
1. **Inherit** from `BaseEnterpriseAgent`.
2. **Implement** the `execute(self, state: EnterpriseAgentState)` method.
3. **Register** your agent class in `graph.py` using `registry.register_factory(name, Class)`.

## Handling State
Do not mutate `state` directly inside the agent. Instead, return a `Dict` of updates. The `EnterpriseAgentState` reducers (like `append_to_list` and `merge_dicts`) will handle merging the updates into the global graph state.

## Security
Do not manually add PII stripping logic to your `execute()` method. The `BaseEnterpriseAgent` wrapper automatically triggers `_mask_pii()` before your logic runs.

## Retries
If you detect a transient failure (e.g., database timeout), simply `raise` an Exception in your `execute()` block. The LangGraph `RetryPolicy` (exponential backoff up to 3 times) will automatically catch it, log it, and retry the node.
