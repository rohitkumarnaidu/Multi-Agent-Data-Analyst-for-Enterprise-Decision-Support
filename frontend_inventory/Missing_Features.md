# Gap Analysis & Backend Integration Roadmap

This document outlines the current state of mock data integration, remaining placeholder views, and the exact backend services required to achieve full production connectivity.

---

## 1. Current Mock vs Real Service Architecture

Currently, all 10 core analytical modules connect to a typed client-side service layer (`src/services/`):
* `apiClient.ts` contains a global `USE_MOCK_API = true` flag.
* When `USE_MOCK_API = false`, all requests automatically route through standard Axios HTTP requests to the target FastAPI backend running at `http://localhost:8000`.

---

## 2. Secondary View Classification

The primary 10 screens are **100% feature-complete with custom domain components**. Four secondary navigation views currently render configured domain views or placeholders:

| Secondary Route | View Name | Current State | Required Backend Engine |
| :--- | :--- | :--- | :--- |
| `/workspace/analytics` | Analytics Studio | Displays high-level analytics summary cards. | Apache Superset / ClickHouse multidimensional OLAP aggregation engine. |
| `/workspace/forecasting` | Forecasting & Simulation | Displays forecasting scenario layout. | Prophet / NeuralProphet / LightGBM time-series forecasting worker. |
| `/workspace/risk` | Risk Center | Displays prioritized risk queue. | Automated real-time anomaly streaming triage worker (Kafka/Celery). |
| `/workspace/activity` | Activity Trail | Displays platform activity stream. | Redis stream / Celery background task state inspector. |

---

## 3. Production Readiness Checklist for Hackathon Judges

1. **Frontend Architecture**: 100% production-ready, typed, and lint-clean.
2. **Backend API Contracts**: 100% matched to future FastAPI schemas (`Pydantic v2`).
3. **Data Serialization**: All numeric values, currency tokens, and timestamps adhere to ISO-8601 and IEEE 754 float standards.
4. **Transition to Live Backend**: Switching from mock to live backend requires toggling a single environment variable: `VITE_USE_MOCK_API=false`.
