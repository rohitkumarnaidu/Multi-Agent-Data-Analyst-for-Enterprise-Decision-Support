# Feature Dependencies

This registry maps the transformation chains for engineered features, documenting parent-child relationships.

| Child Feature | Dependency Type | Parent Features | Transformation Logic |
|---|---|---|---|
| `Total_Margin_USD` | Direct Summation | `Revenue_Impact_USD`, `Cost_Savings_Potential_USD` | `A + B` |
| `Tokens_Per_Second` | Ratio | `Input_Tokens`, `Output_Tokens`, `Processing_Time_Sec` | `(A + B) / C` |
| `Complexity_Per_Agent` | Ratio | `Query_Complexity_Score`, `Num_Agents_Involved` | `A / B` |
| `Prev_Txn_Amount_By_Dept` | Window Shift | `Transaction_Amount_USD`, `Department`, `Timestamp` | Group by B, Order by C, Shift(1) A |
| `PoP_Amount_Change_Pct` | Complex Aggregate | `Transaction_Amount_USD`, `Prev_Txn_Amount_By_Dept` (Child) | `(A - B) / B` |
| `Rolling_7_Txn_Avg_Amount_By_Dept` | Window Mean | `Transaction_Amount_USD`, `Department`, `Timestamp` | Group by B, Order by C, Rolling(7).mean A |
| `Rank_Amount_Within_Dept` | Dense Rank | `Transaction_Amount_USD`, `Department` | Group by B, Rank A |

## Transformation Chains
Notice that `PoP_Amount_Change_Pct` relies on another engineered feature (`Prev_Txn_Amount_By_Dept`). 
If `Prev_Txn_Amount_By_Dept` is deprecated or altered, `PoP_Amount_Change_Pct` must undergo regression testing.
