"""
FastAPI Application — Multi-Agent Data Analyst (Datasphere 26)
===============================================================
Exposes the LangGraph multi-agent decision support system via REST endpoints.

Endpoints:
  POST /ask             - Process a business question through the 8-node graph
  POST /approve         - Resume a human-in-the-loop interrupted workflow
  GET  /health          - System health & subsystem status check
  GET  /anomalies       - On-demand enterprise-wide risk & anomaly scan
  POST /simulate        - Direct what-if scenario simulation
  POST /export-pdf      - Generate and download executive PDF report
"""

import time
from typing import Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response

from backend.api_contract import (
    AskRequest, AskResponse, ApprovalRequest, HealthResponse,
    ResponseMetadata, TraceStep, ConfidenceLevel
)
from backend.config import settings

# ── Lazy imports to avoid startup time on load ──
_multi_agent_app = None
_data_agent = None
_anomaly_agent = None
_simulation_agent = None
_report_agent = None


def _get_graph():
    global _multi_agent_app
    if _multi_agent_app is None:
        from backend.orchestration.graph import multi_agent_app
        _multi_agent_app = multi_agent_app
    return _multi_agent_app


def _get_data_agent():
    global _data_agent
    if _data_agent is None:
        from backend.agents.data_agent import data_agent
        _data_agent = data_agent
    return _data_agent


def _get_anomaly_agent():
    global _anomaly_agent
    if _anomaly_agent is None:
        from backend.agents.anomaly_agent import anomaly_agent
        _anomaly_agent = anomaly_agent
    return _anomaly_agent


def _get_simulation_agent():
    global _simulation_agent
    if _simulation_agent is None:
        from backend.agents.simulation_agent import simulation_agent
        _simulation_agent = simulation_agent
    return _simulation_agent


def _get_report_agent():
    global _report_agent
    if _report_agent is None:
        from backend.agents.report_agent import report_agent
        _report_agent = report_agent
    return _report_agent


