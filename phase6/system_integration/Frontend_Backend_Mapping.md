# Frontend-Backend Mapping

## Page to Endpoint Mapping
* **Executive Dashboard** -> `/api/v1/kpi/realtime`, `/api/v1/reports/summary`
* **AI Workspace (Chat)** -> `/api/v1/chat/stream`, `/api/v1/chat/history`
* **Knowledge Base** -> `/api/v1/knowledge/upload`, `/api/v1/knowledge/search`
* **Simulation** -> `/api/v1/simulations/run`
* **Settings & Auth** -> `/api/v1/auth/login`, `/api/v1/auth/session`

All frontend hooks are mapped to their respective backend services without mocked data.
