# Operations Guide

## Standard Operating Procedures
- **Backup**: Daily backups of SQLite memory and ChromaDB vectors.
- **Scaling**: The FastAPI backend can be horizontally scaled; ensure shared storage for the SQLite DB if doing so, or migrate to PostgreSQL for Memory.
- **Updates**: Deploy new model versions by updating the artifact in `/models` and restarting the API container.
