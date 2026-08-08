# EXPERIMENT LINEAGE & REPRODUCIBILITY REPORT
## Full Audit Trail

### Lineage Graph
`Raw Dataset (Phase 1)` -> `Engineered Features (Phase 2)` -> `Selected Features (Phase 4E)` -> `Production Dataset (Phase 4.5)` -> `Baseline Models (Phase 5A)` -> `Tuned Champion Pipeline (Phase 5B)`

- **Seed**: `42`
- **Optuna Sampler**: TPE Sampler
- **Validation Protocol**: Stratified Cross-Validation on Training Partition
