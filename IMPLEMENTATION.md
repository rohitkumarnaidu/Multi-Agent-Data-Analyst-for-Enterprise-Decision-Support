# Implementation Details

## Data Preparation Implementation (`preprocessing_pipeline.joblib`)
The data preprocessing architecture was strictly implemented using `scikit-learn` version 1.8.0. 

### Custom Transformers
`ColumnDropper` was implemented to intercept incoming API requests and dynamically drop features that match `Year`, `Quarter`, `Decision_Outcome`, etc., ensuring the exact matrix dimensions required by the Encoders are met.

### Out-of-Fold Encoding
To implement target encoding on high-cardinality features (`Department`, `Region`), `sklearn.preprocessing.TargetEncoder` was utilized. This implementation is critical because it performs K-Fold target encoding, which successfully eradicated the training-set overfitting observed in earlier iterations.

## Multi-Agent Implementation (Upcoming)
*To be populated in Phase 3.*
