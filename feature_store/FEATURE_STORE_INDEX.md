# FEATURE STORE INDEX

This index links every document within the Enterprise Feature Store.

### 1. Core Metadata
- [README.md](README.md) - Architecture and usage instructions.
- [feature_metadata.json](feature_metadata.json) - Complete machine-readable attribute map.
- [feature_contracts.yaml](feature_contracts.yaml) - Strict ML validation rules and data types.
- [feature_registry.yaml](feature_registry.yaml) - Formal registration of all features.

### 2. Catalogs & Dictionaries
- [feature_catalog.md](feature_catalog.md) - High-level formulas, leakage risk, and ML impact.
- [feature_dictionary.md](feature_dictionary.md) - End-user business glossary.

### 3. Traceability & Dependencies
- [feature_lineage.md](feature_lineage.md) - Lineage diagrams from raw to ML.
- [feature_dependencies.md](feature_dependencies.md) - Parent/child transform chains.
- [feature_usage.md](feature_usage.md) - Downstream consumers of each feature.

### 4. Domain Deep-Dives
- [business_features.md](business_features.md) - Finance, Sales, and Ops KPIs.
- [ai_features.md](ai_features.md) - LLM and Agentic operational metrics.
- [statistical_features.md](statistical_features.md) - Temporal, Ranking, and Derived categorization.
- [feature_groups.md](feature_groups.md) - Logical clustering for UI display.

### 5. Quality & Governance
- [feature_validation.md](feature_validation.md) - Mathematical and statistical proofs.
- [feature_quality_report.md](feature_quality_report.md) - Outlier, drift, and leakage risk scoring.
- [feature_governance.md](feature_governance.md) - Naming, ownership, and approval rules.
- [feature_lifecycle.md](feature_lifecycle.md) - Status definitions (Validated, Deprecated).
- [feature_versions.md](feature_versions.md) - Changelog for feature logic.
