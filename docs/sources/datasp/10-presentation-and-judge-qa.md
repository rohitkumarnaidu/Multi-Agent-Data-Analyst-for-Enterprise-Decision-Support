# 10 — Presentation & Judge Q&A

**DATASPHERE 26 · Track 06 · Multi-Agent Data Analyst for Enterprise Decision Support**

---

## 1. Slide plan (9 slides, 3–5 minutes)

| # | Slide | Content | Owner |
|---|---|---|---|
| 1 | Problem & team | One-line problem restatement, team names/roles, track | Member C |
| 2 | Who this is for | Primary/Secondary user personas from `02-requirements-and-user-stories.md`, why the current process is slow | Member C |
| 3 | The data | Dataset domains covered, what cleaning was done, one honest data-quality caveat | Member A |
| 4 | Architecture | The five-agent diagram from `03-multi-agent-architecture.md`, Section 1 | Member B |
| 5 | What makes this different | The six differentiators from the feature plan HTML, condensed to bullets | Member B |
| 6 | Live demo | Not a slide — switch to the running app | All three |
| 7 | Evidence | Golden test set result (X/18), baseline-vs-agent comparison from `06`, Section 2 | Member A |
| 8 | Explainability & safety | Trace panel, confidence scoring, human-approval gate, honest limitations | Member B |
| 9 | Impact & close | What changes for a business user, what we'd do with more time, closing line | Member C |

## 2. Speaking flow (timed)

1. **Problem (20s)** — state it in one sentence, name who feels the pain.
2. **User (20s)** — Business users can't get an answer without a queue; that's the gap.
3. **Data (20s)** — what domains, what was cleaned, the one honest caveat.
4. **Architecture (30s)** — five agents, orchestrator to validator, in one breath, pointing at the diagram.
5. **Live demo (90–120s)** — ask a real question, show the answer, open the trace panel, then ask a question designed to trigger a refusal or the approval gate on purpose.
6. **Evidence (20s)** — golden test result, baseline comparison in one sentence.
7. **Explainability & safety (20s)** — how a wrong number gets caught before it's shown.
8. **Impact & close (20s)** — what changes for a real business user; one sentence on what's next; stop talking.

**Time warning markers:** if at 2:30 the live demo hasn't started, cut straight to it — the demo is worth more than any remaining slide content.

## 3. Judge Q&A — answer bank

Each entry: direct answer, evidence, one metric, one limitation, one thing to improve with more time. Fill the bracketed numbers in with real results once the golden test run is complete.

**Why did you select this problem?**
Direct: It scores directly against the categories weighted heaviest — Model Performance and Data Preprocessing — because it's fundamentally about producing correct numbers, not just fluent text. Evidence: judge-alignment matrix in `02-requirements-and-user-stories.md`. Limitation: we chose it over the RAG problem knowing our differentiation had to come from execution, since the pattern itself is common. Improve: —

**Why is this problem important?**
Direct: Business decisions get delayed waiting on a human analyst queue; this closes that loop for a defined class of questions. Evidence: personas and existing-process breakdown in `01`. Limitation: it doesn't replace deep, novel analysis — only the repeatable, well-scoped question class. Improve: expand the intent-classification categories over time.

**Why did you use GenAI here specifically?**
Direct: Two places, and only two: translating an ambiguous English question into a structured intent/query, and translating computed numbers back into plain English. Every number in between is computed by code, not generated. Evidence: `03`, ADR-001. Limitation: the LLM's classification/query-drafting can still misfire on unusual phrasing — that's why Data Agent retries and the Orchestrator falls back to a rule-based classifier. Improve: expand the training examples in the intent classifier.

**Why is an agent needed instead of one prompt?**
Direct: Because the task has real sub-steps with different failure modes — retrieval, computation, language, and verification — and treating them as one prompt means one failure (a hallucinated number) is invisible. Splitting them means each step can be checked independently. Evidence: baseline-vs-agent comparison, `06`, Section 2. Limitation: more moving parts to build and test in 24 hours. Improve: —

**Why not just use a normal ML model?**
Direct: The task isn't prediction from historical patterns — it's on-demand, natural-language-triggered retrieval and computation over whatever question gets asked. There's no fixed label to train a model against. Evidence: problem statement's own framing — "interpret natural language business questions," not "predict X." Limitation: for genuinely predictive questions ("will next quarter be higher"), the system currently doesn't forecast — it reports history. Improve: add a lightweight forecasting agent as a stretch.

**What is your baseline?**
Direct: A single LLM call given the raw question and a data sample, no agents, no validation. Evidence: `06`, Section 2. Metric: [baseline groundedness % vs. agent-pipeline groundedness %, filled in after the run]. Limitation: baseline is intentionally simple — a stronger single-prompt baseline (e.g. with function-calling) would narrow the gap somewhat. Improve: —

**How much did the advanced system improve on the baseline?**
Direct: [state the actual measured gap once run — e.g. "baseline produced ungrounded numbers on X% of test questions; the full pipeline produced zero, because the Validator catches them before they ship"]. Evidence: `06`, Section 2 comparison. Limitation: sample is our 18-question golden set, not a large statistical benchmark. Improve: expand the test set post-event.

