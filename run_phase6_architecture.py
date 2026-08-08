"""
Phase 6 — Enterprise Backend Architecture & Implementation Plan
=========================================================
Datasphere 26 | Multi-Agent Data Analyst for Enterprise Decision Support

Generates 14 required architecture documents in:
    phase6/architecture/
"""

import pathlib
from datetime import datetime

# ─── Config ───────────────────────────────────────────────────────────────────
ROOT   = pathlib.Path(__file__).parent.resolve()
P6_DIR = ROOT / "phase6" / "architecture"
P6_DIR.mkdir(parents=True, exist_ok=True)

TS = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

def log(m): print(f"[{datetime.now().strftime('%H:%M:%S')}] {m}")
def smd(text, name): (P6_DIR / name).write_text(text, encoding="utf-8"); log(f"  Doc: {name}")


# ═══════════════════════════════════════════════════════════════════════════════
# DOC 1: Architecture.md
# ═══════════════════════════════════════════════════════════════════════════════
log("Writing Architecture.md")
arch_md = f"""# Overall System Architecture
**Generated:** {TS}  
**Role:** Enterprise AI Platform Architecture Team

---

## 1. High-Level Architecture Flow

The system follows a strict, unidirectional flow from user request to response, coordinated by the FastAPI gateway and LangGraph orchestrator.

```mermaid
graph TD
    User([User]) -->|HTTPS/WSS| React[React Frontend]
    React -->|REST / WebSocket| FastAPI[FastAPI Backend Gateway]
    
    FastAPI -->|Invoke| LangGraph[LangGraph Orchestrator]
    
    subgraph Multi-Agent Pipeline
        LangGraph -->|State| Router[Intent Router]
        Router --> Data[Data Agent]
        Router --> Analysis[Analysis Agent]
        Router --> Sim[Simulation Agent]
        Router --> Narrative[Narrative Agent]
        Router --> Report[Report Agent]
        
        Data -.-> DuckDB[(DuckDB)]
        Analysis -.-> ML[Frozen ML Models]
        Narrative -.-> Validator[Validator Agent]
        Report -.-> Validator
    end
    
    LangGraph -->|Search Context| RAG[RAG Layer]
    LangGraph -->|Read/Write State| Memory[Memory Layer]
    
    RAG -.-> ChromaDB[(ChromaDB)]
    Memory -.-> Redis[(Redis / SQLite)]
    
    Validator -->|Validated Output| FastAPI
    FastAPI -->|JSON / Stream| React
```

## 2. Core Architectural Principles
- **Immutability of ML Artifacts:** The backend accesses Phase 1-5 artifacts in read-only mode.
- **Stateful Agents:** LangGraph manages the global state. Agents are stateless functions that operate on and mutate the LangGraph state.
- **Streaming First:** WebSockets allow token-by-token streaming of agent thoughts and RAG context to the UI.
- **Zero-Trust Validation:** The Validator Agent intercepts all outputs destined for the user to prevent hallucinations and check against policies.
"""
smd(arch_md, "Architecture.md")


# ═══════════════════════════════════════════════════════════════════════════════
# DOC 2: Backend_Architecture.md
# ═══════════════════════════════════════════════════════════════════════════════
log("Writing Backend_Architecture.md")
back_md = f"""# Backend Architecture
**Generated:** {TS}  

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
"""
smd(back_md, "Backend_Architecture.md")


