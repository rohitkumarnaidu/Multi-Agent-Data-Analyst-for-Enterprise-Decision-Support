# Dataset Verification Report — Phase 5D Verification
**Generated:** 2026-08-08 04:39:45  
**Verifier:** Independent Enterprise ML Verification Team  
**Mode:** ZERO TRUST — All values independently verified

---

## 1. Dataset File Verification

| File | Size (MB) | Rows | Columns | Status |
|---|---|---|---|---|
| production_train.csv | 41.26 | 140,000 | 35 | ✅ VERIFIED |
| production_validation.csv | 8.84 | 30,000 | 35 | ✅ VERIFIED |
| production_test.csv | 8.84 | 30,000 | 35 | ✅ VERIFIED |

**Verification method:** Files loaded via `pd.read_csv()` and shape confirmed.

---

## 2. Target Variable Verification

| Split | Rows Read | Positives Counted | Positive Rate | Claim in 5D.1 | Match |
|---|---|---|---|---|---|
| production_train.csv | 140,000 | 1 | 0.000714% | 0.000714% | ✅ MATCH |
| production_validation.csv | 30,000 | 0 | 0.000000% | 0.000000% | ✅ MATCH |
| production_test.csv | 30,000 | 0 | 0.000000% | 0.000000% | ✅ MATCH |

**Verification method:** `df[TARGET].sum()` and `df[TARGET].mean()` called fresh.

---

## 3. Schema Verification

| Check | Result |
|---|---|
| All 3 splits have 35 columns | ✅ CONFIRMED |
| Target column `SLA_Breached` present | ✅ CONFIRMED (col 35) |
| Feature count = 34 | ✅ CONFIRMED |
| Train == Val column names | ✅ IDENTICAL |
| Train == Test column names | ✅ IDENTICAL |

---

## 4. Data Quality Verification

| Check | Train | Validation | Test | Status |
|---|---|---|---|---|
| Missing values | 0 | 0 | 0 | ✅ VERIFIED (all 0) |
| Duplicate rows | 0 | 0 | 0 | ✅ VERIFIED (all 0) |
| NaN/Inf in numerics | 0 | 0 | 0 | ✅ VERIFIED |

---

## 5. Split Ratio Verification

| Split | Expected | Actual | Match |
|---|---|---|---|
| Train | 70% (140,000) | 140,000 | ✅ EXACT |
| Validation | 15% (30,000) | 30,000 | ✅ EXACT |
| Test | 15% (30,000) | 30,000 | ✅ EXACT |
| Total | 200,000 | 200,000 | ✅ EXACT |

---

## 6. Row Overlap Verification

| Pair | Overlapping Rows | Status |
|---|---|---|
| Train vs Validation | 0 | ✅ NO OVERLAP |
| Train vs Test | 0 | ✅ NO OVERLAP |
| Validation vs Test | 0 | ✅ NO OVERLAP |

**Verification method:** 4-key fingerprint (Transaction_Amount_USD, Deviation_Percentage, Anomaly_Score, Confidence_Score) rounded to 4 d.p.

---

## 7. Phase 5D.1 Target Distribution CSV Verification

Claimed values in `target_distribution.csv` vs independently computed:

| Split            | File                      |   Total_Rows |   Positive_Count_(SLA=1) |   Negative_Count_(SLA=0) | Positive_Pct   | Negative_Pct   | Imbalance_Ratio    | Has_Positive_Samples   | Sufficient_for_ROC_AUC   | Sufficient_for_PR_AUC   | Sufficient_for_F1   | Evaluable_for_Binary_Metrics   | Recommended_Action                             |
|:-----------------|:--------------------------|-------------:|-------------------------:|-------------------------:|:---------------|:---------------|:-------------------|:-----------------------|:-------------------------|:------------------------|:--------------------|:-------------------------------|:-----------------------------------------------|
| Train (70%)      | production_train.csv      |       140000 |                        1 |                   139999 | 0.000714%      | 99.999286%     | 139,999:1          | YES                    | YES (≥1)                 | YES (≥1)                | NO — only 1         | PARTIAL                        | Use for evaluation (only split with positives) |
| Validation (15%) | production_validation.csv |        30000 |                        0 |                    30000 | 0.000000%      | 100.000000%    | ∞:1 (no positives) | NO                     | NO — undefined           | NO — undefined          | NO — only 0         | NO                             | Cannot compute recall/F1/PR-AUC                |
| Test (15%)       | production_test.csv       |        30000 |                        0 |                    30000 | 0.000000%      | 100.000000%    | ∞:1 (no positives) | NO                     | NO — undefined           | NO — undefined          | NO — only 0         | NO                             | Cannot compute recall/F1/PR-AUC                |

**All values match independently computed statistics. ✅**

---

## Dataset Verification Verdict: **PASS** ✅

All dataset files exist, all row counts match, all quality checks pass,  
splits are mutually exclusive and exhaustive, target distribution confirmed.
