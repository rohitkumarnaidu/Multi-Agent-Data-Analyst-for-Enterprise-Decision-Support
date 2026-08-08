# ENTERPRISE MODEL LEADERBOARD REPORT
## PHASE 5A – BASELINE STANDINGS
### DATASPHERE 26: Multi-Agent Data Analyst for Enterprise Decision Support

---

### Official Leaderboard Rankings

| Rank | Model Architecture | Algorithm Family | Train ROC-AUC | Val Accuracy | Val Balanced Acc | Val Latency (ms) | Inference Speed (samples/s) | Status |
|---|---|---|---|---|---|---|---|---|
| **#1** | **Decision_Tree** | Single Decision Tree | 1.0000 | 100.00% | 100.00% | 0.00019 ms | 5,133,118.9 | 🟢 Baseline Validated |
| **#2** | **CatBoost** | Oblivious Decision Trees | 1.0000 | 100.00% | 100.00% | 0.00070 ms | 1,431,523.1 | 🟢 Baseline Validated |
| **#3** | **Naive_Bayes** | Bayesian Classifier | 1.0000 | 100.00% | 100.00% | 0.00124 ms | 806,211.0 | 🟢 Baseline Validated |
| **#4** | **Extra_Trees** | Randomized Ensembles | 1.0000 | 100.00% | 100.00% | 0.00295 ms | 338,919.5 | 🟢 Baseline Validated |
| **#5** | **Random_Forest** | Random Forests | 1.0000 | 100.00% | 100.00% | 0.00325 ms | 307,826.5 | 🟢 Baseline Validated |
| **#6** | **Logistic_Regression** | Generalized Linear Model | 0.9993 | 100.00% | 100.00% | 0.00011 ms | 9,117,155.5 | 🟢 Baseline Validated |
| **#7** | **XGBoost** | Extreme Gradient Boosting | 0.5000 | 100.00% | 100.00% | 0.00038 ms | 2,609,104.0 | 🟢 Baseline Validated |
| **#8** | **HistGradientBoosting** | Scikit-Learn Native GBDT | 0.4037 | 91.95% | 91.95% | 0.00104 ms | 962,488.6 | 🟢 Baseline Validated |
| **#9** | **LightGBM** | Histogram GBDT | 0.4024 | 91.83% | 91.83% | 0.00055 ms | 1,819,692.7 | 🟢 Baseline Validated |

---

### Ranking Criteria
1. **Primary**: Train ROC-AUC & Discriminative Probability Quality
2. **Secondary**: Validation Accuracy & F1-Score
3. **Third**: Balanced Accuracy across class boundaries
4. **Fourth**: Inference Throughput (samples/sec) and Latency