# ═══════════════════════════════════════════════════════════════════════════════
# DOC 3: Agent_Architecture.md
# ═══════════════════════════════════════════════════════════════════════════════
log("Writing Agent_Architecture.md")
agent_md = f"""# Multi-Agent Architecture
**Generated:** {TS}  

---

## 1. LangGraph State Schema
```python
class AgentState(TypedDict):
    messages: Annotated[list[BaseMessage], operator.add]
    intent: str
    sql_query: Optional[str]
    query_results: Optional[list[dict]]
    ml_predictions: Optional[dict]
    rag_context: Optional[list[Document]]
    draft_response: Optional[str]
    validation_status: str
    errors: list[str]
```

## 2. Agent Node Definitions

| Agent | Responsibility | Inputs | Outputs | Failure Handling |
|---|---|---|---|---|
| **Intent Router** | Classifies user intent (Data, ML, RAG, Chat) | User Message | `intent` | Fallback to RAG/Chat |
| **Data Agent** | Generates DuckDB SQL queries | `messages`, `schema` | `sql_query`, `query_results` | Retry up to 3x on SQL errors |
| **Analysis Agent** | Interfaces with frozen XGBoost models | `query_results` | `ml_predictions` | Return error message to state |
| **Simulation Agent** | Runs "what-if" scenarios by altering ML inputs | User constraints | `ml_predictions` (simulated) | Reject invalid constraints |
| **Narrative Agent** | Converts raw data/predictions to business language | `query_results`, `ml_predictions` | `draft_response` | Fallback to raw data display |
| **Report Agent** | Compiles multi-step analyses into markdown reports | `messages`, `context`| `draft_response` (long-form) | N/A |
| **Validator Agent** | Zero-trust check of the `draft_response` against data | `draft_response`, data | `validation_status` | Return to Narrative Agent with critique |

## 3. Inter-Agent Communication
Agents do not call each other directly. They are nodes in a directed cyclic graph (LangGraph). They communicate purely by updating keys in the `AgentState`. The edges dictate the flow (e.g., Narrative Agent always proceeds to Validator Agent).
"""
smd(agent_md, "Agent_Architecture.md")


# ═══════════════════════════════════════════════════════════════════════════════
# DOC 4: RAG_Architecture.md
# ═══════════════════════════════════════════════════════════════════════════════
log("Writing RAG_Architecture.md")
rag_md = f"""# RAG Architecture
**Generated:** {TS}  

---

## 1. Knowledge Sources
The RAG system ingests:
- Phase 1-5 Audit and Certification Reports
- Feature Dictionaries and Registries
- Business Metric Definitions (SLA definitions)
- Model Metadata (e.g., XGBoost performance metrics)
- Architecture and Deployment Docs

## 2. Ingestion Pipeline
1. **Document Loader:** Reads `.md`, `.csv`, `.json` from the `phase1` - `phase5` directories.
2. **Chunking:** Semantic chunking using `RecursiveCharacterTextSplitter` (chunk size: 1000, overlap: 200).
3. **Embedding:** HuggingFace `all-MiniLM-L6-v2` (or OpenAI `text-embedding-3-small`).
4. **Vector Store:** ChromaDB (persistent local storage).

## 3. Retrieval Pipeline
- **Hybrid Retrieval:** 
  - Dense Vector Search (ChromaDB) for semantic matching.
  - Sparse BM25 Search for keyword matching (critical for column names like `customer_id`).
- **Reranking:** Cross-encoder reranking applied to the top 20 combined results to yield the top 5 most relevant chunks.
- **Citation System:** Every chunk injected into the prompt will carry metadata (`source`, `chunk_id`). The Narrative Agent is prompted to output citations in the format `[1]`, `[2]`.

## 4. Knowledge Validation
Before retrieval results enter the LLM prompt context, a lightweight validation check ensures the documents match the user's domain (e.g., preventing SLA queries from pulling RAG chunks about Frontend React routing).
"""
smd(rag_md, "RAG_Architecture.md")


# ═══════════════════════════════════════════════════════════════════════════════
# DOC 5: Memory_Architecture.md
# ═══════════════════════════════════════════════════════════════════════════════
log("Writing Memory_Architecture.md")
mem_md = f"""# Memory Architecture
**Generated:** {TS}  

---

## 1. Storage & Persistence
- **LangGraph Checkpointer:** Uses `SqliteSaver` (for MVP) or `AsyncPostgresSaver` (production) to persist the state of the graph after every node execution.
- **Thread ID:** Every conversation maps to a unique `thread_id`. The checkpointer loads the state associated with this thread to provide continuous memory.

## 2. Memory Types
| Type | Scope | Implementation |
|---|---|---|
| **Conversation Memory** | Single Thread | Raw LangGraph state (`messages` list). |
| **Session Memory** | Web Session | JWT token maps to active `thread_id`s in the database. |
| **Long-term Memory** | User Account | Extracted user preferences stored in a separate RDBMS table (e.g., "User prefers summary over detailed tables"). |
| **Feedback Memory** | System-wide | Thumbs up/down reactions on responses are logged to a Feedback DB for future RLHF. |

## 3. Context Window Management
To prevent blowing out the LLM context window:
- The `messages` list is pruned.
- An automatic summarization node runs when token count > 8000. It replaces the oldest 10 messages with a 1-paragraph summary, retaining the most recent 3 messages verbatim.
"""
smd(mem_md, "Memory_Architecture.md")


