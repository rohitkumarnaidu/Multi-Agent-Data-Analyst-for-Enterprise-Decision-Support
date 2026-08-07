# Feature Relationships

## Mutual Information Rankings
1. `Requires_Human_Review`: **0.00175**
2. `Num_Agents_Involved`: **0.00060**
3. `Is_Weekend`: **0.00055**
4. `Anomaly_Detected`: **0.00010**
5. `Complexity_Per_Agent`: **0.00005**

*Note: All financial features (`Transaction_Amount_USD`, `Revenue_Impact_USD`) and raw computational scores (`Processing_Time_Sec`) reported effective MI scores of `~0.0`. Their interactions with SLA_Breached are statistically negligible.*

## Feature vs Feature
- Scatterplots generated in `plots/scatterplots/` demonstrate the linear relationships between tokens and processing times.
- `Complexity_Per_Agent` scales directly with `Anomaly_Score`, establishing that high cognitive load on the agent framework correlates with a deterioration of data quality validation boundaries.
