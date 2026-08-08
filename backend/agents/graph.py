from langgraph.graph import StateGraph, END
from langgraph.types import RetryPolicy
from langgraph.checkpoint.sqlite import SqliteSaver
import sqlite3
from agents.state import EnterpriseAgentState
from agents.registry import get_agent_registry
from agents.router import intent_router

# Import all agents to register their factories
from agents.nodes.data_agent import DataAgent
from agents.nodes.analysis_agent import AnalysisAgent
from agents.nodes.narrative_agent import NarrativeAgent
from agents.nodes.validator_agent import ValidatorAgent
from agents.nodes.simulation_agent import SimulationAgent
from agents.nodes.report_agent import ReportAgent
from agents.nodes.risk_agent import RiskAgent
from agents.nodes.knowledge_agent import KnowledgeAgent
from agents.nodes.memory_manager import MemoryManager

from rag.chroma_store import ChromaVectorStore
from rag.bm25_index import BM25Index
from memory.session_store import SQLiteSessionStore

# Obtain DI provider registry
registry = get_agent_registry()

# Global stores for RAG / Memory (can be moved to dependency container later)
_vector_store = ChromaVectorStore()
_bm25 = BM25Index()
_session_store = SQLiteSessionStore()

# Register Agent Factories
registry.register_factory("knowledge_agent", lambda: KnowledgeAgent(_vector_store, _bm25))
registry.register_factory("memory_manager", lambda: MemoryManager(_session_store))
registry.register_factory("data_agent", DataAgent)
registry.register_factory("analysis_agent", AnalysisAgent)
registry.register_factory("narrative_agent", NarrativeAgent)
registry.register_factory("validator_agent", ValidatorAgent)
registry.register_factory("simulation_agent", SimulationAgent)
registry.register_factory("report_agent", ReportAgent)
registry.register_factory("risk_agent", RiskAgent)

def build_enterprise_graph() -> StateGraph:
    workflow = StateGraph(EnterpriseAgentState)

    # Define robust enterprise retry policy
    retry_policy = RetryPolicy(max_attempts=3, initial_interval=1, backoff_factor=2)

    # Add all registered nodes using the DI registry
    for name in registry._agent_factories.keys():
        agent_instance = registry.get(name)
        if name == "validator_agent":
            workflow.add_node(name, agent_instance)
        else:
            workflow.add_node(name, agent_instance, retry_policy=retry_policy)

    # Set linear initialization sequence
    workflow.set_entry_point("knowledge_agent")
    workflow.add_edge("knowledge_agent", "memory_manager")

    # The memory manager branches out based on user intent
    workflow.add_conditional_edges(
        "memory_manager",
        intent_router,
        {
            "data_agent": "data_agent",
            "simulation_agent": "simulation_agent",
            "report_agent": "report_agent",
            "risk_agent": "risk_agent",
            "narrative_agent": "narrative_agent",
        }
    )

    # Standard Execution Path for standard data requests
    workflow.add_edge("data_agent", "analysis_agent")
    workflow.add_edge("analysis_agent", "narrative_agent")

    # All paths eventually converge on the Validator Agent before returning to the user
    workflow.add_edge("narrative_agent", "validator_agent")
    workflow.add_edge("simulation_agent", "validator_agent")
    workflow.add_edge("report_agent", "validator_agent")
    workflow.add_edge("risk_agent", "validator_agent")
    
    # Validator is the final node
    workflow.add_edge("validator_agent", END)

    # Set up memory persistence using SQLite
    conn = sqlite3.connect(".langgraph_checkpoints.db", check_same_thread=False)
    memory_saver = SqliteSaver(conn)

    # Compile the graph with checkpointer
    app = workflow.compile(checkpointer=memory_saver)
    return app

# Singleton compiled graph for local testing, 
# although API routes can build per-request via DI.
enterprise_graph = build_enterprise_graph()
