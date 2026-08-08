# RAG Architecture
**Generated:** 2026-08-08 05:46:59  

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
