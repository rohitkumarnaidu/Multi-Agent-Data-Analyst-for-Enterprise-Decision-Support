# 02 — Enterprise Upgrade: Competitive Landscape, Tools, Guardrails, Harness & Vision

**DATASPHERE 26 · Track 06 · Multi-Agent Data Analyst for Enterprise Decision Support**

> This file answers three things asked directly: what the real enterprise players in this exact space actually do, how giving agents real tools changes what they can do, and what "Level 9/10" (per the reference document's own framing) looks like versus what we can honestly deliver in 24 hours.

---

## 1. Where the market actually is right now

Every major data platform vendor shipped a natural-language "ask your data" agent within the last year, and they converged on the same architecture from different starting points. This isn't background trivia — it's the fastest way to know what a technically-literate judge already has in their head as "what good looks like."

| Product | Approach | Real strength | Real limitation |
|---|---|---|---|
| **Databricks Genie (AI/BI)** | Curated "Genie rooms" — a data team pre-defines tables, instructions, and example queries per business audience; generates SQL against Unity Catalog-governed tables; supports MCP so external agents (including Claude) can query it | Exposes the generated SQL logic to the user (transparency); supports open-ended scenario exploration for advanced users | Locked to data that lives in Databricks; a new deployment needs real curation work before it's accurate |
| **Snowflake Cortex Analyst** | YAML-based "Semantic Views" mapping business terms to tables/dimensions/facts/relationships; fully-managed, API-first (REST endpoint) | Fast to stand up if data is already in Snowflake; strong out-of-the-box reliability once the semantic layer exists | Snowflake-only — data from anywhere else has to be moved in first; accuracy drops meaningfully without the curated semantic layer |
| **ThoughtSpot Spotter** | Agent suite: SpotterModel (auto semantic modeling), SpotterViz (auto-dashboards), SpotterCode; Auto-Analyze/SpotIQ proactively surfaces anomalies and trends unprompted; requires a semantic layer built in ThoughtSpot's own modeling language first | The proactive anomaly surfacing is exactly the pattern our Anomaly/Risk node already builds toward | The semantic-layer requirement is a genuine weeks-to-months upfront investment for a new deployment — the opposite of what a 24-hour team has |
| **Microsoft Copilot (Power BI / Fabric IQ)** | LLM grounded by RAG directly against the governed Power BI semantic model; can now write full report pages, modify semantic models, and (via open-source "Fabric Skills") let external agents including Claude author reports directly | Deep, native integration with the exact dashboard tool we already committed to; the legacy Q&A feature is explicitly being retired in favor of this Copilot approach by the end of 2026 — the whole industry has already made the same "conversational over static" bet we're making | Full capability requires paid Fabric capacity (F2+); not something available to a free/student build |

**The one finding that matters most:** independent analysis comparing Cortex Analyst and Genie's own published accuracy claims lands on the same conclusion from both vendors — *accuracy lives in the curated context, not the underlying model.* Raw frontier LLMs solve only 10–21% of realistic enterprise text-to-SQL tasks without a curated semantic/business-glossary layer sitting in front of them (per the Spider 2.0 and BEAVER benchmark literature); the entire value both Databricks and Snowflake sell is that curation layer, not the LLM call itself.

**This directly validates the Knowledge/RAG node's design** (Master Plan §6) — retrieving schema context, business-glossary terms, and worked example queries *before* the Data node drafts SQL is not a nice-to-have, it's the single highest-leverage thing separating a toy demo from something that actually works, according to the two biggest vendors in this exact space. Say this explicitly in the pitch — it reframes the Knowledge node from "extra RAG complexity" to "the thing enterprise vendors themselves say matters most."

**The second finding worth citing directly:** an industry analyst reviewing ThoughtSpot's roadmap said explicitly that the space's next move should be a "Decision Agent" that "wouldn't just answer questions" — the whole conversational-BI industry is being told its current products stop one step short of what we've already built: a recommended action, an owner, and a human-approval gate on anything high-risk (Master Plan §5, §11). That's a genuinely defensible "we're ahead of where the market says it's going" claim, not a hollow one.

## 2. What we do differently — honestly

We cannot out-engineer Databricks or Microsoft's infrastructure in 24 hours, and claiming otherwise to a judge would be the wrong move. The honest, defensible claim is narrower and stronger: **we implement the same principles the market has independently converged on — curated retrieval, proactive detection, action over answer, human oversight — inside one small, fully transparent system a judge can see end to end in three minutes.** Enterprise products hide their semantic layer, their agent reasoning, and their guardrails behind a polished UI; ours shows the trace, the confidence score, the query, and the approval gate openly, because that transparency *is* the demo, not an implementation detail.

## 3. Tools = superpowers — formalizing what each agent can actually do

An LLM that only generates text is a chatbot. An LLM that can call a real function and act on the result is an agent — this is the entire premise behind why the field calls these systems "agentic" at all, and it's the concrete reason a tool-calling design matters more than a clever prompt. Every node in the graph gets an explicit, named tool contract:

| Node | Tool(s) it can call | What the tool actually does |
|---|---|---|
| Orchestrator | `classify_intent`, `read_memory` | Structured intent output; reads prior-turn state |
| Knowledge | `search_glossary(query)`, `search_examples(query)`, `search_tickets(query)` | Hybrid BM25+vector retrieval over three separate ChromaDB collections |
| Data | `execute_sql(query)`, `get_schema()` | Read-only DuckDB execution; schema introspection so the LLM never has to guess column names |
| Anomaly/Risk | `score_risk(record)` | Runs the trained XGBoost/LightGBM model, returns a probability + SHAP top-3 features |
| Simulation | `recompute_metric(formula, delta)`, `get_feature_importance(variable)` | Deterministic recompute for Tier 1; model-importance lookup for Tier 2 |
| Narrative | *(no tools — language only)* | Deliberately tool-less, so it cannot accidentally touch data or execute anything |
| Validator | `crosscheck_numbers(narrative, skeleton)` | Regex/parse-based number extraction and comparison |
| Report/Export | `generate_pdf(content)` | WeasyPrint/ReportLab call |

Writing this table out and putting it in the documentation is itself worth doing — "here is the exact tool contract for every agent" is a concrete, inspectable answer to "how do you stop an agent from doing something it shouldn't," which is a near-guaranteed judge question once tool-use comes up.

## 4. Guardrails, upgraded — NeMo Guardrails, as a real Should-Have

`nemoguardrails` is a lightweight, pip-installable Python package — not heavy infrastructure — which makes it a genuine Should-Have rather than something to leave purely on a roadmap slide:

- **Topical rail:** the Orchestrator's out-of-scope refusal (GT-12 in the golden test set) gets backed by an explicit Colang rail definition rejecting non-business-data questions, rather than relying only on prompt instructions that an LLM can occasionally ignore.
- **Input rail — PII masking:** a regex pass scrubs anything shaped like a name, email, or phone number out of the prompt before it ever reaches the LLM, on top of the column-level exclusion already in the Validator's design (Master Plan §12).
- **Execution rail:** the read-only DuckDB boundary and the `DROP`/`DELETE`/`UPDATE`/`INSERT` circuit breaker (already planned) get formalized as an explicit guardrail layer sitting between the Data node and the database, not just a connection-permission setting — this is the difference between "we configured the database defensively" and "we have an inspectable guardrail component," which reads very differently in documentation.

**Build order:** the topical + execution rails are cheap and go in during the Hour 6–9 block alongside the rest of the safety work. PII masking is a Should-Have, added if that block finishes early.

## 5. Prompt harness, upgraded — DSPy, tiered honestly

Static, hand-written prompts (`"You are an expert SQL writer..."`) are fragile — they work until the phrasing of a real question doesn't match what the prompt author imagined. `DSPy` replaces manual tuning with a compiled, measurable process:

- The **golden test set** (18–23 questions, already being built as evaluation infrastructure per Master Plan §12) doubles as the **DSPy training set** — no separate data-collection effort required, which is exactly why this is realistic to attempt rather than purely aspirational.
- A DSPy "teleprompter" (optimizer) runs the Data node's query-drafting prompt against the golden set and searches for the few-shot examples and prompt phrasing that maximize execution accuracy — mathematically, not by a human guessing at wording.

**Honest tiering:** running one real DSPy compile pass against the query-drafting prompt is a genuine Should-Have, attempted at Hour 12–15 once the core pipeline is stable and the golden set exists in full — not attempted before then, since DSPy optimizing an unstable prompt against an incomplete test set wastes the exact time it's meant to save. If the team is behind schedule at that gate, this is one of the items on the cut-line (Master Plan §14.4) — the manually-written prompts already in the base design are a completely legitimate fallback, not a failure state.

## 6. Graph engineering, upgraded — the self-correcting loop, formalized

The Data node already retries once against a real execution error (Master Plan §5.3) — this is the same idea the reference document calls a "Cyclic ReAct Graph," just under a different name. Formalizing it properly, as a pattern applied consistently rather than a one-off:

**Act → Observe → Reason → (loop or halt):**
1. **Act** — a node calls its tool (e.g. Data node executes SQL).
2. **Observe** — the tool's real output, including any error, is captured verbatim (not paraphrased by the LLM).
3. **Reason** — the owning node (or the Orchestrator, for cross-node failures) is given the actual error and decides whether a corrected retry is worth attempting.
4. **Halt condition** — every loop in the graph is capped at a fixed maximum (we use the same 3-loop ceiling the reference document names) before falling through to the graceful-degradation path already defined for that node (Master Plan §5.3) — this is what prevents runaway token burn during a live demo, which is a real and visible failure mode if left unbounded.

This pattern applies uniformly to the Data node's SQL retries, the Narrative↔Validator regeneration cycle, and the Knowledge node's retrieval-quality check — one mechanism, three uses, instead of three bespoke retry implementations.

## 7. Agent evaluation, upgraded — RAGAS and LLM-as-a-judge

Full detail lives in `03-METRICS-EVALUATION-BENCHMARKS.md`; the design decision worth stating here: RAGAS's Faithfulness metric (does the Narrative node's text match the Analysis node's actual numbers) is functionally the same check the Validator node already performs deterministically via number-extraction — running RAGAS *in addition* gives an independent, second measurement using a different method, which is a stronger explainability story than either check alone ("we verify this two different ways" beats "we verify this one way," in a judge conversation). An independent LLM-as-judge pass (a second model scoring Faithfulness and Answer Relevance from 0.0–1.0) is a genuine Should-Have addition, run once over the full golden set as an evaluation artifact, not as a live per-question check (that would double every response's latency for no live-demo benefit).

