# DATASPHERE 26 · Track 06 — MASTER PLAN
## Multi-Agent Data Analyst for Enterprise Decision Support

> **This is the end-to-end master document.** It supersedes the architecture and stack detail in the earlier `03`, `05`, `06`, `07` files from the first planning pass — the framework changed (CrewAI → LangGraph) and the scope expanded (5-agent core → an 8-node graph with a retrieval layer and a trained model). `01`, `02`, `09`, `10`, `11` remain valid in spirit; wherever they conflict with this file on a technical specific, this file wins.
>
> **Planning document.** The actual idea execution, build, and analysis happen live during the 24-hour event, against the real dataset. Nothing here is a competition result.

---

## Table of contents

0. [How to use this document](#0)
1. [The problem, and every objective mapped to what satisfies it](#1)
2. [The official Datathon workflow, mapped to our system](#2)
3. [Who this is for](#3)
4. [What makes this submission different](#4)
5. [System architecture — the LangGraph design](#5)
6. [The knowledge layer — Agentic Hybrid RAG](#6)
7. [The trained model — XGBoost / LightGBM](#7)
8. [The four committed innovative features](#8)
9. [Data strategy](#9)
10. [Dashboards — Streamlit + Power BI](#10)
11. [Business insights — by domain](#11)
12. [Evaluation, explainability, safety](#12)
13. [Tech stack — complete](#13)
14. [Team roles & hour-by-hour execution](#14)
15. [Risk register & blind spots](#15)
16. [Presentation & judge Q&A](#16)
17. [Submission checklist](#17)

---

<a id="0"></a>
## 0. How to use this document

This is intentionally long because the scope is now genuinely large — a LangGraph orchestration layer, a retrieval system, a trained classifier, four extra features, and two dashboards, built by three people in 24 hours. Read it once tonight in full. During the event, each team member works mostly from their own section (Section 14 tells you which). Every section that involves a build decision states **what we're building**, **why**, and **what to cut first if we're behind** — that last part is not optional reading.

---

<a id="1"></a>
## 1. The problem, and every objective mapped to what satisfies it

**Problem statement, in full:**

> Organizations generate large volumes of data across sales, finance, operations, and customer services, but business users often lack the technical skills to analyze this data quickly. Traditional reporting depends on data analysts, making the process slow and delaying important business decisions. This challenge focuses on using Generative AI and Agentic AI to build a multi-agent system that can understand business questions, retrieve and analyze enterprise data, generate visualizations, and provide clear insights automatically. Participants can develop an intelligent assistant that enables non-technical users to access accurate, explainable, and actionable insights, helping organizations make faster and more informed decisions.

Every one of the seven listed objectives now has a specific, named owner in the system — this table is the proof that nothing was left out:

| Objective | Satisfied by | Where |
|---|---|---|
| Design a multi-agent architecture where specialized agents handle distinct analytical tasks | 8-node LangGraph: Orchestrator, Knowledge, Data, Analysis, Anomaly/Risk, Simulation, Narrative, Validator | Section 5 |
| Interpret natural language business questions accurately | Orchestrator's intent classification + Knowledge node's retrieval-augmented query context | Sections 5, 6 |
| Develop agents capable of retrieving, processing, and analyzing enterprise data | Knowledge node (retrieval) + Data node (query/execution) + Analysis node (computation) | Sections 5, 6, 9 |
| Generate clear visualizations and narrative summaries of analytical findings | Analysis node's chart spec + Narrative node's grounded language generation + Streamlit/Power BI rendering | Sections 5, 10 |
| Ensure explainability and accuracy of AI-generated insights and recommendations | Deterministic numeric core (ADR-style rule: no LLM ever produces a number) + Validator node hard gate + confidence scoring + visible trace | Section 12 |
| Build an interface that allows non-technical users to interact with the system easily | Streamlit chat UI as the live, judge-facing interaction surface | Section 10 |
| Improve organizational agility through faster, more accessible data-driven decisions | Business Insights layer — every answer ends in a recommended action with an owner | Section 11 |

---

<a id="2"></a>
## 2. The official Datathon workflow, mapped to our system

DATASPHERE published this exact 10-step recommended path. Judges were handed the same 10 steps — the presentation and repo structure should walk through them in this literal order, not our own internal architecture order, because that's the mental model already sitting in the judge's head.

| # | Official step | What we actually do here | Owner |
|---|---|---|---|
| 1 | Dataset Release | Load real dataset, run the schema scan the moment it drops | Member A |
| 2 | Understand the Problem | Section 1 of this doc, done before hour 0 | All three |
| 3 | Data Cleaning | Type correction, missing-value report, duplicate check, outlier flagging — logged, not silent | Member A |
| 4 | Exploratory Data Analysis | Automated profiling pass feeding the Knowledge node's business-glossary/example store | Member A |
| 5 | Feature Engineering | Domain-derived features (Section 9) feeding both the Analysis node and the XGBoost model | Member A |
| 6 | Model Building | XGBoost/LightGBM classifier (Section 7) | Member B |
| 7 | Model Evaluation | Accuracy/Precision/Recall/F1/ROC-AUC on a real held-out split, **plus** agent-pipeline metrics (routing accuracy, groundedness, golden-test pass rate) — both reported, not one substituting for the other | Member A + Member B |
| 8 | Business Insights | Section 11 — every insight carries a recommendation, owner, and reason | Member B + Member C |
| 9 | Dashboard Development | Streamlit (live app) + Power BI Desktop (BI report), both, full — Section 10 | Member C |
| 10 | Prototype / Solution Delivery | The rehearsed end-to-end demo | All three |

This table itself is worth putting on a presentation slide — it's the fastest possible proof to a judge that the official process was actually followed, not just referenced.

---

<a id="3"></a>
## 3. Who this is for

**Priya — Regional Sales Manager.** Not technical. Needs an answer in the time it takes to walk to a meeting, in a form she can repeat to her own boss without checking it in Excel first.

**Arjun — Finance Analyst.** Semi-technical, currently the human bottleneck five colleagues route through for the same handful of questions every week.

**Judge — 3-minute attention window.** Needs to see, fast: is this really multi-agent, is it right, does it explain itself, can a non-technical person use it, and — new, given the official workflow — is there an actual model with real evaluation numbers behind "Model Performance."

---

<a id="4"></a>
## 4. What makes this submission different

Eight differentiators, in the order they should come out in the pitch. The first five are architecture-level; the last three are the four committed features (PDF export and what-if simulation are grouped as one "action layer" story).

1. **Numbers come from code, never from the LLM.** The Narrative node only ever describes values the Analysis node already computed. This is the single biggest lever on Explainability and Model Performance both.
2. **A Validator node that can say no.** Every narrative is checked against its source numbers before the user sees it, with a human-approval interrupt for high-risk recommendations — LangGraph's native interrupt mechanism, not a bolted-on workaround.
3. **A real trained model, not just an agent pipeline calling itself "the model."** XGBoost/LightGBM with a genuine train/test split and honestly-reported metrics answers "Model Building" and "Model Evaluation" literally, the way the official workflow asks for it.
4. **Agentic Hybrid RAG that knows when it's needed.** The Knowledge node only retrieves when the question actually benefits from it (ambiguous phrasing, a text-heavy customer-service question) — it isn't RAG for the sake of having RAG.
5. **Two dashboards doing two different jobs, both real.** Streamlit as the live thing judges click; Power BI Desktop as the polished, enterprise-credible report — most comparable public projects have exactly one of these.
6. **Proactive, not just reactive.** The Anomaly/Risk node can surface a problem nobody asked about yet, using the same trained model that satisfies the Model Building requirement — one component, two jobs.
7. **An honest what-if, not a fake forecast.** Scenario recomputation uses the same deterministic formulas as every other answer, with model-based projections explicitly labeled as directional, never presented as guaranteed.
8. **A recommendation the user can actually leave the room with.** The auto-generated one-pager PDF turns any answer into something Priya can forward to her boss in the same minute she got it.

---

<a id="5"></a>
## 5. System architecture — the LangGraph design

### 5.1 Why LangGraph now (confirmed choice)

The first pass recommended CrewAI for speed. With an anomaly branch, a simulation branch, a human-approval interrupt, and cross-turn memory now all in scope, the graph has real conditional branching and needs to pause and resume mid-flow (the approval gate) — that's LangGraph's actual purpose, not a stretch use of it, and it has first-class support for human-in-the-loop interrupts, which removes a chunk of custom plumbing we'd otherwise have to hand-build in CrewAI.

### 5.2 The graph

```
                                   START
                                     │
                                     ▼
                          ┌───────────────────┐
                          │    ORCHESTRATOR     │◀────────────┐
                          │ intent + routing +  │              │
                          │ reads Memory node    │              │ (follow-up
                          └──────────┬──────────┘              │  turns)
                                     │                          │
             ┌───────────────┬──────┴───────┬───────────────┐  │
             ▼               ▼              ▼               ▼  │
     ┌───────────────┐ ┌───────────┐ ┌────────────┐ ┌─────────────┐
     │  KNOWLEDGE      │ │  ANOMALY /  │ │ SIMULATION  │ │  (direct,   │
     │  (Agentic RAG)  │ │  RISK node  │ │  node       │ │  no extra   │
     │  retrieves only │ │  (XGBoost/  │ │  (what-if)  │ │  context    │
     │  if needed      │ │  LightGBM)  │ │             │ │  needed)    │
     └────────┬────────┘ └──────┬──────┘ └──────┬──────┘ └──────┬──────┘
              ▼                 │                │               │
     ┌────────────────┐         │                │               │
     │   DATA node      │        │                │               │
     │  query + execute │        │                │               │
     └────────┬─────────┘        │                │               │
              ▼                  │                │               │
     ┌────────────────┐          │                │               │
     │  ANALYSIS node   │◀───────┴────────────────┴───────────────┘
     │  deterministic    │
     │  metric compute    │
     └────────┬───────────┘
              ▼
     ┌────────────────┐
     │  NARRATIVE node  │  LLM — language only, no numbers invented
     └────────┬─────────┘
              ▼
     ┌────────────────┐
     │  VALIDATOR node  │  cross-check, confidence, sets approval flag
     └────────┬─────────┘
              │
       ┌──────┴──────┐
       ▼             ▼
  [approval        [no approval
   required]        needed]
       │                │
       ▼                │
┌─────────────┐         │
│ HUMAN-APPROVAL│        │
│  interrupt     │        │
│ (LangGraph      │        │
│  native pause)  │        │
└──────┬──────────┘        │
       └──────────┬─────────┘
                   ▼
              ┌─────────┐
              │  MEMORY   │  writes this turn to LangGraph
              │  node      │  checkpoint + ChromaDB
              └─────┬─────┘
                    ▼
                   END → rendered in Streamlit / pushed to Power BI

              (side branch, on explicit request from any completed answer)
                    │
                    ▼
              ┌───────────┐
              │  REPORT /   │  ReportLab / WeasyPrint → PDF one-pager
              │  EXPORT node│
              └───────────┘
```

### 5.3 Node-by-node canvas

| Node | Goal | Input | Output | Max steps / guardrail |
|---|---|---|---|---|
| **Orchestrator** | Classify intent, decide which node(s) fire, read prior-turn memory for follow-ups | Raw question + memory state | Route decision | 1 classification call, 1 retry, then a deterministic keyword-rule fallback so the graph never stalls |
| **Knowledge (Agentic RAG)** | Decide *if* retrieval helps, then retrieve schema examples, business-glossary terms, or ticket-text chunks | Question, intent | Retrieved context (or nothing, if not needed) | Only fires when the Orchestrator's confidence is below a threshold or the question is customer-service/text-shaped — see Section 6 |
| **Data** | Draft and execute a real query | Intent, schema, retrieved context if any | Raw result table + exact query used | 1 attempt + 1 self-correction retry against the actual error message |
| **Anomaly/Risk** | Score records against the trained classifier; can fire proactively or on-demand | Cleaned dataset, trained model | Flagged records + risk scores | Model inference only — no LLM call, deterministic given the model |
| **Simulation** | Recompute a metric under a hypothetical change | Base metric from Analysis, requested change | Recomputed value + explicit confidence label on the projection | Refuses (doesn't fabricate) if no historical relationship supports the requested variable |
| **Analysis** | Compute derived metrics: % change, trend, top-N, margin, etc. | Raw result table | Insight skeleton (fixed numbers) + chart spec | Pure pandas/DuckDB — no LLM call, this is the deterministic core |
| **Narrative** | Turn the insight skeleton into plain English + a recommended action | Insight skeleton | Draft narrative + action | Falls back to local LLM, then a template, never to silence |
| **Validator** | Catch mismatches, assign confidence, decide if approval is needed | Draft narrative + skeleton | Final narrative, confidence label, approval flag | Regenerate once, then fall back to raw-numbers display |
| **Human-approval** | Pause for an explicit click on high-risk recommendations | Validator's flag | Approved/edited action | LangGraph native `interrupt()` — the graph literally halts and resumes on input, no polling hack needed |
| **Memory** | Persist the turn for follow-ups | Full turn state | Updated LangGraph checkpoint + a ChromaDB entry for semantic recall | — |
| **Report/Export** | Turn any completed answer into a PDF | Insight skeleton + narrative | One-page PDF | Only triggered by explicit user request, never automatic |

### 5.4 Loop and failure controls

Same discipline as the first pass, restated for the graph: every LLM-bearing node has a timeout and a non-LLM fallback; the Data node's connection is read-only with an operation allow-list; total node visits per question are capped so a misrouted follow-up can't spin the graph indefinitely.

---

<a id="6"></a>
## 6. The knowledge layer — Agentic Hybrid RAG

### 6.1 What it's actually for (and why "RAG" isn't automatic here)

The core problem is analytics over structured tables — most questions never need retrieval at all, they need a good query. RAG earns its place in exactly two situations, and the Knowledge node is deliberately built to recognize only those two:

1. **Query-drafting assistance.** When a question is ambiguous or the schema is wide, retrieving a handful of similar past example queries and relevant business-glossary terms measurably improves the Data node's query accuracy — this is a well-established pattern in text-to-SQL systems, not a novelty here.
2. **Unstructured text fields.** If the real dataset includes a free-text column (support tickets, review comments), questions like "what are customers complaining about most" genuinely need semantic retrieval over that text — this is real RAG, not structured querying.

If the real dataset is a single clean table with no text field, the second case simply never fires — the Knowledge node stays mostly idle, and that's the correct, honest outcome, not a wasted build.

### 6.2 Design

- **Vector store: ChromaDB** — embedded, in-process, no server to stand up. (Simplified from the "ChromaDB or Qdrant" note — Qdrant's production-tier setup buys nothing for a single-laptop demo and costs real install time.)
- **Embeddings: BAAI/bge-large-en-v1.5**, run locally via `sentence-transformers` — strong open embedding quality, no API cost or latency. **Fallback:** if model download/load time becomes a problem on event Wi-Fi, swap to `bge-small-en-v1.5` — same interface, smaller download, some quality trade-off. Decide by Hour 3.
- **Hybrid search: BM25 (`rank_bm25`) + ChromaDB vector search**, simple score-combination re-ranking — catches exact-term matches (product codes, exact category names) that pure embedding similarity sometimes misses, alongside semantic matches.
- **Agentic behavior:** retrieval is a conditional edge out of the Orchestrator, not a step every question passes through — the Orchestrator's own confidence score and a simple text-shape check (does the question reference a free-text domain) decide whether the Knowledge node fires at all.

### 6.3 Graph RAG (Neo4j) — explicitly deferred, not rejected

Neo4j is genuinely worth it **only if** the real dataset has meaningful multi-entity relationships worth traversing (e.g., customer → order → product → supplier chains). We won't know that until the dataset lands. **Decision gate: Hour 1–3**, once the real schema is known — pursue it only if (a) the relational structure clearly benefits from graph traversal and (b) the team is at or ahead of the Hour 9 gate in Section 14. Standing up a graph database, modeling it correctly, and getting genuinely useful multi-hop queries out of it in the remaining hours is real engineering risk with no guaranteed payoff — treat it exactly like a Could-Have, not a promise.

---

<a id="7"></a>
## 7. The trained model — XGBoost / LightGBM

This is the direct answer to the "Model Building" / "Model Evaluation" gap flagged earlier, and it's designed to do double duty as the brain of the Anomaly/Risk node — one build, two requirements satisfied.

### 7.1 What it predicts (decision tree — resolve at Hour 1–3, once the real schema is known)

1. **Best case — a natural label exists.** Many enterprise datasets have a genuine binary business outcome already in them: `returned`, `churned`, `flagged`, `disputed`, `late_delivery`, `complaint_filed`. If one exists, train a supervised classifier directly against it — this gives fully legitimate, defensible Accuracy/Precision/Recall/F1/ROC-AUC against real ground truth.
2. **No natural label.** Run unsupervised anomaly detection (Isolation Forest, or a simple z-score rule) over the numeric columns first to generate flags, then train XGBoost as a risk-scoring model against those algorithmically-derived flags. **Report this honestly** — "trained against algorithm-derived anomaly labels, not verified business ground truth" is a stronger, more credible statement to a judge than quietly presenting it as if the labels were real.

### 7.2 Build

- **Library: XGBoost** primary. **LightGBM** as the swap if XGBoost's install gives anyone trouble on the day — same interface shape, near-identical performance for this scale of data.
- **Features:** the domain-derived features from Section 9.2 (ratios, aggregations, time-based features) plus whatever the schema scan surfaces as numeric/categorical columns.
- **Split:** a genuine train/test split (time-based split if the data has a date dimension, to avoid leaking future information into training — the exact leakage risk called out in the original data-cleaning checklist).
- **Metrics reported:** Accuracy, Precision, Recall, F1, ROC-AUC — all computed on the held-out test split, logged as a file, shown on a slide.
- **Explainability:** feature importances (XGBoost's built-in gain/SHAP-style importance) shown alongside the metrics — this is what feeds the Simulation node's "directional" projections in Section 8.2, and it's a second, independent explainability artifact beyond the agent trace.

### 7.3 What this is not

Not a claim of production-grade fraud/risk detection. The documentation and the Q&A answer for this are explicit: a real model, real metrics, honestly scoped to what a 24-hour build against a single dataset can actually support.

---

<a id="8"></a>
## 8. The four committed innovative features

### 8.1 Proactive anomaly agent
The Anomaly/Risk node (Section 5.3) doesn't only run when asked — it also runs once against the full loaded dataset right after cleaning, and any high-risk-scored records get surfaced as a standing "flagged items" panel in the Streamlit UI, visible before anyone asks a single question. This is the moment in the demo that proves the system isn't purely reactive.

### 8.2 What-if simulation, honestly scoped
Two tiers, both clearly labeled to the user so nothing is overclaimed:
- **Tier 1 — deterministic recompute (default, always available):** "what if cost dropped 10%" re-runs the exact same formula the Analysis node already used (margin = (rev-cost)/rev) with the adjusted input. This is fully grounded, zero risk of fabrication.
- **Tier 2 — model-informed direction (only where the trained model supports it):** for a variable with no closed-form formula (e.g. "what if we increase marketing spend"), the Simulation node reports the XGBoost model's historical correlation direction and rough magnitude, explicitly labeled *"estimated direction based on historical patterns — not a guaranteed outcome."* If the model has no meaningful relationship for the requested variable, the node says so and refuses rather than inventing a plausible-sounding number — same principle as the Validator node's refusal behavior.

### 8.3 Auto-generated executive one-pager (PDF)
Any completed answer can be turned into a one-page PDF via the Report/Export node — headline number, chart, narrative, recommended action, confidence label, generated timestamp. **Primary tool: WeasyPrint** (HTML template → PDF, fast to iterate). **Risk flagged explicitly:** WeasyPrint depends on system-level libraries (Pango/Cairo) that can be a genuine install headache on an unfamiliar Windows laptop — if that happens, swap to **ReportLab** (pure Python, no system dependencies, slightly more verbose to write). Decide which one is actually installed and working by Hour 6, not at Hour 20.

### 8.4 Multi-turn conversational memory
Two layers: **LangGraph's native checkpointing** holds the current session's turn-by-turn state (so "what about last quarter" after a Region-West question correctly resolves "that" to Region West), and **ChromaDB** stores a semantic log of past turns so a much later follow-up ("earlier you mentioned a drop in the West — has it continued?") can be resolved by retrieval rather than requiring it to still be in the immediate context window.

---

<a id="9"></a>
## 9. Data strategy

### 9.1 Rehearsal datasets (tonight)

| Dataset | Why | Use for |
|---|---|---|
| Contoso sample data | Microsoft's own Power BI sample set — sales, products, customers, dates | Full pipeline rehearsal + Power BI rehearsal |
| Sample Superstore | Classic single-table BI dataset — sales, profit, region, category, segment | Fastest path to a first working end-to-end run |
| Olist Brazilian e-commerce | Multi-table + a genuine text field (review comments) | Stress-tests the schema-reading step and the Knowledge node's text-retrieval path before the real thing |

### 9.2 Cleaning pass (applied automatically on load, real or rehearsal data)

Schema scan → type correction → missing-value report (logged, not silently dropped) → duplicate check (flagged, not silently deleted) → outlier flagging (kept queryable, never stripped) → identifier/measure/dimension classification (what lets the Data node write sane queries without a human telling it the schema).

### 9.3 Feature engineering, by domain

| Domain | Features |
|---|---|
| Sales | Period-over-period % change, rolling average, top-N, revenue-per-transaction |
| Finance | Cost-to-revenue ratio, margin %, expense-category share |
| Operations | Cycle/turnaround time, fulfillment rate |
| Customer service | Ticket volume trend, resolution-time distribution, keyword/sentiment flag on any comment field |

These same features feed both the Analysis node's deterministic answers and the XGBoost model's training set — one feature-engineering pass, two consumers.

### 9.4 Resolving "last quarter"

The maximum date present in the loaded dataset is treated as "today" for all relative-time phrases, with a visible "as of [date]" label in the UI — resolved once, explicitly, so it never surfaces as a live ambiguity bug.

---

<a id="10"></a>
## 10. Dashboards — Streamlit + Power BI, both, full

Confirmed: **both**, each doing a distinct job, not one standing in for the other.

- **Streamlit — the live application judges interact with.** Chat interface, the trace panel, confidence badges, the anomaly flag panel, the approval gate, the "generate PDF" button, and the memory-aware follow-up experience. This is where the actual multi-agent system is demonstrated live.
- **Power BI Desktop — the professional analytics dashboard, built end to end.** 4–6 KPIs spanning at least three of the four named domains, at least one working slicer or drill-through, refreshed from the agents' output tables. No cloud login dependency, so it works regardless of venue Wi-Fi. (Live REST-API push to Power BI Service remains a reach option only, per the earlier plan — attempt it after Section 14's Hour 15 gate, never before.)

**Demo flow:** open on Power BI (10s, "the exec view") → click the slicer to prove it's real → switch to Streamlit → ask a question whose answer matches a number already on the Power BI screen → ask a second question that triggers the anomaly panel or the approval gate → generate a PDF from one answer live.

---

<a id="11"></a>
## 11. Business insights — by domain

This is the step the official workflow calls out on its own (step 8) and the one explicitly asked to headline the pitch. "Meaningful insight" here has a specific, repeatable shape: **a number, a driver, and a recommendation with an owner** — never just a number alone.

| Domain | Example insight shape | What produces it |
|---|---|---|
| **Sales** | "Region West revenue down 12% this quarter, driven by [segment]. Recommended: reallocate marketing spend toward Region West; owner: regional sales lead; confidence: medium (214 records)." | Analysis + Narrative nodes |
| **Finance** | "Cost category [X] growing 20% faster than revenue. Recommended: renegotiate the vendor contract behind [X]; owner: finance lead." | Analysis + Narrative nodes |
| **Operations** | "Fulfillment time up 15% over 6 weeks. Recommended: redistribute warehouse load; owner: ops manager." | Analysis + Narrative nodes |
| **Customer service** | "Complaint volume spike tied to product [P], surfaced by the anomaly scan before anyone asked. Recommended: flag [P] for quality review; owner: product quality team." | Anomaly/Risk node + Narrative node |
| **Cross-domain, hypothetical** | "If cost for [X] fell 10%, margin would move from A% to B%. Directionally, similar past cost reductions correlated with a modest volume increase — treat that second part as an estimate, not a promise." | Simulation node |

Every row ends in a named action and a named owner on purpose — that's the difference between "a report" and "decision support," which is the exact phrase the problem statement uses.

---

<a id="12"></a>
## 12. Evaluation, explainability, safety

### 12.1 Two evaluation tracks, both reported (this is the "hybrid" decision from Section 7)

| Track | Metrics | Source |
|---|---|---|
| **Model-level** | Accuracy, Precision, Recall, F1, ROC-AUC on a held-out split | The XGBoost/LightGBM classifier, Section 7 |
| **Pipeline-level** | Routing accuracy, query success rate, groundedness (zero unsupported numbers), Validator catch rate, latency, confidence calibration | The 18-question golden test set (unchanged in spirit from the first pass, extended with cases for the anomaly node, simulation node, and memory) |

Reporting both, side by side, is itself worth a slide — it directly answers "so where's the actual model" without abandoning the agent-level evidence that carries Explainability.

### 12.2 Golden test set — additions for the new nodes

On top of the original 18 (sales/finance/ops/customer-service, ambiguous, out-of-scope, missing-data, small-sample, high-risk-action, rate-limit-failure, validator-mismatch, follow-up), add:

| ID | Category | Tests |
|---|---|---|
| GT-19 | Anomaly | A record deliberately shaped to score high-risk — confirms the proactive panel actually surfaces it unprompted |
| GT-20 | Simulation (deterministic) | A what-if question with a closed-form formula — confirms Tier 1 recompute is exact |
| GT-21 | Simulation (model-informed) | A what-if question with no formula — confirms Tier 2 labels itself as directional, not certain |
| GT-22 | Simulation (refusal) | A what-if question about a variable with no historical relationship — confirms refusal, not fabrication |
| GT-23 | Memory | A genuine multi-turn follow-up two questions later — confirms ChromaDB recall, not just immediate context |

**Target: 21/23 or better**, with every safety-related test (GT-12, 13, 16, 17, 22) at 100%.

### 12.3 Safety guardrails (carried forward, extended)

Read-only DB connection with an operation allow-list; step ceilings per graph traversal; every LLM node has a timeout and a deterministic fallback; PII-shaped columns excluded from free-text narrative by default; the Simulation node refuses rather than fabricates; the Human-approval interrupt is never bypassed for flagged actions.

### 12.4 System card — template (fill in with real numbers during the event)

```
SYSTEM CARD — Multi-Agent Data Analyst (DATASPHERE 26, Track 06)
Purpose:              [one sentence]
Graph nodes:           Orchestrator, Knowledge, Data, Anomaly/Risk, Simulation,
                       Analysis, Narrative, Validator, Memory, Report/Export
Trained model:          [XGBoost or LightGBM, actual target used]
Model metrics:          [Accuracy / Precision / Recall / F1 / ROC-AUC, real numbers]
Pipeline golden test:   [X / 23, breakdown by category]
Primary LLM / fallback: [cloud model used] / [local model used]
Known limitations:     [filled in honestly]
Human oversight:        Recommendations above the risk threshold require explicit approval.
```

---

<a id="13"></a>
## 13. Tech stack — complete

| Layer | Pick | Note |
|---|---|---|
| Orchestration | **LangGraph** | Explicit state graph, native human-in-the-loop interrupts |
| Vector store | **ChromaDB** | Embedded, no server |
| Embeddings | **BAAI/bge-large-en-v1.5** (fallback: bge-small) | Local, no API cost |
| Hybrid search | **BM25 (`rank_bm25`) + ChromaDB** | Simple score-combination re-ranking |
| Graph DB | **Neo4j — conditional Could-Have** | Only if real data is genuinely relational; decide Hour 1–3 |
| Data engine | **pandas + DuckDB** | In-process SQL, no server |
| Trained model | **XGBoost** (fallback: LightGBM) | Powers Model Building/Evaluation + the Anomaly/Risk node |
| LLM — cloud | Whichever key has headroom on the day | OpenAI / Anthropic / Gemini / Groq |
| LLM — local fallback | **Ollama** (llama3.1:8b / qwen2.5:7b) or **NVIDIA NIM** | Independent of venue Wi-Fi |
| Live app UI | **Streamlit** | Fastest to a working, judge-clickable interface |
| Dashboard | **Power BI Desktop** | No cloud login required |
| In-chat charts | **Plotly** | Renders inline in Streamlit |
| PDF export | **WeasyPrint** (fallback: ReportLab) | Watch for system-dependency install issues |
| Version control | **GitHub** | Public or reviewer access, per event rules |

---

<a id="14"></a>
## 14. Team roles & hour-by-hour execution

### 14.1 Roles

- **Member A — Data & Model Lead:** cleaning pass, feature engineering, XGBoost/LightGBM training + evaluation, Data + Analysis nodes.
- **Member B — Orchestration & GenAI Lead:** LangGraph graph (all nodes and edges), Knowledge/RAG layer, Narrative + Validator nodes, hybrid LLM routing, Simulation node.
- **Member C — Delivery Lead:** Streamlit UI, Power BI report, Memory/ChromaDB wiring, Report/Export (PDF), presentation, judge Q&A, submission checklist.

### 14.2 Tonight (06 Aug) — freeze-and-rehearse, not build

- [ ] Install/test: LangGraph, ChromaDB, `rank_bm25`, `sentence-transformers` (bge model), XGBoost, Streamlit, Power BI Desktop, WeasyPrint (and ReportLab as backup), Ollama + local model
- [ ] Run the full graph end to end on Contoso/Superstore, even roughly — a rough working version beats a polished broken one
- [ ] Confirm the LangGraph human-approval interrupt actually pauses and resumes correctly — this is the single most unfamiliar mechanic in the stack, test it tonight specifically
- [ ] Repo access confirmed for all three

### 14.3 Tomorrow (07 Aug) — with explicit gates and a cut-line

| Hours | Focus | Gate |
|---|---|---|
| 0–1 | Problem + dataset lock-in; **resolve the model-label decision (7.1) and the Neo4j decision (6.3) here** | All three can explain the plan the same way; both open decisions closed |
| 1–3 | Real data in: cleaning, feature engineering | Schema-reading step works without hardcoding |
| 3–6 | Core graph against real data: Orchestrator → Knowledge → Data → Analysis → Narrative → Validator | 3+ golden test questions pass end to end |
| 6–9 | XGBoost trained + evaluated; Anomaly/Risk node live; hybrid LLM fallback tested (GT-16) | Real Accuracy/Precision/Recall/F1/ROC-AUC exist as a file |
| 9–12 | Simulation node (both tiers) + Memory (LangGraph + ChromaDB) | GT-19 through GT-23 passing |
| 12–15 | Full 23-question golden run; fix and re-run | 21/23+, safety tests 100% |
| 15–18 | Streamlit polish (trace panel, anomaly panel, approval UI, PDF button) + Power BI report against real data | Full demo flow (Section 10) runs twice cleanly |
| 18–20 | Documentation, repo freeze, system card filled in | Fresh clone reproduces the demo |
| 20–22 | Slide deck, output file | All 7 deliverables exist as real files |
| 22–23 | Two full rehearsals, timed, Q&A dry run | Both hit time without keyboard recovery |
| 23–24 | Freeze, submit | Confirmation saved, all three verified |

### 14.4 The cut-line (use if behind at any gate above)

**Cut in this order:** Neo4j (already conditional) → Tier 2 model-informed simulation (keep Tier 1 only) → PDF export → memory's ChromaDB long-term layer (keep LangGraph session memory only) → the proactive anomaly panel (keep on-demand anomaly scoring only) → Power BI slicer/drill-through (static visuals still count).

**Never cut:** the deterministic Analysis node, the Validator node, the human-approval interrupt, the XGBoost model and its real evaluation numbers, the golden test run, README reproducibility, the required output file.

---

<a id="15"></a>
## 15. Risk register & blind spots

### 15.1 New risks introduced by the expanded scope

| Risk | Prevention | Fallback |
|---|---|---|
| LangGraph's interrupt mechanic is unfamiliar and eats build time | Tested specifically tonight (14.2) | Fall back to a simple UI-side confirm step if the native interrupt proves fragile |
| No natural label for the classifier in the real dataset | Decision tree in 7.1 resolved at Hour 1–3 | Unsupervised-flags-then-supervised-scorer path, reported honestly |
| Embedding model (bge-large) slow to load on event Wi-Fi/hardware | Swap to bge-small, decided by Hour 3 | — |
| WeasyPrint system-dependency install failure | Confirm which library actually works tonight | ReportLab, pure Python |
| Neo4j eats hours with no event-day payoff | Explicit conditional gate, Section 6.3 | Simply don't build it — RAG still functions fully without it |
| Scope is large enough that Must-Haves slip | Explicit cut-line, Section 14.4, reviewed at every gate | Cut in the stated order, never improvised |

### 15.2 Carried-forward risks and blind spots

All fifteen risks and twelve blind spots from the first pass still apply unchanged (silent data cleaning, relative-time ambiguity, over-indexing on sales, rehearsing only the happy path, presenting "recommended" actions as if the system decided them, and the rest) — see the original risk register for the full list; nothing there was invalidated by the architecture change.

---

<a id="16"></a>
## 16. Presentation & judge Q&A

### 16.1 Updated slide plan (10 slides now)

Same flow as before (problem → user → data → architecture → live demo → evidence → explainability → impact), with two additions: a slide showing the official-workflow mapping table (Section 2 — fast, concrete proof of process alignment) and a slide showing the model metrics table (Section 12.1's two-track evaluation, side by side).

### 16.2 New Q&A entries specific to the expanded system

**Why LangGraph instead of a simpler framework?**
Direct: the graph has real conditional branching (anomaly, simulation, approval) and needs to pause and resume mid-execution for human approval — LangGraph's interrupt is a native fit, not a workaround. Limitation: more code to write than a simpler role-based framework. Improve: —

**Where's the actual machine learning model?**
Direct: an XGBoost/LightGBM classifier, trained and evaluated on a genuine train/test split, reported with Accuracy/Precision/Recall/F1/ROC-AUC — it also powers the proactive Anomaly/Risk node, so it's not a bolt-on built only to check a box. Evidence: system card, Section 12.4. Limitation: if the real dataset had no natural label, the model is trained against algorithm-derived flags, not verified ground truth — stated honestly, not hidden.

**Why do you need retrieval (RAG) for a structured-data problem?**
Direct: mostly, we don't — retrieval only fires for ambiguous query drafting or genuine free-text fields like support tickets; most questions never touch it. Evidence: Section 6.1's explicit "two situations" framing. Limitation: — Improve: —

**Is the what-if simulation a real forecast?**
Direct: no, and we say so in the UI — deterministic recomputation where a formula exists, clearly-labeled directional estimates where it doesn't, and an explicit refusal where even direction isn't supported by the data. Evidence: Section 8.2. Limitation: it's a scenario tool, not a predictive forecasting product. Improve: —

**Why keep a human-approval step instead of fully automating recommendations?**
Direct: because the problem statement itself frames this as decision *support*, and a high-risk recommendation acted on automatically without a human is a harder thing to defend than one extra click. Evidence: Section 5.3, Human-approval node. Limitation: adds one interaction step to the flow. Improve: —

All Q&A entries from the first pass (why this problem, baseline comparison, hallucination prevention, data leakage, PII handling, scalability, limitations, "why should this win") remain valid and are carried forward unchanged.

---

<a id="17"></a>
## 17. Submission checklist

Unchanged structure from the first pass, with two additions to the deliverable mapping:

| Deliverable | What satisfies it now |
|---|---|
| Machine Learning / AI Model | **Both** the LangGraph agent pipeline *and* the trained XGBoost/LightGBM classifier — documented as two distinct components, not conflated |
| Prediction Results | The golden test set's questions with the system's actual answers/confidence, **plus** the classifier's predictions on the held-out test split |

Everything else — repo checklist, output-file checklist, documentation checklist, presentation checklist, two-person verification table — carries forward from the original `11-submission-checklist.md` unchanged.
