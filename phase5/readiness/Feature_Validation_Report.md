# Enterprise Feature Validation Report

**Audit Date**: 2026-08-08 01:09:21 UTC  
**Total Production Features**: 35 (34 Predictors + 1 Target)  
**Status**: 🟢 **PASSED ALL FEATURE CONSTRAINTS**  

---

## 1. Production Feature Registry Audit
| # | Feature Name | Datatype | Role | Missing Count | Verification |
|---|---|---|---|---|---|
| 1 | `Deviation_Percentage` | `float64` | Predictor Feature | 0 | ✅ **VALIDATED** |
| 2 | `Transaction_Amount_USD` | `float64` | Predictor Feature | 0 | ✅ **VALIDATED** |
| 3 | `Risk_Level` | `str` | Predictor Feature | 0 | ✅ **VALIDATED** |
| 4 | `Requires_Human_Review` | `int64` | Predictor Feature | 0 | ✅ **VALIDATED** |
| 5 | `Escalation_Level` | `str` | Predictor Feature | 0 | ✅ **VALIDATED** |
| 6 | `Revenue_Impact_USD` | `float64` | Predictor Feature | 0 | ✅ **VALIDATED** |
| 7 | `Anomaly_Score` | `float64` | Predictor Feature | 0 | ✅ **VALIDATED** |
| 8 | `Business_Unit` | `str` | Predictor Feature | 0 | ✅ **VALIDATED** |
| 9 | `Data_Source_System` | `str` | Predictor Feature | 0 | ✅ **VALIDATED** |
| 10 | `Query_Complexity_Score` | `float64` | Predictor Feature | 0 | ✅ **VALIDATED** |
| 11 | `Query_Type` | `str` | Predictor Feature | 0 | ✅ **VALIDATED** |
| 12 | `KPI_Metric_Name` | `str` | Predictor Feature | 0 | ✅ **VALIDATED** |
| 13 | `Region` | `str` | Predictor Feature | 0 | ✅ **VALIDATED** |
| 14 | `Cost_Savings_Potential_USD` | `float64` | Predictor Feature | 0 | ✅ **VALIDATED** |
| 15 | `KPI_Target_Value` | `float64` | Predictor Feature | 0 | ✅ **VALIDATED** |
| 16 | `Assigned_Agent` | `str` | Predictor Feature | 0 | ✅ **VALIDATED** |
| 17 | `Priority_Level` | `str` | Predictor Feature | 0 | ✅ **VALIDATED** |
| 18 | `Transaction_Amount_USD_Is_Outlier` | `int64` | Predictor Feature | 0 | ✅ **VALIDATED** |
| 19 | `Department` | `str` | Predictor Feature | 0 | ✅ **VALIDATED** |
| 20 | `Confidence_Score` | `float64` | Predictor Feature | 0 | ✅ **VALIDATED** |
| 21 | `Processing_Time_Sec` | `float64` | Predictor Feature | 0 | ✅ **VALIDATED** |
| 22 | `Processing_Time_Sec_Is_Outlier` | `int64` | Predictor Feature | 0 | ✅ **VALIDATED** |
| 23 | `Rolling_7_Txn_Avg_Amount_By_Dept` | `float64` | Predictor Feature | 0 | ✅ **VALIDATED** |
| 24 | `Recommended_Action` | `str` | Predictor Feature | 0 | ✅ **VALIDATED** |
| 25 | `Prev_Txn_Amount_By_Dept` | `float64` | Predictor Feature | 0 | ✅ **VALIDATED** |
| 26 | `PoP_Amount_Change_Pct` | `float64` | Predictor Feature | 0 | ✅ **VALIDATED** |
| 27 | `Root_Cause_Category` | `str` | Predictor Feature | 0 | ✅ **VALIDATED** |
| 28 | `Customer_Segment` | `str` | Predictor Feature | 0 | ✅ **VALIDATED** |
| 29 | `Rank_Amount_Within_Dept` | `float64` | Predictor Feature | 0 | ✅ **VALIDATED** |
| 30 | `KPI_Current_Value` | `float64` | Predictor Feature | 0 | ✅ **VALIDATED** |
| 31 | `Output_Tokens` | `int64` | Predictor Feature | 0 | ✅ **VALIDATED** |
| 32 | `Data_Quality_Score` | `float64` | Predictor Feature | 0 | ✅ **VALIDATED** |
| 33 | `Input_Tokens` | `int64` | Predictor Feature | 0 | ✅ **VALIDATED** |
| 34 | `Total_Margin_USD` | `float64` | Predictor Feature | 0 | ✅ **VALIDATED** |
| 35 | `SLA_Breached` | `int64` | Target Variable | 0 | ✅ **VALIDATED** |


---

## 2. Excluded Features Verification Matrix
All 14 excluded master attributes confirmed absent from all production partitions:
- `Record_ID`: Excluded (Raw ID)
- `Timestamp`: Excluded (Raw Timestamp)
- `Transaction_Date`: Excluded (Raw Date)
- `Start_Timestamp`: Excluded (Raw Timestamp)
- `Agent_Accuracy_Feedback`: Excluded (Target Leakage)
- `Report_Summary_Text`: Excluded (Unstructured Text)
- `Decision_Outcome`: Excluded (Label Proxy)
- `Anomaly_Detected`: Excluded (Collinear)
- `Day_Of_Week`: Excluded (Low SHAP / Redundant)
- `Is_Weekend`: Excluded (Zero Importance)
- `Tokens_Per_Second`: Excluded (High Volatility)
- `Complexity_Per_Agent`: Excluded (Redundant)
- `Num_Agents_Involved`: Excluded (Low Consensus)
- `Employee_ID_Handler`: Excluded (Overfitting Risk)

---

## 3. Governance Sign-off
- **Principal ML Engineer**: ✅ **APPROVED**
- **Data Governance Engineer**: ✅ **APPROVED**
