# Feature Groups

Features are logically clustered for UI presentation in the Feature Store and for batch retrieval during ML training.

## 1. The Financial Set (Tags: `finance`, `sales`)
Used primarily for ROI prediction models and executive dashboards.
- `Total_Margin_USD`
- `PoP_Amount_Change_Pct`

## 2. The Operations / AI Set (Tags: `ops`, `ai`, `mlops`)
Used for system health monitoring, SLA prediction, and LangGraph routing.
- `Tokens_Per_Second`
- `Complexity_Per_Agent`

## 3. The Time-Series Set (Tags: `time`, `stats`, `rolling`)
Used for anomaly detection and forecasting.
- `Start_Timestamp`
- `Day_Of_Week`
- `Is_Weekend`
- `Rolling_7_Txn_Avg_Amount_By_Dept`
- `Prev_Txn_Amount_By_Dept`
- `Rank_Amount_Within_Dept`
