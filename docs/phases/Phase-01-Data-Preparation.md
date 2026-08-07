# Phase 1: Data Preparation & Preprocessing

## Project Objective
Develop a production-ready, enterprise-grade ML preprocessing pipeline capable of safely handling a 200,000-row AI operations dataset, to support a Multi-Agent Data Analyst for Enterprise Decision Support. The resulting dataset must be free of data leakage, robust to novel production data, and suitable for training tree-based models (e.g., XGBoost, LightGBM).

## Initial Dataset
- **Source:** Enterprise Multi-Agent Decision Support Log
- **Size:** 200,000 rows
- **Columns:** 37
- **Target:** `SLA_Breached`

## Cleaning Process
The raw data initially suffered from major issues including collinearity, label leakage, test-set leakage via improper scaling, and unseen category vulnerabilities. Our cleaning process involved multi-staged, zero-trust audits.

## Enterprise Audits
1. **Audit V1 (Initial Assessment):** Detected critical leakage points (e.g., `Decision_Outcome`) and basic data quality issues.
2. **Audit V2 (Pre-flight Verification):** A secondary independent audit that discovered systemic scaling leakage (scaling before split) and encoding failures.
3. **Audit V3 (Zero Trust Code Review):** Uncovered that `TargetEncoder` (via `category_encoders`) was causing training overfitting, and inference crashed due to mismatched columns.

## Problems Found & Fixed
| Problem | Status | Solution |
| :--- | :---: | :--- |
| Target Leakage | Fixed | Dropped `Decision_Outcome`, `Agent_Accuracy_Feedback` |
| Train/Test Leakage | Fixed | Moved `train_test_split` to be the *first* operation |
| Multicollinearity | Fixed | Iterative VIF algorithm drops features until VIF < 10 |
| Inference Column Mismatch | Fixed | Built `ColumnDropper` inside the `sklearn` Pipeline |
| Target Encoding Overfitting | Fixed | Replaced global TargetEncoder with out-of-fold `sklearn.preprocessing.TargetEncoder` |
| Unknown Categories Crash | Fixed | `OrdinalEncoder(handle_unknown='use_encoded_value')` |

## Pipeline Evolution
### V1: Baseline
- Simple dropping and imputing. 
- **Flaw:** Scaled the entire dataset before splitting. Major leakage.

### V2: Robust Split & VIF
- Introduced `ColumnTransformer` and iterative VIF.
- **Flaw:** VIF columns were dropped *before* the Pipeline object. The `joblib` object crashed when fed raw rows during inference.

### V3: Production Ready (Final)
- Integrated `ColumnDropper` custom transformer directly into the `Pipeline`.
- Integrated `sklearn` native out-of-fold `TargetEncoder`.
- Automated production validation tests passed flawlessly.

## Final Architecture
Raw Dataset ➔ `ColumnDropper` ➔ Imputation ➔ `ColumnTransformer` (Target/OneHot/Ordinal Encoders + RobustScaler) ➔ Final Dataset

## Final Outputs
- `train.csv`, `validation.csv`, `test.csv`
- `preprocessing_pipeline.joblib`
- Complete Enterprise Audit Reports