# ── FastAPI Application ──
app = FastAPI(
    title="Datasphere 26 — Multi-Agent Enterprise Decision Support API",
    description=(
        "Zero-Trust, LangGraph-orchestrated 8-node multi-agent AI system "
        "for enterprise operational intelligence and decision support."
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── In-memory session store for human-in-the-loop approvals ──
_pending_approvals: dict = {}


# ── Root ──
@app.get("/")
def read_root():
    return {
        "status": "ok",
        "message": "Datasphere 26 Multi-Agent Decision Support API is running.",
        "docs": "/docs"
    }


# ── POST /ask ──
@app.post("/ask", response_model=AskResponse)
def ask_question(request: AskRequest):
    """
    Primary endpoint. Submits a natural language business question
    through the full 8-node LangGraph multi-agent system.
    """
    start_time = time.time()
    graph = _get_graph()

    initial_state = {
        "question": request.question,
        "session_id": request.session_id,
        "start_timestamp": start_time,
        "execution_steps": []
    }

    config = {"configurable": {"thread_id": request.session_id}}

    try:
        result = graph.invoke(initial_state, config=config)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Agent graph execution failed: {str(e)}")

    total_time = round(time.time() - start_time, 3)
    answer = result.get("sanitized_answer") or result.get("raw_answer") or "No response generated."
    confidence = float(result.get("confidence_score", 0.8))
    confidence_label = result.get("confidence_level", "HIGH")
    requires_approval = result.get("requires_human_approval", False)

    # Persist for approval if needed
    if requires_approval:
        _pending_approvals[request.session_id] = result

    # Build execution trace steps
    steps = result.get("execution_steps", [])
    trace = [
        TraceStep(agent=step.split(":")[0].strip(), action=step, duration_sec=0.0)
        for step in steps
    ]

    # Build chart spec if present
    chart_spec = None
    if result.get("chart_spec"):
        from backend.api_contract import ChartSpec
        chart_spec = ChartSpec(**result["chart_spec"])

    metadata = ResponseMetadata(
        query_used=result.get("sql_query"),
        records_analyzed=len(result.get("query_result_records") or []),
        processing_time_sec=total_time,
        agents_invoked=[s.split(":")[0].strip() for s in steps],
        steps_taken=len(steps),
        llm_provider=settings.DEFAULT_LLM_PROVIDER,
        model_used=settings.GROQ_MODEL if settings.GROQ_API_KEY else settings.OLLAMA_MODEL
    )

    return AskResponse(
        answer=answer,
        confidence=confidence,
        confidence_label=confidence_label,
        confidence_reason=result.get("approval_reason") or "Deterministic Zero-Trust verification passed.",
        chart_spec=chart_spec,
        trace=trace,
        recommended_action=result.get("recommended_action"),
        approval_required=requires_approval,
        low_sample_size=len(result.get("query_result_records") or []) < 30 and len(result.get("query_result_records") or []) > 0,
        is_out_of_scope=result.get("intent") == "out_of_scope",
        is_degraded=settings.DEFAULT_LLM_PROVIDER == "ollama",
        metadata=metadata
    )


# ── POST /approve ──
@app.post("/approve")
def approve_action(request: ApprovalRequest):
    """
    Resume a human-in-the-loop interrupted workflow. Required when
    the Validator Agent sets requires_human_approval = True.
    """
    pending = _pending_approvals.get(request.session_id)
    if not pending:
        raise HTTPException(status_code=404, detail=f"No pending approval found for session '{request.session_id}'.")

    if request.approved:
        del _pending_approvals[request.session_id]
        return {
            "status": "approved",
            "session_id": request.session_id,
            "message": "Action approved and committed to enterprise workflow.",
            "action_taken": request.modified_action or pending.get("recommended_action", "N/A")
        }
    else:
        del _pending_approvals[request.session_id]
        return {
            "status": "rejected",
            "session_id": request.session_id,
            "message": "Action rejected. No changes applied."
        }


# ── GET /health ──
@app.get("/health", response_model=HealthResponse)
def health_check():
    """
    Returns system health status: data layer, ML model, LLM provider.
    """
    da = _get_data_agent()
    aa = _get_anomaly_agent()

    data_ok = False
    try:
        test = da.engine.execute_query("SELECT COUNT(*) AS cnt FROM enterprise_data")
        data_ok = int(test.iloc[0]["cnt"]) > 0
    except Exception:
        pass

    model_ok = aa.pipeline is not None

    return HealthResponse(
        status="ok",
        version="1.0.0",
        data_loaded=data_ok,
        model_loaded=model_ok,
        llm_provider=settings.DEFAULT_LLM_PROVIDER,
        reference_date="2025-12-30"
    )


# ── GET /anomalies ──
@app.get("/anomalies")
def get_anomalies():
    """
    Runs an enterprise-wide risk scan using the Phase 5C champion pipeline.
    Returns department risk ranking, SLA breach rates, and top anomalous records.
    """
    da = _get_data_agent()
    aa = _get_anomaly_agent()

    try:
        df = da.engine.execute_query("SELECT * FROM enterprise_data LIMIT 5000;")
        risk_scan = aa.scan_dataset_anomalies(df)
        chart = aa.generate_risk_chart(risk_scan)
        return {
            "status": "ok",
            "risk_scan": risk_scan,
            "chart_spec": chart.dict() if chart else None
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Anomaly scan failed: {str(e)}")


# ── POST /simulate ──
@app.post("/simulate")
def simulate_scenario(body: dict):
    """
    Direct what-if scenario simulation. Supply a JSON body with:
      { "question": "What if token costs decrease by 15%?" }
    """
    question = body.get("question", "")
    if not question:
        raise HTTPException(status_code=400, detail="'question' field is required.")

    da = _get_data_agent()
    sa = _get_simulation_agent()

    try:
        df = da.engine.execute_query("SELECT * FROM enterprise_data LIMIT 5000;")
        sim_result, chart = sa.simulate(df, question)
        return {
            "status": "ok",
            "simulation": sim_result,
            "chart_spec": chart.dict() if chart else None
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Simulation failed: {str(e)}")


# ── POST /export-pdf ──
@app.post("/export-pdf")
def export_pdf(body: dict):
    """
    Generates and returns an executive PDF briefing document.
    Supply a JSON body with:
      {
        "question": "...",
        "answer": "...",
        "recommended_action": "...",  (optional)
        "sql_query": "...",           (optional)
        "kpi_data": {...}             (optional)
      }
    """
    question = body.get("question", "Enterprise Analysis")
    answer = body.get("answer", "No analysis text provided.")
    recommended_action = body.get("recommended_action")
    sql_query = body.get("sql_query")
    kpi_data = body.get("kpi_data")

    ra = _get_report_agent()

    try:
        pdf_bytes = ra.generate_pdf_report(
            question=question,
            answer=answer,
            recommended_action=recommended_action,
            kpi_data=kpi_data,
            sql_query=sql_query
        )
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={
                "Content-Disposition": "attachment; filename=datasphere_enterprise_report.pdf"
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF generation failed: {str(e)}")
