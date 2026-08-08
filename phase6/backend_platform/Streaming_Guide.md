# Streaming Guide

## LangGraph Streaming
The graph supports `.stream()` execution.
For the FastAPI `/chat` endpoint, a generator function must wrap `enterprise_graph.stream(state)` to yield `Event` objects as Server-Sent Events (SSE).

**Current Status:** Endpoint structures exist. SSE iterators can be toggled depending on the frontend payload request format.
