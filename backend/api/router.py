from fastapi import APIRouter
from api.endpoints import health, chat, knowledge, session

api_router = APIRouter()
api_router.include_router(health.router, tags=["System"])
api_router.include_router(chat.router, prefix="/chat", tags=["Chat"])
api_router.include_router(knowledge.router, prefix="/knowledge", tags=["Knowledge Base"])
api_router.include_router(session.router, prefix="/session", tags=["Session & Memory"])
