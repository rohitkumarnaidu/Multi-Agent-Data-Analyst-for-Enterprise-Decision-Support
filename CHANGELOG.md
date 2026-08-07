# Changelog

All notable changes to this project will be documented in this file.

## [Phase 3 Freeze] - 2026-08-07

### Added
- Complete programmatic EDA pipeline (`scripts/computational_eda.py`, `scripts/computational_eda_completion.py`).
- 22 numerical histograms, boxplots, and qq-plots, alongside 18 categorical count plots.
- Correlation matrices, scatter matrices, pair plots, and temporal trend analyses.
- Automated generation of CSV statistics (Count, IQR, Skewness, Mutual Information).
- Phase 3 Audit & Freeze documentation suite in `reports/` and `eda/`.

## [Phase 2 Freeze] - 2026-08-07
- Comprehensive feature engineering (Business, AI, Temporal features).
- `semantic/metrics.yaml` deterministic SQL metrics definitions.
- Phase 2 documentation suite in `docs/phases/`.

### Changed
- Standardized data types (strings and datetimes).
- Implemented Zero-Drop policy for duplicates and outliers.

## [Phase 1 Freeze] - 2026-08-07

### Added
- Phase 1 documentation suite in `docs/phases/`.
- Automated inference validation scripts (`v3_production_test.py`).
- Iterative VIF reduction logic in pipeline builder.
- `ColumnDropper` custom scikit-learn transformer for inference schema normalization.

### Changed
- Refactored entire preprocessing pipeline from generic pandas operations to a strictly modular `sklearn.pipeline.Pipeline` object.
- Replaced `category_encoders.TargetEncoder` with `sklearn.preprocessing.TargetEncoder` to utilize K-Fold out-of-fold mapping (fixed training leakage).
- Updated `OrdinalEncoder` to silently map unknown inference categories to `-1`.

### Removed
- `Decision_Outcome` and `Agent_Accuracy_Feedback` columns (Target Leakage).
- `Year`, `Quarter`, `Processing_Time_Sec`, `Output_Tokens` (VIF > 10).
