# 01 — Problem Analysis & Competitive Landscape

**DATASPHERE 26 · Track 06 — Generative AI & Agentic AI**
**Problem chosen:** Multi-Agent Data Analyst for Enterprise Decision Support

> Planning document. The final idea execution, analysis, and build happen live during the 24-hour event. Nothing in this file is a competition result.

---

## 1. The problem, restated plainly

Business people who need an answer from company data — a sales trend, a cost spike, a customer complaint pattern — usually can't get it themselves. They wait on an analyst. The analyst is busy, the request queues, and by the time the report lands the decision it was meant to inform has often already been made some other way.

The problem statement asks for a **multi-agent system** that closes that gap: it understands a plain-English business question, goes and gets the right data, works out what the data actually means, draws a chart, writes the answer in plain English, and does all of that with enough transparency that a non-technical person can trust it and a technical judge can verify it.

Two words in the objectives carry the actual grading weight: **explainability** and **accuracy**. Anyone can wire an LLM to a spreadsheet and get something that *looks* like an answer. The problem statement is explicitly asking for a system that is *right*, and *shows its work* — that is the real brief underneath the feature list.

## 2. Who has this problem, and why it matters to them

| Stakeholder | What they actually want | What breaks today |
|---|---|---|
| **Business user** (sales manager, ops lead, finance analyst who isn't technical) | Ask a question in their own words, get a trustworthy answer in seconds, not a ticket number. | They either can't write SQL, or they can and it still takes 20 minutes per question across four systems. |
| **Data/BI analyst** | Stop being a human query interface for the same five questions every week. | Repetitive ad-hoc requests crowd out real analysis work. |
| **Department head** | Make a call (staffing, pricing, restocking) with evidence attached, fast enough that the window to act hasn't closed. | Reports arrive after the decision window; by the time insight lands, it's historical, not actionable. |
| **Judges (this event)** | See a system that is genuinely multi-agent (not a single prompt wearing a costume), accurate, explainable, and usable by a non-technical person — in a 3–5 minute window. | Most submissions in this exact track will look identical from 10 feet away: chatbot, a chart, a paragraph. |

## 3. Existing process (what we're replacing) and its weak points

1. Business user emails/Slacks the analyst.
2. Analyst re-derives context, writes a query, sanity-checks it, exports a chart.
3. Analyst sends a PDF or screenshot back, hours to days later.
4. If the business user has a follow-up question, the loop restarts from step 1.

Failure points worth naming explicitly, because judges will ask "so what does your system fix, specifically":
- **Latency** — the decision often can't wait for the loop.
- **Bus factor** — the answer lives in one analyst's head/queries, not in a repeatable system.
- **No traceability** — six months later nobody can reconstruct how a number was produced.
- **No action attached** — a report is a fact; it doesn't say what to do about the fact.

## 4. Why this problem over the RAG one

Track 6 offered a second option — *Enterprise Knowledge Assistant using Private RAG*. We picked the Multi-Agent Data Analyst because:

- It scores directly against **Model Performance (95% emphasis)** and **Feature Engineering (80%)** — categories a document-retrieval system can't engage with nearly as concretely, since there's no numeric ground truth to be "right" or "wrong" about in the same way.
- It's a stronger match to the team's existing experience with multi-agent architectures, LangChain, and API-based LLM work.
- The differentiation ceiling is higher: a private-RAG assistant is judged mostly on retrieval quality and groundedness (harder to make visually impressive in 3 minutes); a data analyst system produces charts, numbers, and a Power BI dashboard — inherently more demo-friendly.

This is a **deliberate scope decision**, not indecision — record it as such if a judge asks why this track and not the other.

## 5. Competitive landscape — what already exists in public

This system is not being invented from nothing. A working understanding of what's already out there is what lets us cut the parts that are commodity and spend the 24 hours on the parts that aren't.

**Pattern 1 — Orchestrator + specialists.** Nearly every public multi-agent data-analyst project routes a request through a coordinating agent that delegates to narrower agents (a general data-analyst agent, a SQL-specific agent, a visualization component), rather than one agent doing everything. The more developed examples add a supervisor agent explicitly overseeing separate Pandas and SQL analyst sub-agents. This confirms the orchestrator-plus-specialists shape is the right baseline architecture — it's expected, not a differentiator on its own.

**Pattern 2 — Natural language to SQL is a solved, well-documented shape.** Open frameworks built specifically for "ask a database a question in English" turn the question into SQL, run it, and return results with visualizations, working with a wide range of LLMs and databases. A close cousin does the same thing directly over CSV/dataframe/datalake data using LLMs plus retrieval rather than a formal database. The lesson: don't spend hours reinventing text-to-SQL from scratch — the pattern is known, so budget time on the parts that sit *around* it (validation, confidence, action recommendations) instead.

**Pattern 3 — Full "autonomous data scientist" pipelines exist and are overkill for this event.** Some public projects push much further — automatic profiling, EDA, AutoML model building, verification, and even notebook generation, end to end from a single CSV upload, with the interface built in Streamlit throughout. This is a useful reference for UI conventions, but building an AutoML layer is explicitly a **Won't-Have** here (see the feature plan) — it doesn't map to anything in DATASPHERE's rubric and would burn hours the validator/explainability layer needs instead.

**Pattern 4 — Framework choice trade-off is well understood.** Comparative analysis of the major multi-agent frameworks converges on the same conclusion from different directions: role-based frameworks are fastest to prototype with the shallowest learning curve, graph-based frameworks trade more code for more explicit control over branching and state, and conversation-based frameworks fit debate/consensus-style tasks best. For a 3-person team with 24 hours, the fastest-to-prototype option is the correct default — see `03-multi-agent-architecture.md` for the specific pick and why.

**Pattern 5 — Streamlit is the default UI everywhere.** Across every comparable project found, Streamlit (or a very close cousin like Chainlit) is the interface layer, because it's the fastest path from "working Python agent" to "something a judge can click." This is exactly why pairing it with a genuine Power BI dashboard is a differentiator — most rooms of judges will see ten Streamlit chat windows in a row today. A Power BI report changes what that ten-minutes-in feels like.

**Named-tool reference points worth knowing (not building from scratch, just aware of):**
- **Vanna** — open-source natural-language-to-SQL framework, works with any LLM and any database, returns SQL + execution + visualization.
- **PandasAI** — natural-language querying directly over CSV/dataframe/datalake data using LLMs and retrieval.
- **CrewAI / LangGraph / AutoGen (AG2)** — the three dominant multi-agent orchestration frameworks; role-based, graph-based, and conversation-based respectively.

### Sources consulted
- https://github.com/shakil1819/Multi-Agent-Data-Analyst
- https://github.com/VaishnaviSh14/MultiAgent-Data-Analyst
- https://github.com/topics/data-analysis-agent
- https://github.com/business-science/ai-data-science-team
- https://github.com/disler/multi-agent-postgres-data-analytics
- https://github.com/topics/text-to-sql
- https://vanna.ai/
- https://github.com/sinaptik-ai/pandas-ai
- https://www.datacamp.com/tutorial/crewai-vs-langgraph-vs-autogen
- https://pickaxe.co/post/crewai-vs-langgraph-vs-autogen
- https://pecollective.com/blog/ai-agent-frameworks-compared/

## 6. What this means for scope (summary — full detail in the feature plan HTML)

- **Don't** spend hours proving multi-agent routing works — that's table stakes, get it working fast and move on.
- **Don't** build a general-purpose AutoML/notebook-generation layer — it's not scored here.
- **Do** spend the saved hours on the validator/explainability layer, the golden test set, and the Power BI dashboard — these are exactly the places the rubric rewards and the public reference projects mostly skip.

## 7. Open questions to resolve the moment the real dataset drops (07 Aug)

1. Is the dataset one flat table, or multiple related tables (sales + finance + ops + customer service, joined by a key)?
2. What's the actual grain — transaction-level, daily aggregate, monthly?
3. Is there a text/unstructured column (support tickets, comments) that needs light NLP handling, or is it fully structured?
4. What's the realistic row count — does DuckDB-in-memory suffice, or do we need chunked loading?
5. Are there any date-range or "as of" ambiguities that could make a question like "this quarter" genuinely ambiguous?

Log the answers in the decision log the moment the dataset is in hand — see `08-team-roles-and-24hr-execution-plan.md`, Hour 1–3.
