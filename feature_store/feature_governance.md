# Feature Governance

Enterprise policies for modifying, creating, or deprecating features within the Feature Store.

## Naming Standards
- Features must use `Snake_Case_Capitalized`.
- Currency features must end with `_USD` (or equivalent).
- Percentage features must end with `_Pct`.
- Boolean flags must begin with `Is_` or `Has_`.

## Versioning
- **Major Version (v2.0)**: Required if the mathematical formula changes or the data type alters (e.g., float to int).
- **Minor Version (v1.1)**: Allowed for underlying logic optimization that produces the *exact same* mathematical output.

## Ownership
Every feature MUST have a business owner (e.g., Finance, Data Science, MLOps). If an owner leaves, the feature is orphaned and flagged for review.

## Approval Process
1. Data Scientist proposes feature in `feature_gap_report.md`.
2. MLOps Engineer verifies it doesn't cause data leakage.
3. Data Engineer writes the production pipeline code.
4. Final approval requires PR sign-off from the Business Owner.

## Deprecation Policy
- Deprecated features must remain in the `feature_store` and `.parquet` file for 30 days to allow downstream ML models and Dashboards to migrate.
- Tag the feature status as `Deprecated` in `feature_registry.yaml`.
