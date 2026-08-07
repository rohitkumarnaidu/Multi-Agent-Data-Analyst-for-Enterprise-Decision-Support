# Phase 2: Data & Feature Engineering

## Project Objectives
The objective of Phase 2 is to transform the raw enterprise dataset (`enterprise_multiagent_decision_support.csv`) into a mathematically verified, perfectly typed, and feature-rich source optimized for downstream machine learning and LangGraph multi-agent analysis.

## Problems Solved
- Messy string-based datatypes corrected to standard numeric and datetime formats.
- Missing values and duplicates safely logged without deleting rows (Zero Data Loss Policy).
- Statistical outliers identified and explicitly tracked via boolean flags.
- Enhanced the dataset with temporal, business, and AI interaction features for predictive models.

## Schema Discovery
During the initial schema scan, we successfully parsed 37 columns across 200,000 transaction records. We identified structural datatypes, tracked exact null counts, computed column cardinalities, and scanned for PII. The output was systematically saved to `schema_report.json`.

## Cleaning
Our data cleaning pipeline implemented strict data preservation protocols:
- **Type Casting**: Dates (`Transaction_Date`, `Timestamp`) converted to ISO datetime format. Categories (`Department`, `Region`, `Priority_Level`) stripped of whitespace and title-cased.
- **Missing Values**: Columns exceeding 40% missing values (`Agent_Accuracy_Feedback`, `Employee_ID_Handler`, `Customer_Segment`) were flagged for UI exclusion but retained for model queries.
- **Duplicates**: Exact duplicate rows were identified and logged in `cleaning_log.md` but retained in the dataset.
- **Outliers**: Outliers exceeding ±3 standard deviations were identified and explicitly flagged via new boolean columns (e.g., `Transaction_Amount_USD_Is_Outlier`), preserving extreme but real business anomalies.

## Classification
Using cardinality heuristics and nomenclature rules, every column was systematically classified:
- **Identifier**: e.g., `Record_ID`, `Employee_ID_Handler`
- **Measure**: e.g., `Transaction_Amount_USD`, `Processing_Time_Sec`
- **Dimension**: e.g., `Department`, `Business_Unit`, `Region`
Any columns structured like PII (e.g., IDs, handler emails/names) were flagged with `"is_pii": true` to ensure compliance.

## Semantic Metrics
We built a robust semantic layer defined in `semantic/metrics.yaml`. 
This file acts as a single source of truth for the multi-agent system to natively execute SQL against the raw data without LLM hallucination. 
Metrics engineered include: `total_revenue`, `total_transaction_amount`, `average_processing_time`, `total_cost_savings`, `average_query_complexity`, `sla_breach_rate`, `average_data_quality`, `anomaly_rate`, `total_margin`, and `average_tokens_per_second`.

## Feature Engineering
We engineered several layers of advanced features to prepare the dataset for EDA and baseline modeling:

### Business Features
- **Total Margin (USD)**: Derived from the sum of `Revenue_Impact_USD` and `Cost_Savings_Potential_USD`.
- **Top-N Rankings**: Computed a dense rank for `Transaction_Amount_USD` within each `Department`.
- **Period-over-Period Changes**: Calculated row-over-row `PoP_Amount_Change_Pct` utilizing shifted windowing partitioned by `Department`.

### Temporal Features
- **Duration**: Extrapolated the actual `Start_Timestamp` by subtracting `Processing_Time_Sec` from `Timestamp`.
- **Time Boxing**: Added `Day_Of_Week` and `Is_Weekend` binary/categorical identifiers.
- **Rolling Windows**: Engineered a 7-transaction moving average of `Transaction_Amount_USD` partitioned by `Department`. Pre-sorting by `Timestamp` prevented any future data leakage.

### AI Features
- **Efficiency**: Calculated `Tokens_Per_Second` utilizing `Input_Tokens`, `Output_Tokens`, and `Processing_Time_Sec`. Division by zero was explicitly mitigated.
- **Cognitive Load**: Computed `Complexity_Per_Agent` distributing the `Query_Complexity_Score` across `Num_Agents_Involved`.

## DuckDB Validation
The pipeline executed native SQL checks against `metrics.yaml` directly over the exported `master_cleaned_dataset.parquet`. All 10 metrics passed runtime validation against the DuckDB SQL parser, ensuring perfect mathematical compatibility for Phase 3 Data Agents.

## Enterprise Audit & Final Report
An independent Zero-Trust Audit was performed validating temporal ordering, null propagation (0 infs found), duplicate retention, and predictive validity against the `SLA_Breached` target. 
Correlation and Mutual Information tests successfully confirmed the mathematical integrity and high predictive value of the engineered features (`Processing_Time_Sec`, `Num_Agents_Involved`, `Query_Complexity_Score`).

**Final Decision**: Phase 2 frozen and completely ready for downstream Model Training.
