# 06 — Evaluation, Explainability & Safety

**DATASPHERE 26 · Track 06 · Multi-Agent Data Analyst for Enterprise Decision Support**

> Planning document. Actual scores/results get filled in during the event, against the real dataset — the structure below is what to fill, not a finished result.

---

## 1. What gets measured, and how

| Component | Metric | How it's captured |
|---|---|---|
| Orchestrator (routing) | Routing accuracy — % of golden test questions routed to the correct intent | Manual check against expected intent label, logged per question |
| Data Agent (query) | Query success rate — % of questions where a valid, executable query was produced | Logged automatically: query attempted, executed without error |
| Analysis Agent (computation) | Numeric correctness — % of computed values that match an independently-verified manual calculation | Spot-checked by hand for every golden test question before the demo |
| Narrative Agent (language) | Groundedness — % of narratives with zero unsupported numbers | Checked by the Validator Agent automatically, confirmed manually for the golden set |
| Validator Agent | Catch rate — of deliberately injected mismatches, % correctly flagged | Tested directly (see Section 3, test case GT-17) |
| End-to-end | Latency — seconds from question submitted to answer rendered | Logged per question, p50 and worst-case reported |
| End-to-end | Confidence calibration — does "High confidence" correlate with actually-correct answers in spot checks | Reviewed manually across the golden set |

## 2. Baseline comparison

Before the multi-agent pipeline is trusted as "the system," a **single-prompt baseline** must exist: one LLM call, given the raw question and a sample of the data, asked to just answer directly with no agents, no validation. Run the same golden test set through both.

This baseline is not a throwaway — it's the evidence for "why does this need to be multi-agent," a question the judge Q&A doc treats as close to guaranteed. The expected (and typical) result: the baseline is faster to build but produces ungrounded numbers and no audit trail, which is precisely what the multi-agent + validator design fixes. Document the actual comparison once it's run — don't assert this outcome without checking it.

## 3. Golden test set

18 questions, deliberately spanning all four domains named in the problem statement plus explicit edge cases. Adjust the exact wording once the real dataset's actual columns are known — the **categories** below are what matters and should stay fixed.

| ID | Category | Example question shape | What it's testing |
|---|---|---|---|
| GT-01 | AI Efficiency / trend | "How has AI Token Efficiency trended over the last 6 months?" | Line chart selection, trend computation |
| GT-02 | AI Efficiency / comparison | "Compare this quarter's AI Cost Savings to last quarter" | Comparison intent, % change math |
| GT-03 | Governance / ranking | "What are our top 5 departments by SLA breach count?" | Top-N logic, bar chart |
| GT-04 | Governance | "What's our Human-in-the-loop escalation rate this year?" | Cross-column derived metric (rate = escalations/total_queries) |
| GT-05 | Business Impact | "Which agent's token cost grew the fastest?" | Multi-group comparison + ranking combined |
| GT-06 | Risk | "What's the average latency for the Finance_Agent?" | Duration/Average computation from processing_time columns |
| GT-07 | Risk | "Did False Confidence rates get worse recently?" | Trend over a derived (not raw) column |
| GT-08 | System / Aggregate | "How many total queries did the orchestrator process last month?" | Simple aggregation, exact count correctness |
| GT-09 | NLP / text | "What are the most common reasons for SLA breaches?" | Light text-field handling (keyword/category tally on a failure_reason field) |
| GT-10 | Cross-domain | "Is the agent with the highest token cost also our most frequently escalated agent?" | Two-agent-cycle question requiring two separate queries combined in one narrative |
| GT-11 | Ambiguous phrasing | "How are we doing?" | Orchestrator must ask a clarifying question rather than guess, or must pick a sensible default and say so explicitly |
| GT-12 | Out-of-scope | "What's the weather forecast for next week?" | Orchestrator correctly refuses instead of hallucinating an answer |
| GT-13 | Missing data | A question that touches the column deliberately left with missing values (see `04-data-strategy-and-nl-to-insight-pipeline.md`, Section 7) | System reports the gap instead of silently filling it |
| GT-14 | Small sample | A question scoped narrowly enough to hit a low-row-count result | `low_sample_size` flag fires, confidence capped at Medium, narrative hedges |
| GT-15 | High-risk action | A question whose natural answer implies a staffing/spend/vendor decision | `requires_human_approval` fires, UI shows the approval gate |
| GT-16 | Rate-limit / failure | Same as GT-01, run with the primary cloud API key deliberately disabled | Local-model fallback answers correctly, system doesn't crash |
| GT-17 | Injected mismatch (validator test) | A crafted case where the Narrative Agent is fed a deliberately altered number | Validator Agent catches the mismatch and rejects/regenerates rather than shipping it |
| GT-18 | Follow-up (Could-Have, only if built) | A second question referencing "that" from GT-01's answer | Multi-turn memory resolves the reference correctly, or the system says it can't and asks for the full question again |

