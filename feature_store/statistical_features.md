# Statistical Features

This registry maps the statistical properties of our engineered features to ensure proper downstream encoding and scaling by ML models.

### Continuous (Float/Numeric)
Require standard/robust scaling prior to deep learning.
- `Total_Margin_USD`
- `Tokens_Per_Second`
- `Complexity_Per_Agent`
- `Rolling_7_Txn_Avg_Amount_By_Dept`
- `Prev_Txn_Amount_By_Dept`
- `PoP_Amount_Change_Pct`

### Ordinal / Ranking
Retain relative ordering. Tree-based models (XGBoost) can consume natively.
- `Rank_Amount_Within_Dept`

### Categorical
Require One-Hot or Label Encoding.
- `Day_Of_Week`

### Binary
Can be mapped natively to 0/1.
- `Is_Weekend`

### Derived Temporal
Require embedding or cyclical encoding (sine/cosine) if used as deep learning features.
- `Start_Timestamp`