# ═══════════════════════════════════════════════════════════════════════════════
# DOC 6: API_Architecture.md
# ═══════════════════════════════════════════════════════════════════════════════
log("Writing API_Architecture.md")
api_md = f"""# API Architecture
**Generated:** {TS}  

---

## 1. REST Endpoints (FastAPI)

### Chat API
- `POST /api/v1/chat/ask`
  - **Purpose:** Synchronous request for an agent response.
  - **Input:** `{{ "message": str, "thread_id": str }}`
  - **Output:** `{{ "response": str, "citations": list, "data": dict }}`
- `GET /api/v1/chat/history/{{thread_id}}`
  - **Purpose:** Retrieve conversation history.

### ML & Simulation API
- `POST /api/v1/ml/predict`
  - **Purpose:** Direct inference against the XGBoost model.
  - **Input:** Array of feature dictionaries.
  - **Output:** Predictions and probabilities.
- `POST /api/v1/ml/simulate`
  - **Purpose:** Run what-if scenario.

### Feedback API
- `POST /api/v1/feedback`
  - **Purpose:** Capture user ratings (up/down).
  - **Input:** `{{ "message_id": str, "rating": int, "comment": str }}`

### Admin & System API
- `GET /health` -> Liveness probe.
- `GET /api/v1/metrics` -> Prometheus exposition.

## 2. WebSocket Endpoints
- `WS /ws/v1/chat/{{thread_id}}`
  - **Purpose:** Bi-directional streaming connection.
  - **Flow:** User sends text. Server streams back `status` events (e.g., "Agent thinking...", "Querying DB...") and `token` events (the actual LLM text generation) via Server-Sent Events pattern over WS.
"""
smd(api_md, "API_Architecture.md")


# ═══════════════════════════════════════════════════════════════════════════════
# DOC 7: Database_Architecture.md
# ═══════════════════════════════════════════════════════════════════════════════
log("Writing Database_Architecture.md")
db_md = f"""# Database Architecture
**Generated:** {TS}  

---

The system utilizes a polyglot persistence architecture, using the right database for the right job.

## 1. DuckDB (Analytical Engine)
- **Purpose:** Extremely fast OLAP queries on the frozen CSV datasets.
- **Usage:** The Data Agent constructs SQL queries that are executed against DuckDB. 
- **Storage:** Reads directly from `phase5/production_dataset/production_train.csv` (and related files). Data is never duplicated.

## 2. ChromaDB (Vector Store)
- **Purpose:** RAG embeddings storage.
- **Storage:** Stored locally in `backend/data/chroma/`.

## 3. SQLite / PostgreSQL (Relational Store)
- **Purpose:** Application state, users, feedback, and LangGraph checkpointer.
- **Tables:**
  - `users` (id, email, hash)
  - `sessions` (id, user_id, thread_id)
  - `feedback` (id, thread_id, message_id, rating)
  - `checkpoints` (managed by LangGraph)

## 4. Connection Management
- DuckDB connections are read-only and pooled.
- SQLite uses SQLAlchemy ORM with async connections (`aiosqlite`).
"""
smd(db_md, "Database_Architecture.md")


