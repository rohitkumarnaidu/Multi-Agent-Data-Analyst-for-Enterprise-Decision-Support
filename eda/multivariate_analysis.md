# Phase 3F: Multivariate Analysis

## Feature Interactions
- **`Input_Tokens` + `Output_Tokens` vs `Processing_Time_Sec`:** Strong multivariate dependency. High tokens strictly mandate high processing time due to LLM generation speeds. Engineered feature `Tokens_Per_Second` normalizes this.
- **`Revenue_Impact_USD` + `Cost_Savings_Potential_USD`:** Together, these form the engineered `Total_Margin_USD` feature.

## Multicollinearity
- **VIF Report Cross-Reference:** The Feature Store already documented VIF reporting in `reports/vif_report.md`. 
- Highly collinear raw features (like pure Token counts vs total tokens) have been stabilized via engineered rates (`Tokens_Per_Second`).

## Feature Clusters
- **Financial Cluster:** Transaction amounts, revenue impact, cost savings.
- **AI Ops Cluster:** Complexity score, token counts, agent counts.
- **Risk Cluster:** Anomaly scores, confidence scores, data quality scores.
