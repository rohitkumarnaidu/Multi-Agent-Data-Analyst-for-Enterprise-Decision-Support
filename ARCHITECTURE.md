# Multi-Agent Enterprise Architecture

## Overview
The architecture is designed to orchestrate natural language queries into accurate, data-backed insights without LLM hallucinations, ensuring all metric computation runs deterministically.

## 1a. Feature Engineering & Semantic Layer (Phase 2)
- Transforms raw dataset into `master_cleaned_dataset.parquet`.
- Applies Zero-Drop policies.
- Defines deterministic aggregation metrics via `semantic/metrics.yaml`.

## 1b. Preprocessing Pipeline (Phase 1)
A robust `sklearn.pipeline.Pipeline` orchestrates the raw data conversion into a purely numeric matrix suitable for the ML engine.
- **Components:** `ColumnDropper` -> `SimpleImputer` -> `RobustScaler` / `TargetEncoder` / `OneHotEncoder` / `OrdinalEncoder`

## 2. LLM Orchestration Engine (Phase 3)
A LangGraph state machine routes requests across specialized nodes:
- **Orchestrator:** Determines intent (e.g., "Is this a data request or a methodology question?").
- **Semantic RAG:** Uses ChromaDB + BM25 to query documentation.
- **Data Engine:** Uses DuckDB to convert Natural Language to SQL, returning hard numbers.
- **ML Engine:** Uses XGBoost predictions to surface risk anomalies.
- **Narrative Synthesizer:** Summarizes the raw metrics into a boardroom-ready response.

## 3. Web Interface (Phase 4)
- **Frontend:** Streamlit conversational UI with interactive Plotly charting.
- **Backend:** FastAPI exposing LangGraph endpoints.
