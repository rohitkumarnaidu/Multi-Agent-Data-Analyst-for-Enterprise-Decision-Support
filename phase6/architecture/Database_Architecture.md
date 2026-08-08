# Database Architecture
**Generated:** 2026-08-08 05:46:59  

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
