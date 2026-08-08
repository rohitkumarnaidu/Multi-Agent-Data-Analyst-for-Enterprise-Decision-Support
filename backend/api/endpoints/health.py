from fastapi import APIRouter, Depends
from schemas.api_models import HealthResponse
from core.config import settings
from database.connection import db_manager
from services.ml_loader import ml_service

router = APIRouter()

@router.get("/health", response_model=HealthResponse)
async def health_check():
    return HealthResponse(
        status="ok",
        version=settings.VERSION,
        environment=settings.ENVIRONMENT,
        duckdb_connected=db_manager.get_duckdb_conn() is not None,
        ml_model_loaded=ml_service.check_health()
    )

@router.get("/ready")
async def readiness_check():
    # Return 503 if not ready
    is_ready = db_manager.get_duckdb_conn() is not None and ml_service.check_health()
    return {"ready": is_ready}
