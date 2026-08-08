# Retry Implementation Guide

## LangGraph Native Retries
We utilize LangGraph's native `RetryPolicy` to handle transient node failures gracefully.

### Configuration
```python
from langgraph.types import RetryPolicy

retry_policy = RetryPolicy(
    max_attempts=3,
    initial_interval=1,
    backoff_factor=2
)
```

### Application
During graph compilation, the policy is passed via the `retry_policy` keyword argument:
`workflow.add_node(name, agent_instance, retry_policy=retry_policy)`

### Exceptions
The `validator_agent` is specifically excluded from the retry policy. Validation failures must propagate linearly or fail fast, as retrying a pure validation step without mutating the underlying input provides no value.

### Node Behavior
To trigger a retry, the agent's `execute()` method must explicitly raise an Exception. The `BaseEnterpriseAgent.__call__` wrapper catches these, records a telemetry failure event, and re-raises to inform the LangGraph orchestrator.
