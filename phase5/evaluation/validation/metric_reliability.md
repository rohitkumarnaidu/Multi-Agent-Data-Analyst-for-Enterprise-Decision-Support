# Metric Reliability Report — Phase 5D.1
**Generated:** 2026-08-08 04:19:30

---

## 1. The Class Imbalance Problem

```
Dataset:         200,000 rows
Positive class:  1 sample (0.0005%)
Negative class:  199,999 samples (99.9995%)
Imbalance Ratio: 199,999:1
```

This represents one of the **most extreme class imbalance scenarios** possible in binary classification.
The following analysis explains how each standard metric behaves under this condition.

---

## 2. Metric-by-Metric Reliability Analysis

### ✅ Accuracy — UNRELIABLE UNDER THIS IMBALANCE

| Property | Assessment |
|---|---|
| Formula | (TP + TN) / N |
| Behavior with 0.0005% positive rate | A model predicting ALL-ZERO achieves 99.9993% accuracy |
| Observed in Phase 5D | Models achieved 99.99%–100% accuracy, including the all-zero predictor |
| Reliability for this dataset | ❌ MISLEADING — does not reflect breach detection ability |
| Alternative | Use Balanced Accuracy or MCC instead |

### ✅ Balanced Accuracy — MORE RELIABLE

| Property | Assessment |
|---|---|
| Formula | (TPR + TNR) / 2 |
| Behavior | Averages sensitivity and specificity equally |
| With 0 positives in test set | Undefined (TPR = TP/FP+FN = 0/0) — reduces to TNR/2 |
| With 1 positive in train | Partially meaningful — sensitive to that single positive |
| Reliability | ⚠️ LIMITED — heavily dependent on the single positive |

### ✅ Precision — UNRELIABLE (division by zero risk)

| Property | Assessment |
|---|---|
| Formula | TP / (TP + FP) |
| Behavior | Undefined if model never predicts positive (TP=FP=0) |
| Observed | Precision = 0 for models that predict all-zero |
| Reliability | ❌ UNDEFINED when no positives predicted |

### ⚠️ Recall (Sensitivity / TPR) — UNRELIABLE

| Property | Assessment |
|---|---|
| Formula | TP / (TP + FN) |
| Behavior | Requires at least 1 true positive to be meaningful |
| With 1 positive | Binary: either 0.0 (missed) or 1.0 (caught) |
| Reliability | ⚠️ BINARY — not a continuous signal with n=1 |

### ❌ F1 Score — UNRELIABLE

| Property | Assessment |
|---|---|
| Formula | 2 × (Precision × Recall) / (Precision + Recall) |
| With 1 positive | Either 0.0 or a small fraction depending on FP rate |
| Observed in Phase 5D | F1 = 0.0 for ALL models (the single positive was predicted as 0) |
| Reliability | ❌ NOT RELIABLE — degenerate with n_positives=1 |
| Alternative | Use MCC or cost-sensitive loss |

### ✅ ROC-AUC — PARTIALLY RELIABLE

| Property | Assessment |
|---|---|
| Formula | Area under TPR vs FPR curve |
| Behavior | Requires at least 1 positive and 1 negative |
| With 1 positive | Computed — but has extremely high variance |
| Observed | AUC range: 0.37–0.70 (high variance expected) |
| Statistical note | With n_pos=1, AUC = P(model ranks positive above random negative) |
| Reliability | ⚠️ COMPUTABLE but HIGH VARIANCE — 95% CI would be very wide |

### ❌ PR-AUC (Average Precision) — UNRELIABLE

| Property | Assessment |
|---|---|
| Formula | Area under Precision-Recall curve |
| Behavior | Heavily influenced by class imbalance |
| Baseline for random classifier | = positive rate = 0.0007% (effectively 0) |
| With 1 positive | Extremely noisy — any FP dramatically changes precision |
| Reliability | ❌ NOT RELIABLE with n_positives=1 |

### ✅ MCC (Matthews Correlation Coefficient) — MOST RELIABLE

| Property | Assessment |
|---|---|
| Formula | (TP×TN − FP×FN) / √[(TP+FP)(TP+FN)(TN+FP)(TN+FN)] |
| Behavior | Accounts for all four confusion matrix quadrants equally |
| With extreme imbalance | More robust than F1 or accuracy |
| With 1 positive | Still computable — but limited by small n_pos |
| Reliability | ✅ BEST metric for this scenario — use as primary metric |
| Observed | Values near 0.0 (as expected — models essentially predict majority class) |

### ✅ Brier Score — RELIABLE

| Property | Assessment |
|---|---|
| Formula | Mean squared error of probability predictions |
| Behavior | Well-defined regardless of class balance |
| Interpretation | Lower = better calibrated probabilities |
| Reliability | ✅ RELIABLE — does not require positives to compute |
| Limitation | Near-zero positive rate means models can minimize Brier by predicting ~0 always |

### ✅ Cohen's Kappa — PARTIALLY RELIABLE

| Property | Assessment |
|---|---|
| Formula | (Observed accuracy − Expected accuracy) / (1 − Expected accuracy) |
| Behavior | Adjusts for chance agreement |
| With extreme imbalance | Expected accuracy ≈ 1.0, so Kappa ≈ 0 for all models |
| Reliability | ⚠️ COMPUTABLE but degenerate with near-perfect expected accuracy |

### ✅ Log Loss — RELIABLE (for probability quality)

| Property | Assessment |
|---|---|
| Formula | −[y·log(p) + (1−y)·log(1−p)] |
| Behavior | Penalizes overconfident wrong predictions |
| Reliability | ✅ RELIABLE — well-defined for any n_pos ≥ 0 |
| Note | Low log-loss can be achieved by always predicting near-0 probability |

---

## 3. Summary Table

| Metric | Reliable Under 199,999:1 Imbalance | Reason |
|---|---|---|
| Accuracy | ❌ UNRELIABLE | Trivially maximized by all-zero predictor |
| Balanced Accuracy | ⚠️ LIMITED | Depends on single positive |
| Precision | ❌ UNRELIABLE | Undefined with n_pred_pos=0 |
| Recall | ⚠️ LIMITED | Binary signal with n_pos=1 |
| F1 Score | ❌ UNRELIABLE | Degenerate with n_pos=1 |
| ROC-AUC | ⚠️ COMPUTABLE, HIGH VARIANCE | Wide CI with single positive |
| PR-AUC | ❌ UNRELIABLE | Baseline = 0.0007%; noisy |
| MCC | ✅ MOST RELIABLE | Balanced quadrant accounting |
| Brier Score | ✅ RELIABLE | Probability-based, class-agnostic |
| Log Loss | ✅ RELIABLE | Probability-based, class-agnostic |
| Cohen's Kappa | ⚠️ DEGENERATE | Expected accuracy ≈ 1.0 |

---

## 4. Recommended Primary Metrics for This Dataset

1. **MCC (Matthews Correlation Coefficient)** — primary ranking metric
2. **Brier Score** — calibration quality
3. **ROC-AUC** — discriminative ability (with wide CI caveat)
4. **Business Cost (FP×$50 + FN×$500)** — operational decision metric
5. **Threshold-optimized Recall** — at operationally meaningful threshold

---

## 5. Metric Reliability Verdict

> **Most Phase 5D metrics are technically computable but should be interpreted with caution.**
> The Phase 5D evaluation correctly identified the class imbalance and documented it.
> The **composite leaderboard** and **MCC** are the most valid ranking signals.
> Accuracy figures should NOT be cited as evidence of strong breach detection capability.