# ═══════════════════════════════════════════════════════════════════════════════
# DOC 8: Security_Architecture.md
# ═══════════════════════════════════════════════════════════════════════════════
log("Writing Security_Architecture.md")
sec_md = f"""# Security Architecture
**Generated:** {TS}  

---

## 1. Data Security & Injection Prevention
- **Prompt Injection:** All user inputs pass through a lightweight classifier to detect jailbreaks before entering the LangGraph state.
- **SQL Injection (DuckDB):** The Data Agent generates SQL, but DuckDB is mounted in **READ-ONLY** mode. `DROP`, `DELETE`, `UPDATE`, and `INSERT` commands will physically fail at the engine level.
- **PII Masking:** Any sensitive columns identified in Phase 2 are dropped or masked before they reach the Narrative Agent.

## 2. Authentication & Authorization
- **Auth:** JWT-based authentication via OAuth2PasswordBearer in FastAPI.
- **RBAC:** Roles (`user`, `admin`, `auditor`). The Intent Router denies access to system-level metrics (e.g., Audit logs) if the user lacks the `admin` role.

## 3. Operations Security
- **Secrets Management:** LLM API keys and JWT secrets loaded strictly via `.env` files and `python-dotenv`. NEVER hardcoded.
- **Rate Limiting:** IP and token-based rate limiting via FastAPI middleware to prevent LLM DDOS attacks.
"""
smd(sec_md, "Security_Architecture.md")


# ═══════════════════════════════════════════════════════════════════════════════
# DOC 9: Monitoring_Architecture.md
# ═══════════════════════════════════════════════════════════════════════════════
log("Writing Monitoring_Architecture.md")
mon_md = f"""# Monitoring Architecture
**Generated:** {TS}  

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
"""
smd(mon_md, "Monitoring_Architecture.md")


# ═══════════════════════════════════════════════════════════════════════════════
# DOC 10: Folder_Structure.md
# ═══════════════════════════════════════════════════════════════════════════════
log("Writing Folder_Structure.md")
folder_md = f"""# Production Folder Structure
**Generated:** {TS}  

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
"""
smd(folder_md, "Folder_Structure.md")


# ═══════════════════════════════════════════════════════════════════════════════
# DOC 11: Implementation_Roadmap.md
# ═══════════════════════════════════════════════════════════════════════════════
log("Writing Implementation_Roadmap.md")
roadmap_md = f"""# Implementation Roadmap
**Generated:** {TS}  

---

| Phase | Title | Deliverables | Dependencies |
|---|---|---|---|
| **Phase 6A** | **Core Backend Setup** | FastAPI skeleton, `main.py`, DuckDB connection, ML model loading. | Frozen Phase 5 Artifacts |
| **Phase 6B** | **RAG Pipeline** | ChromaDB init, Document ingestion script, Hybrid search module. | Phase 6A |
| **Phase 6C** | **Multi-Agent Core** | LangGraph state, Agent node definitions (Data, Analysis, Narrative). | Phase 6A |
| **Phase 6D** | **Memory & Graph Wiring** | SQLite checkpointer, Graph edges, Intent routing. | Phase 6C |
| **Phase 6E** | **API Surface** | REST endpoints, WebSocket streaming implementation. | Phase 6D |
| **Phase 6F** | **Frontend Wiring** | React app updated to call Phase 6E endpoints. Mock data removed. | Phase 6E |
| **Phase 6G** | **Deployment** | Dockerfile, Environment variables, Final integration test. | Phase 6F |

## Acceptance Criteria
- Code matches architecture design.
- Mocks completely removed.
- XGBoost Champion model provides live inference.
- Graph routes correctly 95% of the time.
"""
smd(roadmap_md, "Implementation_Roadmap.md")


