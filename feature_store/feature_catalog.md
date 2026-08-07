# Feature Catalog

Master catalog documenting every feature for ML and Analytical usage.

| Feature Name | Type | Original/Eng | Source Columns | Formula | Business Meaning | Technical Meaning | Expected ML Impact | Used By | Importance | Leakage Risk | Validation | Version | Owner | Status | Tags |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `Start_Timestamp` | datetime | Eng | `Timestamp`, `Proc_Time` | `Time - Proc_Time` | Moment query began | Extrapolated start time | High (Sequence) | Agents, ML | High | None | PASS | 1.0 | DE | Prod | temporal |
| `Total_Margin_USD` | float | Eng | `Revenue`, `Cost` | `Rev + Cost` | Total ROI of query | Sum of financial impact | High (Target) | BI, ML | Critical | None | PASS | 1.0 | Fin | Prod | finance |
| `Tokens_Per_Second`| float | Eng | `In`, `Out`, `Time` | `(In+Out)/Time` | Velocity of LLM | Throughput speed | High (Latency) | MLOps | High | None | PASS | 1.0 | MLOps | Prod | ai |
| `Complexity_Per_Agent`| float | Eng | `Complex`, `Agents` | `Complex/Agents` | Cognitive load | Distributed complexity | Medium | Routing | Medium | None | PASS | 1.0 | MLOps | Prod | ai |
| `Rolling_7_Txn` | float | Eng | `Txn`, `Dept` | `rolling(7)` | Recent average size | Windowed mean | High (Trend) | ML | High | Mitigated | PASS | 1.0 | DS | Prod | stats |
| `Prev_Txn_Amt` | float | Eng | `Txn`, `Dept` | `shift(1)` | Last transaction size | Lag 1 | Medium | ML | Medium | Mitigated | PASS | 1.0 | DS | Prod | stats |
| `PoP_Amount_Pct` | float | Eng | `Txn`, `Prev` | `(Cur-Prev)/Prev` | Growth over last | PCT change | High (Anomalies) | Dashboards| High | None | PASS | 1.0 | Fin | Prod | finance |
| `Rank_Within_Dept` | int | Eng | `Txn`, `Dept` | `rank()` | Relative size | Dense Rank | Medium | ML | Medium | None | PASS | 1.0 | DS | Prod | stats |
| `Day_Of_Week` | str | Eng | `Timestamp` | `day_name()` | Day name | String extraction | Medium | Dashboards| Low | None | PASS | 1.0 | DE | Prod | time |
| `Is_Weekend` | bool | Eng | `Timestamp` | `dow >= 5` | Weekend flag | Boolean mask | Low | Dashboards| Low | None | PASS | 1.0 | DE | Prod | time |
