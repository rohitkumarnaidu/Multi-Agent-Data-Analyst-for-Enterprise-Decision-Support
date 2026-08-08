# Enterprise Recommendations — Phase 5D.1
**Generated:** 2026-08-08 04:19:30

> **IMPORTANT:** These are RECOMMENDATIONS ONLY.  
> No implementation is performed in this phase.  
> Implementation is subject to separate governance approval.

---

## Root Problem

The enterprise evaluation is fundamentally limited by:
1. **Only 1 positive sample** in a 200,000-row dataset
2. **No positive samples** in the held-out validation and test sets
3. Models trained to minimize loss on a **199,999:1 imbalanced** target

Without addressing this, evaluation metrics remain unreliable and production deployment carries significant unquantified risk.

---

## Recommendation 1: Repeated Stratified K-Fold Cross-Validation

**What:** Replace single train/val/test split with 5×2 or 10-fold stratified CV  
**Why:** With only 1 positive, each fold would still have at most 1 positive — but averaging across folds provides more stable AUC estimates  
**Benefit:** Reduces variance in AUC estimates; provides mean ± std per metric  
**Implementation note:** Use `StratifiedKFold(n_splits=5, shuffle=True)` with `roc_auc_score`  
**Priority:** HIGH

---

## Recommendation 2: Bootstrap Evaluation (Already Partially Done)

**What:** 200+ iteration bootstrap on all available positives  
**Why:** With n=1 positive, bootstrap variance quantifies uncertainty in AUC estimates  
**Current status:** 50-iter bootstrap completed in Phase 5D — **extend to 1,000 iterations**  
**Expected output:** 95% CI on AUC: [lower, upper] for each model  
**Priority:** MEDIUM

---

## Recommendation 3: Cost-Sensitive Threshold Optimization

**What:** Find threshold `t*` that minimizes total business cost:  
```
Cost(t) = FP(t) × $50 + FN(t) × $500
t* = argmin Cost(t)
```
**Why:** Default threshold of 0.50 causes 100% miss rate on the current dataset  
**Recommended approach:** Sweep t from 0.001 to 0.50 in steps of 0.001  
**Expected outcome:** Threshold much lower than 0.50 (likely 0.01–0.05)  
**Priority:** CRITICAL — should be done BEFORE deployment

---

## Recommendation 4: Probability Calibration (Platt Scaling / Isotonic)

**What:** Apply calibration to all model probability outputs  
**Why:** Models trained with extreme imbalance output probabilities biased toward 0  
**Method:** Use `sklearn.calibration.CalibratedClassifierCV` (Platt or isotonic)  
**Benefit:** Better-calibrated probabilities → more reliable threshold selection  
**Requirement:** Needs a holdout calibration set with positive samples  
**Priority:** HIGH (after data collection — see Rec 7)

---

## Recommendation 5: Class Weight Adjustment

**What:** Retrain models with `class_weight='balanced'` or custom ratio  
**Balanced weight formula:**
```
w_positive = n_total / (2 × n_positive) = 200,000 / 2 = 100,000
w_negative = n_total / (2 × n_negative) ≈ 1.0
```
**Why:** Forces the model to penalize FN (missed breaches) 100,000× more  
**Models supporting this:** Logistic Regression, Decision Tree, Random Forest, XGBoost (scale_pos_weight), LightGBM (is_unbalance)  
**Priority:** HIGH — re-evaluate after retraining

> **NOTE:** This requires model retraining — must go through Phase 5A/5B governance approval.

---

## Recommendation 6: Balanced Evaluation Metrics (Immediate — No Retraining)

**What:** Replace Accuracy with MCC + Business Cost as primary reporting metrics  
**Metrics to mandate:**
- MCC (Matthews Correlation Coefficient)
- Business Cost = FP×$50 + FN×$500
- Threshold-optimized Recall
- Brier Score
- ROC-AUC (with CI)

**Metrics to REMOVE from executive reports:**
- Raw Accuracy (misleading)
- F1 at threshold=0.50 (degenerate)
- Precision at threshold=0.50 (often undefined)

**Priority:** CRITICAL — implement in next reporting cycle

---

## Recommendation 7: Data Collection — Positive Class Enrichment

**What:** Collect additional labeled SLA breach instances  
**Target:** Minimum 100 confirmed breach records for reliable metric computation  
**Sources:** Historical SLA breach logs, operational incident tickets, manual audit flags  
**Why:** All other recommendations are limited by the single positive sample  
**Expected metric improvement:**
- F1: From undefined → computable
- PR-AUC: From meaningless → actionable
- Calibration: From biased → reliable
- Stratified CV: From infeasible → meaningful

**Priority:** CRITICAL — this is the root cause of all evaluation limitations

---

## Recommendation 8: SMOTE / Oversampling (Conditional)

**What:** Synthetic Minority Oversampling Technique  
**Condition:** Only apply if and when ≥ 5 real positive samples are collected (Rec 7)  
**SMOTE variants to consider:** SMOTE, ADASYN, BorderlineSMOTE  
**Caution:** SMOTE on 1 sample generates identical copies — not meaningful  
**Priority:** LOW — contingent on Rec 7

---

## Recommendation 9: Focal Loss (Conditional)

**What:** Replace cross-entropy loss with Focal Loss (Lin et al., 2017) for deep/boosting models  
**Formula:** FL(p) = −α(1−p)^γ × log(p), where γ > 0 down-weights easy negatives  
**Suitable for:** XGBoost (custom objective), LightGBM (custom objective), PyTorch models  
**Why:** Specifically designed for extreme class imbalance scenarios  
**When to apply:** After data collection (Rec 7) and if standard class weighting (Rec 5) is insufficient  
**Priority:** LOW — advanced technique

---

## Recommendation 10: Live Monitoring Pipeline

**What:** Deploy prediction monitoring alongside the model  
**Monitor:**
1. Daily predicted positive rate (alert if 0% for >7 consecutive days)  
2. Weekly SLA breach rate from operational logs vs model predictions  
3. Monthly AUC re-estimation on any new labeled data  
4. Quarterly full model re-evaluation via Phase 5D re-run  

**Priority:** HIGH — deploy simultaneously with model

---

## Priority Summary

| Priority | Recommendation | Can Do Now | Requires Retraining |
|---|---|---|---|
| 🔴 CRITICAL | Rec 7: Collect more positive data | No — ops effort | No |
| 🔴 CRITICAL | Rec 3: Cost-based threshold | Yes | No |
| 🔴 CRITICAL | Rec 6: Replace Accuracy with MCC | Yes | No |
| 🟠 HIGH | Rec 5: Class weight retraining | No | Yes |
| 🟠 HIGH | Rec 10: Live monitoring | Yes | No |
| 🟠 HIGH | Rec 4: Calibration | Partial | Partial |
| 🟡 MEDIUM | Rec 1: Stratified K-Fold | No — needs positives | Yes |
| 🟡 MEDIUM | Rec 2: Extended bootstrap | Yes | No |
| 🟢 LOW | Rec 8: SMOTE | No — needs positives | Yes |
| 🟢 LOW | Rec 9: Focal Loss | No — needs positives | Yes |
