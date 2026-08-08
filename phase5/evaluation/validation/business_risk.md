# Business Risk Report — Phase 5D.1
**Generated:** 2026-08-08 04:19:30

---

## 1. Risk of Optimistic Accuracy

### Observation
All models report 99.99%–100% accuracy on the training set.

### Root Cause
With 199,999 negatives and 1 positive, **predicting ALL-ZERO** achieves:
```
Accuracy = 139,999 / 140,000 = 99.9993%
```
This is the **null model performance floor**, not a meaningful achievement.

### Business Risk
| Risk | Level | Impact |
|---|---|---|
| Stakeholder misinterpretation of 99.99% accuracy | **CRITICAL** | May create false confidence in breach detection |
| Reporting "99.99% accurate model" to executives | **CRITICAL** | Model catches 0 of the actual breaches |
| Using accuracy as primary KPI in SLA dashboards | **HIGH** | Decision-makers won't see real failure modes |

**Mitigation:** Always report `SLA Detection Rate %` and `FN Cost` alongside accuracy.

---

## 2. Risk of False Confidence

### Observation
Models achieve near-perfect Brier Scores and low log-loss by predicting probabilities near 0 for all samples.

### Root Cause
The optimal strategy for any model under this imbalance — without cost-sensitive training — 
is to output `P(SLA_Breached=1) ≈ 0.0007` (the prior) for every sample, which:
- Minimizes Brier Score
- Minimizes Log Loss
- Achieves near-perfect accuracy
- **Catches ZERO breaches**

### Business Risk
| Risk | Level | Impact |
|---|---|---|
| Model deployed without threshold tuning | **CRITICAL** | Misses all SLA breaches |
| Model evaluated using standard 0.50 threshold | **HIGH** | F1 = 0, Recall = 0 |
| Probability outputs not calibrated for imbalance | **HIGH** | Risk scores misleading |

**Mitigation:** Deploy with operationally-tuned threshold (≤ 0.001 or cost-based).

---

## 3. Risk of Deployment Without Threshold Tuning

### Observation
At default threshold of 0.50, every model in Phase 5D predicts `SLA_Breached=0` for all records.

### Consequence in Production
```
SLA Breach occurs → Model outputs P=0.003 → Below threshold 0.50 → Classified as COMPLIANT
→ No alert raised → Operations team unaware → SLA penalty incurred
```

### Business Risk Matrix

| Scenario | Probability | Business Impact |
|---|---|---|
| Breach occurs, model misses it (FN) | HIGH (given current threshold) | $500+ per breach + SLA penalty |
| Model flags healthy txn (FP) | LOW (model predicts all-zero) | $50 per unnecessary review |
| Breach rate increases 10× in production | POSSIBLE | Model performance degrades further |
| Stakeholders use model without audit | POSSIBLE | Silent failure mode |

---

## 4. Business Implications

### The Fundamental Tension

| Goal | Implication |
|---|---|
| Maximize Accuracy | → Predict all-zero, miss every breach |
| Maximize Recall | → Predict all-one, review every transaction |
| Optimize Business Cost | → Find threshold that minimizes FP×$50 + FN×$500 |

### Cost-of-Doing-Nothing Baseline

```
Current breach rate:    0.0005% globally
In 200,000 transactions:  ~1 breach expected
FN cost per missed breach: $500
Cost of missing all breaches: $500 (trivial at current rate)
```

### Warning: Latent Risk

> At 0.0005% breach rate, the **expected annual cost of missed breaches** appears minimal.  
> However, this dataset may represent a **low-incident snapshot** in time.  
> Historical SLA breach rates in operational systems are typically 0.1%–5%.  
> If the true production breach rate is higher, this model's silent failure mode becomes  
> **extremely expensive** at scale.

**Example at 1% breach rate (real-world typical):**
```
Transactions per day:    10,000
Breaches per day:        100
FN cost at 100% miss:    $50,000/day = $18.25M/year
```

