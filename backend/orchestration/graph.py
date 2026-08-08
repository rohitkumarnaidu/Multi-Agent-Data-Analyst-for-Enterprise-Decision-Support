"""
LangGraph Multi-Agent Workflow — Datasphere 26
===============================================
Compiles the 8-node state graph orchestrating:
  1. Orchestrator Node (Intent & Routing)
  2. Knowledge / RAG Node (ChromaDB + BM25)
  3. Data Node (DuckDB SQL Engine)
  4. Analysis Node (Deterministic Metrics & Plotly ChartSpec)
  5. Anomaly & Risk Node (Certified Phase 5C ML Champion)
  6. Simulation Node (What-If Scenarios)
  7. Narrative Node (Grounded Executive Insights)
  8. Validator Node (Zero-Trust Validation & Human Gating)
"""

import time
import pandas as pd
from typing import Dict, Any, Optional
from langgraph.graph import StateGraph, END
from langgraph.checkpoint.memory import MemorySaver

from backend.orchestration.state import AgentState
from backend.semantic.retriever import retriever, should_retrieve
from backend.agents.orchestrator import orchestrator
from backend.agents.data_agent import data_agent
from backend.agents.analysis_agent import analysis_agent, InsightSkeleton
from backend.agents.anomaly_agent import anomaly_agent
from backend.agents.simulation_agent import simulation_agent
from backend.agents.narrative_agent import narrative_agent
from backend.agents.validator_agent import validator_agent
from backend.api_contract import ValidationReport, ConfidenceLevel


# ── Node 1: Orchestrator ──
def orchestrator_node(state: AgentState) -> AgentState:
    steps = state.get("execution_steps", [])
    steps.append("Orchestrator: Intent classification & entity extraction")
    
    question = state["question"]
    history = state.get("session_history", [])
    classification = orchestrator.classify(question, history)
    
    intent = classification.get("intent", "sql_query")
    confidence = float(classification.get("confidence", 0.9))
    entities = classification.get("entities", {})
    resolved_q = classification.get("resolved_question", question)
    
    # Check conditional RAG trigger
    needs_rag = should_retrieve(resolved_q, intent, confidence)
    
    return {
        "intent": intent,
        "intent_confidence": confidence,
        "intent_reason": classification.get("reason", ""),
        "entities": entities,
        "resolved_question": resolved_q,
        "rag_triggered": needs_rag,
        "execution_steps": steps
    }


# ── Node 2: Knowledge & RAG ──
def knowledge_node(state: AgentState) -> AgentState:
    steps = state.get("execution_steps", [])
    steps.append("Knowledge Layer: Hybrid RRF retrieval (ChromaDB + BM25)")
    
    query = state.get("resolved_question", state["question"])
    docs = retriever.retrieve(query, top_k=3)
    formatted_context = retriever.format_context_for_prompt(docs)
    
    return {
        "retrieved_docs": docs,
        "retrieved_context": formatted_context,
        "execution_steps": steps
    }


# ── Node 3: Data Node (DuckDB SQL) ──
def data_node(state: AgentState) -> AgentState:
    steps = state.get("execution_steps", [])
    steps.append("Data Agent: NL-to-SQL generation & DuckDB query execution")
    
    query = state.get("resolved_question", state["question"])
    context = state.get("retrieved_context", "")
    
    sql = data_agent.generate_sql(query, context)
    df, final_sql, err = data_agent.execute_and_correct(sql, query)
    
    records = df.to_dict(orient="records") if not df.empty else []
    
    return {
        "sql_query": final_sql,
        "query_result_records": records,
        "sql_error": err,
        "execution_steps": steps
    }


# ── Node 4: Analysis Node (Deterministic) ──
def analysis_node(state: AgentState) -> AgentState:
    steps = state.get("execution_steps", [])
    steps.append("Analysis Agent: Deterministic statistics & ChartSpec generation (Zero LLM)")
    
    records = state.get("query_result_records", [])
    df = pd.DataFrame(records) if records else pd.DataFrame()
    question = state.get("resolved_question", state["question"])
    sql_used = state.get("sql_query", "")
    
    skeleton, chart_spec = analysis_agent.analyze(df, question, sql_used)
    
    return {
        "insight_skeleton": skeleton.dict() if skeleton else None,
        "chart_spec": chart_spec.dict() if chart_spec else None,
        "execution_steps": steps
    }


