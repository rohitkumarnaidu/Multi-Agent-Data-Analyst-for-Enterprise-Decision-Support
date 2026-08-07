# Phase 2 Decisions

## Zero-Drop Policy
**Decision**: No duplicate rows or outlier rows were dropped from the 200,000 record set. 
**Rationale**: Downstream agents must have access to real business anomalies. Deletion is destructive; flagging is constructive.

## Inline DuckDB Metric Validation
**Decision**: Executed all semantic metrics natively in DuckDB during the final audit.
**Rationale**: Ensures 100% mathematical and syntactical correctness before exposing the semantic layer to the LLM agent.
