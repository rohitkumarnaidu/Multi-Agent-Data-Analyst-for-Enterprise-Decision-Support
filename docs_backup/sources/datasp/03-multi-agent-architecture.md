# 03 — Multi-Agent Architecture

**DATASPHERE 26 · Track 06 · Multi-Agent Data Analyst for Enterprise Decision Support**

> Planning document. Build happens live during the event against the real dataset.

---

## 1. Architecture at a glance

```
 Business question (plain English)
          │
          ▼
   ┌─────────────────┐
   │  ORCHESTRATOR    │  intent classification, routing, state
   └────────┬─────────┘
            │
            ▼
   ┌─────────────────┐        ┌─────────────────┐
   │   DATA AGENT     │───────▶│ ANALYSIS AGENT   │
   │ query + retrieve │  raw   │ compute metrics  │
   └─────────────────┘  table └────────┬─────────┘
                                        │ numbers + chart spec
                                        ▼
                              ┌─────────────────┐
                              │ NARRATIVE AGENT  │  LLM writes English
                              │ (LLM, grounded)  │  around fixed numbers
                              └────────┬─────────┘
                                       │ draft answer
                                       ▼
                              ┌─────────────────┐
                              │ VALIDATOR AGENT  │  checks narrative vs.
                              │                  │  source numbers, scores
                              │                  │  confidence, can refuse
                              └────────┬─────────┘
                                       │
                     low confidence /  │  normal
                     high-risk action  │
                              ▼        ▼
                     ┌────────────┐  final answer + chart
                     │ HUMAN CHECK│  → chat UI + Power BI
                     │ (approve)  │
                     └────────────┘
```

Five agents, one deterministic core (Data + Analysis agents never call an LLM to produce a number — only to decide *how* to query and *what* to compute). The LLM's job is strictly: classify intent, write queries, and turn verified numbers into English. It never invents a figure.

## 2. Agent-by-agent design canvas

### Orchestrator Agent
- **Goal:** Read the raw question, classify intent, decide which agent(s) to invoke and in what order, hold session state for follow-ups.
- **Trigger:** New message in the chat UI.
- **Input:** Raw natural-language question, prior turn context (if any).
- **Output:** Intent label (trend / comparison / ranking / aggregation / anomaly / out-of-scope), routing decision.
- **Tools:** Intent-classification prompt (LLM call, cheap/fast model), session state store.
- **Decision rules:** If intent confidence from the classifier is below a threshold, ask one clarifying question instead of guessing the route. If the question references a domain outside the dataset (e.g. asks about weather), classify as out-of-scope and route straight to a polite refusal — do not invoke downstream agents.
- **Max steps:** 1 classification call per question.
- **Retry:** 1 retry on malformed classifier output, then fall back to a keyword-based rule classifier (deterministic, no LLM) so the system never fully stalls.
- **Timeout:** 5 seconds for the classification call before falling back to the rule-based classifier.
- **Completion condition:** A valid route is selected and handed off.
- **Failure condition:** Classifier and rule-based fallback both fail to produce a route → return "I couldn't understand that as a business question about this data — could you rephrase it?"

### Data Agent (Query & Retrieval)
- **Goal:** Turn the classified intent + question into an executable query against the dataset and return a raw result table.
- **Input:** Intent label, original question, schema of the loaded dataset.
- **Output:** Executed query text (for the trace panel) + raw result DataFrame.
- **Tools:** LLM call to draft the query (pandas expression or SQL against DuckDB), a schema-aware prompt that only knows real column names (prevents inventing columns), query execution sandboxed against a read-only connection.
- **Decision rules:** Query is generated, then executed; if execution throws an error, the error message is fed back to the LLM once for a self-correction attempt; a second failure routes to a graceful "I couldn't retrieve that" response rather than a stack trace.
- **Guardrail:** Query is validated against an allow-list of operations (SELECT/aggregate only — no DELETE/UPDATE/DROP is ever permitted, enforced at the connection level, not just by prompting).
- **Max steps:** 1 query attempt + 1 self-correction retry.
- **Timeout:** 8 seconds execution limit; long-running queries are killed and reported as a data-volume limitation, not left to hang.
- **Completion condition:** A result table (possibly empty) is returned with the exact query used attached.
- **Failure condition:** Two failed attempts → escalate to Orchestrator's refusal path.

