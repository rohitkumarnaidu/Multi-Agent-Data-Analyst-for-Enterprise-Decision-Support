import time
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi import Request
import structlog

logger = structlog.get_logger("enterprise_backend")

class TimingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start_time = time.perf_counter()
        response = await call_next(request)
        process_time = time.perf_counter() - start_time
        response.headers["X-Process-Time"] = str(process_time)
        
        logger.info(f"Path: {request.url.path} completed in {process_time:.4f}s", process_time=process_time)
        return response
