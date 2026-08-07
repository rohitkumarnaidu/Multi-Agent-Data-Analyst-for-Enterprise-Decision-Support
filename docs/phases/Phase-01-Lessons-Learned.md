# Phase 1: Lessons Learned

## Mistakes Made
1. **Target Encoder Overfitting:** Initially, the pipeline utilized a naive target encoder. We assumed it was mathematically sound, but realized it mapped categories using the *global* target mean. This is a classic trap that guarantees severe training-set overfitting for tree models.
2. **Outside-Pipeline Manipulations:** High-VIF features were dynamically dropped using `pandas.drop()` before fitting the `Pipeline`. 

## Production Bugs Encountered
- **Inference Crash (Schema Mismatch):** Because of the outside-pipeline manipulations, when a single raw row (representing an API request) was fed into `joblib.transform()`, it violently crashed because the Pipeline's `ColumnTransformer` expected an input array of a specific dimension that didn't include the VIF columns.
- **Unknown Category Fatalities:** `OrdinalEncoder` inherently throws hard `ValueError` exceptions if it encounters a novel string in production.

## How They Were Fixed
- **Inference Crash:** Engineered a `ColumnDropper` custom transformer directly into the pipeline so that raw incoming schema matches internal processing exactly.
- **Unknown Categories:** Activated `handle_unknown='use_encoded_value', unknown_value=-1` to ensure graceful fallback.
- **Overfitting:** Swapped to native `sklearn` `TargetEncoder` to leverage K-Fold out-of-fold mapping.

## Enterprise Best Practices Learned
- **Zero Trust the Model Artifact:** Never assume a pipeline works just because it outputs `train.csv`. Always feed it exactly one raw row of uncleaned data and verify it doesn't crash.
- **Isolation of Concerns:** The model artifact (`.joblib`) must be 100% self-sufficient. Web developers calling the API should never need to write manual Pandas cleanup logic.

## Interview Talking Points
- *"In our ML pipeline, I identified a severe deployment vulnerability where the inference schema misaligned with training expectations due to external VIF column dropping. I resolved this by engineering a custom scikit-learn transformer to encapsulate feature selection natively within the serialized pipeline object."*
- *"To handle high cardinality categorical variables without exploding our feature space, I utilized Target Encoding. However, to prevent data leakage and training overfitting, I specifically enforced out-of-fold K-Fold encoding."*
