# ML Recommendations

1. **Model Selection:** Proceed with XGBoost as the primary model due to its ability to handle missing values, non-linear feature interactions, and class imbalance efficiently.
2. **Metric Selection:** Default to PR-AUC (Precision-Recall Area Under Curve) and F1-Score rather than pure Accuracy, given the 95/5 negative-skewed target variable (`SLA_Breached`).
3. **Feature Selection:** Prune post-execution trailing features (e.g., `Total_Margin_USD`, `Agent_Accuracy_Feedback`) to prevent target leakage, isolating only features available at inference time (T0).
