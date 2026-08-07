# Business Features Strategy

The Multi-Agent Data Analyst platform thrives on translating raw operational logging into actionable financial and efficiency KPIs. The business features engineered in Phase 2 are specifically designed to serve dashboards and optimization models.

## Core Engineered Business Features

### 1. `Total_Margin_USD`
- **Concept**: Not all queries just cost money. Some generate revenue, while others prevent costs. By summing `Revenue_Impact_USD` and `Cost_Savings_Potential_USD`, we create a unified "Margin" column.
- **Usage**: Dashboards tracking the overall business value driven by the AI agent network.

### 2. `Rank_Amount_Within_Dept`
- **Concept**: A $10,000 transaction in Finance might be rank 100, while in HR it might be rank 1.
- **Usage**: Allows the ML model to learn relative scaling (normalized importance) without suffering from the absolute magnitude differences across departments.

### 3. `PoP_Amount_Change_Pct`
- **Concept**: Row-over-row percentage difference in transaction values within a department.
- **Usage**: Critical for anomaly detection. A 500% jump from the previous transaction implies a system error, an urgent request, or a potential data quality issue. 
