# API Architecture

## FastAPI Routing
- `/chat/ask`: Core LangGraph query endpoint.
- `/chat/simulate`: Chat endpoint forcing `simulation_agent` execution.
- `/knowledge/upload`: Admin endpoint for PDF/CSV ingest.
- `/session/{id}/history`: Memory retrieval.

## Middleware
- RateLimiter (stub for slowapi)
- TimingMiddleware (Latency Tracking)
- GZip (Compression)
- RequestID (Tracing)
