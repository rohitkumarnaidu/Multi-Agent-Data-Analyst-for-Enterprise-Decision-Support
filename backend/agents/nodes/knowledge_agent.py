from typing import Dict, Any
from agents.state import EnterpriseAgentState
from agents.base import BaseEnterpriseAgent
from rag.chroma_store import ChromaVectorStore
from rag.bm25_index import BM25Index
from rag.hybrid_retriever import HybridRetriever
import structlog

logger = structlog.get_logger("enterprise_backend.agents.knowledge")

class KnowledgeAgent(BaseEnterpriseAgent):
    """
    Knowledge Agent responsible for retrieving relevant context 
    from the Hybrid RAG system before other agents execute.
    """
    
    def __init__(self, vector_store: ChromaVectorStore, bm25_index: BM25Index):
        super().__init__("knowledge_agent")
        self.retriever = HybridRetriever(vector_store, bm25_index)
        
    def execute(self, state: EnterpriseAgentState) -> Dict[str, Any]:
        """Execute knowledge retrieval."""
        logger.info("Executing Knowledge Agent retrieval")
        
        query = state.get("question", "")
        if not query:
            logger.warning("No question found in state, skipping retrieval.")
            return {}
            
        try:
            docs = self.retriever.retrieve(query, k=5)
            context_string = "\n\n".join([d.page_content for d in docs])
            
            logger.info("Knowledge retrieved", num_docs=len(docs))
            
            # Since 'context' is not guaranteed to be an append list in the typed dict,
            # we just overwrite or merge. We'll update the state context.
            return {"context": context_string}
            
        except Exception as e:
            logger.error("Knowledge retrieval failed", error=str(e))
            self._handle_failure(state, e)
            raise
