# Business Features

This domain groups all features associated with Finance, Operations, Sales, and Customer Service KPIs.

## 1. `Total_Margin_USD`
- **Domain**: Finance / Sales
- **Reasoning**: Raw data isolates Revenue from Cost Savings. For ML optimization algorithms aiming to maximize overall firm value, a single Margin metric acts as the most direct target variable.

## 2. `PoP_Amount_Change_Pct`
- **Domain**: Finance / Operations
- **Reasoning**: A static transaction of $10,000 means nothing in a vacuum. By converting this into a percentage change from the previous transaction, models can instantly detect anomalies, surges, or crashes in business volume.

## 3. `Rank_Amount_Within_Dept`
- **Domain**: Operations
- **Reasoning**: Prevents absolute magnitude skewing. A $500 transaction might be a "Top 1" rank for IT Support, but a "Bottom 10" for B2B Sales. This normalizes importance.
