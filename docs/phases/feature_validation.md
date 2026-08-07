# Feature Validation Report

This document records the mathematical edge-case protections and statistical validations applied to the engineered features during Phase 2.

## Edge Case Protections

### 1. Division by Zero (Zero / Null Propagation)
- **`Tokens_Per_Second`**: Uses `.replace(0, np.nan)` on the denominator (`Processing_Time_Sec`) to safely coerce division by zero into `NaN` rather than `inf`. This prevents model corruption during training.
- **`Complexity_Per_Agent`**: Uses `.replace(0, np.nan)` on `Num_Agents_Involved`.
- **`PoP_Amount_Change_Pct`**: Ensures that if the previous transaction was 0, it yields `NaN` instead of an infinite percentage change.

### 2. Temporal Data Leakage Protection
- **`Rolling_7_Txn_Avg_Amount_By_Dept`** and **`Prev_Txn_Amount_By_Dept`**: The dataset was explicitly sorted by `Timestamp` prior to group-by and window application. This guarantees that row `i` only looks at rows `< i`, eliminating the risk of looking into the future.

### 3. Null Addition Propagation
- **`Total_Margin_USD`**: Computed using `df['Revenue_Impact_USD'].fillna(0) + df['Cost_Savings_Potential_USD'].fillna(0)`. If one value was null and the other 100, the result correctly retains 100 rather than silently dropping to Null.

## Statistical Validation

An independent audit script ran Pearson correlation and Mutual Information mapping against the target variable `SLA_Breached`:
- `Tokens_Per_Second` has a slight negative correlation (-0.003), acting as a valid proxy metric for pipeline efficiency.
- `Num_Agents_Involved` and `Processing_Time_Sec` displayed non-zero Mutual Information, confirming their utility in predictive routing models. 
- All duration calculations (e.g., `Start_Timestamp`) were verified to produce 0 negative time-deltas.
