# 04 — Data Strategy & NL-to-Insight Pipeline

**DATASPHERE 26 · Track 06 · Multi-Agent Data Analyst for Enterprise Decision Support**

> Planning document. The official dataset ships with the event. Everything here is rehearsal + a schema-agnostic pipeline design so the real data slots in without a redesign.

---

## 1. What the problem statement tells us to expect

"Data across sales, finance, operations, and customer services" — read literally, that's very likely either:
- **One wide table** with columns spanning multiple domains (a transaction table with sales, cost, region, and support-flag columns), or
- **Several related tables** joined by a common key (customer ID, order ID, date), one table per domain.

Design the Data Agent's schema-reading step to handle both without knowing in advance which one it'll get — see Section 4.

## 2. Rehearsal datasets (use today, before the real one drops)

| Dataset | Why it fits | Get it |
|---|---|---|
| **Contoso sample data** | Microsoft's own sample dataset built specifically for Power BI demos — sales, products, customers, dates. Rehearsing on it means the Power BI half of the pipeline (Section 5 of `05-dashboard-powerbi-integration.md`) is tested against data shaped exactly like what a judge expects to see in Power BI. | Bundled with Power BI Desktop samples / widely mirrored on GitHub. |
| **Sample Superstore** | The other classic BI-sample dataset (sales, profit, region, category, sub-category, customer segment) — closest single-table analogue to "sales + ops" combined. | Widely available as a CSV; also ships with Tableau/Power BI sample packs. |
| **Olist Brazilian e-commerce dataset** | Multi-table (orders, payments, reviews, customers) — good stand-in if the real dataset turns out to be relational rather than one flat file, and it includes a genuine text field (review comments) to rehearse the "light NLP on a text column" edge case. | Public dataset, widely mirrored. |

**Rehearsal plan for today:** load Contoso or Superstore first (fastest to a working demo since it's single-table), get the full five-agent pipeline working end to end on it, then run Olist through the same pipeline unmodified to prove the schema-reading step in Section 4 actually generalizes. If Olist breaks the pipeline, that's the bug to fix tonight — not during the event.

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

Worked example, using a Superstore-shaped rehearsal dataset:

**Question:** *"How did we do in the West region last quarter compared to the one before?"*

1. **Orchestrator** classifies intent = `comparison` (two time periods, one segment). Confidence high → routes directly, no clarifying question needed.
2. **Data Agent** reads the schema summary from Section 3, drafts a query: filter `region == "West"`, group by quarter, sum `sales`, for the two most recent quarters present in the data. Executes against DuckDB. Returns a 2-row result table (`quarter`, `total_sales`).
3. **Analysis Agent** computes `change_pct` between the two rows, checks sample size (row count feeding each quarter's sum — if under a threshold, sets `low_sample_size`), selects chart type = bar (two-period comparison → bar, not line, since a 2-point line reads as a trend it isn't).
4. **Narrative Agent** receives the fixed skeleton `{"region": "West", "prior_quarter": "Q2", "current_quarter": "Q3", "change_pct": -12.4, "sample_size": 214}` and writes: *"Sales in the West region fell 12.4% from Q2 to Q3."* plus a recommended action grounded only in what the skeleton actually contains.
5. **Validator Agent** re-extracts the number `12.4` from the narrative, confirms it matches the skeleton exactly, sets confidence = High (sample size adequate, primary model used, no fallback path triggered), sets `requires_human_approval = false` (informational insight, not a high-risk action).
6. **UI** renders: chart, narrative, confidence badge, "why" trace link, recommended action.

Same six steps run for every question in the golden test set (`06-evaluation-explainability-safety.md`) — the worked example above is what "the pipeline" concretely means when it shows up in every other document in this set.

## 5. Handling ambiguity

"Last quarter" is ambiguous relative to what "today" means inside a static competition dataset (there's no real "now"). Resolve this once, explicitly, at data-load time: the Data Agent treats the **maximum date present in the loaded dataset** as "today" for the purposes of relative time phrases ("this month," "last quarter," "year to date"). Document this assumption visibly in the UI (a small "as of [max date in data]" label) so it never becomes a silent, hard-to-explain judge question.

## 6. Feature engineering ideas, by domain

| Domain | Derived features worth having ready |
|---|---|
| **Sales** | Period-over-period % change, rolling 3-period average, top-N products/regions/segments, revenue-per-transaction |
| **Finance** | Cost-to-revenue ratio, margin %, expense category share of total |
| **Operations** | Cycle time / turnaround time if a start/end timestamp pair exists, order fulfillment rate |
| **Customer service** | Ticket volume trend, resolution-time distribution, simple keyword/sentiment flag on a free-text comment column if one exists (rule-based or a small pretrained classifier — not a training exercise in itself) |

Every feature above must be traceable to a real column in whatever dataset actually ships — treat this table as a checklist to map against the real schema on 07 Aug, not a fixed requirement to force onto data that doesn't support it.

## 7. Live "messy data" moment for the demo

Deliberately keep one column in the demo dataset with a realistic flaw (a handful of missing values, or a mixed-format date field) rather than pre-cleaning everything to invisibility. When a question touches that column, the system should visibly say what it did about it ("14 rows were missing a region value and were excluded from this comparison") instead of silently producing a number. This is a **Should-Have** from the feature plan and it is one of the highest-leverage 90-second moments available in the whole demo for the Data Preprocessing criterion.
