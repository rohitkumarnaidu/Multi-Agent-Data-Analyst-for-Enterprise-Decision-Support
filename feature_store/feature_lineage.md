# Feature Lineage

This document traces the complete lineage from raw data ingestion to ML model consumption.

## High-Level Pipeline
```mermaid
graph TD
    A[Raw Dataset] --> B[Cleaning & Typing]
    B --> C[Imputation & Outlier Flags]
    C --> D[Engineered Features]
    D --> E[Semantic Metrics Layer]
    D --> F[ML Models]
    D --> G[AI Agents]
    E --> H[Dashboards]
```

## Detailed Feature Traceability

### Business Metrics (`Total_Margin_USD`)
```mermaid
graph LR
    R[Revenue_Impact_USD] --> M[Total_Margin_USD]
    C[Cost_Savings_Potential_USD] --> M
    M --> BI[Finance Dashboard]
    M --> ML[Pricing Model]
```

### AI Metrics (`Tokens_Per_Second`)
```mermaid
graph LR
    I[Input_Tokens] --> T[Tokens_Per_Second]
    O[Output_Tokens] --> T
    P[Processing_Time_Sec] --> T
    T --> AG[Graph Router Node]
    T --> ML[Latency Predictor]
```

### Temporal Aggregates (`Rolling_7_Txn_Avg_Amount_By_Dept`)
```mermaid
graph LR
    A[Transaction_Amount_USD] --> S[Sort by Timestamp]
    D[Department] --> S
    S --> W[Rolling Window]
    W --> R[Rolling_7_Txn_Avg_Amount_By_Dept]
    R --> ML[Anomaly Detection Model]
```
