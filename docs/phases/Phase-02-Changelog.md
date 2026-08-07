# Phase 2 Changelog

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
