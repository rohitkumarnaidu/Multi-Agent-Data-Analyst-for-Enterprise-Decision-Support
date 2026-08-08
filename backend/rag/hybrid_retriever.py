"""
Hybrid Retriever leveraging Reciprocal Rank Fusion (RRF).
"""
import structlog
from typing import List, Dict, Tuple
from langchain_core.documents import Document
from rag.chroma_store import ChromaVectorStore
from rag.bm25_index import BM25Index

logger = structlog.get_logger("enterprise_backend.rag.hybrid")

class HybridRetriever:
    def __init__(self, vector_store: ChromaVectorStore, bm25_index: BM25Index, rrf_k: int = 60):
        self.vector_store = vector_store
        self.bm25_index = bm25_index
        self.rrf_k = rrf_k  # Constant for RRF algorithm

    def _reciprocal_rank_fusion(self, search_results: List[List[Document]], top_k: int) -> List[Document]:
        """
        Fuses multiple result lists using Reciprocal Rank Fusion.
        RRF Score = sum(1 / (rrf_k + rank)) across all result lists.
        """
        doc_scores: Dict[str, float] = {}
        doc_map: Dict[str, Document] = {}

        for doc_list in search_results:
            for rank, doc in enumerate(doc_list):
                # We use page_content as a quick hash key if no explicit ID exists.
                # In production, docs should have unique IDs in metadata.
                doc_id = doc.metadata.get("id", doc.page_content[:100])
                
                if doc_id not in doc_scores:
                    doc_scores[doc_id] = 0.0
                    doc_map[doc_id] = doc
                
                doc_scores[doc_id] += 1.0 / (self.rrf_k + rank + 1)

        # Sort by RRF score descending
        sorted_docs = sorted(doc_scores.items(), key=lambda x: x[1], reverse=True)
        
        # Return top_k
        return [doc_map[doc_id] for doc_id, score in sorted_docs[:top_k]]

    def retrieve(self, query: str, k: int = 5) -> List[Document]:
        """Performs a hybrid semantic + keyword search with RRF."""
        logger.info("Executing Hybrid Retrieval", query=query, k=k)
        
        # 1. Semantic Search (Vector)
        semantic_docs = self.vector_store.semantic_search(query, k=k)
        
        # 2. Keyword Search (BM25)
        keyword_docs = self.bm25_index.keyword_search(query, k=k)
        
        # 3. Fuse Results
        fused_docs = self._reciprocal_rank_fusion([semantic_docs, keyword_docs], top_k=k)
        
        logger.info("Hybrid Retrieval complete", retrieved_docs=len(fused_docs))
        return fused_docs
