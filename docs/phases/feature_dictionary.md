# Feature Dictionary

Welcome to the Enterprise Feature Dictionary. This glossary translates engineering features into plain-English business definitions for analysts and stakeholders.

## Temporal (Time-Based) Features
- **Start_Timestamp**: The exact date and time when the agent began processing the request. This is calculated backward from the final completion timestamp.
- **Day_Of_Week**: The text name (e.g., "Monday") indicating when the transaction occurred. Useful for tracking peak volume days.
- **Is_Weekend**: A simple Yes/No indicator if the transaction occurred on Saturday or Sunday, helping identify off-hours SLA exceptions.

## Financial & KPI Features
- **Total_Margin_USD**: The complete financial benefit of the query, adding together both direct new revenue and identified cost savings.
- **Prev_Txn_Amount_By_Dept**: The dollar amount of the immediately preceding transaction handled by this specific department.
- **PoP_Amount_Change_Pct**: The percentage growth (or shrinkage) in transaction value compared to the department's previous transaction.
- **Rank_Amount_Within_Dept**: Where this transaction ranks financially against all others in the same department (1 = highest).
- **Rolling_7_Txn_Avg_Amount_By_Dept**: The average dollar value of the last 7 transactions in this department, smoothing out sudden spikes.

## AI & Operations Features
- **Tokens_Per_Second**: The processing speed of the AI agent, measuring how much text (tokens) it read and wrote every second.
- **Complexity_Per_Agent**: The average difficulty of the query distributed across the number of agents who had to collaborate to solve it. 
