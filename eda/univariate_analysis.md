# Phase 3C: Univariate Analysis

## Numerical Features

### Transaction_Amount_USD
- **Distribution:** Right-skewed continuous measure.
- **Outliers:** 2,735 identified (flagged separately). 
- **Business Interpretation:** Represents the gross financial impact processed by the agent. Crucial for ROI segmentation.

### Processing_Time_Sec
- **Distribution:** Strongly right-skewed.
- **Outliers:** 377 outliers (indicating anomalous agent hangs or extreme latency).
- **Business Interpretation:** A key driver of `SLA_Breached`. Time efficiency directly correlates with token consumption.

### Input_Tokens & Output_Tokens
- **Distribution:** Normally distributed with long tails.
- **Business Interpretation:** AI operations cost indicator. High variance could indicate agent confusion or excessively verbose outputs.

## Categorical Features

### Department
- **Cardinality:** 7 unique departments.
- **Top Categories:** Finance, Sales, ITOps.
- **Business Interpretation:** Different departments exhibit varied query complexities and transaction sizes.

### Data_Source_System
- **Cardinality:** 9 unique systems (e.g., Salesforce, SAP).
- **Business Interpretation:** Defines integration latency and data quality incoming to the agent network.

## Temporal Features

### Transaction_Date & Timestamp
- **Trend:** Consistent daily volume over the 3-year logged period.
- **Business Interpretation:** Daily seasonality affects server load and SLA adherence. Engineered features like `Day_Of_Week` and `Is_Weekend` capture structural business cycle variances.
