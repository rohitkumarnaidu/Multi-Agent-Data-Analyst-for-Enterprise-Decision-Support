# State Management & Data Flow Architecture
## End-to-End Data Pipeline, API Client, and Component State Topology

---

## 1. Architectural Overview

```
+-----------------------------------------------------------------------------+
|                            USER INTERACTION LAYER                           |
|      (React 19 + React Router DOM + React Flow + ECharts Visualization)     |
+-----------------------------------------------------------------------------+
                                       │
                                       ▼
+-----------------------------------------------------------------------------+
|                           STATE MANAGEMENT LAYER                            |
|  - WorkspaceContext: Active user role, notification queue, system toast     |
|  - Feature Hooks: useDataModules, useForecasting, useRiskScanner             |
|  - Component State: Active session, graph node statuses, slider parameters  |
+-----------------------------------------------------------------------------+
                                       │
                                       ▼
+-----------------------------------------------------------------------------+
|                            SERVICE & CLIENT LAYER                           |
|  - apiClient.ts: Axios client with unified error handling and mock toggle   |
|  - aiWorkspaceService.ts: LangGraph ask/approval API bindings                |
|  - forecastingService.ts: Monte Carlo simulation & sensitivity calculations |
|  - riskService.ts: Anomaly detection & SHAP telemetry                       |
|  - guardrailsService.ts: AST policy enforcement & rule management           |
+-----------------------------------------------------------------------------+
                                       │
                                       ▼
+-----------------------------------------------------------------------------+
|                         BACKEND & ANALYTICAL ENGINES                        |
|  - LangGraph Multi-Agent Orchestrator (10 Specialized Autonomous Agents)    |
|  - DuckDB Analytical Lakehouse (50,000 shipment records)                    |
|  - XGBoost & Isolation Forest Anomaly Detection Models                      |
|  - AST Guardrails & Deterministic Financial Safety Limiters                 |
+-----------------------------------------------------------------------------+
```

---

## 2. API Contract & Mocking Architecture

The frontend architecture includes a deterministic mock/live fallback system (`USE_MOCK_API`) enabling 100% offline demonstration reliability while maintaining strict parity with live backend endpoints:

- **Endpoint:** `POST /api/v1/ask`
  - **Request Body:** `{ question: string, session_id?: string, include_simulation?: boolean, simulation_tier?: 1 | 2 }`
  - **Response Payload:** `AskResponse` (answer, confidence, chart_spec, trace, recommended_action, approval_required).
- **Endpoint:** `POST /api/v1/approve`
  - **Request Body:** `{ session_id: string, approved: boolean, reason?: string }`
  - **Response Payload:** `{ status: 'ok', updated_trace: TraceStep[] }`
- **Endpoint:** `POST /api/v1/simulate`
  - **Request Body:** `SimulationParameters` (carrier rate, fuel surcharge, demand growth).
  - **Response Payload:** `SimulationResult` (projected GMV, margin, SLA breach rate, fan chart points).

---

## 3. Real-Time UI Synchronization
- **Agent Node State Transitions:** As queries execute, agent nodes in `AgentGraphCanvas` transition sequentially: `idle` -> `running` (with active tool display) -> `completed` / `requires_approval`.
- **Chart Reactivity:** Modifying simulation dials triggers instant parametric recalculations in ECharts fan charts without full page refreshes.
