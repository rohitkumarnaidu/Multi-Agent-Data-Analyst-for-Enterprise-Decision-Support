"""
Document loading and chunking utilities for the Enterprise Knowledge Base.
"""
from typing import List, Optional
import os
import structlog
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import PyPDFLoader, CSVLoader, UnstructuredMarkdownLoader, DirectoryLoader

logger = structlog.get_logger("enterprise_backend.rag.loaders")

class EnterpriseDocumentLoader:
    def __init__(self, chunk_size: int = 1000, chunk_overlap: int = 200):
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
            separators=["\n\n", "\n", " ", ""]
        )

    def load_and_chunk_file(self, file_path: str, metadata: Optional[dict] = None) -> List[Document]:
        """Loads a single file, chunks it, and attaches enterprise metadata."""
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"Knowledge file not found: {file_path}")

        logger.info(f"Loading document", file_path=file_path)
        ext = file_path.lower().split('.')[-1]
        
        try:
            if ext == 'pdf':
                loader = PyPDFLoader(file_path)
            elif ext == 'csv':
                loader = CSVLoader(file_path)
            elif ext == 'md':
                loader = UnstructuredMarkdownLoader(file_path)
            else:
                raise ValueError(f"Unsupported document format: {ext}")
            
            docs = loader.load()
            
            # Enrich metadata
            if metadata:
                for doc in docs:
                    doc.metadata.update(metadata)
                    
            chunks = self.text_splitter.split_documents(docs)
            logger.info("Document chunked successfully", num_chunks=len(chunks), file_path=file_path)
            return chunks
            
        except Exception as e:
            logger.error("Failed to load document", file_path=file_path, error=str(e))
            raise