**Target before judging:** 16/18 or better passing, with GT-12, GT-13, GT-16, and GT-17 (the safety/failure cases) at 100% — these four matter more to the rubric than one more SLA chart working.

## 4. Explainability techniques actually implemented

- **Visible agent trace** — every answer's UI includes a collapsible "how this was produced" panel showing: intent classification, the exact query executed, the raw values the Analysis Agent computed, and the Validator's confidence reasoning.
- **Confidence label with a stated reason**, never a bare badge — "Medium confidence: based on 14 records, below our 30-record threshold for High," not just "Medium."
- **Decision log** — every session's questions, routes, queries, and confidence outcomes are written to a plain-text/CSV log file, so a judge asking "can you show me a case where it wasn't confident" has an immediate, real answer instead of a hypothetical.
- **Model/System card** (Section 6) — a one-page honest account of what the system does and doesn't do well, handed to judges if asked or included in the documentation deliverable.

## 5. Safety guardrails

| Risk | Guardrail |
|---|---|
| Infinite/looping agent calls | Hard step ceiling per question (8 steps total — see `03-multi-agent-architecture.md`, Section 6), enforced in code |
| Destructive query | Read-only database connection; allow-list of query operations (SELECT/aggregate only) enforced at the connection layer, not just by prompting the LLM to "please only read" |
| Prompt injection via the question box | The question text is never concatenated directly into a system-level instruction; it's passed as user content within a fixed prompt template, and the query-generation step only ever has visibility into real column names — it can't be talked into referencing a table that doesn't exist |
| Tool hallucination (agent claims it used a tool it didn't) | Every "tool used" claim in the trace panel is populated from actual execution logs, never from the LLM describing what it did |
| Excessive latency during a live demo | 8-second query timeout, 5-second classification timeout, both with deterministic non-LLM fallbacks (Section 3 of `03-multi-agent-architecture.md`) |
| Sensitive/PII-shaped columns in the real dataset | If any column looks like a name/email/ID tied to an individual, it's excluded from free-text narrative generation by default (aggregate-only), flagged in the schema report — even though the competition dataset is very unlikely to contain real PII, treating it as if it might is itself worth a sentence in the safety section of the documentation |

## 6. Model / System Card — template

Fill this in for real once the system is running against the actual dataset. The structure below is complete; the content is written during the event.

```
SYSTEM CARD — Multi-Agent Data Analyst (DATASPHERE 26, Track 06)

Purpose:            [one sentence — what business question this system answers]
Components:         Orchestrator, Data Agent, Analysis Agent, Narrative Agent, Validator Agent
Primary LLM:        [model + provider actually used on the day]
Fallback LLM:       [local model actually used on the day]
Data:               [dataset name, size, domain columns actually present]
Golden test result: [X / 18 passing, with breakdown by category]
Known limitations:  [filled honestly — e.g. "cannot answer questions requiring
                     data outside the loaded dataset's date range"]
Human oversight:    Recommended actions above the risk threshold require
                     explicit approval before being shown as final.
Failure behavior:   Degrades to local model, then to raw-data display,
                     never to a fabricated answer or a crash.
```

## 7. What "explainable and accurate" means to say out loud to a judge, in one sentence

*"Every number you see came from code that ran against the real data — the model's only job is to describe what already happened, and a second agent checks that description before it ever reaches the screen."*
