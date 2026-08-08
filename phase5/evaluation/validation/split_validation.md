# Split Validation Report — Phase 5D.1
**Generated:** 2026-08-08 04:19:30

---

## 1. Schema Integrity

| Check | Result | Detail |
|---|---|---|
| Train columns == Validation columns | ✅ PASS | Identical 35-column schema |
| Train columns == Test columns | ✅ PASS | Identical 35-column schema |
| Column ordering consistent | ✅ PASS | Same sequence across all splits |
| Target column present in all splits | ✅ PASS | `SLA_Breached` verified |
| Feature columns count (34) | ✅ PASS | 34 predictors confirmed |

## 2. Row Overlap Analysis

**Method:** 4-key fingerprint using `Transaction_Amount_USD, Deviation_Percentage, Anomaly_Score, Confidence_Score` (rounded to 4 decimal places).

| Comparison | Overlapping Rows | Overlap % | Result |
|---|---|---|---|
| Train vs Validation | 0 | 0.0000% | ✅ NO OVERLAP |
| Train vs Test | 0 | 0.0000% | ✅ NO OVERLAP |
| Validation vs Test | 0 | 0.0000% | ✅ NO OVERLAP |

> Result: **Splits are mutually exclusive.** Zero row-level overlap across all three pairs.

## 3. Leakage Assessment

| Leakage Vector | Assessment | Evidence |
|---|---|---|
| Row duplication across splits | ✅ NONE | 0 overlapping key-fingerprints |
| Target leakage (test labels seen in training) | ✅ NONE | metadata: `zero_leakage_certified=true` |
| Feature leakage (future data in train) | ✅ NONE | metadata: `immutable_source_phases=true` |
| Label leakage via preprocessing | ✅ NONE | Pipeline fitted on train, applied to val/test |
| Rolling/lag feature contamination | ✅ NONE | Computed within-split per Phase 4 design |

## 4. Data Quality Checks

| Check | Train | Validation | Test |
|---|---|---|---|
| Missing Values | 0 | 0 | 0 |
| Infinite Values | 0 | 0 | 0 |
| Duplicate Rows | 0 | 0 | 0 |
| NaN in numeric cols | 0 | 0 | 0 |

## 5. Size Verification

| Split | Expected Rows | Actual Rows | Expected Ratio | Status |
|---|---|---|---|---|
| Train | 140,000 | 140,000 | 70.0% | ✅ PASS |
| Validation | 30,000 | 30,000 | 15.0% | ✅ PASS |
| Test | 30,000 | 30,000 | 15.0% | ✅ PASS |
| Total | 200,000 | 200,000 | 100% | ✅ PASS |

## Verdict: **ALL SPLIT INTEGRITY CHECKS PASS** ✅

Splits are: mutually exclusive · exhaustive · schema-consistent · leakage-free · quality-verified
