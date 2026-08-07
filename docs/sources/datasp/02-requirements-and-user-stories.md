# 02 — Requirements & User Stories

**DATASPHERE 26 · Track 06 · Multi-Agent Data Analyst for Enterprise Decision Support**

> Planning document. Final requirements verification happens against the real dataset released on event day.

---

## 1. Functional requirements

Each requirement is written so it can be tested with a yes/no answer during rehearsal.

| ID | Requirement | Acceptance criteria |
|---|---|---|
| FR-001 | Accept a business question in plain English via a chat-style input | Input box accepts free text; no query language required from the user |
| FR-002 | Classify question intent (trend / comparison / ranking / aggregation / anomaly / general) | Orchestrator logs a visible intent label for every question asked in the golden test set |
| FR-003 | Route the classified intent to the correct specialist agent | Router selects Data Agent + Analysis Agent combination matching the intent; visible in the agent trace |
| FR-004 | Generate and execute a real query against the dataset | No hardcoded answers; query text is logged and shown in the trace panel |
| FR-005 | Compute derived metrics deterministically (% change, top-N, average, trend slope) | All numbers in the final answer are traceable to a pandas/DuckDB computation, not free-text LLM output |
| FR-006 | Select a chart type appropriate to the data shape | Trend questions render a line chart, comparisons render a bar chart, composition renders a donut, at minimum |
| FR-007 | Generate a plain-English narrative summarizing the result | A non-technical reader can state the answer back correctly after one read, under 10 seconds |
| FR-008 | Attach a confidence label (High/Medium/Low) with a one-line reason | Confidence label is visible on every answer, not only low-confidence ones |
| FR-009 | Cross-check the narrative against the computed numbers before returning it to the user | Validator agent flags at least one deliberately-triggered mismatch during the golden test run |
| FR-010 | Refuse to answer when the data doesn't support a confident response | At least one golden test question is designed to trigger this refusal path, and it does |
| FR-011 | Attach a recommended action (what to do / who owns it / why) to every insight | Action field is non-empty on every answer in the golden test set |
| FR-012 | Fall back to a local model if the primary cloud API fails or rate-limits | Killing the cloud API key mid-session produces a degraded-but-working answer, not a crash |
| FR-013 | Refresh a Power BI report from agent-produced output data | Report reflects the current dataset after a manual or scheduled refresh, verified before the demo |
| FR-014 | Log every question, route, query, and answer for audit | A session log file exists and is human-readable after a demo run |

## 2. Non-functional requirements

Vague targets are useless in a rubric that includes Explainability and Model Performance — every line below has a number attached where a number is meaningful.

| Category | Requirement |
|---|---|
| **Latency** | A typical question (aggregation/comparison over the working dataset) returns an answer within 15 seconds end-to-end during rehearsal; anything slower gets a visible "thinking" state, never a silent hang. |
| **Reliability** | The demo path must survive one deliberately-forced failure (kill the network, kill the API key) without crashing the app — degrade to the local model or a clear error, never a stack trace on screen. |
| **Explainability** | Every answer exposes: which agent ran, what query/data was used, the confidence label and its reason. No answer is a black box. |
| **Accuracy** | 100% of numbers shown to the user are sourced from executed code, never generated as free text by the LLM. |
| **Usability** | A person with zero SQL/Python knowledge can ask a working question and understand the answer without an explanation from a teammate. |
| **Reproducibility** | A fresh clone of the repo + `pip install -r requirements.txt` + one documented command reproduces the working demo. |
| **Auditability** | Every session produces a log that lets a reviewer reconstruct exactly how an answer was derived, after the fact. |
| **Data handling** | The system does not fabricate values for missing data — it reports the gap instead of guessing. |
| **Portability** | The full stack runs on a single laptop with no required internet access except for the primary cloud LLM call (which has a local fallback per FR-012). |

## 3. User personas

**Primary User — Head of AI Governance (primary persona).** Not technical. Owns SLA numbers, not queries. Needs: "how are the agents doing vs. last quarter, and where's the bottleneck" in the time it takes to walk to a meeting. Success = they trust the number enough to repeat it to their own boss without double-checking it in Excel first.

**Secondary User — ML Ops Engineer.** Semi-technical, comfortable with Python, but currently the bottleneck stakeholders route through for SQL log parsing. Success = the system answers the token-cost questions they currently get asked five times a week, freeing them for actual model building instead of log lookups.

**Judge persona — evaluator, 3-minute attention window.** Has seen several similar demos already today. Needs to see, fast: is this really multi-agent, is it right, does it explain itself, and can a non-technical person actually use it. Success = they can answer all four in the first 90 seconds of the demo.

## 4. User stories

| ID | Story | Priority |
|---|---|---|
| US-01 | As the Head of AI Governance, I want to ask "how did the Finance_Agent perform this quarter" in plain English, so I don't need to open a BI tool or file a ticket. | Must |
| US-02 | As the Head of AI Governance, I want the answer to include a chart, not just a number, so I can screenshot it straight into a meeting. | Must |
| US-03 | As the ML Ops Engineer, I want to see which columns/rows the system used, so I can spot-check it against my own knowledge of the data. | Should |
| US-04 | As the ML Ops Engineer, I want the system to tell me when it's not confident, so I don't repeat a shaky number to leadership. | Should |
| US-05 | As a department head, I want every insight to end with a suggested next step, so the output is a decision aid, not just a report. | Should |
| US-06 | As a judge, I want to see the agent-by-agent trace of how an answer was produced, so I can verify this is genuinely multi-agent and not a single prompt. | Must |
| US-07 | As a judge, I want to see the system handle a question it can't confidently answer, so I can assess whether it knows its own limits. | Should |
| US-08 | As the Head of AI Governance, I want to ask a follow-up question without repeating context, so the interaction feels like talking to a person, not filling a form. | Could |

## 5. Explicit non-goals (see the feature plan for the full Won't/Can't list)

- Not a general-purpose BI platform for arbitrary datasets.
- Not a replacement for a certified financial reporting system — outputs are decision support, not audited figures.
- Not a fully autonomous action-taker — every recommended action with meaningful business risk requires a human "approve" click.

## 6. Judge-alignment matrix

| Requirement group | Problem Understanding | Data Preprocessing | Feature Engineering | Model Performance | Explainability | Innovation | Visualization | Presentation & Q&A |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| Intent classification & routing (FR-001–003) | ● | | | | | ● | | |
| Query & compute layer (FR-004–006) | | ● | ● | ● | | | ● | |
| Narrative & confidence (FR-007–008) | ● | | | | ● | | | ● |
| Validator & refusal (FR-009–010) | | | | ● | ● | ● | | |
| Recommended action (FR-011) | ● | | | | | ● | | ● |
| Hybrid LLM routing (FR-012) | | | | | | ● | | |
| Power BI integration (FR-013) | | | | | | | ● | ● |
| Audit logging (FR-014) | | | | | ● | | | |
