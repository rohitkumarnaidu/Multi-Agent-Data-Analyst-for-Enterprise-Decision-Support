# Feature Validation

Mathematical and statistical validation proofs for the Enterprise Feature Store.

| Feature | Nulls Checked | Distribution Checked | Variance Checked | Outliers Protected | Correlation Checked | Leakage Free | Temporal Consistent | Math Correct | Biz Correct | Status |
|---|---|---|---|---|---|---|---|---|---|---|
| `Start_Timestamp` | Yes | Yes | Yes | N/A | Yes | Yes | Yes (No negative delta) | Yes | Yes | 🟢 PASS |
| `Total_Margin_USD`| Yes | Yes | Yes | Yes (Flagged) | Yes | Yes | Yes | Yes (Zero-fill Nulls) | Yes | 🟢 PASS |
| `Tokens_Per_Sec` | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes (Div/0 Handled) | Yes | 🟢 PASS |
| `Complexity_Per` | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes (Div/0 Handled) | Yes | 🟢 PASS |
| `Rolling_7_Txn` | Yes | Yes | Yes | N/A | Yes | Yes (Sorted prior to window) | Yes | Yes | Yes | 🟢 PASS |
| `Prev_Txn_Amt` | Yes | Yes | Yes | N/A | Yes | Yes | Yes | Yes | Yes | 🟢 PASS |
| `PoP_Amt_Pct` | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes (Div/0 Handled) | Yes | 🟢 PASS |
| `Rank_Amount` | Yes | Yes | Yes | N/A | Yes | Yes | Yes | Yes (Dense rank) | Yes | 🟢 PASS |
| `Day_Of_Week` | Yes | Yes | Yes | N/A | Yes | Yes | Yes | Yes | Yes | 🟢 PASS |
| `Is_Weekend` | Yes | Yes | Yes | N/A | Yes | Yes | Yes | Yes | Yes | 🟢 PASS |
