# Agent Workflow

## Core Execution Path
For standard analytical queries (the fallback default of the intent router), the workflow is as follows:

1. **Intent Router:** Directs the execution to the `data_agent`.
2. **Data Agent:** Executes DuckDB SQL generation and runs the query against the frozen datasets. Writes `sql_query` and `data_results` to state.
3. **Analysis Agent:** Receives the data. Performs aggregations and trend detection. Writes `analysis` and `charts` to state.
4. **Narrative Agent:** Reads the analysis and translates it into an executive summary. Writes `narrative` to state.
5. **Validator Agent:** Scans the entire state for errors or hallucinations. Applies a confidence score and `validation_status`.

## Alternate Paths
- **Simulation:** Routes directly to `simulation_agent` -> `validator_agent`.
- **Reporting:** Routes directly to `report_agent` -> `validator_agent`.
- **Risk/Anomaly:** Routes directly to `risk_agent` -> `validator_agent`.
