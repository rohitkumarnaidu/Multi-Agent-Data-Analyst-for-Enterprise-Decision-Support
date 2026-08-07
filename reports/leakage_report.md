# Data Leakage Report

## Target Variable
The primary predictive targets are `Decision_Outcome` and `SLA_Breached`.

## Removed Leaky Features
- `Agent_Accuracy_Feedback`: Generated post-decision, causing target leakage in predictive models.
- `Report_Summary_Text`: Generated post-decision, causing target leakage in predictive models.
- `Confidence_Score`: Generated post-decision, causing target leakage in predictive models.
