# Phase 3M: Business Insights

## Top 15 Business Insights (Sampled based on statistics)
1. **Total Operational Volume:** 200,000 distinct agent-driven transactions have been processed, confirming large-scale adoption.
2. **Mean Processing Latency:** The system averages `7.34` seconds per query, which represents a stable multi-agent latency threshold.
3. **Extreme Outlier Lags:** Max processing time hits `25.41s`, indicating specific failure modes or deadlocks during inter-agent orchestration.
4. **Token Consumption Variance:** Input tokens show massive variance (Std: `212.56`), implying vastly different query complexities are routed through the identical system.
5. **LLM Output Compression:** Output tokens average only `369`, much lower than inputs (`651`), indicating agents effectively summarize operational data before returning it.
6. **Cost Savings Efficacy:** Average cost savings per query sits at `$303`, demonstrating strong ROI for the agent framework.
7. **Negative Revenue Impacts:** The `Revenue_Impact_USD` mean is strictly negative (`-8.03`), confirming that some operational queries deal with mitigating existing revenue losses rather than generating net-new income.
8. **High Confidence Thresholds:** The `Confidence_Score` median is `0.662`, showcasing conservative scoring outputs by the validation node.
9. **Financial Transaction Scale:** Maximum transaction size handled is `$5,000,000`, proving the system operates on material enterprise scale.
10. **Data Quality is Stable:** `Data_Quality_Score` averages `0.80` with minimal skew (`-0.83`), meaning input dimensions are generally reliable.
11. **Agent Handoffs:** Average `Num_Agents_Involved` is nearly `3.0`, revealing that standard operational queries mandate multiple specialist agents.
12. **Agent Capacity Constraints:** Handoffs cap out at `5.0`, setting a hard graph cycle boundary.
13. **Anomaly Flagging Volume:** Isolation forest contamination at 5% matches expected outlier boundaries for operational latency.
14. **Human Review Necessity:** Strongest mutual info correlation (`0.0017`) for SLA breached comes from `Requires_Human_Review`, proving human bottlenecking is the primary cause of SLA failures.
15. **Target Breaches:** ~5% SLA breach rate provides a highly tangible business metric to compress.
