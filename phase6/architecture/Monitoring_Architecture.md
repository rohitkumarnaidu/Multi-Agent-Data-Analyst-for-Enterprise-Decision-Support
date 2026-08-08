# Monitoring Architecture
**Generated:** 2026-08-08 05:46:59  

---

## 1. Application Logging
- Uses Python `logging` module with structured JSON output via `structlog`.
- All requests logged with `trace_id` for distributed tracing.
- Captures API latency, status codes, and unhandled exceptions.

## 2. LLM Observability
- **LangSmith (or similar):** Integrated with LangGraph to capture the full trace of every agent execution, including intermediate states, exact prompts sent to the LLM, token usage, and latency per node.
- **Cost Tracking:** Token counts multiplied by model cost to track spend per session.

## 3. Metrics (Prometheus / Grafana)
FastAPI exposes `/metrics` capturing:
- `requests_total`
- `request_duration_seconds`
- `active_websockets`
- `llm_token_usage_total`
- `duckdb_query_duration`
