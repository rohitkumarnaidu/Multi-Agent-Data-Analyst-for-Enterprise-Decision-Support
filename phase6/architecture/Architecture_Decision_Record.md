# Architecture Decision Record (ADR)
**Generated:** 2026-08-08 05:46:59  

---

## ADR 1: Use LangGraph for Multi-Agent Orchestration
* **Context:** The system requires multiple agents (Data, ML, Narrative) to collaborate and pass state.
* **Decision:** We will use LangGraph instead of AutoGen or CrewAI.
* **Justification:** LangGraph provides absolute deterministic control over the flow of execution via state graphs, which is critical for enterprise compliance (e.g., ensuring the Validator agent always runs last). AutoGen is too autonomous/unpredictable for this strict requirement.

## ADR 2: Use DuckDB for Data Access
* **Context:** The agents need to query the 200k+ row production CSVs.
* **Decision:** We will use DuckDB in-process instead of loading Pandas dataframes.
* **Justification:** DuckDB allows standard SQL generation by the Data Agent, is drastically faster than Pandas for analytical queries, and easily handles memory limitations.

## ADR 3: COND-001 Threshold Enforcement
* **Context:** Phase 5D Certification mandated a custom threshold to overcome class imbalance.
* **Decision:** The `ml_service.py` will implement a hardcoded probability threshold ($t* = 0.05$) when translating XGBoost `predict_proba` into binary `predict` outputs.
* **Justification:** Satisfies the Governance Certification Board requirement blocking deployment.
