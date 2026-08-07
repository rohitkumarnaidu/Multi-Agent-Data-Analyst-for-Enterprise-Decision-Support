# Feature Lineage

This document traces the dependency graph from our engineered features backward to their raw source columns in `enterprise_multiagent_decision_support.csv`.

## 1. Temporal Lineage
- **`Start_Timestamp`**
  - `<-- Timestamp` (raw)
  - `<-- Processing_Time_Sec` (raw)
- **`Day_Of_Week`**
  - `<-- Timestamp` (raw)
- **`Is_Weekend`**
  - `<-- Timestamp` (raw)

## 2. Business Lineage
- **`Total_Margin_USD`**
  - `<-- Revenue_Impact_USD` (raw)
  - `<-- Cost_Savings_Potential_USD` (raw)
- **`Rank_Amount_Within_Dept`**
  - `<-- Transaction_Amount_USD` (raw)
  - `<-- Department` (raw)
- **`Prev_Txn_Amount_By_Dept`**
  - `<-- Transaction_Amount_USD` (raw)
  - `<-- Department` (raw)
  - `<-- Timestamp` (raw)
- **`Rolling_7_Txn_Avg_Amount_By_Dept`**
  - `<-- Transaction_Amount_USD` (raw)
  - `<-- Department` (raw)
  - `<-- Timestamp` (raw)
- **`PoP_Amount_Change_Pct`**
  - `<-- Transaction_Amount_USD` (raw)
  - `<-- Prev_Txn_Amount_By_Dept` (engineered)

## 3. AI / Interaction Lineage
- **`Tokens_Per_Second`**
  - `<-- Input_Tokens` (raw)
  - `<-- Output_Tokens` (raw)
  - `<-- Processing_Time_Sec` (raw)
- **`Complexity_Per_Agent`**
  - `<-- Query_Complexity_Score` (raw)
  - `<-- Num_Agents_Involved` (raw)
