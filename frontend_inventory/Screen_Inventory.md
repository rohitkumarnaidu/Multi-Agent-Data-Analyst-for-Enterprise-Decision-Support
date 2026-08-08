# Enterprise Screen Inventory

This document provides a comprehensive inventory of all 15 screens and views across the Datasphere Enterprise AI Analytics Platform.

---

## Screen Directory Table

| # | Screen Name | Route Path | Purpose | Primary Users | Business Goal |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | **Executive Dashboard** | `/workspace/dashboard` | Bird's-eye view of revenue, margins, SLA breaches, operational anomalies, and executive what-if simulators. | C-Suite, VP of Operations, Operations Leads | Detect enterprise margin leakage, monitor live SLAs, and evaluate high-level strategic interventions. |
| 2 | **AI Workspace (Three-Panel)** | `/workspace/ai` | Interactive multi-agent orchestration console with interactive LangGraph DAG, timeline execution, and inspector. | Enterprise Analysts, Data Scientists, Ops Managers | Execute complex natural language analytical queries with autonomous agent reasoning and human approval checkpoints. |
| 3 | **Analytics Studio** | `/workspace/analytics` | Deep operational analytics, multi-dimensional drill-downs, and cross-departmental metric synthesis. | Business Intelligence Analysts, Financial Controllers | Uncover regional performance discrepancies and historical cost variance trends. |
| 4 | **Enterprise Datasets Hub** | `/workspace/datasets` | Ingestion catalog, schema explorer, data profiling metrics, missing value audits, and distribution histograms. | Data Engineers, ML Engineers, Analysts | Ensure incoming transactional and supply chain datasets meet enterprise data quality standards. |
| 5 | **Knowledge Base & Semantics** | `/workspace/knowledge` | Business glossary, verified metric formulas, domain ontologies, and vector embedding collections. | Analytics Engineers, Governance Leads | Ground AI agent reasoning in verified enterprise definitions and eliminate hallucinations. |
| 6 | **Feature Store** | `/workspace/feature-store` | Curated feature repository, entity keys, computation formulas, transformation lineage, and update frequencies. | Data Scientists, ML Engineers | Standardize feature engineering and guarantee consistency between training and real-time inference. |
| 7 | **Exploratory Data Analysis (EDA)** | `/workspace/eda` | Univariate statistics, correlation heatmaps, multivariate scatter plots, distribution plots, and hypothesis tests. | Data Scientists, Quantitative Analysts | Detect non-linear dependencies, outliers, skewness, and statistical significance before modeling. |
| 8 | **Feature Selection Studio** | `/workspace/feature-selection` | Multi-method consensus ranking (Mutual Info, LASSO, RF, XGBoost), VIF collinearity, and Top-K subset impact. | ML Engineers, Risk Modelers | Eliminate redundant features, prevent multicollinearity, and optimize model inference latency. |
| 9 | **Explainability Studio (XAI)** | `/workspace/explainability` | TreeSHAP beeswarm, local waterfall attributions, LIME local surrogates, and counterfactual recourse simulators. | Risk Officers, Compliance Auditors, Data Scientists | Satisfy regulatory requirements (EU AI Act, SR 11-7) by explaining exactly why a model made a specific prediction. |
| 10 | **Model Registry & Center** | `/workspace/models` | Champion vs Challenger leaderboard, ROC-AUC / PR curves, confusion matrices, and live inference what-if tester. | MLOps Leads, Chief Data Officers | Validate model performance against strict thresholds before promoting candidates to production traffic. |
| 11 | **Forecasting & Simulation** | `/workspace/forecasting` | Time-series forecasting (Prophet, ARIMA, LightGBM), confidence intervals, and scenario impact modeling. | Supply Chain Planners, Revenue Ops | Project SLA breach probabilities and demand volatility across future quarters. |
| 12 | **Risk Center** | `/workspace/risk` | Automated risk scoring, anomaly alert prioritization, financial exposure tracking, and escalation queues. | Risk Managers, Operations Directors | Triage high-dollar breach liabilities and coordinate rapid mitigation workflows. |
| 13 | **Enterprise Reports Hub** | `/workspace/reports` | Curated executive briefing archive, structured GFM markdown viewer, KPI grids, and 1-click PDF/MD exporters. | Executives, Department Heads, Board of Directors | Generate board-ready, audit-compliant synthesized reports with clear strategic recommendations. |
| 14 | **Activity & Execution Trail** | `/workspace/activity` | Unified timeline of background agent tasks, model retraining runs, and data pipeline sync jobs. | DevOps Engineers, System Administrators | Track platform health, background job statuses, and resource consumption. |
| 15 | **Settings & AI Governance** | `/workspace/settings` | Foundation LLM router, generation temperature, HITL guardrail policies, token telemetry, and cryptographic audit logs. | Chief Information Security Officers, Platform Admins | Maintain enterprise security, manage API budgets, and enforce deterministic guardrail rules. |

