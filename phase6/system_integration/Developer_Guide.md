# Developer Guide

## Local Integration Testing
Run the complete stack locally using:
```bash
docker-compose up
```
This boots the React Frontend, FastAPI backend, DuckDB, ChromaDB, and LangGraph instances.

## Debugging
- Check `logs/app.log` for structured JSON logs.
- Use the `/docs` Swagger UI for testing API endpoints manually.
- Inspect SQLite memory store via `sqlite3 memory.db`.