**How did you prevent hallucinations?**
Direct: The LLM never generates a number — it only narrates numbers a deterministic code path already computed, and a second agent cross-checks the narrative against those numbers before it ships. Evidence: `03`, ADR-001 and the Validator Agent design. Metric: GT-17's catch rate. Limitation: this catches *number* hallucination specifically; it doesn't fully guard against subtler misinterpretation of what a correct number means. Improve: add a second independent check on causal/interpretive claims, not just numeric ones.

**How did you evaluate the agents?**
Direct: An 18-question golden test set spanning all four business domains plus explicit edge cases (ambiguous phrasing, missing data, out-of-scope questions, rate-limit failure, deliberate mismatch injection). Evidence: `06`, Section 3, full table. Metric: [X/18, with the four safety-critical tests called out]. Limitation: hand-built, not exhaustive. Improve: grow the set with real questions observed during the demo/Q&A itself.

**What happens when retrieval fails?**
Direct: One self-correction retry using the actual error message, then a graceful "I couldn't retrieve that" response — never a stack trace, never a fabricated table. Evidence: `03`, Data Agent failure condition. Limitation: — Improve: —

**What happens when the agent chooses the wrong tool/route?**
Direct: There's only one routing decision (Orchestrator → specialist agents), guarded by a confidence threshold; below threshold, it asks a clarifying question instead of guessing. Evidence: `03`, Orchestrator decision rules. Limitation: a genuinely ambiguous question can still get one clarifying round wrong. Improve: —

**How did you handle missing data?**
Direct: Missing values are reported in the schema summary, not silently dropped or imputed; if a question touches an affected column, the answer states what was excluded and why. Evidence: `04`, Section 3 and Section 7 (the live messy-data demo moment). Limitation: — Improve: add configurable imputation strategies for cases where silent exclusion isn't the right call.

**How did you avoid data leakage?**
Direct: This is a descriptive-analytics system, not a trained predictive model, so classic train/test leakage doesn't apply in the traditional sense — the relevant analogue is making sure "as of" date logic doesn't let a relative-time question quietly reference data it shouldn't. Evidence: `04`, Section 5. Limitation: — Improve: —

**How explainable is the model?**
Direct: Every answer exposes the exact query executed, the raw computed values, the confidence label with its reason, and which model (cloud or local fallback) produced the narrative. Evidence: `06`, Section 4. Limitation: the underlying LLM's own reasoning process for query drafting isn't inspectable beyond its output — we verify outputs, not internal reasoning. Improve: —

**How do you protect private/sensitive data?**
Direct: Any column that looks like it identifies an individual is excluded from free-text narrative generation by default and flagged in the schema report. Evidence: `06`, Section 5. Limitation: this is a heuristic, not a certified PII-detection system, and the competition dataset is unlikely to contain real PII in the first place — we're not overclaiming production-grade privacy guarantees. Improve: —

**Can the system scale?**
Direct: The architecture doesn't assume a specific data size — DuckDB handles substantially larger datasets than this event uses without a redesign, and the agent pipeline is stateless per question. Evidence: `07`, Section 1. Limitation: not load-tested for concurrent users; built and tested for a single-user demo context. Improve: add a query queue and connection pooling for multi-user production use.

**What are the limitations?**
Direct, stated plainly: it answers the class of questions the golden test set represents well; it doesn't forecast; it depends on reasonably clean column naming to route correctly; the local-model fallback is measurably weaker than the primary cloud model. Evidence: system card, `06`, Section 6. Improve: each of these is a named next step, not a hidden gap.

**What would you improve with more time?**
Direct: A forecasting agent, a larger/crowd-sourced golden test set, live Power BI push-dataset refresh (Path B) as the default rather than the reach case, and a second interactive slicer on the dashboard. Evidence: Could-Have list in the feature plan. Limitation: — Improve: —

**What is genuinely innovative here?**
Direct: Not the multi-agent pattern itself — that's now well-established. The deterministic numeric core with an LLM confined strictly to language, the Validator Agent as a hard gate rather than a suggestion, the hybrid cloud/local routing built in from day one, and pairing a conversational agent with an actual Power BI report instead of one more chat window. Evidence: differentiation section of the feature plan. Limitation: — Improve: —

**Who benefits?**
Direct: The non-technical business user who currently waits on an analyst, and the analyst who currently answers the same handful of questions repeatedly instead of doing deeper work. Evidence: personas, `02`. Limitation: — Improve: —

**What action does the system enable?**
Direct: Every insight carries a named recommended action, an owner, and a reason — not just a number — with high-risk recommendations gated behind explicit human approval. Evidence: `03`, Narrative Agent and human-approval checkpoint. Limitation: — Improve: —

**Can the results be reproduced?**
Direct: Yes — a fresh clone plus the documented setup command reproduces the working demo; every session's queries and results are logged. Evidence: README, reproducibility gate in `08`, Hour 15–18. Limitation: — Improve: —

**Why should this solution win?**
Direct: Because it treats "explainable and accurate" as the actual brief, not a checkbox — every number is provably grounded, the system demonstrably catches its own mistakes on request, and the dashboard looks like something an enterprise would actually deploy, not a hackathon prototype. Evidence: the whole planning set, demonstrated live. Limitation: we'll let the demo answer that one. Improve: —
