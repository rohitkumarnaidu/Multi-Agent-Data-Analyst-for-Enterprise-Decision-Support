# Phase 4A: Statistical Feature Selection Summary

## Final Classification Counts
- **KEEP / KEEP (High Confidence):** 26
- **REVIEW:** 3
- **REDUNDANT:** 14
- **REMOVE CANDIDATE:** 0
- **LOW VALUE:** 1

## Methodological Notes
- **Multicollinearity (VIF):** Computed across numeric predictors. Features with VIF > 10 are flagged as REDUNDANT.
- **Leakage (Correlation/MI):** Very high correlation (>0.95) or Mutual Information (>0.5) against the target triggers a REMOVE CANDIDATE / REVIEW flag.
- **Stability (PSI):** Population Stability Index was computed between random train/val splits. High PSI reduces the overall ML score.
- **Overall Score:** Weighted average of derived ML statistical strength and Business relevance.

## Next Steps
The project is ready for Business Feature Selection and SHAP-based Model Selection in subsequent phases. Use `feature_rankings.csv` as the foundation for those steps.
