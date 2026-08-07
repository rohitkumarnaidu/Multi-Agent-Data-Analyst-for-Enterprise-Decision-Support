# Enterprise Feature Store

Welcome to the Datasphere Multi-Agent Enterprise Feature Store. This repository serves as the single source of truth for all engineered features utilized by Machine Learning models, AI Agents, BI Dashboards, and DuckDB analytical queries.

## Architecture
This Feature Store operates offline, persisting features via `.parquet` datasets, with all metadata, lineage, and contracts defined declaratively in this directory. 
- **Storage**: `data/master_cleaned_dataset.parquet`
- **Semantics**: `semantic/metrics.yaml`
- **Metadata**: `feature_store/`

## Governance
No feature may be consumed in production unless it has been explicitly defined, validated, and versioned in this store. 
All features require:
- A strict Feature Contract (`feature_contracts.yaml`)
- Documented Lineage (`feature_lineage.md`)
- Statistical Validation (`feature_validation.md`)

## Folder Structure
- `FEATURE_STORE_INDEX.md`: Master directory of all documentation.
- `*.yaml / *.json`: Machine-readable metadata and contracts.
- `*.md`: Human-readable catalogs, dictionaries, and governance policies.

## Versioning & Maintenance
Features follow semantic versioning. Changes to calculation logic mandate a major version bump. All deprecations must undergo a 30-day archival phase.
