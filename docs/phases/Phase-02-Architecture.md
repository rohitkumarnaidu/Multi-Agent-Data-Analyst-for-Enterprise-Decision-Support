# Phase 2 Architecture (Data Pipeline)

## Flow
1. **Ingestion**: Read `data/raw/enterprise_multiagent_decision_support.csv`
2. **Type Correction**: Date parsing and string normalization.
3. **Imputation & Logging**: Flag nulls and duplicates, compute outliers.
4. **Feature Engineering**: Derive temporal, AI interaction, and business KPI features.
5. **Output**: Write optimized `master_cleaned_dataset.parquet`.
6. **Semantic Mapping**: Output `metrics.yaml`.
