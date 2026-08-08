# Integration Architecture

## System Topography
- **Client Tier**: Enterprise React Frontend (Dashboards, Chat, Knowledge Base).
- **API Tier**: FastAPI (Authentication, Session Management, Agent Invocation).
- **Orchestration Tier**: LangGraph (Intent Routing, Agent Coordination).
- **Agent Tier**: specialized agents (Knowledge, Memory, Data, Analysis, Simulation, Risk, Narrative, Validator, Report).
- **Data Tier**: DuckDB (Structured Data), ChromaDB/BM25 (Hybrid RAG), SQLite (Memory).
- **ML Tier**: Phase 5 Champion Model (Prediction & Inference).

## Data Flow
User Request -> FastAPI -> Auth Middleware -> LangGraph Router -> Agents -> Data/ML Tier -> Report Aggregation -> FastAPI Response -> Client Render.
