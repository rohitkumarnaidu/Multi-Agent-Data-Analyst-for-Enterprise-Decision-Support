# Telemetry Report

## Observability Payload
Every agent execution now generates a highly structured telemetry payload appended to the `EnterpriseAgentState.telemetry` array.

### Schema
```json
{
    "agent_name": "data_agent",
    "execution_id": "uuid-v4",
    "correlation_id": "session-string",
    "latency_sec": 0.0023,
    "retries": 0,
    "failure_reason": null,
    "recovery_status": "n/a",
    "timestamp": 1690000000.0
}
```

## Reducer Mechanism
Because LangGraph executes nodes asynchronously and potentially in parallel, the `telemetry` list uses an `append_to_list` typed reducer. This ensures that concurrent writes from parallel agent execution paths merge flatly into a single chronological array.

This telemetry allows downstream dashboards (or the Risk Agent) to monitor system health natively from the graph state without parsing external logs.