## 8. ML model benchmarking, upgraded — SMOTE and a real baseline table

The reference document's model benchmark table is a template worth adopting directly: a **named baseline** (plain Logistic Regression) compared against the **production model** (XGBoost, with SMOTE applied if the real dataset's label turns out to be as imbalanced as the reference project's "only 12% of orders are late" example). SMOTE (Synthetic Minority Over-sampling) is a genuinely cheap, well-understood technique to add if Hour 6–9's class-balance check reveals a skewed label — it's a few lines via `imbalanced-learn`, not a research project. Report the same shape of table: Precision / Recall / ROC-AUC, baseline versus production, side by side — this is what makes "Model Performance" a real, inspectable number rather than an assertion.

**Inference latency target:** under 200ms per scoring call, so the Anomaly/Risk node never becomes the bottleneck in an otherwise-real-time chat experience — this is a legitimate, measurable non-functional requirement to add to Master Plan §12.

## 9. Self-improvement — what "go back and improve the model" actually means here

Two real, buildable layers, kept honest about what runs live tonight versus what's designed-and-demonstrated-once versus what's genuinely future work:

- **Feedback capture (build for real):** every Validator catch, every low-confidence answer, and every golden-test failure gets logged in a structured format — this is the raw material for improvement, and it costs almost nothing to build since the logging infrastructure already exists for the trace panel.
- **One real DSPy re-optimization pass (Should-Have, Hour 12–15):** described in Section 5 — this *is* the "go back and improve the model" loop, made concrete and actually runnable in the time available, rather than a vague aspiration.
- **Model retraining trigger (designed, demonstrated once, not looped live):** the XGBoost model's training script accepts new labeled data and re-trains — show this working once, with before/after metrics, as proof the mechanism exists. Don't attempt to build an automated, continuously-retraining production loop live; that's real MLOps infrastructure and is explicitly Section 10's future-roadmap material, not a 24-hour deliverable.
- **Versioning:** every model artifact and every DSPy-compiled prompt gets a filename with a version/timestamp, so a regression can always be rolled back to the last known-good version in seconds — cheap insurance, real engineering discipline, worth mentioning to a judge asking about production-readiness.

