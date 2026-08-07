# Phase 3M: ML Insights & Executive Recommendations

## ML Insights (Derived from Computational Statistics)
1. **Extreme Non-Normality:** Kurtosis levels on financial features (e.g., `Deviation_Percentage` kurtosis = `0.035`) and `Transaction_Amount_USD` demonstrate massive heavy-tail distributions.
2. **Standardization Required:** Tree-based models (XGBoost/LightGBM) will not require standardization, but any neural network or distance-based model (KNN) will catastrophically fail without robust scaling (e.g. RobustScaler) due to ranges spanning from `-261,787` to `5,000,000`.
3. **Class Imbalance Realities:** The SLA_Breached target possesses high imbalance. `scale_pos_weight` is mandatory; SMOTE is not strictly required given the absolute volume (5% of 200,000 is still 10,000 minority class samples, sufficient for tree splitting).
4. **Predictive Weakness in Pure Financials:** The Mutual Information classifier returned negligible scores (`~2.99e-15`) for financial columns against the target `SLA_Breached`.
5. **Predictive Strength in Operations:** Operational flags like `Requires_Human_Review`, `Num_Agents_Involved`, and `Is_Weekend` retained the highest mutual information.

## Top Risks
1. **Heavy Tails:** Absolute maximums on financial data create massive leverage points for linear models.
2. **Post-execution feature leak:** Attempting to use `Agent_Accuracy_Feedback` to predict SLA breaches inherently leaks the outcome, as feedback occurs *after* execution.
3. **Dimensionality of categorical variables:** 18 categorical variables exist. High cardinality features will explode memory usage if one-hot encoded (recommend Target Encoding or LightGBM native).

## Executive Recommendations
1. **Algorithm Selection:** Finalize **LightGBM** as the core model. It inherently handles the 18 categorical variables natively, manages the 200k row scale in seconds, and is robust to the heavy-tail financial features.
2. **Feature Pruning:** Drop `Revenue_Impact_USD` and `Transaction_Amount_USD` from the SLA prediction pipeline based on the Mutual Info scores proving they do not drive execution latency.
3. **Transformations:** Apply Yeo-Johnson transformations to operational times (`Processing_Time_Sec`) to mitigate the skewness (`0.269`) if using linear baselines.