### Analysis Agent
- **Goal:** Convert the raw result table into the actual analytical content: percentage changes, trend direction, top-N rankings, anomaly flags, averages, segment comparisons — computed in code, not language.
- **Input:** Raw result DataFrame, intent label.
- **Output:** A structured "insight skeleton" — a small dict of named, computed values (e.g. `{"metric": "revenue", "period": "Q3", "change_pct": -12.4, "driver_segment": "Region West", "sample_size": 214}`) plus a chart spec (chart type + fields to plot).
- **Tools:** Pure pandas/numpy computation — **no LLM call in this agent**. This is deliberate: it is the deterministic core that everything downstream is grounded against.
- **Decision rules:** Chart type selection is rule-based on data shape (time column present → line; two categorical groups being compared → bar; parts of a whole → donut; single numeric distribution → histogram).
- **Completion condition:** Insight skeleton + chart spec produced.
- **Failure condition:** Result table too small/empty to compute a meaningful metric (e.g. fewer than 3 rows for a trend) → sets a `low_sample_size` flag that the Validator Agent must respect.

### Narrative Agent (LLM, grounded generation)
- **Goal:** Turn the insight skeleton into a plain-English answer a non-technical person can read in under 10 seconds, plus a recommended action.
- **Input:** Insight skeleton (numbers already computed, immutable at this point).
- **Output:** Draft narrative text + recommended action (what to do / who owns it / why).
- **Tools:** LLM call with a strict prompt: *"You will be given fixed numeric facts. Write one short paragraph explaining them in plain English and one recommended action. Do not introduce any number not present in the input."*
- **Decision rules:** If the `low_sample_size` flag is set, the action recommendation must explicitly hedge ("based on a small sample, treat this as directional") rather than state it plainly.
- **Completion condition:** Draft narrative + action text produced.
- **Failure condition:** LLM call fails/times out → local model fallback (see `07-tech-stack-and-tooling.md`) generates the narrative from the same fixed insight skeleton.

### Validator Agent
- **Goal:** Catch any mismatch between the draft narrative and the source insight skeleton before the user sees it; assign a confidence label; decide if human approval is required.
- **Input:** Draft narrative + the original insight skeleton it was supposed to be grounded in.
- **Output:** Final approved narrative (unchanged, corrected, or replaced with a refusal), confidence label (High/Medium/Low) + one-line reason, `requires_human_approval` flag.
- **Tools:** A numeric extraction pass over the narrative text (regex/simple parsing) compared against the insight skeleton's actual values; a rule set for confidence scoring (sample size, data recency, whether the query hit a fallback path).
- **Decision rules:**
  - Any number in the narrative that doesn't match the skeleton (beyond rounding tolerance) → reject and regenerate once, or fall back to a template-based narrative built directly from the skeleton with no LLM involved.
  - `low_sample_size` or fallback-model-used → confidence capped at Medium.
  - Recommended action classified as high-risk (anything implying a financial, staffing, or vendor decision) → `requires_human_approval = true`.
- **Completion condition:** Final answer, confidence label, and approval flag returned to the UI.
- **Failure condition:** Cannot produce a matching narrative after 1 regeneration → falls back to displaying the raw insight skeleton and chart with a note that automated narration is unavailable for this answer — the system fails visibly and safely, never silently.

### Human-approval checkpoint (not an agent — a UI gate)
Triggered whenever the Validator sets `requires_human_approval`. The chat UI shows the recommended action greyed out with an "Approve" button before it's presented as final. This is deliberately left in the demo, not automated away — see `01-problem-analysis-and-competitive-landscape.md` and the differentiation section of the feature plan for why this is a scoring point, not a limitation to hide.

## 3. Agent Necessity Test

Before adding any agent beyond these five, answer all of the following. If any answer is "no," don't add it.

