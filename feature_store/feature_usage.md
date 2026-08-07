# Feature Usage Map

This document maps all engineered features to their downstream consumers. Before deprecating a feature, all listed consumers must be notified.

## Downstream ML Models
| Model Name | Features Consumed | Purpose |
|---|---|---|
| SLA Predictor | `Tokens_Per_Second`, `Complexity_Per_Agent`, `Is_Weekend` | Predicts probability of SLA breach. |
| Anomaly Detector | `PoP_Amount_Change_Pct`, `Rolling_7_Txn_Avg_Amount_By_Dept` | Flags anomalous transaction sizes. |

## AI Agents (LangGraph Nodes)
| Agent Name | Features Consumed | Purpose |
|---|---|---|
| Routing Node | `Complexity_Per_Agent`, `Day_Of_Week` | Routes complex queries to human fallback or advanced tiers. |
| Audit Node | `Total_Margin_USD` | Triggers deeper review for high-margin impacts. |

## Dashboards & Semantic Layer (DuckDB)
| Dashboard/Report | Features Consumed | Purpose |
|---|---|---|
| Executive Summary | `Total_Margin_USD` | Primary KPI. |
| Department Health | `Rank_Amount_Within_Dept`, `Prev_Txn_Amount_By_Dept` | Contextualizes performance locally. |
| MLOps Monitoring | `Tokens_Per_Second` | Tracks real-time LLM inference degradation. |
