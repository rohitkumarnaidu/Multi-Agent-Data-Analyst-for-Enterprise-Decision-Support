# Phase 1: Engineering Decisions

## 1. Why RobustScaler?
- **Problem:** Real-world enterprise KPIs often contain extreme, non-normal outliers.
- **Alternatives:** `StandardScaler`, `MinMaxScaler`.
- **Chosen Solution:** `RobustScaler`
- **Reason:** It scales based on the Interquartile Range (IQR) and median, meaning extreme anomalous spikes in API traffic or processing time won't compress the majority of the distribution into a narrow band.
- **Tradeoffs:** Does not bound values strictly to [0, 1].

## 2. Why out-of-fold TargetEncoder?
- **Problem:** High cardinality strings (like `Department` or `Region`) explode dimensionality if One-Hot Encoded.
- **Alternatives:** `category_encoders.TargetEncoder`, `HashingEncoder`.
- **Chosen Solution:** `sklearn.preprocessing.TargetEncoder`
- **Reason:** It performs internal K-Fold cross-validation during the `fit_transform` stage. This prevents a tree model from memorizing the global mean and overfitting the training set.
- **Tradeoffs:** Slightly slower to fit than a naive target encoder.

## 3. Why a Custom `ColumnDropper`?
- **Problem:** Dropping high-VIF and leaky columns using pandas *before* passing the DataFrame into the pipeline causes the Pipeline's feature expectations to misalign with raw production data.
- **Alternatives:** Dropping columns in the API endpoint before calling `predict()`.
- **Chosen Solution:** A custom `ColumnDropper` class inheriting from `TransformerMixin`, placed as step 1 in the Pipeline.
- **Reason:** The `joblib` object should be entirely self-contained. The API endpoint should blindly pass JSON to the model, and the model handles everything.
- **Tradeoffs:** Requires distributing `custom_transformers.py` alongside the `.joblib` file.

## 4. Why train_test_split first?
- **Problem:** Scaling or encoding the entire 200,000 row dataset bleeds future information (from test/val) into the historical training data.
- **Alternatives:** Ignorance.
- **Chosen Solution:** Split first, `fit` strictly on `X_train`.
- **Reason:** Mathematical purity. Models must be evaluated on genuinely unseen data.

## 5. Why Iterative VIF Reduction?
- **Problem:** Features like `Total_Tokens` and `Input_Tokens` are heavily correlated, confusing linear models and inflating coefficients.
- **Alternatives:** PCA, Ridge Regularization.
- **Chosen Solution:** Iteratively drop the max VIF feature until all are < 10.
- **Reason:** Retains the exact semantic meaning of the remaining features (crucial for explainable AI and human-readable dashboards).
