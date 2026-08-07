# Changelog

All notable changes to this project will be documented in this file.

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
