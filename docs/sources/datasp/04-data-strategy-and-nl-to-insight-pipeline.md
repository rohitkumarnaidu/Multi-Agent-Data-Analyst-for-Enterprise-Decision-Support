# 04 — Data Strategy & NL-to-Insight Pipeline

**DATASPHERE 26 · Track 06 · Multi-Agent Data Analyst for Enterprise Decision Support**

> Planning document. The official dataset ships with the event. Everything here is rehearsal + a schema-agnostic pipeline design so the real data slots in without a redesign.

---

## 1. What the problem statement tells us to expect

"Data across sales, finance, operations, and customer services" — initially interpreted as a retail schema. However, the provided dataset is a **Multi-Agent System Audit Log**.

This is a single, wide flat-file (200,000 rows) tracking the activities of an AI workforce (e.g., `Finance_Agent`, `ITOps_Agent`) across those domains. The Data Agent's schema-reading step must be optimized for this wide-table structure, handling operational metrics rather than retail transactions.

## 2. Rehearsal datasets

Since the dataset is uniquely an **AI Agent Audit Log**, standard retail datasets (like Superstore or Contoso) are no longer suitable proxies.

| Dataset | Why it fits | Get it |
|---|---|---|
| **Subsets of the Provided CSV** | The `enterprise_multiagent_decision_support.csv` file is 200,000 rows. Rehearsing on the first 5,000 rows ensures perfect schema alignment. | Local `raw/` directory. |

**Rehearsal plan for today:** Load a 5K subset of the provided dataset. Get the full five-agent pipeline working end-to-end to prove the schema-reading step in Section 4 can handle the specialized AI metrics (Token usage, Confidence Scores, SLA Breaches).

## 3. Data cleaning approach

Applied automatically the moment any dataset (rehearsal or real) is loaded, before any agent sees it:

1. **Schema scan** — column names, inferred types, null counts per column, row count.
2. **Type correction** — dates parsed to actual datetime, numeric-looking strings (e.g. `"$1,204.50"`) coerced to numeric, category columns normalized (trim whitespace, consistent casing).
3. **Missing-value report** — percentage missing per column, surfaced to the team, not silently dropped. Columns over 40% missing are flagged and excluded from auto-generated charts by default (still queryable if a question specifically asks about them).
4. **Duplicate check** — exact-duplicate rows flagged and reported; not auto-deleted without a visible decision, since silent deletion is exactly the kind of thing a judge asks about under "data preprocessing."
5. **Outlier flag (not removal)** — values beyond 3 standard deviations from the column mean are flagged in the schema summary, not stripped. An agent answering "what's our biggest sale" needs the outlier to still be queryable — cleaning must not quietly hide real business events.
6. **Identifier vs. measure classification** — heuristic pass to separate ID/key columns (high cardinality, not meaningful to aggregate) from measure columns (numeric, meaningful to sum/average) and dimension columns (categorical, meaningful to group by). This classification is what lets the Data Agent write sane queries without being told the schema by a human.

This whole pass is itself a legitimate "Data Preprocessing" rubric artifact — log its output (before/after row counts, null percentages, type corrections made) as evidence, not just as internal plumbing.

## 4. The NL-question-to-answer pipeline, step by step

Worked example, using the AI Audit Log dataset:

**Question:** *"Which department had the most AI SLA breaches last quarter?"*

1. **Orchestrator** classifies intent = `aggregation` (one metric, grouped by department, filtered by time). Confidence high → routes directly.
2. **Data Agent** reads the schema summary, drafts a query: filter by date, group by `Department`, sum where `SLA_Breached == True`. Executes against DuckDB. Returns a 4-row result table (`Department`, `SLA_Breach_Count`).
3. **Analysis Agent** finds the max row (e.g., IT Operations), computes the percentage of total breaches, selects chart type = bar (categorical comparison → bar).
4. **Narrative Agent** receives the fixed skeleton `{"department": "IT Operations", "breach_count": 412, "pct_of_total": 45.2}` and writes: *"IT Operations had the most AI SLA breaches last quarter, accounting for 45.2% of all escalations."* plus a recommended action grounded only in what the skeleton contains.
5. **Validator Agent** re-extracts the number `45.2` from the narrative, confirms it matches the skeleton exactly, sets confidence = High, sets `requires_human_approval = false`.
6. **UI** renders: chart, narrative, confidence badge, "why" trace link, recommended action.

Same six steps run for every question in the golden test set.

## 5. Handling ambiguity

"Last quarter" is ambiguous relative to what "today" means inside a static competition dataset (there's no real "now"). Resolve this once, explicitly, at data-load time: the Data Agent treats the **maximum date present in the loaded dataset** as "today" for the purposes of relative time phrases ("this month," "last quarter," "year to date"). Document this assumption visibly in the UI (a small "as of [max date in data]" label) so it never becomes a silent, hard-to-explain judge question.

## 6. Feature engineering ideas, by domain

| Domain | Derived features worth having ready |
|---|---|
| **AI Efficiency** | **Token Efficiency:** (`Output_Tokens` / `Processing_Time_Sec`). Identifies which agents are computationally expensive. |
| **Governance** | **Human Bottleneck Rate:** Percentage of queries where `Requires_Human_Review` is True. Highlights manual friction points. |
| **Business Impact** | **Agent Automation ROI:** Sum of `Cost_Savings_Potential_USD` for queries that were `Auto-Resolved` successfully without SLA breach. |
| **Risk Management** | **False Confidence Flag:** Queries where `Confidence_Score` was high (>0.8) but `Agent_Accuracy_Feedback` was low or `SLA_Breached` was True. |

Every feature above is directly traceable to the `enterprise_multiagent_decision_support.csv` columns.

## 7. Live "messy data" moment for the demo

Deliberately keep one column in the demo dataset with a realistic flaw (a handful of missing values, or a mixed-format date field) rather than pre-cleaning everything to invisibility. When a question touches that column, the system should visibly say what it did about it ("14 rows were missing a region value and were excluded from this comparison") instead of silently producing a number. This is a **Should-Have** from the feature plan and it is one of the highest-leverage 90-second moments available in the whole demo for the Data Preprocessing criterion.
