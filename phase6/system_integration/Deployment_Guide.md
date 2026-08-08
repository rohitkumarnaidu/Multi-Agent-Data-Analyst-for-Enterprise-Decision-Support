# Deployment Guide

## Preparation
1. Ensure Docker and Docker Compose are installed.
2. Configure `.env.production` with secure credentials.
3. Build the frontend static assets.

## Execution
```bash
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d
```
Monitor logs via `docker-compose logs -f`.