---

## 5. Phase 5D Business Evaluation Reference

| Model                |   SLA_Detection_Rate_Pct |   False_Alarm_Rate_Pct |   Automation_Rate_Pct |   Breaches_Caught |   Breaches_Missed |   False_Alarms |   True_Negatives |   Missed_Breach_Cost_USD |   False_Alarm_Cost_USD |   Total_Operational_Cost_USD |   Cost_Savings_vs_Baseline_USD |   ROI_vs_Baseline_Pct |
|:---------------------|-------------------------:|-----------------------:|----------------------:|------------------:|------------------:|---------------:|-----------------:|-------------------------:|-----------------------:|-----------------------------:|-------------------------------:|----------------------:|
| Logistic_Regression  |                      100 |                  98.75 |                  1.25 |                 1 |                 0 |         138253 |             1746 |                        0 |                6912650 |                      6912650 |                          87350 |                  1.25 |
| Decision_Tree        |                        0 |                  21.85 |                 78.15 |                 0 |                 1 |          30591 |           109408 |                      500 |                1529550 |                      1530050 |                        5469950 |                 78.14 |
| Random_Forest        |                        0 |                   0    |                100    |                 0 |                 1 |              0 |           139999 |                      500 |                      0 |                          500 |                        6999500 |                 99.99 |
| Extra_Trees          |                        0 |                   0    |                100    |                 0 |                 1 |              0 |           139999 |                      500 |                      0 |                          500 |                        6999500 |                 99.99 |
| XGBoost              |                        0 |                   0    |                100    |                 0 |                 1 |              0 |           139999 |                      500 |                      0 |                          500 |                        6999500 |                 99.99 |
| LightGBM             |                        0 |                   0    |                100    |                 0 |                 1 |              0 |           139999 |                      500 |                      0 |                          500 |                        6999500 |                 99.99 |
| CatBoost             |                        0 |                   0    |                100    |                 0 |                 1 |              0 |           139999 |                      500 |                      0 |                          500 |                        6999500 |                 99.99 |
| HistGradientBoosting |                        0 |                   0    |                100    |                 0 |                 1 |              0 |           139999 |                      500 |                      0 |                          500 |                        6999500 |                 99.99 |
| GaussianNB           |                        0 |                   0    |                100    |                 0 |                 1 |              0 |           139999 |                      500 |                      0 |                          500 |                        6999500 |                 99.99 |

---

## 6. Risk Register

| Risk ID | Risk | Likelihood | Impact | Severity | Mitigation |
|---|---|---|---|---|---|
| BR-001 | Accuracy cited as model quality | HIGH | HIGH | 🔴 CRITICAL | Mandate MCC + Recall in all reports |
| BR-002 | Default threshold (0.50) used in production | HIGH | CRITICAL | 🔴 CRITICAL | Implement cost-based threshold tuning |
| BR-003 | Model misses all breaches at current threshold | HIGH | HIGH | 🔴 CRITICAL | Lower threshold to ≤ 0.001 |
| BR-004 | True breach rate higher than dataset implies | MEDIUM | CRITICAL | 🔴 HIGH | Validate against historical breach logs |
| BR-005 | Ensemble models not evaluated (class error) | MEDIUM | MEDIUM | 🟡 MEDIUM | Re-evaluate with ProductionEnsemblePipeline loaded |
| BR-006 | No out-of-sample evaluation possible | HIGH | HIGH | 🔴 HIGH | Collect more labeled breach data |
| BR-007 | Fairness analysis on training data only | MEDIUM | LOW | 🟡 MEDIUM | Document and re-validate on production live data |

---

## 7. Deployment Recommendation

> **DO NOT DEPLOY** with default threshold of 0.50.  
> **MUST** apply cost-sensitive threshold tuning before any production deployment.  
> **MUST** monitor SLA breach rate on live data to validate assumptions.  
> **SHOULD** collect more positive-class examples to enable proper model evaluation.
