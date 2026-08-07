# Data & Feature Engineering Phase Summary

## Overview
This directory contains the cleaned dataset and associated metadata artifacts produced during the Data & Feature Engineering Phase. 

## Cleaned Dataset
- **File**: `master_cleaned_dataset.parquet`
- **Rows**: 200000
- **Columns**: 49

## Artifacts Produced
1. **`schema_report.json`**: Machine-readable schema scan with inferred types, null counts, cardinalities, business classifications (`identifier`, `measure`, `dimension`), and PII flags.
2. **`cleaning_log.md`**: Human-readable report detailing missing value percentages, duplicate counts, outlier flags, and the global "As Of Date" for relative time phrases.
3. **`../semantic/metrics.yaml`**: The semantic layer defining 10 core business metrics with their SQL expressions and allowed dimensions.

## Key Findings & Corrections
- **Type Correction**: Dates were parsed, and string categories were normalized (title case, whitespace stripped).
- **Missing Values**: Columns exceeding 40% missing values (e.g., `Agent_Accuracy_Feedback`, `Employee_ID_Handler`) are flagged in the cleaning log but retained for queryability. No rows were dropped.
- **Duplicates**: 0 exact duplicates were detected and logged, but retained to prevent silent data loss.
- **Outliers**: Outliers (>3 Std Dev) in numeric columns are flagged in the schema report and with boolean flag columns (e.g., `Transaction_Amount_USD_Is_Outlier`), but were not removed.
- **PII**: Columns containing identifiable information are flagged as `is_pii: true` in the schema report.

## Engineered Features
Several domain and AI-specific features were added:
- **Temporal**: `Start_Timestamp`, `Day_Of_Week`, `Is_Weekend`
- **Business**: `Total_Margin_USD`
- **AI/Interaction**: `Tokens_Per_Second`, `Complexity_Per_Agent`
- **Helpers**: Rolling averages, period-over-period changes, and top-N ranks were computed partitioned by `Department`.

## Uncertainties / Next Steps
- Duplicate resolution strategy needs to be defined by downstream owners.
- Imputation strategies for heavily missing columns should be considered during model training.
