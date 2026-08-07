# Phase 1: Outputs & Artifacts

## Generated Datasets
- `data/train.csv` - The pristine, scaled, encoded, leakage-free 70% matrix for model training.
- `data/validation.csv` - The 15% tuning split.
- `data/test.csv` - The 15% final holdout split.

## Serialization Objects
- `models/preprocessing_pipeline.joblib` - The self-contained master preprocessor for real-time inference.

## Python Scripts
- `scripts/custom_transformers.py` - Contains `ColumnDropper`.
- `scripts/v2_pipeline_builder.py` - Historical iterative build script.
- `scripts/v3_pipeline_builder.py` - Final production script.
- `scripts/v3_production_test.py` - Automated inference test suite.

## Generated Reports
- `reports/vif_report.md` - Log of sequentially dropped high-correlation features.
- `reports/encoding_report.md` - Listing of binary, low, and high cardinality feature routing.
- `reports/scaling_report.md` - Listing of numerical features treated by RobustScaler.
- `reports/production_validation.md` - Pass/fail results of the V3 zero-trust tests.
- `reports/feature_metadata.json` - Serialized feature array configurations.

## Documentation (This directory)
- `Phase-01-Data-Preparation.md`
- `Phase-01-Summary.md`
- `Phase-01-Changelog.md`
- `Phase-01-Decisions.md`
- `Phase-01-Lessons-Learned.md`
- `Phase-01-Architecture.md`
- `Phase-01-Validation.md`
- `Phase-01-Risks.md`
- `Phase-01-Outputs.md`
