from fastapi import Request
from fastapi.responses import JSONResponse
from schemas.api_models import ErrorResponse
import structlog

logger = structlog.get_logger("enterprise_backend")

class EnterpriseBackendException(Exception):
    def __init__(self, message: str, status_code: int = 400):
        self.message = message
        self.status_code = status_code

async def enterprise_exception_handler(request: Request, exc: EnterpriseBackendException):
    logger.error(f"Enterprise error: {exc.message}")
    return JSONResponse(
        status_code=exc.status_code,
        content=ErrorResponse(message=exc.message, type="EnterpriseBackendException").model_dump()
    )

async def global_exception_handler(request: Request, exc: Exception):
    logger.critical(f"Unhandled exception: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content=ErrorResponse(message="Internal Server Error", type="InternalError").model_dump()
    )
