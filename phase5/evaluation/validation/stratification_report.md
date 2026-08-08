# Stratification Review Report — Phase 5D.1
**Generated:** 2026-08-08 04:19:30

---

## 1. Target Variable Stratification

### Observed Distribution

| Split | Rows | Positives | Positive Rate | Has Positives |
|---|---|---|---|---|
| Train | 140,000 | **1** | 0.000714% | ✅ YES |
| Validation | 30,000 | **0** | 0.000000% | ❌ NO |
| Test | 30,000 | **0** | 0.000000% | ❌ NO |
| **Master** | **200,000** | **1** | **0.000500%** | ✅ YES |

### Was Stratified Splitting Applied to the Target?

**Evidence from VAL-007:**
> "Target class balance identical across train, val, and test splits — PASS"

**Independent Assessment:**  
The metadata test VAL-007 evaluates whether the 70/15/15 **row ratio** is preserved — not 
whether the **class ratio** is preserved. With only 1 positive in 200,000 rows, the test 
trivially passes because:
- Train has 0.000714% positives
- Val has 0.000000% positives  
- Test has 0.000000% positives
- All three are approximately equal to 0% ≈ 0.0005%

This is a **degenerate equality** — not meaningful target stratification.

### Why Target Stratification Was Mathematically Impossible

```
Global positive rate: p = 1 / 200,000 = 0.000005

For standard stratified split (70/15/15):
  Expected positives in train:      200,000 × 0.70 × 0.000005 = 0.70  ≈ 0 or 1
  Expected positives in validation: 200,000 × 0.15 × 0.000005 = 0.15  ≈ 0
  Expected positives in test:       200,000 × 0.15 × 0.000005 = 0.15  ≈ 0

With only 1 available positive, ANY split strategy assigns it to exactly one split.
True target-stratified splitting requires n_positives ≥ 3 (minimum: 1 per split).
Actual n_positives = 1. Target stratification is mathematically infeasible.
```

### Impact Rating: ⚠️ HIGH

The single positive sample landed in `production_train`. This means:
- Validation set: **cannot compute recall, F1, PR-AUC** (no true positives possible)
- Test set: **cannot compute recall, F1, PR-AUC** (no true positives possible)
- Train set: **only 1 positive** — recall/F1 computed on extremely sparse ground truth

---

## 2. Feature Distribution Alignment (Jensen-Shannon Divergence)

> JSD = 0: identical distributions | JSD = 1: maximally different  
> Threshold for alignment: JSD < 0.010

| Feature        |   JSD_Train_vs_Val |   JSD_Train_vs_Test |   JSD_Val_vs_Test |   Max_JSD | Aligned_(JSD<0.01)   |
|:---------------|-------------------:|--------------------:|------------------:|----------:|:---------------------|
| Risk_Level     |            4e-06   |             5e-06   |           3e-06   |   5e-06   | ✅ YES               |
| Department     |            2.6e-05 |             2.9e-05 |           4.3e-05 |   4.3e-05 | ✅ YES               |
| Business_Unit  |            9e-06   |             2.7e-05 |           1.6e-05 |   2.7e-05 | ✅ YES               |
| Region         |            1.2e-05 |             2e-06   |           1.4e-05 |   1.4e-05 | ✅ YES               |
| Priority_Level |            1.2e-05 |             3.1e-05 |           1.6e-05 |   3.1e-05 | ✅ YES               |

### Finding: Feature Distributions Fully Aligned ✅

All 5 key categorical features show Max JSD < 0.005 across all split pairs.  
The splits are representative random samples of the same underlying population.

---

## 3. Numerical Feature Alignment

| Feature | Train Mean ± Std | Val Mean ± Std | Test Mean ± Std | Drift |
|---|---|---|---|---|
| Transaction_Amount_USD | 23,144 ± 51,298 | 22,628 ± 46,331 | 23,197 ± 45,805 | ✅ Minimal |
| Anomaly_Score | 0.1999 ± 0.1207 | 0.2012 ± 0.1213 | 0.1989 ± 0.1205 | ✅ Minimal |
| Confidence_Score | 0.6606 ± 0.1120 | 0.6589 ± 0.1119 | 0.6598 ± 0.1120 | ✅ Minimal |
| Deviation_Percentage | 0.0114 ± 11.26 | -0.0355 ± 11.27 | -0.0077 ± 11.32 | ✅ Minimal |

---

## 4. Summary

| Stratification Check | Result |
|---|---|
| Row-count ratio (70/15/15) | ✅ PASS |
| Feature distribution alignment | ✅ PASS (all JSD < 0.005) |
| Numerical feature alignment | ✅ PASS |
| Target class stratification | ⚠️ INFEASIBLE — only 1 positive exists |
| Impact on evaluation splits | ⚠️ HIGH — addressed in evaluation_integrity.md |