| Question | Orchestrator | Data | Analysis | Narrative | Validator |
|---|---|---|---|---|---|
| Why is a single function insufficient? | Routing needs judgment across ambiguous phrasing | Query generation must adapt to arbitrary questions | Metric choice depends on intent | Language generation is inherently non-deterministic work | Cross-checking needs independent judgment from the generator |
| What measurable benefit does it provide? | Correct agent invoked for the right task | Real answers, not canned ones | Numbers are trustworthy and reproducible | Non-technical users understand the answer | Hallucinated numbers are caught before shipping |
| What happens when it fails? | Falls back to rule-based classifier | Falls back to graceful refusal | Sets `low_sample_size`, downstream hedges | Falls back to local model, then template | Falls back to raw skeleton display |

A sixth agent (e.g. a dedicated "anomaly-detection agent") is a **Could-Have** — only add it once these five are demo-stable, per the feature plan.

## 4. Framework choice

**Primary: CrewAI.** Role-based agent definitions map directly onto the canvas above (each agent = a CrewAI agent with a role, goal, and backstory), and it's the fastest of the major frameworks to get a working multi-agent pipeline running from zero — the right trade for a 3-person, 24-hour build.

**Escalation path: LangGraph.** If the Validator's retry/approval branching logic (Section 2) turns out to need more explicit state management than CrewAI's task-chaining comfortably gives, port just the Validator step into a small LangGraph subgraph rather than rewriting the whole pipeline. Don't switch frameworks wholesale mid-event.

**Not used: AutoGen/AG2.** Its strength is open-ended multi-agent conversation/debate, which isn't the shape of this problem — the pipeline here is a fixed, auditable sequence, not a negotiation.

## 5. Architecture decision records

**ADR-001 — Deterministic Analysis Agent, no LLM in the numeric path.**
*Context:* Explainability and Model Performance are the two heaviest-weighted rubric categories.
*Decision:* All numeric computation happens in pandas/DuckDB code; the LLM only ever narrates already-computed values.
*Consequence:* Slightly more engineering work up front (structured insight-skeleton contract between agents) in exchange for numbers that are provably correct, not just plausible-sounding.

**ADR-002 — Validator Agent as a hard gate, not a soft suggestion.**
*Context:* Public reference projects demo the happy path only; a caught hallucination is more convincing evidence of explainability than a clean run.
*Decision:* The Validator can reject and regenerate, or fall back to a raw-numbers display — it is never bypassed.
*Consequence:* One deliberately-designed golden-test question exists specifically to trigger this path for the demo (see `06-evaluation-explainability-safety.md`).

**ADR-003 — CrewAI over LangGraph as the default framework.**
*Context:* Team has 24 hours and 3 people; both frameworks can express the pipeline.
*Decision:* CrewAI for speed of initial build; LangGraph only as a targeted fallback for the Validator's branching logic if needed.
*Consequence:* Faster path to a working end-to-end demo; slightly less explicit control over state than a full LangGraph build would give.

**ADR-004 — Human approval checkpoint kept, not automated away.**
*Context:* A fully autonomous system that "just acts" reads as a risk to judges evaluating explainability and safety-mindedness, and the problem statement itself frames this as *decision support*, not decision automation.
*Decision:* Any recommended action flagged high-risk requires an explicit UI approval click before being presented as final.
*Consequence:* One extra UI state to build, and a genuinely defensible answer to "what stops this from doing something wrong automatically."

## 6. Loop and failure controls (system-wide)

- **Max total steps per question:** Orchestrator (1) + Data Agent (2 max with retry) + Analysis Agent (1) + Narrative Agent (2 max with fallback) + Validator (2 max with regeneration) = 8 steps ceiling, enforced in code, not just documented.
- **No agent calls another agent directly** — all hand-offs go through the Orchestrator's state object, so there is no path to an accidental agent-to-agent loop.
- **Every LLM call has a timeout and a non-LLM fallback** (rule-based classifier, template narrative, raw-skeleton display) — the system degrades, it never hangs.
