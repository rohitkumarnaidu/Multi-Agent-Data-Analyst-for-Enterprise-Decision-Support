# Phase 3I: Model Readiness

## Best Target Variable
**`SLA_Breached` (Boolean)**
- Clearly defined, business-critical KPI.
- Imbalanced, presenting a realistic ML challenge.
- Verified in Phase 1 as completely free of target leakage.

## Best Features
- `Query_Complexity_Score`
- `Num_Agents_Involved`
- `Input_Tokens`
- `Department`
- `Data_Source_System`
- `Day_Of_Week`

## Recommended Algorithms

### 1. XGBoost (Highly Recommended)
**Why:** Proven robustness on tabular data with mixed datatypes (numeric and high-cardinality categorical via encoding). Handles the 5% class imbalance smoothly using `scale_pos_weight`.

### 2. LightGBM (Recommended Alternative)
**Why:** Capable of training substantially faster on the 200,000 row dataset while providing native handling for categorical variables without heavy one-hot encoding overhead.

### 3. Logistic Regression (Baseline)
**Why:** Necessary as a highly interpretable baseline before committing to tree-based ensembles.

### Rejected Models
- **Neural Networks:** Unnecessary complexity for 200k rows of structured tabular data.
- **Random Forest:** Slower to train and predict than XGBoost/LightGBM for this specific dimensionality.
