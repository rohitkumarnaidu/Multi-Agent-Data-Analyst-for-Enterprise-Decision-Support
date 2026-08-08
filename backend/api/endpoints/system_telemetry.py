"""
System Telemetry API — Enterprise Decision Support Platform
=============================================================
System monitoring, resource usage, and service status.
Developer-facing endpoint for the System Monitor page.
"""
import os
import sys
import platform
import time
from fastapi import APIRouter
from core.config import settings
from database.connection import db_manager
from services.ml_loader import ml_service
import structlog

logger = structlog.get_logger("enterprise_backend.api.telemetry")
router = APIRouter()

_start_time = time.time()


@router.get("/telemetry")
async def get_system_telemetry():
    """Return system telemetry data."""
    services = []

    # DuckDB Status
    duckdb_status = "online" if db_manager.get_duckdb_conn() is not None else "offline"
    services.append({
        "name": "DuckDB",
        "status": duckdb_status,
        "version": "1.1",
        "details": "In-process analytical SQL engine",
    })

    # ML Model Status
    ml_status = "online" if ml_service.check_health() else "offline"
    services.append({
        "name": "ML Champion Model",
        "status": ml_status,
        "details": "Phase 5C Certified Stacking Ensemble",
    })

    # LLM Provider
    llm_provider = getattr(settings, 'DEFAULT_LLM_PROVIDER', 'unknown')
    llm_model = getattr(settings, 'GROQ_MODEL', '') or getattr(settings, 'OLLAMA_MODEL', '')
    services.append({
        "name": f"LLM ({llm_provider.title()})",
        "status": "online" if llm_provider != "unknown" else "degraded",
        "version": llm_model,
        "details": f"Provider: {llm_provider}",
    })

    # Ollama check
    try:
        import httpx
        resp = httpx.get(f"{settings.OLLAMA_HOST}/api/tags", timeout=2.0)
        if resp.status_code == 200:
            models = resp.json().get("models", [])
            model_names = [m["name"] for m in models[:3]]
            services.append({
                "name": "Ollama",
                "status": "online",
                "version": ", ".join(model_names) if model_names else "No models",
                "details": f"{len(models)} models available",
            })
        else:
            services.append({"name": "Ollama", "status": "offline"})
    except Exception:
        services.append({"name": "Ollama", "status": "offline", "details": "Not reachable"})

    # ChromaDB
    try:
        from rag.chroma_store import chroma_store
        chroma_status = "online" if chroma_store else "offline"
    except Exception:
        chroma_status = "offline"
    services.append({"name": "ChromaDB", "status": chroma_status, "details": "Vector database"})

    # SQLite Memory
    services.append({
        "name": "SQLite (Memory Store)",
        "status": "online" if os.path.exists(".memory.db") else "offline",
        "details": "Session and conversation storage",
    })

    # LangGraph Checkpoints
    services.append({
        "name": "LangGraph Checkpoints",
        "status": "online" if os.path.exists(".langgraph_checkpoints.db") else "offline",
        "details": "Graph execution state persistence",
    })

    # System resources
    cpu_percent = 0.0
    mem_percent = 0.0
    mem_used = 0.0
    mem_total = 0.0
    disk_used = 0.0
    disk_total = 0.0
    try:
        import psutil
        cpu_percent = psutil.cpu_percent(interval=0.1)
        mem = psutil.virtual_memory()
        mem_percent = mem.percent
        mem_used = round(mem.used / (1024 ** 3), 2)
        mem_total = round(mem.total / (1024 ** 3), 2)
        disk = psutil.disk_usage("/")
        disk_used = round(disk.used / (1024 ** 3), 2)
        disk_total = round(disk.total / (1024 ** 3), 2)
    except ImportError:
        pass

    return {
        "cpu_percent": cpu_percent,
        "memory_percent": mem_percent,
        "memory_used_mb": mem_used * 1024,
        "memory_total_mb": mem_total * 1024,
        "disk_used_gb": disk_used,
        "disk_total_gb": disk_total,
        "python_version": sys.version.split()[0],
        "platform": platform.platform(),
        "services": services,
        "llm_provider": llm_provider,
        "llm_model": llm_model,
        "uptime_sec": round(time.time() - _start_time, 2),
    }
