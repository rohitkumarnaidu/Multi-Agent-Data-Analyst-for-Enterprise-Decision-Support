# Phase 3H: Feature Insights

| Feature | Predictive Value (vs SLA) | Leakage Risk | Recommendation |
|---|---|---|---|
| `Processing_Time_Sec` | **CRITICAL** | High (if derived post-execution) | **MODIFY:** Must ensure ML models don't use absolute total time if predicting SLA breach *before* execution ends. |
| `Input_Tokens` | High | None | **KEEP** |
| `Num_Agents_Involved` | High | Moderate (dynamic routing) | **KEEP** |
| `Query_Complexity_Score` | High | None | **KEEP** |
| `Department` | Medium | None | **KEEP** |
| `Total_Margin_USD` | Low | None | **DROP** (Irrelevant for SLA prediction, useful for ROI prediction) |
| `Is_Weekend` | Medium | None | **KEEP** |
| `Agent_Accuracy_Feedback`| Unknown | High (post-event) | **DROP** (72% missing, high leakage) |

## Recommendations
- Retain AI operational metrics (Tokens, Complexity) for SLA prediction.
- Drop trailing financial impact features if the target is SLA execution risk, to reduce dimensionality.
