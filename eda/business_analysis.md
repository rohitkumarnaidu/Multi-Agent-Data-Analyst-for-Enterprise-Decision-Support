# Phase 3G: Business Analytics

## Finance
- **Revenue & Profitability:** High variance in `Total_Margin_USD` across departments. Sales drives revenue impact, while ITOps drives cost savings.

## Operations
- **Agent Performance:** Average `Tokens_Per_Second` is stable, but bottlenecked queries (high `Processing_Time_Sec`) drastically pull down the mean for specific `Data_Source_System` connections.
- **SLA & Customer Service:** The system successfully resolves the vast majority of queries within SLA. Breaches represent edge cases requiring human-in-the-loop (`Requires_Human_Review` = True).

## AI Operations
- **Agent Collaboration:** When `Num_Agents_Involved` exceeds 2, `Confidence_Score` fluctuates, implying complex intents stress the orchestrator.
- **Token Efficiency:** Optimization opportunities exist for the orchestrator to compress context before passing to sub-agents.

## Risk Analysis
- **Anomalies:** `Anomaly_Detected` correlates with low `Data_Quality_Score`, highlighting that garbage-in from specific systems causes model uncertainty.
