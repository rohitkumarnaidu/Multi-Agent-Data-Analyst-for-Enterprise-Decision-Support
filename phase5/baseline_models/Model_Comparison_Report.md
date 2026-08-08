# MODEL COMPARISON REPORT
## PHASE 5A – ARCHITECTURAL BENCHMARK ANALYSIS
### DATASPHERE 26: Multi-Agent Data Analyst for Enterprise Decision Support

---

### 1. Multi-Dimensional Architecture Comparison

| Model Architecture | Model Family | Training Time (s) | Peak Memory (MB) | Val Latency (ms/sample) | Inference Speed (samples/sec) | Interpretability | Outlier Robustness |
|---|---|---|---|---|---|---|---|
| **Logistic_Regression** | Generalized Linear Model | 0.109s | 4.5 MB | 0.00011 ms | 9,117,155.5 | High (Linear/Tree) | High |
| **Decision_Tree** | Single Decision Tree | 0.281s | 25.8 MB | 0.00019 ms | 5,133,118.9 | High (Linear/Tree) | High |
| **Random_Forest** | Random Forests | 1.293s | 158.9 MB | 0.00325 ms | 307,826.5 | High (Linear/Tree) | High |
| **Extra_Trees** | Randomized Ensembles | 0.932s | 116.6 MB | 0.00295 ms | 338,919.5 | High (Linear/Tree) | High |
| **XGBoost** | Extreme Gradient Boosting | 2.502s | 1.1 MB | 0.00038 ms | 2,609,104.0 | High (Linear/Tree) | High |
| **LightGBM** | Histogram GBDT | 0.436s | 2.8 MB | 0.00055 ms | 1,819,692.7 | High (Linear/Tree) | High |
| **CatBoost** | Oblivious Decision Trees | 2.303s | 1.6 MB | 0.00070 ms | 1,431,523.1 | High (Linear/Tree) | High |
| **HistGradientBoosting** | Scikit-Learn Native GBDT | 1.968s | 25.5 MB | 0.00104 ms | 962,488.6 | High (Linear/Tree) | High |
| **Naive_Bayes** | Bayesian Classifier | 0.066s | 72.8 MB | 0.00124 ms | 806,211.0 | High (Linear/Tree) | High |

---

### 2. Algorithmic Family Trade-off Matrix

1. **Ensemble Tree Models (Random Forest & Extra Trees)**:
   - *Strengths*: Non-linear boundary capture, zero sensitivity to monotonic transformations, out-of-the-box feature importance.
   - *Considerations*: Higher memory footprint during training compared to linear baselines.

2. **Gradient Boosted Decision Trees (XGBoost, LightGBM, CatBoost, HistGB)**:
   - *Strengths*: State-of-the-art tabular accuracy, native histogram binning, rapid inference.
   - *Considerations*: Requires careful learning rate and regularization control in Phase 5B.

3. **Linear & Probabilistic Baselines (Logistic Regression & Naive Bayes)**:
   - *Strengths*: Ultra-low latency (<0.006 ms/sample), low memory overhead, straightforward coefficient interpretability.
   - *Considerations*: Assumes monotonic log-odds relationships.

---

### 3. Visual Artifacts
- Metric Comparison: `metric_comparison.png`
- Training Time Benchmark: `training_time_comparison.png`
- Inference Throughput Benchmark: `inference_time_comparison.png`
- Combined ROC Curves: `all_roc_curves.png`
- Combined PR Curves: `all_pr_curves.png`
- 3x3 Confusion Matrix Grid: `all_confusion_matrices_grid.png`
