# Model Center & Registry Feature Inventory

This document details the **Model Center & Registry** (`/workspace/models`), which manages champion/challenger governance, statistical validation, and real-time inference testing.

---

## 1. Champion vs. Challenger Leaderboard ([ModelRegistryTable.tsx](file:///c:/PROJECTS/Datasphere/Multi-Agent%20Data%20Analyst%20for%20Enterprise%20Decision%20Support/frontend/src/features/models/components/ModelRegistryTable.tsx))

| Model ID & Architecture | Version | Status | ROC-AUC | F1-Score | Brier Score | Latency (p95) | Deployment Date |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`model-lgbm-sla-v19`** (LightGBM) | `v1.9.2` | 👑 **Champion** (Active Production) | **0.942** | **0.884** | **0.068** | **8.4 ms** | 2026-08-01 |
| **`model-xgb-sla-v21`** (XGBoost) | `v2.1.0` | ⚔️ **Challenger** (Candidate) | **0.948** | **0.891** | **0.064** | **14.2 ms** | 2026-08-05 |
| **`model-catboost-v08`** (CatBoost) | `v0.8.4` | 🔬 **Staging** (Evaluation) | **0.938** | **0.876** | **0.072** | **18.5 ms** | 2026-08-04 |
| **`model-logistic-baseline`** (GLM) | `v1.0.0` | 📦 **Archived** (Reference) | **0.812** | **0.720** | **0.142** | **2.1 ms** | 2026-06-15 |

---

## 2. Statistical Validation & Diagnostic Charts ([ValidationCharts.tsx](file:///c:/PROJECTS/Datasphere/Multi-Agent%20Data%20Analyst%20for%20Enterprise%20Decision%20Support/frontend/src/features/models/components/ValidationCharts.tsx))

### A. ROC-AUC Performance Curve
* **Visual Type**: Apache ECharts Receiver Operating Characteristic (ROC) curve with random baseline line.
* **Area Under Curve**: `0.942` (High discriminatory power across true positive and false positive trade-offs).

### B. Precision-Recall (PR) Curve
* **Visual Type**: PR Curve optimized for imbalanced dataset distributions ($12.4\%$ positive breach rate).
* **Average Precision (AP)**: `0.891`.

### C. Interactive Confusion Matrix & Cutoff Slider
* **Interactive Cutoff Slider**: Adjusts decision threshold from $0.00 \to 1.00$ (Default: $0.50$).
* **Dynamic Contingency Table**:
  * **True Positives (TP)**: `4,420` (Breaches correctly intercepted).
  * **True Negatives (TN)**: `34,180` (On-time deliveries approved).
  * **False Positives (FP)**: `820` (Unnecessary false alarms).
  * **False Negatives (FN)**: `580` (Missed breaches).

---

## 3. Hyperparameter Architecture Inspector ([HyperparametersCard.tsx](file:///c:/PROJECTS/Datasphere/Multi-Agent%20Data%20Analyst%20for%20Enterprise%20Decision%20Support/frontend/src/features/models/components/HyperparametersCard.tsx))
* `learning_rate`: `0.035`
* `num_leaves`: `64`
* `max_depth`: `8`
* `feature_fraction`: `0.80` (Subsample ratio)
* `min_data_in_leaf`: `40`
* `l1_regularization`: `0.15`
* `l2_regularization`: `0.85`

---

## 4. Live Real-Time Inference Playground ([PredictionPlayground.tsx](file:///c:/PROJECTS/Datasphere/Multi-Agent%20Data%20Analyst%20for%20Enterprise%20Decision%20Support/frontend/src/features/models/components/PredictionPlayground.tsx))
* **Interactive Payload Editor**: Allows ML engineers to input real-time feature values:
  * Distance: `620 km`
  * Weight: `14.5 kg`
  * Historical Carrier Breach Rate: `24.0%`
  * Weather Severity: `7.5 / 10`
* **Instant Output**:
  * **Breach Probability**: `76.4%` (Rose - High Risk).
  * **Inference Latency**: `6.8 ms`.
  * **Model Hash Signature**: `sha256:4f8a9e...`
