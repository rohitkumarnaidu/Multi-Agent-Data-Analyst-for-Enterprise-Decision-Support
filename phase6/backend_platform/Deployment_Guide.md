# Deployment Guide

## Telemetry
The backend initializes structlog and leaves hooks open for OpenTelemetry/LangSmith. 
To enable LangSmith, provide `LANGCHAIN_API_KEY` and `LANGCHAIN_TRACING_V2=true` in `.env`.

## Persistence
Ensure the deployment environment maps a volume to `.chroma_db` and `.memory.db` for state persistence across container restarts.
