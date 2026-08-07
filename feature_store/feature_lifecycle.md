# Feature Lifecycle

The operational state machine for all features in this store.

1. **Created**: Feature has been proposed and engineered in a development branch.
2. **Validated**: Feature has passed statistical, mathematical, and leakage checks (`feature_validation.md`).
3. **Production Ready**: Feature is actively populated in the Master Dataset and registered in `feature_registry.yaml` with a Business Owner.
4. **Deprecated**: Feature logic is outdated. No new models should consume this feature. Existing models have a 30-day grace period.
5. **Archived**: Feature is permanently removed from the batch processing pipeline. Its historical registry definition remains for audit purposes, but it will no longer populate in the dataset.

*All current features (v1.0) are in the **Production Ready** state.*
