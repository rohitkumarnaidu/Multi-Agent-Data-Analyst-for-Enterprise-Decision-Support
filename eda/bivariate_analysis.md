# Phase 3E: Bivariate Analysis

## Feature vs Target
- **`Processing_Time_Sec` vs `SLA_Breached`:** Extreme processing times logically trigger SLA breaches. There is a rigid threshold effect here.
- **`Query_Complexity_Score` vs `SLA_Breached`:** Higher complexity queries are associated with higher breach rates.

## Category vs Target
- **`Department` vs `SLA_Breached`:** Technical departments (ITOps) dealing with complex multi-system queries exhibit marginally higher breach rates than standard HR inquiries.
- **`Escalation_Level` vs `SLA_Breached`:** High escalation queries show higher risk due to cross-agent routing dependencies.

## Time vs Target
- **`Is_Weekend` vs `SLA_Breached`:** Weekend processing times may differ based on system load and automated cron overlaps, though agent compute remains elastic.

## Business Explanations
The data demonstrates that multi-agent routing (where `Num_Agents_Involved` > 1) inherently adds latency. If the initial intent router misclassifies a complex prompt, the re-routing penalty often causes an SLA breach.