# ── Node 5: Anomaly & Risk Node ──
def anomaly_node(state: AgentState) -> AgentState:
    steps = state.get("execution_steps", [])
    steps.append("Anomaly & Risk Agent: Phase 5C ML Champion operational scan")
    
    # Load dataset for scan
    df = data_agent.engine.execute_query("SELECT * FROM enterprise_data LIMIT 5000;")
    risk_scan = anomaly_agent.scan_dataset_anomalies(df)
    chart = anomaly_agent.generate_risk_chart(risk_scan)
    
    answer_text = (
        f"**Enterprise Operational Risk Audit Summary**\n\n"
        f"• **Scanned Transactions:** {risk_scan['total_scanned_records']:,}\n"
        f"• **Overall SLA Breach Rate:** **{risk_scan['overall_sla_breach_rate_pct']}%**\n"
        f"• **Anomaly Detection Rate:** **{risk_scan['overall_anomaly_rate_pct']}%**\n"
        f"• **Human Bottlenecks Detected:** **{risk_scan['human_bottleneck_rate_pct']}%**\n"
        f"• **Silent False-Confidence Alerts:** **{risk_scan['false_confidence_count']} incidents**\n\n"
        f"**Model Audit Status:** Certified Champion Ensemble ({risk_scan['champion_model_name']}) active."
    )
    
    rec_action = "Deploy automated SLA throttling to top high-risk departments. (Owner: Head of AI Governance)"
    
    return {
        "anomaly_data": risk_scan,
        "raw_answer": answer_text,
        "recommended_action": rec_action,
        "chart_spec": chart.dict() if chart else None,
        "execution_steps": steps
    }


# ── Node 6: Simulation Node ──
def simulation_node(state: AgentState) -> AgentState:
    steps = state.get("execution_steps", [])
    steps.append("Simulation Agent: Tier 1 What-If deterministic recomputation")
    
    df = data_agent.engine.execute_query("SELECT * FROM enterprise_data LIMIT 5000;")
    question = state.get("resolved_question", state["question"])
    sim_res, chart = simulation_agent.simulate(df, question)
    
    answer_text = (
        f"**What-If Scenario Simulation Results**\n\n"
        f"• **Scenario Action:** {sim_res['action']}\n"
        f"• **Simulation Type:** {sim_res['scenario_type']}\n"
        f"• **Key Outcome:** {sim_res['key_takeaway']}\n"
        f"• **Confidence Level:** {sim_res['confidence_label']}"
    )
    
    rec_action = "Incorporate projected scenario tolerances into upcoming quarterly budget plan. (Owner: VP of Finance)"
    
    return {
        "simulation_data": sim_res,
        "raw_answer": answer_text,
        "recommended_action": rec_action,
        "chart_spec": chart.dict() if chart else None,
        "execution_steps": steps
    }


# ── Node 7: Narrative Node ──
def narrative_node(state: AgentState) -> AgentState:
    steps = state.get("execution_steps", [])
    steps.append("Narrative Agent: Grounded executive synthesis")
    
    intent = state.get("intent", "sql_query")
    question = state.get("resolved_question", state["question"])
    
    if intent == "out_of_scope":
        ans = (
            "I am the Datasphere Enterprise AI Data Analyst. I specialize in enterprise decision support, "
            "AI efficiency metrics, governance compliance, revenue impact, and risk modeling. "
            "I cannot answer questions outside enterprise operations."
        )
        return {
            "raw_answer": ans,
            "recommended_action": "Please query internal business metrics or operational agent workloads.",
            "execution_steps": steps
        }
        
    if intent == "general_faq":
        ans = (
            "Welcome to Datasphere 26 Decision Support System. You can ask analytical questions such as:\n"
            "• 'Which department has the highest token efficiency?'\n"
            "• 'What is our SLA breach rate across agents?'\n"
            "• 'What if token costs decrease by 15%?'\n"
            "• 'Run an operational anomaly audit.'"
        )
        return {
            "raw_answer": ans,
            "recommended_action": "Select a domain to begin interactive analysis.",
            "execution_steps": steps
        }

    # For SQL / RAG knowledge
    skeleton_dict = state.get("insight_skeleton")
    skeleton = InsightSkeleton(**skeleton_dict) if skeleton_dict else InsightSkeleton(
        total_records=0,
        primary_metric="N/A",
        primary_value=0.0,
        key_findings=[]
    )
    retrieved_ctx = state.get("retrieved_context", "")

    # For RAG/knowledge intent, build answer directly from retrieved docs
    if intent in ("rag_knowledge", "general_faq") and retrieved_ctx:
        ans = (
            f"**Enterprise Knowledge Response**\n\n"
            f"{retrieved_ctx.replace('--- ENTERPRISE KNOWLEDGE CONTEXT ---', '').replace('------------------------------------', '').strip()}\n\n"
            f"*Source: Datasphere 26 Enterprise Knowledge Base (ChromaDB + BM25 Hybrid Index)*"
        )
        rec_action = "Consult your Enterprise AI Governance team to validate this metric definition before use in reporting."
        return {
            "raw_answer": ans,
            "recommended_action": rec_action,
            "execution_steps": steps
        }

    raw_ans, rec_action = narrative_agent.generate_narrative(question, skeleton, retrieved_ctx)

    
    return {
        "raw_answer": raw_ans,
        "recommended_action": rec_action,
        "execution_steps": steps
    }