# ═══════════════════════════════════════════════════════════════════════════════
# DOC 12: Architecture_Decision_Record.md
# ═══════════════════════════════════════════════════════════════════════════════
log("Writing Architecture_Decision_Record.md")
adr_md = f"""# Architecture Decision Record (ADR)
**Generated:** {TS}  

---

## ADR 1: Use LangGraph for Multi-Agent Orchestration
* **Context:** The system requires multiple agents (Data, ML, Narrative) to collaborate and pass state.
* **Decision:** We will use LangGraph instead of AutoGen or CrewAI.
* **Justification:** LangGraph provides absolute deterministic control over the flow of execution via state graphs, which is critical for enterprise compliance (e.g., ensuring the Validator agent always runs last). AutoGen is too autonomous/unpredictable for this strict requirement.

## ADR 2: Use DuckDB for Data Access
* **Context:** The agents need to query the 200k+ row production CSVs.
* **Decision:** We will use DuckDB in-process instead of loading Pandas dataframes.
* **Justification:** DuckDB allows standard SQL generation by the Data Agent, is drastically faster than Pandas for analytical queries, and easily handles memory limitations.

## ADR 3: COND-001 Threshold Enforcement
* **Context:** Phase 5D Certification mandated a custom threshold to overcome class imbalance.
* **Decision:** The `ml_service.py` will implement a hardcoded probability threshold ($t* = 0.05$) when translating XGBoost `predict_proba` into binary `predict` outputs.
* **Justification:** Satisfies the Governance Certification Board requirement blocking deployment.
"""
smd(adr_md, "Architecture_Decision_Record.md")


# ═══════════════════════════════════════════════════════════════════════════════
# DOC 13: Phase6_Master_Plan.md
# ═══════════════════════════════════════════════════════════════════════════════
log("Writing Phase6_Master_Plan.md")
master_md = f"""# Phase 6 Master Plan
**Generated:** {TS}  

---

## Executive Summary
This document serves as the master blueprint for Phase 6. The goal is to build an enterprise-grade API and Multi-Agent Orchestrator that wraps the ML and Data assets produced in Phases 1-5, exposing them to the React frontend.

## Guardrails
1. **No ML Retraining:** Do not touch `production_train.csv` or `champion_model.joblib`. Read them only.
2. **No Data Duplication:** DuckDB reads the CSVs in place.
3. **No Unvalidated Responses:** The LangGraph execution must always pass through a validation node before responding to the user.

## Next Steps for Engineering
1. Create the `/backend` folder.
2. Initialize virtual environment and install `fastapi`, `langgraph`, `duckdb`, `xgboost`, `chromadb`.
3. Begin execution of Phase 6A (Core Backend Setup) as defined in `Implementation_Roadmap.md`.
"""
smd(master_md, "Phase6_Master_Plan.md")


# ═══════════════════════════════════════════════════════════════════════════════
# DOC 14: README.md
# ═══════════════════════════════════════════════════════════════════════════════
log("Writing README.md")
readme_md = f"""# Phase 6 Backend Architecture
**Project:** Datasphere 26 — Multi-Agent Data Analyst for Enterprise Decision Support  
**Generated:** {TS}  
**Role:** Enterprise AI Platform Architecture Team

---

## Purpose
This directory contains the complete architectural blueprints for Phase 6. No code has been implemented yet. These documents serve as the technical specifications for the engineering team.

## Specifications Included

1. **Architecture.md** - High-level system flow and principles.
2. **Backend_Architecture.md** - FastAPI and framework details.
3. **Agent_Architecture.md** - LangGraph state and node definitions.
4. **RAG_Architecture.md** - Ingestion and hybrid retrieval pipelines.
5. **Memory_Architecture.md** - State persistence and session management.
6. **API_Architecture.md** - REST and WebSocket endpoint specs.
7. **Database_Architecture.md** - DuckDB, SQLite, and ChromaDB roles.
8. **Security_Architecture.md** - RBAC, injection prevention, and PII.
9. **Monitoring_Architecture.md** - Logging and LLM tracing.
10. **Folder_Structure.md** - The target `/backend` directory tree.
11. **Implementation_Roadmap.md** - Step-by-step implementation phases.
12. **Architecture_Decision_Record.md** - Justifications for key technical choices.
13. **Phase6_Master_Plan.md** - Master executive blueprint and guardrails.

## Action
Engineering is authorized to commence development following `Implementation_Roadmap.md`.
"""
smd(readme_md, "README.md")

log("=" * 60)
log("PHASE 6 ARCHITECTURE GENERATION COMPLETE")
log(f"Output: {P6_DIR}")
log("14 architectural documents generated successfully.")
log("=" * 60)
