# Backend Architecture
**Generated:** 2026-08-08 05:46:59  

---

## 1. Framework
- **Primary Framework:** FastAPI (Python 3.11+)
- **Concurrency:** `asyncio` for non-blocking I/O (Database, LLM calls, RAG queries).
- **Server:** Uvicorn with Gunicorn process manager (production).

## 2. Component Layers
1. **API Gateway Layer (`api/`)**: Defines routers, endpoints, WebSocket handlers, and payload validation (Pydantic).
2. **Orchestration Layer (`orchestration/`)**: Hosts the LangGraph StateGraph, managing transitions between agents based on routing logic.
3. **Agent Layer (`agents/`)**: Hosts the individual LLM-powered agents (Data, Analysis, Narrative, etc.) acting as nodes in the graph.
4. **Service Layer (`services/`)**: Interfaces with external systems (DuckDB, RAG, ML inference).
5. **Data Access Layer (`database/`)**: Manages connections to SQLite (memory) and DuckDB (analytics).

## 3. Dependency Injection
FastAPI's dependency injection system will be used to provide:
- Database sessions
- Active user contexts (from JWT)
- Initialized LLM clients
- RAG retrievers

This ensures the backend is highly testable and loosely coupled.
