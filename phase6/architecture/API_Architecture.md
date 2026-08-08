# API Architecture
**Generated:** 2026-08-08 05:46:59  

---

## 1. REST Endpoints (FastAPI)

### Chat API
- `POST /api/v1/chat/ask`
  - **Purpose:** Synchronous request for an agent response.
  - **Input:** `{ "message": str, "thread_id": str }`
  - **Output:** `{ "response": str, "citations": list, "data": dict }`
- `GET /api/v1/chat/history/{thread_id}`
  - **Purpose:** Retrieve conversation history.

### ML & Simulation API
- `POST /api/v1/ml/predict`
  - **Purpose:** Direct inference against the XGBoost model.
  - **Input:** Array of feature dictionaries.
  - **Output:** Predictions and probabilities.
- `POST /api/v1/ml/simulate`
  - **Purpose:** Run what-if scenario.

### Feedback API
- `POST /api/v1/feedback`
  - **Purpose:** Capture user ratings (up/down).
  - **Input:** `{ "message_id": str, "rating": int, "comment": str }`

### Admin & System API
- `GET /health` -> Liveness probe.
- `GET /api/v1/metrics` -> Prometheus exposition.

## 2. WebSocket Endpoints
- `WS /ws/v1/chat/{thread_id}`
  - **Purpose:** Bi-directional streaming connection.
  - **Flow:** User sends text. Server streams back `status` events (e.g., "Agent thinking...", "Querying DB...") and `token` events (the actual LLM text generation) via Server-Sent Events pattern over WS.
