# API Verification

## Routes
- `/chat/ask` and `/chat/chat` endpoints correctly parse JSON bodies into the LangGraph state dict.
- Streaming capabilities (SSE) are stubbed but depend on LangGraph `stream()` which cannot execute.

**Score:** FAILED (Cannot boot FastAPI)
