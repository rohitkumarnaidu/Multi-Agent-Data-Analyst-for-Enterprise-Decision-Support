# Changelog

All notable changes to this project will be documented in this file.

## [Phase 4E Freeze] - 2026-08-08

### Added
- Computed **Enterprise Consensus Score** equally weighting Phase 4A, 4B, 4C, and 4D.
- Evaluated all 44 foundational features, definitively classifying them into KEEP (Production), KEEP (Executive KPI), KEEP (AI Critical), REVIEW, or REMOVE.
- Froze the absolute master feature inventory for Phase 5 Model Training.

## [Phase 4D Freeze] - 2026-08-08

### Added
- Created `run_phase4d_explainability.py` to extract intrinsic meaning via SHAP and LIME.
- Computed Global SHAP via TreeExplainer on Random Forest, XGBoost, LightGBM, and CatBoost.
- Plotted local LIME interactions for anomalous prediction interpretation.

## [Phase 4C Freeze] - 2026-08-08

### Added
- Automated `run_phase4c_model.py` to extract intrinsic feature importances using 5 lightweight models (Random Forest, XGBoost, LightGBM, CatBoost, Extra Trees).
- Executed 4 wrapper methods (RFE, RFECV, SFS, SBS) and Permutation Importance across 10,000 stratified sample rows.
- Established a unified `Consensus Feature Rank` mapping back to the 44 base features (reversing OHE expansions).
- Generated ranking variance statistics to identify and flag computationally unstable features.
- Automated `run_phase4c_audit.py` Zero-Trust verification resulting in `Phase4C_Certification.md` and `Phase4C_Freeze_Report.md`.

## [Phase 4B Freeze] - 2026-08-08

### Added
- Phase 4B Business Feature Selection evaluation script (`run_phase4b_business.py`).
- Generated comprehensive business classifications, evaluating all features against 5 business-centric KPIs (Business, Executive, AI-Agent, Dashboard, Decision Support).
- Verified and matched all statistical metadata from Phase 4A into semantic business groups (Finance, Operations, Risk, etc.).
- Five-part verification suite including `Business_Consistency_Report.md`.

## [Phase 4A Freeze] - 2026-08-07

### Added
- Phase 4 Readiness Audit and Phase 4A Statistical Feature Selection.
- Automated python scripts (`run_phase4_audit.py`, `run_phase4a_statistical.py`, `run_phase4a_audit.py`) to systematically generate statistical metrics without data alteration.
- Comprehensive 15-metric statistical profiles for all features (including Variance, Mutual Information, ANOVA, Chi-Square, and PSI).
- Strict Multicollinearity checks via VIF, flagging heavily correlated features as REDUNDANT.
- Four-part verification suite (`Phase4A_Verification_Report.md`, `Phase4A_Audit_Report.md`, `Phase4A_Certification.md`, `Phase4A_Freeze_Report.md`).

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
