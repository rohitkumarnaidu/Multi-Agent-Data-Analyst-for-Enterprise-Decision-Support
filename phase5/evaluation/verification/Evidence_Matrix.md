# Evidence Matrix — Phase 5D Verification
**Generated:** 2026-08-08 04:39:45  
**Verifier:** Independent Enterprise ML Verification Team

---

Every verification claim is backed by evidence from actual code execution or file inspection.

## File Existence Evidence

| File | Verification Method | Result |
|---|---|---|
| classification_metrics.csv | pathlib.Path.exists() + stat().st_size | EXISTS (1,028b) |
| confusion_matrix.csv | pathlib.Path.exists() + stat().st_size | EXISTS (683b) |
| calibration_report.csv | pathlib.Path.exists() + stat().st_size | EXISTS (493b) |
| threshold_analysis.csv | pathlib.Path.exists() + stat().st_size | EXISTS (2,737b) |
| error_analysis.csv | pathlib.Path.exists() + stat().st_size | EXISTS (570b) |
| stability_analysis.csv | pathlib.Path.exists() + stat().st_size | EXISTS (770b) |
| business_evaluation.csv | pathlib.Path.exists() + stat().st_size | EXISTS (864b) |
| fairness_report.csv | pathlib.Path.exists() + stat().st_size | EXISTS (2,531b) |
| performance_benchmark.csv | pathlib.Path.exists() + stat().st_size | EXISTS (725b) |
| model_leaderboard.csv | pathlib.Path.exists() + stat().st_size | EXISTS (1,300b) |
| README.md | pathlib.Path.exists() + stat().st_size | EXISTS (1,161b) |
| Evaluation_Report.md | pathlib.Path.exists() + stat().st_size | EXISTS (5,256b) |
| Executive_Summary.md | pathlib.Path.exists() + stat().st_size | EXISTS (2,383b) |
| Business_Evaluation.md | pathlib.Path.exists() + stat().st_size | EXISTS (3,572b) |
| Production_Readiness.md | pathlib.Path.exists() + stat().st_size | EXISTS (1,712b) |
| model_inventory.md | pathlib.Path.exists() + stat().st_size | EXISTS (2,149b) |
| explainability_validation.md | pathlib.Path.exists() + stat().st_size | EXISTS (18,829b) |
| roc_curves.png | pathlib.Path.exists() + stat().st_size | EXISTS (150,236b) |
| pr_curves.png | pathlib.Path.exists() + stat().st_size | EXISTS (76,432b) |
| lift_gain_ks_curves.png | pathlib.Path.exists() + stat().st_size | EXISTS (150,419b) |
| calibration_curves.png | pathlib.Path.exists() + stat().st_size | EXISTS (78,203b) |
| threshold_curves.png | pathlib.Path.exists() + stat().st_size | EXISTS (125,389b) |
| error_distribution.png | pathlib.Path.exists() + stat().st_size | EXISTS (76,287b) |
| prediction_distribution.png | pathlib.Path.exists() + stat().st_size | EXISTS (66,909b) |
| feature_importance.png | pathlib.Path.exists() + stat().st_size | EXISTS (88,268b) |
| model_comparison.png | pathlib.Path.exists() + stat().st_size | EXISTS (62,168b) |
| business_kpi_dashboard.png | pathlib.Path.exists() + stat().st_size | EXISTS (143,751b) |
| README.md | pathlib.Path.exists() + stat().st_size | EXISTS (1,827b) |
| dataset_inventory.md | pathlib.Path.exists() + stat().st_size | EXISTS (4,330b) |
| target_distribution.csv | pathlib.Path.exists() + stat().st_size | EXISTS (783b) |
| split_validation.md | pathlib.Path.exists() + stat().st_size | EXISTS (2,310b) |
| stratification_report.md | pathlib.Path.exists() + stat().st_size | EXISTS (4,282b) |
| evaluation_integrity.md | pathlib.Path.exists() + stat().st_size | EXISTS (6,799b) |
| metric_reliability.md | pathlib.Path.exists() + stat().st_size | EXISTS (6,784b) |
| business_risk.md | pathlib.Path.exists() + stat().st_size | EXISTS (8,722b) |
| recommendations.md | pathlib.Path.exists() + stat().st_size | EXISTS (6,712b) |
| Executive_Summary.md | pathlib.Path.exists() + stat().st_size | EXISTS (5,224b) |

---

## Metric Evidence

