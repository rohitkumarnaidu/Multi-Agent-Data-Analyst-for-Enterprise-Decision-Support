# Phase 5A: Baseline Model Development
## DATASPHERE 26: Multi-Agent Data Analyst for Enterprise Decision Support

### Overview
This directory contains the complete baseline machine learning models, benchmark metrics, leaderboards, feature importances, and serialization registry produced in **Phase 5A**.

### Directory Structure
```
phase5/baseline_models/
├── leaderboard.csv                  # Official model ranking table
├── model_metrics.csv                # Complete metric matrix for all 9 models
├── training_times.csv               # Training resource consumption metrics
├── inference_times.csv              # Inference latency & throughput benchmarks
├── imbalance_comparison_metrics.csv # Class imbalance strategy evaluation
├── model_registry.json              # Machine-readable model metadata registry
├── Baseline_Model_Report.md         # Comprehensive executive baseline report
├── Model_Comparison_Report.md       # Multi-dimensional model comparison
├── Leaderboard_Report.md            # Leaderboard standings report
├── Training_Report.md               # Resource consumption & reproducibility audit
├── Performance_Report.md            # Production inference SLA compliance
├── metric_comparison.png            # Visual metric comparison bar chart
├── training_time_comparison.png     # Training time comparison bar chart
├── inference_time_comparison.png    # Inference throughput comparison bar chart
├── all_roc_curves.png               # Combined ROC curves plot
├── all_pr_curves.png                # Combined Precision-Recall curves plot
├── all_calibration_curves.png       # Combined Calibration reliability curves
├── all_confusion_matrices_grid.png  # 3x3 confusion matrix grid plot
├── confusion_matrices/              # Individual confusion matrix plots
├── roc_curves/                      # Individual ROC curve plots
├── pr_curves/                       # Individual PR curve plots
├── calibration_curves/              # Individual calibration plots
├── classification_reports/          # Detailed text classification reports
├── feature_importance/              # Top 10, Top 20, Top 35 feature importance CSVs & plots
└── predictions/                     # Validation, Test, and Train prediction CSVs
```

### Models Evaluated
1. `Logistic_Regression`
2. `Decision_Tree`
3. `Random_Forest`
4. `Extra_Trees`
5. `XGBoost`
6. `LightGBM`
7. `CatBoost`
8. `HistGradientBoosting`
9. `Naive_Bayes`
