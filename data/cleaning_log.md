# Data Cleaning Log

## Missing Value Report

| Column                     |   Missing Count | Missing %   | Excluded from Default Charts   |
|:---------------------------|----------------:|:------------|:-------------------------------|
| Record_ID                  |               0 | 0.00%       | No                             |
| Transaction_Date           |               0 | 0.00%       | No                             |
| Timestamp                  |               0 | 0.00%       | No                             |
| Department                 |               0 | 0.00%       | No                             |
| Business_Unit              |               0 | 0.00%       | No                             |
| Region                     |            4005 | 2.00%       | No                             |
| Data_Source_System         |               0 | 0.00%       | No                             |
| Assigned_Agent             |               0 | 0.00%       | No                             |
| Query_Type                 |               0 | 0.00%       | No                             |
| Num_Agents_Involved        |               0 | 0.00%       | No                             |
| Query_Complexity_Score     |               0 | 0.00%       | No                             |
| Input_Tokens               |               0 | 0.00%       | No                             |
| Output_Tokens              |               0 | 0.00%       | No                             |
| Processing_Time_Sec        |            4049 | 2.02%       | No                             |
| KPI_Metric_Name            |               0 | 0.00%       | No                             |
| KPI_Current_Value          |            4045 | 2.02%       | No                             |
| KPI_Target_Value           |               0 | 0.00%       | No                             |
| Deviation_Percentage       |               0 | 0.00%       | No                             |
| Transaction_Amount_USD     |               0 | 0.00%       | No                             |
| Revenue_Impact_USD         |               0 | 0.00%       | No                             |
| Cost_Savings_Potential_USD |            4964 | 2.48%       | No                             |
| Anomaly_Detected           |               0 | 0.00%       | No                             |
| Anomaly_Score              |               0 | 0.00%       | No                             |
| Confidence_Score           |               0 | 0.00%       | No                             |
| Data_Quality_Score         |            5995 | 3.00%       | No                             |
| Root_Cause_Category        |               0 | 0.00%       | No                             |
| Recommended_Action         |               0 | 0.00%       | No                             |
| Priority_Level             |               0 | 0.00%       | No                             |
| Risk_Level                 |               0 | 0.00%       | No                             |
| Escalation_Level           |               0 | 0.00%       | No                             |
| Decision_Outcome           |               0 | 0.00%       | No                             |
| SLA_Breached               |               0 | 0.00%       | No                             |
| Agent_Accuracy_Feedback    |          144000 | 72.00%      | Yes                            |
| Employee_ID_Handler        |          144000 | 72.00%      | Yes                            |
| Customer_Segment           |          103864 | 51.93%      | Yes                            |
| Report_Summary_Text        |            5910 | 2.96%       | No                             |
| Requires_Human_Review      |               0 | 0.00%       | No                             |


**Note**: Columns with >40% missing values (Agent_Accuracy_Feedback, Employee_ID_Handler, Customer_Segment) are flagged for exclusion from default charts, but have NOT been removed from the dataset to preserve queryability.

## Duplicate Detection

- **Exact Duplicate Rows**: 0

- **Policy Action**: Duplicates were flagged but NOT deleted automatically to prevent silent row loss. If deletion is required, it must be performed explicitly downstream.

## Outlier Detection (>3 Std Dev)

- **Input_Tokens**: 146 outliers flagged. (Not removed).

- **Output_Tokens**: 177 outliers flagged. (Not removed).

- **Processing_Time_Sec**: 377 outliers flagged. (Not removed).

- **KPI_Current_Value**: 6116 outliers flagged. (Not removed).

- **KPI_Target_Value**: 6206 outliers flagged. (Not removed).

- **Deviation_Percentage**: 595 outliers flagged. (Not removed).

- **Transaction_Amount_USD**: 2735 outliers flagged. (Not removed).

- **Revenue_Impact_USD**: 2672 outliers flagged. (Not removed).

- **Cost_Savings_Potential_USD**: 2155 outliers flagged. (Not removed).

- **Anomaly_Score**: 1490 outliers flagged. (Not removed).

- **Confidence_Score**: 342 outliers flagged. (Not removed).

- **Data_Quality_Score**: 1479 outliers flagged. (Not removed).

- **Agent_Accuracy_Feedback**: 281 outliers flagged. (Not removed).

## Time Context

- **As Of Date**: 2025-12-30 19:59:30

This constant should be used by downstream agents for relative time phrases (e.g. 'last month').
