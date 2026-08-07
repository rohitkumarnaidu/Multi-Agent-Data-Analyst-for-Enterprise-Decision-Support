# Temporal Analysis

Based on computation of the `Timestamp` and `Transaction_Date` features.

- `Is_Weekend` registered as the third highest predictive categorical variable (Mutual Info: `0.00055`) for SLA_Breached.
- Rolling features (`Rolling_7_Txn_Avg_Amount_By_Dept`) successfully computed without error but offer negligible SLA predictive value (`~0.0`).
- Processing times hold steady regardless of total transaction scale (proven by uncorrelated financial/latency metrics).
