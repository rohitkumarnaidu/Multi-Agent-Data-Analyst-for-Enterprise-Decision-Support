# API Mapping & FastAPI Contract Specifications

This document defines the REST and Server-Sent Events (SSE) API contracts implemented in the frontend service layer ([`frontend/src/services/`](file:///c:/PROJECTS/Datasphere/Multi-Agent%20Data%20Analyst%20for%20Enterprise%20Decision%20Support/frontend/src/services/)).

---

## Complete Endpoint Mapping Table

| Endpoint Route | HTTP Method | Frontend Service | Request Payload | Response Schema | Backend Module | Implementation Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `/api/dashboard/kpis` | `GET` | `dashboardService.getKpis` | `None` (Query: `timeframe`) | `ExecutiveKpi[]` | `src/api/routers/dashboard.py` | ✅ Mock Service / API Client Ready |
| `/api/dashboard/revenue-trends` | `GET` | `dashboardService.getRevenueTrends` | `None` | `RevenueTrendPoint[]` | `src/api/routers/dashboard.py` | ✅ Mock Service / API Client Ready |
| `/api/dashboard/anomalies` | `GET` | `dashboardService.getAnomalies` | `None` | `OperationalIncident[]` | `src/api/routers/dashboard.py` | ✅ Mock Service / API Client Ready |
| `/api/ai/sessions` | `GET` | `aiWorkspaceService.getSessions` | `None` | `ChatSession[]` | `src/api/routers/ai_agent.py` | ✅ Mock Service / API Client Ready |
| `/api/ai/execute` | `POST` / `SSE` | `aiWorkspaceService.executePrompt` | `{ prompt, sessionId, model }` | `Stream<AgentExecutionEvent>` | `src/agents/orchestrator.py` | ✅ Mock Service / API Client Ready |
| `/api/ai/hitl/approve` | `POST` | `aiWorkspaceService.approveHITL` | `{ actionId, approved, feedback }`| `{ status: 'resumed' }` | `src/agents/guardrails.py` | ✅ Mock Service / API Client Ready |
| `/api/data/datasets` | `GET` | `dataService.getDatasets` | `None` | `DatasetMetadata[]` | `src/api/routers/data.py` | ✅ Mock Service / API Client Ready |
| `/api/data/lineage` | `GET` | `dataService.getDataLineage` | `None` | `LineageGraph` | `src/api/routers/data.py` | ✅ Mock Service / API Client Ready |
| `/api/data/knowledge` | `GET` | `dataService.getKnowledgeItems` | `None` | `KnowledgeItem[]` | `src/api/routers/knowledge.py` | ✅ Mock Service / API Client Ready |
| `/api/data/features` | `GET` | `dataService.getFeatureStore` | `None` | `FeatureDefinition[]` | `src/api/routers/features.py` | ✅ Mock Service / API Client Ready |
| `/api/eda/summary` | `GET` | `edaService.getEDASummary` | `None` | `EDASummary` | `src/api/routers/eda.py` | ✅ Mock Service / API Client Ready |
| `/api/eda/correlations` | `GET` | `edaService.getCorrelations` | `?method=pearson` | `CorrelationMatrix` | `src/api/routers/eda.py` | ✅ Mock Service / API Client Ready |
| `/api/eda/hypothesis-tests` | `GET` | `edaService.getHypothesisTests` | `None` | `HypothesisTest[]` | `src/api/routers/eda.py` | ✅ Mock Service / API Client Ready |
| `/api/features/ranking` | `GET` | `featureSelectionService.getFeatureRankings` | `None` | `ConsensusRanking[]` | `src/api/routers/feature_selection.py` | ✅ Mock Service / API Client Ready |
| `/api/features/vif` | `GET` | `featureSelectionService.getVIFScores` | `None` | `VIFScore[]` | `src/api/routers/feature_selection.py` | ✅ Mock Service / API Client Ready |
| `/api/features/simulate-subset` | `POST` | `featureSelectionService.simulateSubset` | `{ k: number, method: string }` | `SubsetSimulationResult` | `src/api/routers/feature_selection.py` | ✅ Mock Service / API Client Ready |
| `/api/models/registry` | `GET` | `modelService.getModelRegistry` | `None` | `ModelArtifact[]` | `src/api/routers/models.py` | ✅ Mock Service / API Client Ready |
| `/api/models/:id/predict` | `POST` | `modelService.runInference` | `{ modelId, features }` | `InferencePrediction` | `src/api/routers/models.py` | ✅ Mock Service / API Client Ready |
| `/api/explainability/shap` | `GET` | `explainabilityService.getSHAPData` | `None` | `SHAPBeeswarmData` | `src/api/routers/explainability.py` | ✅ Mock Service / API Client Ready |
| `/api/explainability/waterfall/:id` | `GET` | `explainabilityService.getWaterfall` | `None` | `WaterfallData` | `src/api/routers/explainability.py` | ✅ Mock Service / API Client Ready |
| `/api/explainability/counterfactuals` | `POST` | `explainabilityService.generateCounterfactual` | `{ transactionId, targetRisk }` | `CounterfactualRecourse` | `src/api/routers/explainability.py` | ✅ Mock Service / API Client Ready |
| `/api/reports` | `GET` | `reportService.getReports` | `None` | `ReportArtifact[]` | `src/api/routers/reports.py` | ✅ Mock Service / API Client Ready |
| `/api/reports/generate` | `POST` | `reportService.generateReport` | `{ title, type, targetScope, depth }` | `ReportArtifact` | `src/api/routers/reports.py` | ✅ Mock Service / API Client Ready |
| `/api/settings/llm` | `GET` / `PUT` | `settingsService.getLLMConfig` / `updateLLMConfig` | `{ primaryModel, temperature, ... }` | `LLMConfig` | `src/api/routers/settings.py` | ✅ Mock Service / API Client Ready |
| `/api/settings/hitl-policies` | `GET` | `settingsService.getHITLPolicies` | `None` | `HITLPolicy[]` | `src/api/routers/settings.py` | ✅ Mock Service / API Client Ready |
| `/api/settings/token-usage` | `GET` | `settingsService.getTokenUsage` | `None` | `TokenUsageTelemetry` | `src/api/routers/settings.py` | ✅ Mock Service / API Client Ready |
| `/api/settings/audit-logs` | `GET` | `settingsService.getAuditLogs` | `None` | `AuditLogEntry[]` | `src/api/routers/settings.py` | ✅ Mock Service / API Client Ready |
