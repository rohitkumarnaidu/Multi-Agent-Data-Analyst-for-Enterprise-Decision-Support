# Enterprise End-to-End Data Flow Architecture

This document maps the complete data lifecycle across key interactive screens in Datasphere.

---

## 1. AI Workspace Multi-Agent Execution Flow

```
[User Natural Language Prompt]
       │
       ▼
[PromptInputBar.tsx] (Dispatches useExecutePrompt Mutation)
       │
       ▼
[aiWorkspaceService.ts] (POST /api/ai/execute)
       │
       ▼
[FastAPI Backend / LangGraph Orchestrator]
       │
       ├─► [Data Agent] ──────► Runs DuckDB SQL Query
       ├─► [Analysis Agent] ──► Runs statsmodels / scipy.stats
       ├─► [Knowledge Agent] ─► Queries ChromaDB Vector Store
       │
       ▼
[Validator & Guardrails Node]
       │
       ├─► (Risk < Threshold) ──► [Report Agent] ──► Streams Final Response
       │
       └─► (Risk > Threshold) ──► Pauses Graph ──► Returns HITL Checkpoint Event
                                                            │
                                                            ▼
                                               [HITLApprovalCard.tsx]
                                                            │
                                                            ▼
                                               [Human Approves Action]
                                                            │
                                                            ▼
                                               [LangGraph Resumes Execution]
```

---

## 2. Exploratory Data Analysis (EDA) Data Flow

```
[User Selects Correlation Method (Spearman)]
       │
       ▼
[useCorrelations Hook] (React Query Cache Check)
       │
       ▼
[edaService.getCorrelations()] (GET /api/eda/correlations?method=spearman)
       │
       ▼
[FastAPI / NumPy & SciPy Engine] (Computes 8x8 pairwise rank correlation matrix & p-values)
       │
       ▼
[CorrelationHeatmap.tsx] (Transforms 2D array into Apache ECharts visualMap configuration)
       │
       ▼
[Interactive Heatmap Rendered on Canvas with Tooltips]
```

---

## 3. Explainability & Counterfactual Recourse Data Flow

```
[User Selects Transaction #TX-98214 in ExplainabilityPage.tsx]
       │
       ▼
[useExplainability Hook] (Fetches SHAP attributions & waterfall steps)
       │
       ▼
[explainabilityService.getWaterfall('TX-98214')]
       │
       ▼
[TreeSHAP Explainer Kernel] (Calculates exact Shapley values against baseline E[f(x)])
       │
       ▼
[WaterfallPlot.tsx] (Renders step-by-step contribution to 79% breach probability)
       │
       ▼
[User Clicks "Generate Counterfactual Recourse"]
       │
       ▼
[DiCE Optimization Engine] (Finds minimal feature perturbation to reduce breach probability < 15%)
       │
       ▼
[CounterfactualsCard.tsx] (Displays recommended carrier re-route with +$431.50 net savings)
```