## 10. Future vision — now, near future, and where this goes

| Horizon | What exists | What it looks like |
|---|---|---|
| **Now (this event)** | The 8-node graph, real trained model, real guardrails, real evaluation set, two dashboards | A working decision-support assistant for one dataset, demoed live, with an honest account of its own limitations |
| **Near future (weeks after)** | Dynamic schema discovery (a dedicated "Database Architect Agent" that reads `INFORMATION_SCHEMA` before the Data node writes SQL, per the reference roadmap) | The system plugs into *any* company's database without a human manually describing the schema first — removing the single biggest manual-setup cost every enterprise competitor also has to solve |
| **Near future** | Cloud-hosted backend (FastAPI on a container platform), decoupled from any one laptop's environment | Removes the exact dependency fragility this whole setup file exists to manage — the permanent fix, not just tonight's workaround |
| **Future (production vision)** | Row-Level Security in the Data node — the Orchestrator becomes aware of the asking user's role and forces a `WHERE` clause matching their access scope | Enterprise-safe multi-user deployment — a regional manager's question physically cannot return another region's data, enforced in the query layer, not just the UI |
| **Future** | AutoML integration (PyCaret/H2O) behind the Simulation node | "Forecast next month" trains a real time-series model on the fly instead of relying only on historical-correlation direction — turning today's honestly-labeled "directional estimate" into a genuine forecast |
| **Future** | Continuous DSPy re-optimization + automated model retraining, triggered on a schedule against accumulated real usage data | The one-time manual passes described in Section 9 become a standing production pipeline — the actual "self-improving system" the current design is a deliberate, honest first step toward |

