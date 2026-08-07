# Feature Catalog (v1.0)

This catalog acts as the master record for all engineered features in the Multi-Agent Data Analyst dataset.

| Feature Name | Formula | Source Columns | Business Meaning | Expected ML Impact | Leakage Risk | Statistical Validation | Version |
|---|---|---|---|---|---|---|---|
| `Start_Timestamp` | `Timestamp - Processing_Time_Sec` | `Timestamp`, `Processing_Time_Sec` | Exact moment the query began. | High (Temporal sequencing) | None | Verified: 0 negative durations. | 1.0 |
| `Day_Of_Week` | `dt.day_name()` | `Timestamp` | Day of week for traffic analysis. | Medium (Seasonality) | None | Verified valid day names. | 1.0 |
| `Is_Weekend` | `dt.dayofweek >= 5` | `Timestamp` | Binary flag for weekend SLA changes. | Medium | None | Verified boolean split. | 1.0 |
| `Total_Margin_USD` | `Revenue_Impact_USD + Cost_Savings_Potential_USD` | `Revenue_Impact_USD`, `Cost_Savings_Potential_USD` | Total financial value of the agent's interaction. | High (Target proxy/weighting) | None | Nulls mapped to 0 safely. | 1.0 |
| `Tokens_Per_Second` | `(Input + Output) / Processing_Time` | `Input_Tokens`, `Output_Tokens`, `Processing_Time_Sec` | Velocity of the LLM generation. | High (Latency prediction) | None | Div/0 protected. 4049 nulls. | 1.0 |
| `Complexity_Per_Agent` | `Complexity / Agents_Involved` | `Query_Complexity_Score`, `Num_Agents_Involved` | Cognitive load per human/agent. | Medium (Routing optimization) | None | Div/0 protected. | 1.0 |
| `Rolling_7_Txn_Avg_Amount_By_Dept` | `rolling(7).mean()` by `Dept` | `Transaction_Amount_USD`, `Department`, `Timestamp` | Recent moving average of transaction values. | High (Trend feature) | None (Timestamp sorted) | Verified non-leaking window. | 1.0 |
| `Prev_Txn_Amount_By_Dept` | `shift(1)` by `Dept` | `Transaction_Amount_USD`, `Department`, `Timestamp` | Amount of the immediate prior transaction. | Medium | None (Timestamp sorted) | Verified lag assignment. | 1.0 |
| `PoP_Amount_Change_Pct` | `(Current - Prev) / Prev` | `Transaction_Amount_USD`, `Prev_Txn_Amount_By_Dept` | Growth vs previous transaction. | High (Anomaly detection) | None | Div/0 protected (np.nan). | 1.0 |
| `Rank_Amount_Within_Dept` | `rank(dense, descending)` by `Dept` | `Transaction_Amount_USD`, `Department` | Ordered magnitude of transaction. | Medium (Categorization) | None | Dense ranking applied. | 1.0 |
