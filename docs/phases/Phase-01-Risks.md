# Phase 1: Risk Assessment

## Initial Risks
- **Lookahead Bias (Leakage):** Models achieving 100% accuracy because they were fed future data (`Decision_Outcome`).
- **Deployment Crashes:** High likelihood of `joblib` artifacts failing in production when incoming API requests lacked the precise columns of the historical dataset.

## Resolved Risks
- ✅ **Train-set Leakage:** Solved via strict `Pipeline.fit(X_train)` execution.
- ✅ **Multicollinearity Instability:** Solved via iterative VIF reduction algorithms.
- ✅ **Schema Misalignment Crash:** Solved by injecting `ColumnDropper` inside the pipeline.
- ✅ **Unseen Category Crash:** Solved via explicit `handle_unknown` configurations.
- ✅ **Target Encoding Overfit:** Solved via K-Fold out-of-fold `TargetEncoder`.

## Remaining Risks
- **Data Drift over time:** As enterprise policies change, the Target Encoded probabilities of specific departments (e.g., `HR`) breaching SLA may drift.
- **Concept Drift:** The definition of an SLA breach itself may change dynamically based on new enterprise contracts.

## Mitigation Plans (Phase 2 & 3)
- Ensure the XGBoost model utilizes monotonic constraints where applicable.
- Deploy an ongoing monitoring system to track data drift using evidently/Kolmogorov-Smirnov testing against the `train.csv` baseline.
