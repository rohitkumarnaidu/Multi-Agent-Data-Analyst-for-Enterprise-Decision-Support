from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware

from core.config import settings
from core.exceptions import EnterpriseBackendException, enterprise_exception_handler, global_exception_handler
from middleware.request_id import RequestIDMiddleware
from middleware.timing import TimingMiddleware
from api.router import api_router
from database.connection import db_manager
from services.ml_loader import ml_service
import log_config.logger
import structlog

logger = structlog.get_logger("enterprise_backend")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup actions
    logger.info("Initializing Enterprise Backend...")
    db_manager.connect_duckdb()
    ml_service.load_artifacts()
    logger.info("Startup complete.")
    yield
    # Shutdown actions
    logger.info("Shutting down...")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan
)

# Middleware
app.add_middleware(TimingMiddleware)
app.add_middleware(RequestIDMiddleware)
app.add_middleware(
    GZipMiddleware, 
    minimum_size=settings.COMPRESSION_MIN_SIZE, 
    compresslevel=settings.COMPRESSION_LEVEL
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Exceptions
app.add_exception_handler(EnterpriseBackendException, enterprise_exception_handler)
app.add_exception_handler(Exception, global_exception_handler)

# Routers
app.include_router(api_router, prefix=settings.API_V1_STR)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
