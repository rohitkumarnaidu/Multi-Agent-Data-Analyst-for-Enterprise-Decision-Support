from langgraph.graph import StateGraph, END
from agents.state import EnterpriseAgentState
from agents.registry import registry
from agents.router import intent_router

# Import all agents to register them
from agents.nodes.data_agent import DataAgent
from agents.nodes.analysis_agent import AnalysisAgent
from agents.nodes.narrative_agent import NarrativeAgent
from agents.nodes.validator_agent import ValidatorAgent
from agents.nodes.simulation_agent import SimulationAgent
from agents.nodes.report_agent import ReportAgent
from agents.nodes.risk_agent import RiskAgent

# Register Agents
registry.register(DataAgent())
registry.register(AnalysisAgent())
registry.register(NarrativeAgent())
registry.register(ValidatorAgent())
registry.register(SimulationAgent())
registry.register(ReportAgent())
registry.register(RiskAgent())

def build_enterprise_graph() -> StateGraph:
    workflow = StateGraph(EnterpriseAgentState)

    # Add all registered nodes
    for name, agent in registry.get_all().items():
        workflow.add_node(name, agent)

    # Define Conditional Entry Point (Router)
    # The router determines the initial agent based on the intent
    workflow.set_conditional_entry_point(
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

    # Compile the graph
    app = workflow.compile()
    return app

# Singleton compiled graph
enterprise_graph = build_enterprise_graph()
