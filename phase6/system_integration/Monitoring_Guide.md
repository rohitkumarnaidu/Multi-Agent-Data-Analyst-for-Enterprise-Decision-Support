# Monitoring Guide

## Observability Stack
- **LangSmith**: Used for tracing LangGraph agent executions.
- **OpenTelemetry**: Integrated for backend tracing.
- **Structured Logging**: All logs are JSON formatted with Correlation IDs for cross-service tracking.
- **Health Checks**: Monitor `/health` and `/ready` endpoints via your load balancer.
