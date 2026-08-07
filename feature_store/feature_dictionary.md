# Feature Dictionary

This dictionary translates engineering nomenclature into business terminology.

| Feature | Datatype | Description | Example | Allowed Range | Nullable | Default Value | Missing Strategy | Scaling Strategy | Encoding Strategy | Business Owner |
|---|---|---|---|---|---|---|---|---|---|---|
| `Total_Margin_USD` | float | Combined financial value of revenue generated and cost saved by the transaction. | 1500.50 | Any | No | 0.0 | Impute Zero | Standard Scaler | None | Finance Team |
| `Tokens_Per_Second` | float | AI inference speed, combining input read time and output generation time. | 125.4 | > 0 | Yes | Null | Drop/Impute Mean | MinMax Scaler | None | MLOps Team |
| `Complexity_Per_Agent` | float | Average difficulty assigned to each human or AI agent working on the query. | 2.5 | 0-10 | Yes | Null | Median | Standard Scaler | None | MLOps Team |
| `PoP_Amount_Change_Pct` | float | Percentage difference between the current transaction and the previous one in the same department. | 0.15 (15%) | Any | Yes | Null | Ignore | Robust Scaler | None | Finance Team |
| `Rank_Amount_Within_Dept` | int | The standing of this transaction's size compared to all others in the department (1 = largest). | 5 | >= 1 | No | N/A | Error | None | None | Data Science |
| `Day_Of_Week` | string | Calendar day the transaction completed. | "Monday" | Monday-Sunday | No | N/A | Error | None | One-Hot Encoding | Data Engineering |
