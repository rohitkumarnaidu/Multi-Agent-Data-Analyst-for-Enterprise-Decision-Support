import uuid
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi import Request
from fastapi import Request
import structlog

class RequestIDMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        correlation_id = request.headers.get("X-Correlation-ID", str(uuid.uuid4()))
        request.state.correlation_id = correlation_id
        
        # Inject into thread-local logger context in a real app (structlog contextvars)
        structlog.contextvars.bind_contextvars(correlation_id=correlation_id, request_id=correlation_id)
        
        response = await call_next(request)
        response.headers["X-Correlation-ID"] = correlation_id
        return response
