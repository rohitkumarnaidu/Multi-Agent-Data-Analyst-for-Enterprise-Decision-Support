# Phase 2 Lessons Learned

- **Handling Pandas NA values**: Using `astype(str)` carelessly converts actual nulls to the literal string `"Nan"`, requiring a secondary pass to replace them with `np.nan`.
- **Division by Zero Protection**: Features like `Tokens_Per_Second` require careful division protection (e.g., `.replace(0, np.nan)`) prior to division to prevent silent introduction of `inf` values.