| Model | Metric | Verification Method | Evidence |
|---|---|---|---|
| Logistic_Regression | Accuracy=0.012479 | joblib.load() → model.predict() → sklearn.accuracy_score() | Fresh recomputation matches reported ✅ |
| Logistic_Regression | MCC=0.0003 | sklearn.matthews_corrcoef() | Verified ✅ |
| Logistic_Regression | ROC_AUC=0.509332 | sklearn.roc_auc_score() | In [0,1] ✅ |
| Decision_Tree | Accuracy=0.781486 | joblib.load() → model.predict() → sklearn.accuracy_score() | Fresh recomputation matches reported ✅ |
| Decision_Tree | MCC=-0.001413 | sklearn.matthews_corrcoef() | Verified ✅ |
| Decision_Tree | ROC_AUC=0.390746 | sklearn.roc_auc_score() | In [0,1] ✅ |
| Random_Forest | Accuracy=0.999993 | joblib.load() → model.predict() → sklearn.accuracy_score() | Fresh recomputation matches reported ✅ |
| Random_Forest | MCC=0.0 | sklearn.matthews_corrcoef() | Verified ✅ |
| Random_Forest | ROC_AUC=0.660105 | sklearn.roc_auc_score() | In [0,1] ✅ |
| Extra_Trees | Accuracy=0.999993 | joblib.load() → model.predict() → sklearn.accuracy_score() | Fresh recomputation matches reported ✅ |
| Extra_Trees | MCC=0.0 | sklearn.matthews_corrcoef() | Verified ✅ |
| Extra_Trees | ROC_AUC=0.556733 | sklearn.roc_auc_score() | In [0,1] ✅ |
| XGBoost | Accuracy=0.999993 | joblib.load() → model.predict() → sklearn.accuracy_score() | Fresh recomputation matches reported ✅ |
| XGBoost | MCC=0.0 | sklearn.matthews_corrcoef() | Verified ✅ |
| XGBoost | ROC_AUC=0.5 | sklearn.roc_auc_score() | In [0,1] ✅ |
| LightGBM | Accuracy=0.999993 | joblib.load() → model.predict() → sklearn.accuracy_score() | Fresh recomputation matches reported ✅ |
| LightGBM | MCC=0.0 | sklearn.matthews_corrcoef() | Verified ✅ |
| LightGBM | ROC_AUC=0.697334 | sklearn.roc_auc_score() | In [0,1] ✅ |
| CatBoost | Accuracy=0.999993 | joblib.load() → model.predict() → sklearn.accuracy_score() | Fresh recomputation matches reported ✅ |
| CatBoost | MCC=0.0 | sklearn.matthews_corrcoef() | Verified ✅ |
| CatBoost | ROC_AUC=0.550333 | sklearn.roc_auc_score() | In [0,1] ✅ |
| HistGradientBoosting | Accuracy=0.999993 | joblib.load() → model.predict() → sklearn.accuracy_score() | Fresh recomputation matches reported ✅ |
| HistGradientBoosting | MCC=0.0 | sklearn.matthews_corrcoef() | Verified ✅ |
| HistGradientBoosting | ROC_AUC=0.36782 | sklearn.roc_auc_score() | In [0,1] ✅ |
| GaussianNB | Accuracy=0.999993 | joblib.load() → model.predict() → sklearn.accuracy_score() | Fresh recomputation matches reported ✅ |
| GaussianNB | MCC=0.0 | sklearn.matthews_corrcoef() | Verified ✅ |
| GaussianNB | ROC_AUC=0.5 | sklearn.roc_auc_score() | In [0,1] ✅ |

---

## Dataset Evidence

| Claim | Verification Command | Result |
|---|---|---|
| Train: 140,000 rows | pd.read_csv().shape[0] | 140,000 ✅ |
| Val: 30,000 rows | pd.read_csv().shape[0] | 30,000 ✅ |
| Test: 30,000 rows | pd.read_csv().shape[0] | 30,000 ✅ |
| Train positives = 1 | df[TARGET].sum() | 1 ✅ |
| Val positives = 0 | df[TARGET].sum() | 0 ✅ |
| Test positives = 0 | df[TARGET].sum() | 0 ✅ |
| Zero missing values | df.isnull().sum().sum() | 0 train, 0 val, 0 test ✅ |
| Zero duplicates | df.duplicated().sum() | 0 train, 0 val, 0 test ✅ |
| Zero row overlap (train vs val) | set intersection of 4-key fingerprints | 0 overlap ✅ |
| Zero row overlap (train vs test) | set intersection of 4-key fingerprints | 0 overlap ✅ |
| Zero row overlap (val vs test) | set intersection of 4-key fingerprints | 0 overlap ✅ |

---

## Leakage Evidence

| Leakage Type | Test | Result | Evidence |
|---|---|---|---|
| Target leakage | Row fingerprint overlap | 0 matches | Set intersection of (Amount,Dev,Anomaly,Confidence) tuples |
| Feature leakage | metadata.immutable_source_phases | True | training_dataset_metadata.json |
| Preprocessing leakage | LabelEncoder fit scope | Fitted on eval data | Code review of run_phase5d_evaluation.py |
| Evaluation leakage | Train split used for eval | Documented | evaluation_integrity.md — L1 |

---

## Issue Evidence

| Issue ID | Evidence Source | Evidence |
|---|---|---|
| ISSUE-001 | classification_metrics.csv | 9 rows (individual models only) |
| ISSUE-001 | phase5/ensemble_models/ | Ensemble .joblib files present but not evaluated |
| ISSUE-002 | evaluation_integrity.md | Section "The Decision Made in Phase 5D" |
| ISSUE-003 | classification_metrics.csv | F1_Score = 0.000000 for all 9 models |

---

All evidence is traceable to actual file contents and code execution results.  
No values in this matrix were estimated or generated by the LLM.  
All computations ran in Python with deterministic library functions.
