# Feature Selection & Multicollinearity Studio

This document covers the **Feature Selection Studio** (`/workspace/feature-selection`), which provides multi-method consensus ranking, collinearity diagnostics, and subset simulation.

---

## 1. Multi-Method Consensus Ranking Engine ([ConsensusRankingTable.tsx](file:///c:/PROJECTS/Datasphere/Multi-Agent%20Data%20Analyst%20for%20Enterprise%20Decision%20Support/frontend/src/features/feature-selection/ConsensusRankingTable.tsx))

Combines 4 distinct feature importance methodologies into a normalized Borda-count consensus score:
1. **Mutual Information (Non-Linear)**: Captures non-linear dependencies between continuous features and binary target `sla_breached`.
2. **LASSO (L1 Regularization)**: Measures sparsity and linear predictive weight under $L_1$ shrinkage.
3. **Random Forest (Gini Importance)**: Evaluates mean decrease in impurity across 500 decision trees.
4. **XGBoost (Gain Importance)**: Calculates relative contribution of each feature across boosted gradient splits.

### Feature Ranking Table:

| Rank | Feature Name | Consensus Score | Mutual Info Rank | LASSO Rank | RF Rank | XGBoost Rank | Selection Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **#1** | `transit_time_hrs` | `98.4 / 100` | #1 | #1 | #1 | #1 | ✅ Selected |
| **#2** | `distance_km` | `92.1 / 100` | #2 | #3 | #2 | #2 | ✅ Selected |
| **#3** | `carrier_historical_breach_rate` | `88.7 / 100` | #4 | #2 | #3 | #4 | ✅ Selected |
| **#4** | `weather_severity` | `84.2 / 100` | #3 | #5 | #4 | #3 | ✅ Selected |
| **#5** | `route_congestion_index` | `79.5 / 100` | #5 | #4 | #6 | #5 | ✅ Selected |
| **#6** | `package_weight_kg` | `71.2 / 100` | #6 | #6 | #5 | #6 | ✅ Selected |
| **#7** | `carrier_cost_per_km` | `42.1 / 100` | #7 | #8 | #7 | #8 | ⚠️ High VIF Warning |
| **#8** | `fuel_surcharge_rate` | `38.4 / 100` | #8 | #7 | #8 | #7 | ❌ Dropped (Collinear) |

---

## 2. Variance Inflation Factor (VIF) Collinearity Monitor ([VIFMonitorCard.tsx](file:///c:/PROJECTS/Datasphere/Multi-Agent%20Data%20Analyst%20for%20Enterprise%20Decision%20Support/frontend/src/features/feature-selection/VIFMonitorCard.tsx))

* **VIF Safety Thresholds**:
  * `VIF < 5.0`: Optimal / Independent feature (Emerald).
  * `5.0 <= VIF < 10.0`: Moderate collinearity; monitor closely (Amber).
  * `VIF >= 10.0`: Severe multicollinearity; mandatory drop or PCA transformation (Rose).
* **Automated Agent Intervention**: Highlights collinear feature pairs (e.g. `fuel_surcharge_rate` with VIF = 14.8) and automatically recommends dropping redundant variables to prevent regression coefficient instability.

---

## 3. Top-K Feature Subset Impact Simulator ([SubsetImpactCard.tsx](file:///c:/PROJECTS/Datasphere/Multi-Agent%20Data%20Analyst%20for%20Enterprise%20Decision%20Support/frontend/src/features/feature-selection/SubsetImpactCard.tsx))

* **Interactive Slider**: Adjusts subset size $K$ from **5 features** to **25 features**.
* **Simulated Metrics**:
  * **Model ROC-AUC**: Shows performance curve plateauing at $K = 8$ (ROC-AUC: 0.942).
  * **Inference Latency**: Drops from $48\text{ms}$ (all 24 features) down to $12\text{ms}$ ($K = 8$ features).
  * **Dimensionality Reduction %**: $66.7\%$ reduction with zero loss in predictive power.
* **1-Click Export**: *"Apply Optimal Feature Set to Model Registry"* dispatches the approved feature subset directly to training pipelines.
