"""
Knowledge Extended API — Enterprise Decision Support Platform
==============================================================
Extended knowledge base endpoints for document listing,
stats, and hybrid search.
"""
import os
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
import structlog

logger = structlog.get_logger("enterprise_backend.api.knowledge_ext")
router = APIRouter()

UPLOAD_DIR = ".knowledge_files"


@router.get("/documents")
async def list_documents():
    """List all indexed knowledge documents."""
    docs = []
    if os.path.exists(UPLOAD_DIR):
        for fname in os.listdir(UPLOAD_DIR):
            fpath = os.path.join(UPLOAD_DIR, fname)
            if os.path.isfile(fpath):
                ext = os.path.splitext(fname)[1].lower()
                file_type_map = {
                    ".pdf": "pdf", ".csv": "csv", ".xlsx": "excel",
                    ".xls": "excel", ".md": "markdown", ".txt": "text",
                    ".json": "json", ".docx": "word",
                }
                docs.append({
                    "filename": fname,
                    "file_type": file_type_map.get(ext, "unknown"),
                    "size_bytes": os.path.getsize(fpath),
                })
    return docs


@router.get("/stats")
async def get_knowledge_stats():
    """Return knowledge base statistics."""
    stats = {
        "vector_count": 0,
        "chunk_count": 0,
        "bm25_index_size": 0,
        "embedding_model": "BAAI/bge-m3",
        "documents_indexed": 0,
    }

    # Count documents
    if os.path.exists(UPLOAD_DIR):
        stats["documents_indexed"] = len([f for f in os.listdir(UPLOAD_DIR) if os.path.isfile(os.path.join(UPLOAD_DIR, f))])

    # Try to get ChromaDB stats
    try:
        from rag.chroma_store import chroma_store
        if hasattr(chroma_store, 'collection') and chroma_store.collection is not None:
            stats["vector_count"] = chroma_store.collection.count()
            stats["chunk_count"] = stats["vector_count"]
    except Exception as e:
        logger.debug("ChromaDB stats unavailable", error=str(e))

    # Try to get BM25 stats
    try:
        from rag.bm25_index import bm25_index
        if hasattr(bm25_index, 'corpus_size'):
            stats["bm25_index_size"] = bm25_index.corpus_size
    except Exception as e:
        logger.debug("BM25 stats unavailable", error=str(e))

    return stats


class SearchRequest(BaseModel):
    query: str


@router.post("/search")
async def search_knowledge(request: SearchRequest):
    """Perform hybrid search across the knowledge base."""
    try:
        from semantic.retriever import retriever
        results = retriever.retrieve(request.query, top_k=5)
        return [
            {
                "content": doc.get("content", doc.get("text", "")),
                "source": doc.get("source", doc.get("metadata", {}).get("source", "unknown")),
                "similarity_score": round(float(doc.get("score", doc.get("similarity", 0.0))), 4),
                "chunk_id": doc.get("id", ""),
            }
            for doc in results
        ]
    except Exception as e:
        logger.error("Knowledge search failed", error=str(e))
        return []
