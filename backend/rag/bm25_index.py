"""
BM25 Keyword Index for Lexical Search.
"""
import structlog
from typing import List, Optional
from langchain_core.documents import Document
from langchain_community.retrievers import BM25Retriever

logger = structlog.get_logger("enterprise_backend.rag.bm25")

class BM25Index:
    def __init__(self):
        self.retriever: Optional[BM25Retriever] = None
        self.documents: List[Document] = []

    def build_index(self, documents: List[Document]):
        """Builds or rebuilds the BM25 lexical index."""
        logger.info("Building BM25 keyword index", num_docs=len(documents))
        if not documents:
            logger.warning("Attempted to build BM25 index with empty document list.")
            return

        self.documents.extend(documents)
        self.retriever = BM25Retriever.from_documents(self.documents)
        logger.info("BM25 index built successfully.")

    def keyword_search(self, query: str, k: int = 5) -> List[Document]:
        """Perform a keyword search using the BM25 index."""
        if not self.retriever:
            logger.warning("BM25 retriever invoked but not initialized. Returning empty.")
            return []
            
        logger.info("Executing keyword search", query=query, k=k)
        self.retriever.k = k
        return self.retriever.invoke(query)
