# TRAINING REPORT & RESOURCE PROFILING
## PHASE 5A – COMPUTATIONAL AUDIT
### DATASPHERE 26: Multi-Agent Data Analyst for Enterprise Decision Support

---

### 1. Training Environment & Resource Consumption

| Model Architecture | Training Time (s) | Training Throughput (rows/s) | Peak Memory Usage (MB) | Samples Trained | Status |
|---|---|---|---|---|---|
| **Logistic_Regression** | 0.1090s | 1,284,047.9 rows/s | 4.45 MB | 140,000 | 🟢 PASS |
| **Decision_Tree** | 0.2808s | 498,625.0 rows/s | 25.78 MB | 140,000 | 🟢 PASS |
| **Random_Forest** | 1.2929s | 108,280.6 rows/s | 158.92 MB | 140,000 | 🟢 PASS |
| **Extra_Trees** | 0.9321s | 150,204.0 rows/s | 116.64 MB | 140,000 | 🟢 PASS |
| **XGBoost** | 2.5016s | 55,964.7 rows/s | 1.07 MB | 140,000 | 🟢 PASS |
| **LightGBM** | 0.4362s | 320,955.4 rows/s | 2.76 MB | 140,000 | 🟢 PASS |
| **CatBoost** | 2.3028s | 60,795.9 rows/s | 1.61 MB | 140,000 | 🟢 PASS |
| **HistGradientBoosting** | 1.9683s | 71,126.1 rows/s | 25.47 MB | 140,000 | 🟢 PASS |
| **Naive_Bayes** | 0.0663s | 2,111,814.5 rows/s | 72.83 MB | 140,000 | 🟢 PASS |

---

### 2. Training Integrity & Reproducibility
- **Random Seed**: `random_state = 42` enforced uniformly across all algorithms.
- **Dataset Partitioning**: 140,000 train rows (70.0%), 30,000 val rows (15.0%), 30,000 test rows (15.0%).
- **Data Leakage Check**: Preprocessing `ColumnTransformer` fit strictly on `production_train.csv` and transformed out-of-sample on validation and test sets.
- **Imbalance Benchmark**: Evaluated Class Weighting and Oversampling strategies in `imbalance_comparison_metrics.csv` without modifying primary baselines.
