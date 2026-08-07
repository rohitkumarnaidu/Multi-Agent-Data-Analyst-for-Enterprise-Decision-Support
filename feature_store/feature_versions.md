# Feature Versions Changelog

This document acts as the git-style history for mathematical changes to feature formulas. 

## v1.0 (2026-08-07)
**Status**: Production
**Changes**:
- Initial deployment of 10 core engineered features.
- Established strict temporal sorting for `Rolling_7_Txn_Avg_Amount_By_Dept` to prevent data leakage.
- Enforced `np.nan` replacement for division-by-zero risks in `Tokens_Per_Second` and `Complexity_Per_Agent`.
- Implemented `fillna(0)` logic in `Total_Margin_USD` to ensure partial nulls don't collapse the sum.