Stated as a single sentence for the pitch: *this weekend proves the architecture; the roadmap above is the difference between a hackathon prototype and the thing the market is already paying Databricks and Snowflake for — and we know exactly what that difference is, because we measured ourselves against it.*

### Sources consulted
- https://medium.com/@satadru1998/databricks-lacks-what-matters-most-snowflake-delivers-in-text2sql-2330b5dac13a
- https://querio.ai/articles/best-ai-analytics-tools-connect-snowflake-bigquery-databricks
- https://addepto.com/databricks-vs-snowflake-2026-which-platform-is-better-for-enterprise-ai-genai/
- https://colrows.com/blogs/cortex-analyst-vs-genie/
- https://infinisynapse.com/en/blog/databricks-genie
- https://www.knowi.com/blog/best-agentic-bi-tools/
- https://www.techtarget.com/searchbusinessanalytics/news/366636078/ThoughtSpot-automates-full-platform-with-new-Spotter-agents
- https://querio.ai/articles/natural-language-query-business-intelligence-thoughtspot-vs-power-bi-vs-tableau-2026
- https://azure.microsoft.com/en-us/blog/microsoft-build-2026-building-agentic-apps-with-microsoft-fabric-and-microsoft-databases/
- https://www.neenopal.com/blog/NaturalLanguageProcessing
- https://aiproductivity.ai/vs/power-bi-vs-thoughtspot/