# ── Node 8: Validator Node ──
def validator_node(state: AgentState) -> AgentState:
    steps = state.get("execution_steps", [])
    steps.append("Validator Agent: Zero-Trust numeric verification & confidence scoring")
    
    narrative = state.get("raw_answer", "")
    skeleton_dict = state.get("insight_skeleton")
    skeleton = InsightSkeleton(**skeleton_dict) if skeleton_dict else None
    
    records = state.get("query_result_records", [])
    df = pd.DataFrame(records) if records else pd.DataFrame()
    sql_error = state.get("sql_error")
    
    sanitized, report, req_approval = validator_agent.validate(narrative, skeleton, df, sql_error)
    
    start_time = state.get("start_timestamp", time.time())
    total_latency = round(time.time() - start_time, 4)
    
    return {
        "sanitized_answer": sanitized,
        "confidence_score": report.confidence_score,
        "confidence_level": report.confidence_level.value,
        "validation_report": report.dict(),
        "requires_human_approval": req_approval,
        "approval_reason": report.approval_reason,
        "total_latency_sec": total_latency,
        "execution_steps": steps
    }


# ── Routing Decision Functions ──
def route_after_orchestrator(state: AgentState) -> str:
    if state.get("rag_triggered", False):
        return "knowledge_node"
    return route_by_intent(state)


def route_by_intent(state: AgentState) -> str:
    intent = state.get("intent", "sql_query")
    if intent == "sql_query":
        return "data_node"
    elif intent == "anomaly_risk":
        return "anomaly_node"
    elif intent == "simulation":
        return "simulation_node"
    else:
        return "narrative_node"


# ── Build & Compile Graph ──
def build_graph():
    workflow = StateGraph(AgentState)

    # Register Nodes
    workflow.add_node("orchestrator_node", orchestrator_node)
    workflow.add_node("knowledge_node", knowledge_node)
    workflow.add_node("data_node", data_node)
    workflow.add_node("analysis_node", analysis_node)
    workflow.add_node("anomaly_node", anomaly_node)
    workflow.add_node("simulation_node", simulation_node)
    workflow.add_node("narrative_node", narrative_node)
    workflow.add_node("validator_node", validator_node)

    # Entrypoint
    workflow.set_entry_point("orchestrator_node")

    # Routing Edges
    workflow.add_conditional_edges(
        "orchestrator_node",
        route_after_orchestrator,
        {
            "knowledge_node": "knowledge_node",
            "data_node": "data_node",
            "anomaly_node": "anomaly_node",
            "simulation_node": "simulation_node",
            "narrative_node": "narrative_node"
        }
    )

    workflow.add_conditional_edges(
        "knowledge_node",
        route_by_intent,
        {
            "data_node": "data_node",
            "anomaly_node": "anomaly_node",
            "simulation_node": "simulation_node",
            "narrative_node": "narrative_node"
        }
    )

    # Sequential edges
    workflow.add_edge("data_node", "analysis_node")
    workflow.add_edge("analysis_node", "narrative_node")
    workflow.add_edge("narrative_node", "validator_node")
    workflow.add_edge("anomaly_node", "validator_node")
    workflow.add_edge("simulation_node", "validator_node")
    workflow.add_edge("validator_node", END)

    # Compile with in-memory checkpointer
    memory = MemorySaver()
    app = workflow.compile(checkpointer=memory)
    return app


# Singleton compiled graph
multi_agent_app = build_graph()
