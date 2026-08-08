"""
Enterprise ChromaDB Vector Store integration for Semantic Search.
"""
import os
import structlog
from typing import List, Dict, Any, Optional
from langchain_core.documents import Document
from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings

logger = structlog.get_logger("enterprise_backend.rag.chroma")

class ChromaVectorStore:
    def __init__(self, persist_directory: str = ".chroma_db", collection_name: str = "enterprise_knowledge"):
        self.persist_directory = os.path.abspath(persist_directory)
        self.collection_name = collection_name
        
        # Enterprise-grade local embeddings for privacy/security
        logger.info("Initializing HuggingFace Embeddings model...")
        self.embeddings = HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-MiniLM-L6-v2"
        )
        
        logger.info("Initializing Chroma vector store", directory=self.persist_directory)
        self.vector_store = Chroma(
            collection_name=self.collection_name,
            embedding_function=self.embeddings,
            persist_directory=self.persist_directory
        )

    def add_documents(self, documents: List[Document]) -> List[str]:
        """Index documents into the vector store."""
        logger.info("Indexing documents into Chroma", num_docs=len(documents))
        ids = self.vector_store.add_documents(documents)
        logger.info("Indexing complete", num_indexed=len(ids))
        return ids

    def semantic_search(self, query: str, k: int = 5, filter_dict: Optional[Dict[str, Any]] = None) -> List[Document]:
        """Perform a similarity search."""
        logger.info("Executing semantic search", query=query, k=k)
        results = self.vector_store.similarity_search(query, k=k, filter=filter_dict)
        return results

    def reset(self):
        """Wipes the database. Use carefully."""
        logger.warning("Wiping Chroma database")
        self.vector_store.delete_collection()
