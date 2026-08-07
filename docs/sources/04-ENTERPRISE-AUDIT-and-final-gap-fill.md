# 04 — Enterprise Master-Prompt Audit & Final Gap-Fill

**DATASPHERE 26 · Track 06 · Multi-Agent Data Analyst for Enterprise Decision Support**

> This file runs the `Universal_Enterprise_Phase_Execution_Master_Prompt.md` framework against everything built so far, section by section, in the same Pass/Partial/Not-Applicable format that master prompt itself specifies in its own §36. Three outcomes per item: **Covered** (already done, cited to where), **Scoped Out** (deliberately not built, with the reason stated so it's a decision, not an oversight), or **Gap — filled below** (genuinely missing, added in Section 2 of this file). Also reconciles the new `MVP_Multi_Agent_Data_Analyst.md` document against what's already committed — some of it is a genuine upgrade, some of it was written for a different context and would actively undo decisions already locked in. Both get said plainly.

---

## 1. The audit

| Universal Prompt phase | Verdict | Evidence / reason |
|---|---|---|
| §5.1 Problem analysis | ✅ Covered | Master Plan §1; `01-problem-analysis-and-competitive-landscape.md` |
| §5.2 Vision statement | ✅ Covered | Master Plan §4 (differentiators) functions as the vision/USP statement |
| §5.3 Stakeholder analysis | ✅ Covered | Master Plan §3; requirements file's persona table |
| §5.4 Scope definition | ✅ Covered | Feature plan HTML's MoSCoW (Must/Should/Could/Won't/Can't) is a stronger, more decision-useful version of this than a prose scope doc |
| §5.5 Feasibility study | ✅ Covered | Risk register + the cut-line (Master Plan §14.4) is the practical form of a go/revise/no-go call, reviewed at every execution gate rather than once upfront |
| §6 Research & competitor analysis | ✅ Covered | `02-ENTERPRISE-UPGRADE-competitive-landscape-and-vision.md` — Databricks Genie, Snowflake Cortex Analyst, ThoughtSpot Spotter, Microsoft Fabric, sourced and dated |
| §7.1–7.2 Business & functional requirements | ✅ Covered | `02-requirements-and-user-stories.md`, FR-001 through FR-014 |
| §7.3 Non-functional requirements | ✅ Covered | Same file, plus the latency/accuracy targets now formalized in `03-METRICS-EVALUATION-BENCHMARKS.md` |
| §7.4–7.5 Personas & user stories | ✅ Covered | Same file, US-01 through US-08 |
| §7.6 Use cases | ✅ Covered | The golden test set (GT-01 through GT-23) functions as the use-case set, in a more testable form than prose use-case narratives |
| §7.7 Requirement traceability matrix | ⚠️ **Gap — filled below (§2.1)** | Individual pieces exist (FR IDs, GT IDs, module names) but were never joined into one matrix |
| §8 Project planning (WBS, backlog, sprints) | ✅ Covered, adapted | A 24-hour event doesn't take sprints — Master Plan §14's hour-by-hour blocks with gates *are* the WBS and release plan, in the form that actually fits a single-day build |
| §8.1 Risk register | ✅ Covered | `09-risk-register-and-blind-spots.md`, extended in Master Plan §15 |
| Decision log / assumption log | ⚠️ **Gap — filled below (§2.2)** | Decision-log *mechanism* exists (Section 5.3 of `03-multi-agent-architecture.md` describes the log format), but no single canonical assumption register consolidating every assumption made across all files exists yet |
| §9 Data requirements & gathering | ✅ Covered | `04-data-strategy-and-nl-to-insight-pipeline.md`, Master Plan §9 |
| §10 Solution architecture + ADRs | ✅ Covered | Master Plan §5; ADR-001 through ADR-004 in `03-multi-agent-architecture.md` |
| §11 Technology stack selection | ✅ Covered | Master Plan §13; `01-ENVIRONMENT-SETUP-and-hardware.md` §4's full resource audit |
| §12 Database design (entities, ERD, data dictionary) | ⚠️ **Gap — filled below (§2.3)** | The *real* dataset's schema can't be ERD'd until it lands tomorrow, but our own system's metadata (the semantic metrics layer, the ChromaDB collections, the log tables) is fully knowable now and was never formalized |
| §13 API design | ⚠️ **Gap — filled below (§2.4)** | FastAPI was chosen as the layer between Streamlit and the graph, but the actual endpoint contract was never specified |
| §14.1–14.2 UI/UX planning & required states | ⚠️ **Gap — filled below (§2.5)** | Panels are described throughout, but the systematic loading/empty/error/offline/retry state checklist was never run |
| §14.3–14.6 Design system, accessibility, responsive, animation | 🚫 Scoped out | Streamlit's built-in component set is the explicit trade for build speed (already reasoned in the environment setup file) — a custom design system is exactly the scope a React frontend would need and Streamlit was chosen specifically to avoid |
| §15 Frontend development structure | 🚫 Scoped out (N/A) | No meaningful "frontend folder structure" question exists for a Streamlit single-app UI the way it does for a React app |
| §16 Backend development | ✅ Covered, light gap closed | FastAPI's role is defined in Master Plan §13; the endpoint contract gap is closed in §2.4 below |
| §17 Authentication & authorization | 🚫 Scoped out | Explicit Won't-Have in the feature plan HTML — no real users, no login requirement in the rubric, not worth an hour |
| §18 Security engineering (STRIDE, etc.) | ⚠️ **Gap — filled below (§2.6)** | Guardrails exist (Master Plan §12.3, upgrade file §4) but a formal STRIDE pass was never explicitly run — cheap to add, genuinely strengthens the "Explainability & Safety" story |
| §19 Third-party integrations | ✅ Covered, lightly | Cloud LLM provider, Ollama, Hugging Face — covered functionally throughout; formal per-service documentation isn't warranted at this scale (one LLM provider, one fallback, no other external services) |
| §20 Testing & QA | ✅ Covered, adapted | `03-METRICS-EVALUATION-BENCHMARKS.md` covers this more specifically than a generic test-level checklist would; load/stress/soak/spike testing explicitly don't apply to a single-demo-day, single-user system — noted here rather than silently skipped |
| §21 Performance engineering | ✅ Covered | Latency targets throughout the metrics file |
| §22 DevOps & CI/CD | 🚫 Scoped out (mostly), one gap | Full CI pipeline (lint/test/scan/deploy gates) isn't worth building for a system with no ongoing maintenance window — Docker (already built) is the piece that actually matters. **One small addition:** a `pytest` smoke-test script that runs the golden set automatically is worth the 20 minutes it costs — added to §2.7 |
| §23 Cloud & infrastructure | 🚫 Scoped out | Explicit, reasoned decision in the environment setup file — laptop-based, no cloud hosting |
| §24 Observability & operations | ✅ Covered, adapted | Structured logging + optional LangSmith tracing (environment setup file §4) is the right-sized version of this for a single build |
| §25 Backup, recovery, business continuity | 🚫 Scoped out | No production data, no uptime commitment — genuinely not applicable, stated explicitly rather than left silent |
| §26 Documentation | ✅ Covered extensively | This entire file set *is* the documentation deliverable |
| §27 Compliance, privacy, governance | ✅ Covered, adapted | PII-exclusion rule and the "not verified business ground truth" honesty pattern (Master Plan §7, §12) are the right-sized version — full GDPR/consent-flow documentation is not applicable to a synthetic/competition dataset with no real users |
| §28 Release readiness | ✅ Covered | `11-submission-checklist.md`, two-person verification table |
| §29 Post-deployment validation | 🚫 Scoped out (N/A) | No deployment in the traditional sense — the "deployment" is the live demo, and its validation is the rehearsal process in Master Plan §14 |
| §30 Maintenance & continuous improvement | ✅ Covered | Upgrade file §9–10 (self-improvement loop, future roadmap) |
| §31 Repository structure | ⚠️ **Gap — filled below (§2.8)** | Referenced conceptually (Docker's `backend/`, `streamlit_app/`) but never laid out as a full tree |
| §32 56-item deliverables list | ✅ Covered, mapped | Section 3 of this file maps the relevant subset explicitly |
| §33 Quality gates | ✅ Covered | Master Plan §14's hour-by-hour gates |
| §34–35 Output format & execution stages | ✅ Covered | This file set follows Analyze → Plan → Design → (Build happens live) → Verify → Document, in that order, across the conversation |
| §36 Final enterprise audit | ✅ **This file is that audit** | — |

**Reading straight down the "Scoped Out" rows is itself useful** — every one of them is a *decision*, with a reason, not a blank spot nobody thought about. That distinction is worth being able to state out loud if a judge asks "why doesn't this have X" — the answer is never "we didn't think of it," it's "we thought about it and here's why it doesn't belong in a 24-hour single-demo system."

---

## 2. Filling the real gaps

### 2.1 Requirement traceability matrix

| Business need | Functional req | User story | Graph node | Test(s) | Deployment component |
|---|---|---|---|---|---|
| Fast answers without an analyst queue | FR-001, FR-002, FR-003 | US-01, US-06 | Orchestrator | GT-01–03, GT-11 | Streamlit |
| Real, not fabricated, retrieval | FR-004 | US-02 | Knowledge, Data | GT-04–09 | Backend (FastAPI + DuckDB + ChromaDB) |
| Trustworthy numbers | FR-005 | US-03 | Analysis | GT-10, GT-14 | Backend |
| Proactive risk detection | — (feature, §8.1 of Master Plan) | — | Anomaly/Risk | GT-19 | Backend (XGBoost) |
| Honest scenario answers | — (feature, §8.2) | — | Simulation | GT-20–22 | Backend |
| Plain-English output | FR-007 | US-01, US-08 | Narrative | GT-01–10 | Streamlit |
| Catch mistakes before shipping | FR-009, FR-010 | US-04, US-07 | Validator | GT-13, GT-17 | Backend |
| High-risk actions need a human | FR-011 | US-05 | Validator → Human-approval | GT-15 | Streamlit (approval UI) |
| Works even if the cloud API fails | FR-012 | — | Narrative (fallback), all LLM nodes | GT-16 | Ollama (host) |
| Executive-ready dashboard | FR-013 | — | (outside the graph) | §12 of Master Plan | Power BI Desktop |
| Full audit trail | FR-014 | US-06 | Memory, all nodes | — | Log files |

### 2.2 Assumption register (consolidated)

Every material assumption made across the whole file set, in one place — review this list as a team at Hour 0–1 and correct anything the real dataset contradicts:

| # | Assumption | Where it's used | If wrong, what changes |
|---|---|---|---|
| 1 | The real dataset is primarily structured/tabular, possibly with one free-text field | Knowledge node design, Data node design | If it's mostly documents, the Knowledge node's retrieval role grows substantially — see the RAG problem statement's design as a reference point |
| 2 | A natural binary outcome column may or may not exist for the classifier | Section 7.1, Master Plan | Decision tree already branches on this — resolved at Hour 1–3, not assumed either way |
| 3 | "Last quarter"/"this month" resolve against the dataset's own max date, not a real calendar date | Data strategy §9.4 | Stated visibly in the UI regardless, so this can't become a silent bug |
| 4 | The team has working cloud LLM API access on event day | Hybrid LLM routing | Local-only mode is a fully-specified fallback, not a hard dependency |
| 5 | Power BI Desktop installs cleanly on the designated laptop | Dashboard plan | Path C (custom dashboard) is the explicit fallback |
| 6 | The dataset fits comfortably in memory for DuckDB | Data engine choice | See Section 4 of this file — this is the specific point where the two documents disagree, resolved here in favor of the original plan |
| 7 | Venue Wi-Fi is not fully reliable | Risk register, hybrid LLM, Power BI Path A default | Everything critical already has an offline-safe path |

### 2.3 System metadata design — the semantic layer, formalized

This is the one idea from the new MVP document that should be adopted directly and specifically: a governed, YAML-defined metric layer that the Data/Knowledge nodes consult before drafting a query, rather than leaving metric definitions implicit in prompts. It's cheap, and it's the concrete, buildable version of the "curated context is the accuracy lever" finding from the competitive research (upgrade file §1).

```yaml
# semantic/metrics.yaml — filled in with real column names at Hour 1–3
metrics:
  - name: total_revenue
    sql: "SUM(order_amount)"
    allowed_dimensions: [region, product_category, date, customer_segment]
    description: "Gross revenue before returns"
  - name: margin_pct
    sql: "(SUM(order_amount) - SUM(cost_amount)) / NULLIF(SUM(order_amount), 0)"
    allowed_dimensions: [region, product_category, date]
    description: "Gross margin as a percentage of revenue"
  # ... 8-12 metrics total is the right size — see the MVP document's own
  # reasoning: start with the metrics that answer 80% of likely questions,
  # not an attempt to cover every column in the schema
```

This file is consumed by the Data node's schema-context prompt and doubles as living documentation — it's simultaneously the "data dictionary" the Universal Prompt's §12 asks for and the retrieval-context source for the Knowledge node (§6 of the Master Plan), one artifact serving two roles.

**Also adopted from the MVP document:** a semantic cache keyed on `(metric, dimensions, filters)` so a repeated demo question doesn't re-hit the query engine — cheap, and specifically protects rehearsal and live-demo speed.

### 2.4 API contract — the `/ask` endpoint

```
POST /ask
Request:
{
  "question": "How did we do in the West region last quarter?",
  "session_id": "uuid-string"
}

Response (success):
{
  "answer": "SLA breaches by the Finance_Agent rose 12.4%.",
  "confidence": "high",
  "confidence_reason": "214 records, primary model used, no fallback triggered",
  "chart_spec": { "type": "bar", "data": {...} },
  "trace": {
    "intent": "comparison",
    "query": "SELECT ...",
    "nodes_fired": ["orchestrator", "data", "analysis", "narrative", "validator"]
  },
  "requires_approval": false,
  "recommended_action": { "action": "...", "owner": "...", "reason": "..." }
}

Response (error):
{
  "success": false,
  "error": {
    "code": "RETRIEVAL_FAILED",
    "message": "Could not retrieve data for that question.",
    "trace_id": "uuid-string"
  }
}
```

Matches the Universal Prompt's own recommended error-response shape (§13) almost exactly — worth keeping that consistency since it's a well-reasoned, standard pattern, not worth reinventing.

### 2.5 Required UI states — Streamlit checklist

| State | What it looks like | Where it matters most |
|---|---|---|
| Default | Empty chat, a few example questions shown as clickable prompts | First thing a judge sees |
| Loading | A visible "thinking" indicator, not a frozen screen | Every question, especially any that hit the 3-8 second query range |
| Empty result | "No matching records for that question" — never a blank chart | GT-13-style missing-data questions |
| Error / degraded | Clear, calm messaging when the fallback path fires (GT-16) — never looks like a crash | Forced-failure rehearsal |
| Low confidence | Visibly distinct styling (not just a badge color) so it can't be missed at a glance | Small-sample and fallback-model answers |
| Approval-pending | Greyed-out recommended action with a clear "Approve" button, distinct from the normal answer state | GT-15 |
| Out-of-scope refusal | Polite, on-brand refusal text, not a generic error | GT-12 |
| PDF-generated | Confirmation + download link, not a silent file write | Report/Export node |

### 2.6 STRIDE threat model — quick pass

| Threat | Applies here? | Mitigation |
|---|---|---|
| **S**poofing | Low — single-user local demo, no auth boundary to spoof | N/A by scope (§17 above) |
| **T**ampering | Yes — a malicious question could try to manipulate the SQL generation | Read-only connection, operation allow-list, NeMo execution rail (upgrade file §4) |
| **R**epudiation | Low — but the decision log/trace already gives an audit trail regardless | Trace panel + session logs |
| **I**nformation disclosure | Yes — any PII-shaped column | Column-level exclusion from narrative generation (Master Plan §12) |
| **D**enial of service | Low risk (single user) but a runaway loop is the local equivalent | Step ceilings, timeouts, the formalized self-correcting loop's 3-attempt cap (upgrade file §6) |
| **E**levation of privilege | N/A — no privilege tiers exist in this system | N/A by scope |

Small table, cheap to produce, genuinely strengthens the "we thought about security properly" answer in Q&A rather than just gesturing at "guardrails."

### 2.7 CI smoke test (the one DevOps item worth keeping)

A single `pytest` script that loads the golden test set and runs it against the live graph, asserting the safety-critical cases (GT-12, 13, 16, 17, 22) pass — run manually before freeze hour, not on every commit (a full CI trigger pipeline is genuinely not worth building here, per §22's scope-out above). Twenty minutes to write, and it turns "we ran the golden set" from a manual claim into a repeatable, one-command proof.

### 2.8 Repository structure

```
project-root/
├── backend/
│   ├── agents/            # one module per graph node
│   ├── graph/              # LangGraph graph definition + edges
│   ├── semantic/            # metrics.yaml (§2.3) + schema-linking logic
│   ├── models/               # trained XGBoost/LightGBM artifact + training script
│   ├── data/                   # cleaning pipeline, DuckDB connection
│   ├── guardrails/               # NeMo Colang rail definitions
│   ├── tests/                     # golden set + the smoke-test script (§2.7)
│   ├── main.py                      # FastAPI entrypoint, /ask endpoint (§2.4)
│   └── Dockerfile
├── streamlit_app/
│   ├── app.py
│   └── Dockerfile
├── data/
│   ├── rehearsal/                    # AI Audit Log 1k and 5k chunks
│   └── real/                          # the actual event dataset, once released
├── outputs/                             # generated PDFs, prediction results file
├── docs/                                 # this entire planning set
├── docker-compose.yml
├── requirements.txt
├── .env.example
├── .gitignore
└── README.md
```

---

## 3. The 56-item deliverables list — mapped

Running the Universal Prompt's full §32 list against this project, condensed to items that actually apply:

**In scope, delivered as part of this planning set:** Problem statement, competitor analysis, feasibility (via risk register), stakeholder register, scope document (MoSCoW), SRS-equivalent (requirements file), personas, user stories, use cases (golden set), traceability matrix (§2.1), risk register, assumption register (§2.2), architecture document + diagrams + ADRs, database design (§2.3, scoped to our own metadata), API specification (§2.4), UI/UX state spec (§2.5), design system (N/A, scoped out), security controls + threat model (§2.6), test plan, CI smoke test (§2.7), deployment guide (Docker), user manual (README), developer guide, test report (golden set results), security report (STRIDE + guardrails), release notes (submission checklist), handover document (this file set), maintenance plan (upgrade file §9-10), future roadmap (upgrade file §10).

**Explicitly not produced, because they don't apply at this scale:** OpenAPI file (one endpoint doesn't need a formal spec, §2.4's contract is sufficient), infrastructure-as-code, monitoring dashboards/alert definitions (no ongoing operations), backup/DR plan, performance/load test report (single-user context), deployment report (no traditional deployment), administrator manual (no admin role exists).

---

## 4. Reconciling the new MVP document

Read in full. Three categories, stated plainly rather than silently merged:

### Adopt directly (genuine upgrades, compatible with everything already decided)
- **Semantic YAML metric layer** — Section 2.3 above, adopted wholesale, it's a better concrete implementation of a design principle already committed to.
- **Vendor diversity for the Validator** — the MVP document's point that the Critique/Verifier should ideally run on a *different* model than the one that generated the narrative is already implicit in the metrics file's LLM-as-judge note; worth making explicit in the build: if cloud budget allows, route the Validator's LLM-as-judge check through a different provider than the Narrative node uses.
- **Cost-routing rule for LLM calls** — "high-frequency, low-stakes calls stay local; low-frequency, quality-sensitive calls go to the paid tier" is a sharper allocation rule than our current "cloud-first-then-fallback" pattern for every call. **Refinement to Master Plan §5:** route the Orchestrator's intent classification and the Data node's query drafting to the local model by default (fast, high-frequency, and errors are cheaply caught by retry/validation anyway); reserve the cloud model specifically for the Narrative node, where output quality is most visible. Hybrid fallback (Master Plan §7) still applies in both directions.
- **Honest golden-set framing** — "we measured X% on our own N-question set, not a borrowed leaderboard number" is exactly the right framing for the golden test set results and is adopted as the standard way to present them in documentation and Q&A.
- **DeepEval** — worth knowing as a pytest-style alternative/complement to RAGAS if RAGAS's setup proves fiddly on the day; not a required swap.
- **Forecasting model upgrade for Simulation Tier 2** — currently Tier 2 (Master Plan §8.2) uses XGBoost feature-importance direction as a rough estimate. A small dedicated time-series model (a gradient-boosted regressor with lag features, trained on whatever date-indexed metric the real data supports) is a genuine, buildable upgrade to that tier **if** Hour 9-12 finishes early — it's a Could-Have addition, not a replacement for the honest-labeling approach already in place.

### Reject, with reason (would undo decisions already made deliberately)
- **TPC-DS at scale factor 100 (~100GB) as "the dataset."** This event provides its own dataset (`enterprise_multiagent_decision_support.csv`) on the morning of the event (per the official workflow, Master Plan §2) — there is no scenario where the team chooses its own competition dataset. TPC-DS at any scale is irrelevant. Use the provided 200,000 row CSV as the only source of truth.
- **PostgreSQL + Next.js as the stack.** This was the ARIA-OS stack, reused here because it's familiar — but it directly contradicts the DuckDB + Streamlit decision made deliberately, twice, earlier in this planning process specifically to protect build time for the agent side over the frontend. Reintroducing a full Next.js frontend now would be re-opening a decision that was made for good, time-boxed reasons, not because DuckDB/Streamlit are worse tools in the abstract.
- **"You're not against a hard deadline."** This is factually incorrect for DATASPHERE 26 — there is a 24-hour hard deadline. This line is the clearest evidence that the MVP document (and whatever "Enterprise document" it's a companion to) was written for a different, more open-ended project, not this specific event. Worth knowing which project that was, if it's one to keep separate.

### Genuinely unknown — flagged, not guessed at
The MVP document repeatedly refers to a companion **"Enterprise document"** describing "12 agents, three graphs, full A2A interoperability, and audit-grade governance," and to a prior project called **ARIA-OS** ("15 concurrent async agents on local Ollama/Mistral 7B, FastAPI + Next.js, PostgreSQL"). Neither of those documents is in this conversation. If either one contains ideas meant for *this* hackathon rather than a separate, longer-running project, worth sharing directly rather than having this file guess at what a document it can't see actually says.

---

## 5. Closing summary

**Overall completion against the Universal Enterprise Master Prompt's framework, scoped appropriately for a 24-hour single-demo event:** every phase is either genuinely covered, deliberately and explicitly scoped out with a stated reason, or — for the eight items in Section 2 — closed just now. Nothing in the 37-section framework was silently skipped; every gap that existed has either been filled above or explicitly marked not applicable and why.

**Critical blockers:** none from planning — the two live blockers left are both dataset-shaped and can only resolve at Hour 1–3 tomorrow: whether a natural label exists for the classifier (§7.1 of the Master Plan) and whether Neo4j is worth attempting (§6.3).

**One live decision to make before Hour 0:** whether to adopt the LLM cost-routing refinement in Section 4 (local-first for Orchestrator/Data, cloud-reserved for Narrative) — it's a genuine improvement over the original all-cloud-first pattern and costs nothing to adopt, so unless there's a reason not to, treat it as adopted.
