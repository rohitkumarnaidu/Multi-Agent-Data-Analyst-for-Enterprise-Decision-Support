import os
import json
import pandas as pd
import numpy as np

def verify_phase5a():
    print("=" * 70)
    print("ENTERPRISE QA & SECURITY AUDIT: PHASE 5A VERIFICATION SUITE")
    print("=" * 70)
    
    base_dir = "phase5/baseline_models"
    checks = []
    
    # 1. Required Files Existence
    req_files = [
        "leaderboard.csv",
        "model_metrics.csv",
        "training_times.csv",
        "inference_times.csv",
        "imbalance_comparison_metrics.csv",
        "model_registry.json",
        "Baseline_Model_Report.md",
        "Model_Comparison_Report.md",
        "Leaderboard_Report.md",
        "Training_Report.md",
        "Performance_Report.md",
        "README.md",
        "metric_comparison.png",
        "training_time_comparison.png",
        "inference_time_comparison.png",
        "all_roc_curves.png",
        "all_pr_curves.png",
        "all_calibration_curves.png",
        "all_confusion_matrices_grid.png"
    ]
    
    missing_files = [f for f in req_files if not os.path.exists(os.path.join(base_dir, f))]
    checks.append(("Required Root Files", len(missing_files) == 0, f"Missing: {missing_files}"))
    
    # 2. Required Subdirectories
    subdirs = [
        "confusion_matrices",
        "roc_curves",
        "pr_curves",
        "calibration_curves",
        "classification_reports",
        "feature_importance",
        "predictions"
    ]
    missing_subdirs = [d for d in subdirs if not os.path.isdir(os.path.join(base_dir, d))]
    checks.append(("Required Subdirectories", len(missing_subdirs) == 0, f"Missing: {missing_subdirs}"))
    
    # 3. Model Count in Registry & Leaderboard
    models = [
        "Logistic_Regression", "Decision_Tree", "Random_Forest",
        "Extra_Trees", "XGBoost", "LightGBM", "CatBoost",
        "HistGradientBoosting", "Naive_Bayes"
    ]
    
    leaderboard_df = pd.read_csv(os.path.join(base_dir, "leaderboard.csv"))
    metrics_df = pd.read_csv(os.path.join(base_dir, "model_metrics.csv"))
    with open(os.path.join(base_dir, "model_registry.json"), 'r') as f:
        registry = json.load(f)
        
    checks.append(("Leaderboard Model Count (9/9)", len(leaderboard_df) == 9, f"Found {len(leaderboard_df)}"))
    checks.append(("Metrics Table Model Count (9/9)", len(metrics_df) == 9, f"Found {len(metrics_df)}"))
    checks.append(("Model Registry Entry Count (9/9)", len(registry) == 9, f"Found {len(registry)}"))
    
    # 4. Predictions Shape & Integrity
    val_pred_df = pd.read_csv(os.path.join(base_dir, "predictions", "val_predictions.csv"))
    test_pred_df = pd.read_csv(os.path.join(base_dir, "predictions", "test_predictions.csv"))
    
    checks.append(("Val Predictions Rows (30,000)", val_pred_df.shape[0] == 30000, f"Shape: {val_pred_df.shape}"))
    checks.append(("Test Predictions Rows (30,000)", test_pred_df.shape[0] == 30000, f"Shape: {test_pred_df.shape}"))
    checks.append(("Val Predictions Zero-Null", val_pred_df.isnull().sum().sum() == 0, f"Null count: {val_pred_df.isnull().sum().sum()}"))
    checks.append(("Test Predictions Zero-Null", test_pred_df.isnull().sum().sum() == 0, f"Null count: {test_pred_df.isnull().sum().sum()}"))
    
    # 5. Feature Importance Completeness
    fi_top10 = pd.read_csv(os.path.join(base_dir, "feature_importance", "feature_importance_top10.csv"))
    fi_top20 = pd.read_csv(os.path.join(base_dir, "feature_importance", "feature_importance_top20.csv"))
    fi_top35 = pd.read_csv(os.path.join(base_dir, "feature_importance", "feature_importance_top35.csv"))
    
    checks.append(("Feature Importance Top 10", len(fi_top10) == 10, f"Rows: {len(fi_top10)}"))
    checks.append(("Feature Importance Top 20", len(fi_top20) == 20, f"Rows: {len(fi_top20)}"))
    checks.append(("Feature Importance Top 35 (34 Features)", len(fi_top35) == 34, f"Rows: {len(fi_top35)}"))
    
    # Print Results
    all_passed = True
    print("\nAudit Assertions:")
    for name, passed, details in checks:
        status = "[PASS]" if passed else "[FAIL]"
        if not passed:
            all_passed = False
        print(f"  {status} {name.ljust(40)}: {details}")
        
    print("\n" + "=" * 70)
    if all_passed:
        print("PHASE 5A VERIFICATION STATUS: [PASS] ALL AUDIT CHECKS PASSED (100%)")
    else:
        print("PHASE 5A VERIFICATION STATUS: [FAIL] AUDIT FAILED")
    print("=" * 70)

if __name__ == "__main__":
    verify_phase5a()
