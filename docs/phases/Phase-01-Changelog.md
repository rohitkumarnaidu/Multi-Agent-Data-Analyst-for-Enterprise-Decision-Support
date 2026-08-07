# Phase 1: Changelog

### Version: V1 (Initial Audit & Baseline)
- **Date:** 2026-08-07
- **Changes:** Executed enterprise audit on raw dataset. Created baseline pipeline.
- **Reason:** To identify fundamental quality flaws.
- **Impact:** Discovered target leakage and severe scaling leakage.
- **Result:** Baseline pipeline rejected.

### Version: V2 (Pre-Flight Fixes)
- **Date:** 2026-08-07
- **Changes:** Refactored architecture to enforce `train_test_split` prior to all scaler fitting. Introduced iterative VIF reduction.
- **Reason:** To prevent lookahead bias and reduce multicollinearity.
- **Impact:** Data became linearly stable and free of validation leakage. 
- **Result:** Rejected during Zero Trust Inference testing due to column mismatch errors.

### Version: V3 (Production Freeze - Final)
- **Date:** 2026-08-07
- **Changes:** 
  - Wrote custom `ColumnDropper` transformer.
  - Replaced `category_encoders` with native `sklearn` `TargetEncoder`.
  - Configured `OrdinalEncoder(handle_unknown='use_encoded_value')`.
- **Reason:** To ensure raw incoming production records process successfully without schema errors or unseen-category crashes.
- **Impact:** Achieved 100% pass rate on the 5-stage inference testing suite.
- **Result:** Pipeline certified and frozen.
