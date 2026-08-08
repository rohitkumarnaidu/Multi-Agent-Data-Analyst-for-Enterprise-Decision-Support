# Reliability Audit

## LangGraph Retries
- **Implementation:** `langgraph.types.RetryPolicy`
- **Tuning:** 3 attempts max, starting with 1 second, backing off exponentially by a factor of 2.
- **Coverage:** Applied to all executable nodes.
- **Exclusion:** Intentionally excludes the `validator_agent`. A validation failure indicates a logical failure, not a transient operational failure, and therefore should not blindly retry.

## Exception Bubbling
Exceptions raised in the `execute()` block are logged by `structlog`, telemetry is attached for observability, and the exception is bubbled cleanly up to the LangGraph executor to trigger the retry policy.

**Result:** PASS
