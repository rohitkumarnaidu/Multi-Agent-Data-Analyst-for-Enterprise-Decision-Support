# Production Folder Structure
**Generated:** 2026-08-08 05:46:59  

---

The implementation will establish the following structure in the root directory:

```text
/backend
├── api/                  # FastAPI routers and endpoints
│   ├── routes_chat.py
│   ├── routes_ml.py
│   └── websockets.py
├── core/                 # Config, security, exceptions
│   ├── config.py
│   └── security.py
├── database/             # DuckDB, SQLite setup and CRUD
│   ├── duckdb_client.py
│   └── models.py
├── orchestration/        # LangGraph StateGraph definition
│   ├── state.py
│   └── graph.py
├── agents/               # Individual agent nodes
│   ├── router.py
│   ├── data_agent.py
│   ├── analysis_agent.py
│   └── narrative_agent.py
├── rag/                  # ChromaDB, ingest, retrieval
│   ├── document_loader.py
│   └── retriever.py
├── services/             # Interfaces to ML models
│   └── ml_service.py
├── utils/                # Prompts, parsers, helpers
├── tests/                # Pytest suite
├── main.py               # FastAPI entrypoint
├── requirements.txt
└── Dockerfile
```
