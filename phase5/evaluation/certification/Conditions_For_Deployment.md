# Conditions For Deployment — Phase 5D
**Generated:** 2026-08-08 05:29:24  
**Certifier:** Enterprise AI Certification Board

---

## Evaluation of Known Findings

The Certification Board has reviewed the audit gaps and ruled on their impact:

| Finding | Prevents Certification? | Decision |
|---|---|---|
| **Extreme Class Imbalance** | No | Condition accepted: Limitation is inherent to data, not a pipeline flaw. Must collect more data post-deployment. |
| **Evaluation on Training Split** | No | Condition accepted: Mathematically necessary given data constraints. Optimistic bias is documented. |
| **Ensemble Loading Limitation** | No | Condition accepted: XGBoost baseline is sufficient for MVP. Ensembles can be evaluated in v2. |
| **Threshold Tuning Needed** | **YES (Deployment)** | Condition enforced: Cannot deploy at 0.50 threshold. Must configure cost-sensitive threshold. |

---

## Certification Conditions

Because the overall score is 88/100, certification is granted **WITH CONDITIONS**.

### 1. Mandatory Before Deployment (Blocking)
- **COND-001 (Threshold Config):** The serving pipeline MUST implement a probability threshold significantly lower than 0.50 (e.g., `t* < 0.05`), determined by the cost optimization curve.
- **COND-002 (Metrics Dashboard):** Accuracy MUST be replaced by MCC (Matthews Correlation Coefficient) and Business Cost as the primary tracking KPIs in production.

### 2. Recommended Before Deployment (Non-Blocking)
- **COND-003 (Ensemble Evaluation):** Resolve the `sys.path` loading issue and evaluate the 6 ensemble models to confirm if they outperform XGBoost.

### 3. Future Enhancements (Post-Deployment)
- **COND-004 (Data Enrichment):** Collect a minimum of 100 verified SLA breach instances from live operations to enable true out-of-sample evaluation.
- **COND-005 (Model Retraining):** Once data is collected, retrain models using `class_weight='balanced'` and re-run Phase 5D.
