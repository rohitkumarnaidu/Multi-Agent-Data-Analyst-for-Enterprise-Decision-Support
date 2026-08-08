# RAG Architecture

## Components
- `ChromaVectorStore`: Local embedding persistence using `sentence-transformers`.
- `BM25Index`: Lexical index for keyword exact matches.
- `HybridRetriever`: Combines vector similarity and BM25 using Reciprocal Rank Fusion (RRF) algorithm (k=60).
- `KnowledgeAgent`: LangGraph node executed immediately after the entry point to populate the state context.