---

## Detailed Screen Specifications

### 1. Executive Dashboard (`/workspace/dashboard`)
* **Key Components**: `ExecutiveHeader`, `ExecutiveKpiGrid`, `RevenueMarginChart`, `RegionalBreakdownChart`, `DepartmentMatrix`, `ExecutiveAnomalyFeed`, `ExecutiveScenarioWidget`.
* **Data Sources**: Real-time aggregation of transactional GMV, SLA delivery performance, and courier risk scoring.
* **Interactions**: Metric timeframe toggles (24h / 7d / 30d), scenario slider adjustments for carrier rate shifts, and 1-click report generation.

### 2. AI Workspace (`/workspace/ai`)
* **Key Components**: `SessionSidebar`, `ChatMessageItem`, `PromptInputBar`, `InspectorPanel`, `HITLApprovalCard`, `ToolExecutionTimeline`, `AgentNode` (React Flow).
* **Data Sources**: LangGraph state machine, agent memory stores, and real-time tool execution logs.
* **Interactions**: Multi-turn chat, golden query quick-launch, interactive graph zoom/pan, tool step inspection, and approval/rejection of high-impact financial actions.

### 3. Enterprise Datasets Hub (`/workspace/datasets`)
* **Key Components**: Dataset list cards, schema attribute table, data quality gauge, profiling histograms, and `DataLineageCanvas`.
* **Data Sources**: DuckDB transactional tables, Parquet data lake artifacts.
* **Interactions**: Schema search, column distribution preview, lineage DAG node clicks, and raw dataset exports.

### 4. Knowledge Base (`/workspace/knowledge`)
* **Key Components**: Metric definition cards, SQL formula viewers, vector collection inspectors, and sync status badges.
* **Data Sources**: Enterprise Semantic Store and ChromaDB vector collections.
* **Interactions**: Metric keyword search, domain filtering (Supply Chain, Finance, SLA), and formula copying.

### 5. Feature Store (`/workspace/feature-store`)
* **Key Components**: Feature catalog table, entity key tags, transformation code drawer, and drift monitors.
* **Data Sources**: Feast / Hopsworks compatible feature metadata store.
* **Interactions**: Feature search by entity (`order_id`, `carrier_id`, `customer_id`), feature activation toggles, and lineage inspection.

### 6. EDA Studio (`/workspace/eda`)
* **Key Components**: `DistributionChart`, `CorrelationHeatmap`, `MultivariateScatterChart`, `HypothesisTestsList`.
* **Data Sources**: Statistical profiling engine (Spearman/Pearson correlations, Shapiro-Wilk normality tests, Mann-Whitney U tests).
* **Interactions**: Variable pair selection, confidence interval toggling ($90\% / 95\% / 99\%$), and correlation threshold filtering.

### 7. Feature Selection Studio (`/workspace/feature-selection`)
* **Key Components**: `ConsensusRankingTable`, `VIFMonitorCard`, `SubsetImpactCard`.
* **Data Sources**: Multi-agent feature ranking ensemble and statsmodels variance inflation engine.
* **Interactions**: Top-K slider adjustments ($5 \to 25$), method weight tuning, and real-time model accuracy vs latency simulation.

### 8. Explainability Studio (`/workspace/explainability`)
* **Key Components**: `SHAPBeeswarmChart`, `WaterfallPlot`, `CounterfactualsCard`.
* **Data Sources**: TreeSHAP kernel, LIME surrogate explainer, and DiCE counterfactual optimization engine.
* **Interactions**: Transaction ID selector, feature perturbation sliders, and minimum-distance recourse generation.

### 9. Model Registry & Center (`/workspace/models`)
* **Key Components**: `ModelRegistryTable`, `ValidationCharts` (ROC-AUC, PR Curves, Confusion Matrix), `HyperparametersCard`, `PredictionPlayground`.
* **Data Sources**: MLflow / Weights & Biases model registry metadata.
* **Interactions**: Champion/Challenger comparison, interactive threshold sliders ($0.0 \to 1.0$), and live payload prediction scoring.

### 10. Enterprise Reports Hub (`/workspace/reports`)
* **Key Components**: `ReportListCard`, `ReportViewer`, `GenerateReportModal`.
* **Data Sources**: Autonomous Report Agent compilation artifacts.
* **Interactions**: Report archive filtering, 1-click PDF print export, raw markdown download, and custom AI report generation modal.

### 11. System Settings & AI Governance (`/workspace/settings`)
* **Key Components**: `LLMConfigCard`, `HITLPoliciesCard`, `TokenCostCard`, `AuditTrailCard`.
* **Data Sources**: System configuration store, HashiCorp Vault KMS, and cryptographic audit ledger.
* **Interactions**: Foundation model router selection, sampling temperature sliders, guardrail policy toggles, and audit log search.
