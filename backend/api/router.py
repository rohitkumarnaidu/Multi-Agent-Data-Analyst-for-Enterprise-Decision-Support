from fastapi import APIRouter
from api.endpoints import health, chat, knowledge, session
from api.endpoints import dashboard_kpis, data_explorer, agents_status, models_api
from api.endpoints import knowledge_extended, memory_api_extended, system_telemetry
from api.endpoints import dataset_discovery

api_router = APIRouter()

# Existing routers
api_router.include_router(health.router, tags=["System"])
api_router.include_router(chat.router, tags=["Chat"])
api_router.include_router(knowledge.router, prefix="/knowledge", tags=["Knowledge Base"])
api_router.include_router(session.router, prefix="/session", tags=["Session & Memory"])

# New routers — Phase A
api_router.include_router(dashboard_kpis.router, tags=["Dashboard"])
api_router.include_router(data_explorer.router, prefix="/data", tags=["Data Explorer"])
api_router.include_router(agents_status.router, prefix="/agents", tags=["Agents"])
api_router.include_router(models_api.router, prefix="/models", tags=["Models"])
api_router.include_router(knowledge_extended.router, prefix="/knowledge", tags=["Knowledge Extended"])
api_router.include_router(memory_api_extended.router, prefix="/memory", tags=["Memory"])
api_router.include_router(system_telemetry.router, prefix="/system", tags=["System Telemetry"])
api_router.include_router(dataset_discovery.router, prefix="/dataset", tags=["Dataset Discovery"])
