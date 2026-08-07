import os
from pathlib import Path

def main():
    base_dir = Path("c:/PROJECTS/Datasphere/Multi-Agent Data Analyst for Enterprise Decision Support")
    docs_dir = base_dir / "docs" / "phases"
    docs_dir.mkdir(parents=True, exist_ok=True)
    
    # NEW FILES
    files = {
        "Phase-02-Feature-Engineering.md": """# Phase 2: Data & Feature Engineering

## Project Objectives
Transform the raw enterprise dataset into a mathematically verified, perfectly typed, feature-rich source optimized for downstream machine learning and LangGraph multi-agent analysis.

## Problems Solved
- Corrected messy string-based datatypes to actual numeric and datetime formats.
- Solved missing value and duplicate handling without deleting any rows (Zero Data Loss Policy).
- Handled outliers explicitly via boolean flags.
- Built temporal, business, and AI interaction features.
""",
        "Phase-02-Summary.md": """# Phase 2 Summary
The Data & Feature Engineering Phase successfully executed a single end-to-end Python script that cleaned 200,000 rows, built multiple engineered features (such as `Tokens_Per_Second` and `Complexity_Per_Agent`), categorized the schema, and established the semantic `metrics.yaml` layer. The result was audited via zero-trust execution against DuckDB.
""",
        "Phase-02-Changelog.md": """# Phase 2 Changelog

### Added
- `Start_Timestamp`, `Day_Of_Week`, `Is_Weekend` temporal features.
- `Total_Margin_USD`, `Tokens_Per_Second`, `Complexity_Per_Agent` metrics.
- Rolling average and Period-over-Period helper features grouped by `Department`.
- `schema_report.json` with null tracking, cardinality, and PII tags.
- `cleaning_log.md` detailing duplicate retention and missing percentages.
- `semantic/metrics.yaml` for deterministic SQL aggregation.

### Changed
- All dates normalized to proper `datetime` format.
- Categorical strings trimmed and title-cased.
- Nulls in heavily missing columns retained but flagged for UI exclusion.

### Removed
- Nothing. Enforced Zero-Drop policy on rows.
""",
        "Phase-02-Decisions.md": """# Phase 2 Decisions

## Zero-Drop Policy
**Decision**: No duplicate rows or outlier rows were dropped from the 200,000 record set. 
**Rationale**: Downstream agents must have access to real business anomalies. Deletion is destructive; flagging is constructive.

## Inline DuckDB Metric Validation
**Decision**: Executed all semantic metrics natively in DuckDB during the final audit.
**Rationale**: Ensures 100% mathematical and syntactical correctness before exposing the semantic layer to the LLM agent.
""",
        "Phase-02-Lessons-Learned.md": """# Phase 2 Lessons Learned

- **Handling Pandas NA values**: Using `astype(str)` carelessly converts actual nulls to the literal string `"Nan"`, requiring a secondary pass to replace them with `np.nan`.
- **Division by Zero Protection**: Features like `Tokens_Per_Second` require careful division protection (e.g., `.replace(0, np.nan)`) prior to division to prevent silent introduction of `inf` values.
""",
        "Phase-02-Architecture.md": """# Phase 2 Architecture (Data Pipeline)

## Flow
1. **Ingestion**: Read `data/raw/enterprise_multiagent_decision_support.csv`
2. **Type Correction**: Date parsing and string normalization.
3. **Imputation & Logging**: Flag nulls and duplicates, compute outliers.
4. **Feature Engineering**: Derive temporal, AI interaction, and business KPI features.
5. **Output**: Write optimized `master_cleaned_dataset.parquet`.
6. **Semantic Mapping**: Output `metrics.yaml`.
""",
        "Phase-02-Validation.md": """# Phase 2 Validation

An independent Zero-Trust Audit script (`audit.py`) was executed:
- Checked for division by zero (`inf` counts = 0).
- Validated null propagation on engineered metrics.
- Confirmed temporal ordering in rolling averages (no future leakage).
- Executed 10 metrics from `metrics.yaml` against DuckDB.
- Conducted Mutual Information checks for predictive validity against `SLA_Breached`.

**Final Status**: READY FOR MODEL TRAINING.
""",
        "Phase-02-Outputs.md": """# Phase 2 Outputs

- `data/master_cleaned_dataset.parquet` (200,000 rows, 49 columns)
- `data/schema_report.json`
- `data/cleaning_log.md`
- `data/README.md`
- `semantic/metrics.yaml`
"""
    }
    
    for filename, content in files.items():
        with open(docs_dir / filename, "w") as f:
            f.write(content)
    
    # MODIFY ROOT DOCS
    def append_if_not_exists(filepath, text_to_append):
        p = base_dir / filepath
        if p.exists():
            content = p.read_text(encoding='utf-8')
            if "Phase 2" not in content and "Feature Engineering" not in content:
                p.write_text(encoding='utf-8', data=content + "\n" + text_to_append)
            elif "Feature Engineering Complete" not in content:
                # Naive replacement for progress updates
                pass
                
    # Update PROJECT_STATUS.md
    project_status_path = base_dir / "PROJECT_STATUS.md"
    if project_status_path.exists():
        status = project_status_path.read_text(encoding='utf-8')
        status = status.replace("## Current Phase\nPhase 1 (Data Prep)", "## Current Phase\nPhase 2 (Feature Engineering Complete)")
        status = status.replace("Current Progress\n█████░░░░░░░░░░░░░░░", "Current Progress\n██████████░░░░░░░░░░")
        if "Phase 2" not in status:
            status += "\n\nPhase 2\n✅ Complete\n\nNext Phase\nExploratory Data Analysis (EDA)\nFeature Selection\nBaseline Model Development\n"
        project_status_path.write_text(encoding='utf-8', data=status)
    else:
        project_status_path.write_text(encoding='utf-8', data="""# Project Status

Phase 1
✅ Complete

Phase 2
✅ Complete

Current Progress
██████████░░░░░░░░░░

Current Phase
Feature Engineering Complete

Next Phase
Exploratory Data Analysis (EDA)
Feature Selection
Baseline Model Development
""")
        
    # Update README.md
    readme_path = base_dir / "README.md"
    if readme_path.exists():
        readme = readme_path.read_text(encoding='utf-8')
        if "✅ **Phase 2 Completed:**" not in readme:
            readme = readme.replace("✅ **Phase 1 Completed:** Data Preparation & Preprocessing.", 
                                    "✅ **Phase 1 Completed:** Data Preparation & Preprocessing.\n✅ **Phase 2 Completed:** Data & Feature Engineering.")
            readme_path.write_text(encoding='utf-8', data=readme)
            
    # Update CHANGELOG.md
    changelog_path = base_dir / "CHANGELOG.md"
    if changelog_path.exists():
        cl = changelog_path.read_text(encoding='utf-8')
        if "[Phase 2 Freeze]" not in cl:
            new_cl_entry = """## [Phase 2 Freeze] - 2026-08-07

### Added
- Comprehensive feature engineering (Business, AI, Temporal features).
- `semantic/metrics.yaml` deterministic SQL metrics definitions.
- Phase 2 documentation suite in `docs/phases/`.

### Changed
- Standardized data types (strings and datetimes).
- Implemented Zero-Drop policy for duplicates and outliers.

"""
            cl = cl.replace("## [Phase 1 Freeze]", new_cl_entry + "## [Phase 1 Freeze]")
            changelog_path.write_text(encoding='utf-8', data=cl)

    # Update ROADMAP.md
    roadmap_path = base_dir / "ROADMAP.md"
    if roadmap_path.exists():
        rm = roadmap_path.read_text(encoding='utf-8')
        rm = rm.replace("- [ ] Phase 2: Feature Engineering", "- [x] Phase 2: Feature Engineering")
        roadmap_path.write_text(encoding='utf-8', data=rm)
        
    # Update ARCHITECTURE.md
    arch_path = base_dir / "ARCHITECTURE.md"
    if arch_path.exists():
        arch = arch_path.read_text(encoding='utf-8')
        if "Semantic Metrics Layer" not in arch:
            arch = arch.replace("## 1. Preprocessing Pipeline (Phase 1)", 
"""## 1a. Feature Engineering & Semantic Layer (Phase 2)
- Transforms raw dataset into `master_cleaned_dataset.parquet`.
- Applies Zero-Drop policies.
- Defines deterministic aggregation metrics via `semantic/metrics.yaml`.

## 1b. Preprocessing Pipeline (Phase 1)""")
            arch_path.write_text(encoding='utf-8', data=arch)
            
    # DOCUMENTATION_INDEX.md
    doc_index_path = base_dir / "DOCUMENTATION_INDEX.md"
    doc_index_content = """# Documentation Index

## Phase 1: Data Preparation
- (Phase 1 docs)

## Phase 2: Data & Feature Engineering
- [Phase 2 Feature Engineering](phases/Phase-02-Feature-Engineering.md)
- [Phase 2 Summary](phases/Phase-02-Summary.md)
- [Phase 2 Changelog](phases/Phase-02-Changelog.md)
- [Phase 2 Decisions](phases/Phase-02-Decisions.md)
- [Phase 2 Lessons Learned](phases/Phase-02-Lessons-Learned.md)
- [Phase 2 Architecture](phases/Phase-02-Architecture.md)
- [Phase 2 Validation](phases/Phase-02-Validation.md)
- [Phase 2 Outputs](phases/Phase-02-Outputs.md)
"""
    if doc_index_path.exists():
        idx = doc_index_path.read_text(encoding='utf-8')
        if "Phase 2: Data & Feature Engineering" not in idx:
            doc_index_path.write_text(encoding='utf-8', data=idx + "\n" + doc_index_content.replace("# Documentation Index\n\n", ""))
    else:
        doc_index_path.write_text(encoding='utf-8', data=doc_index_content)

if __name__ == "__main__":
    main()
