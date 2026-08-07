# 07 — Tech Stack & Tooling

**DATASPHERE 26 · Track 06 · Multi-Agent Data Analyst for Enterprise Decision Support**

> Planning document. No code is written from this file directly — it's the decision record the team builds against tomorrow.

---

## 1. Stack, with reasoning and the alternative considered

| Layer | Pick | Why | Alternative considered, and why not |
|---|---|---|---|
| Agent orchestration | **CrewAI** | Role-based agents map directly onto the five-agent canvas in `03-multi-agent-architecture.md`; fastest of the major frameworks to get a working pipeline from zero. | LangGraph — more explicit control over branching/state, but meaningfully more code to reach the same first working demo; reserved as a targeted fallback for the Validator's branching logic only. |
| LLM — cloud (primary) | **Whichever of the team's available keys has the most headroom on event day** (OpenAI / Anthropic / Gemini / Groq) | Decision deferred deliberately to event morning — rate limits and key availability are the actual deciding factor, not a theoretical preference. | Committing to one provider months in advance — rejected, because a single point of failure with no plan B is exactly the risk this stack is designed to avoid (see hybrid routing, Section 3). |
| LLM — local fallback | **Ollama (llama3.1:8b or qwen2.5:7b)** or **NVIDIA NIM endpoint** if venue GPU access allows it | Small enough to run on a laptop CPU if needed; NIM preferred if a GPU is actually available, given existing team familiarity with it. | A second cloud API as the "fallback" — rejected, because a cloud outage or a shared-Wi-Fi problem would take out both primary and fallback at once; a local model is the only fallback that's independent of venue connectivity. |
| Data engine | **pandas + DuckDB** | DuckDB runs in-process (no server to install/configure), executes real SQL directly against pandas DataFrames or CSV/Parquet files, and is fast enough for datasets at this event's scale. | A full Postgres/MySQL server — rejected as unnecessary setup overhead for a single-laptop demo with no concurrent-write requirement. |
| Chat / agent UI | **Streamlit** | Fastest path from a working Python pipeline to something a judge can click, and it's what the team already needs the least ramp-up time on. | Chainlit — a closer "chat product" feel, but not enough marginal benefit over Streamlit to justify the extra learning curve tonight. |
| Dashboard | **Power BI Desktop** | See `05-dashboard-powerbi-integration.md` in full. | A Streamlit-only dashboard — kept explicitly as the Path C fallback, not the default. |
| In-chat charts | **Plotly** | Renders directly inside Streamlit, interactive by default (hover/zoom), no extra plumbing. | Matplotlib — fine for static images, but Plotly's interactivity is a small, free upgrade with no real cost. |
| Version control | **GitHub**, repo made public or shared with reviewer access before the deadline | Required by the event rules. | — |

## 2. Why "mixed" LLM access is a design decision, not a compromise

The team confirmed access to both cloud APIs and local/offline models for the event. Rather than treating that as "we'll use whichever is convenient," it's built into the architecture directly (`03-multi-agent-architecture.md`, Section 2 — Narrative Agent failure condition) as the FR-012 requirement: **primary cloud call, automatic local fallback on failure or rate-limit, with no manual intervention required.**

### How the routing actually works (design-level, not code)

1. Every LLM call in the pipeline (intent classification, query drafting, narrative generation) goes through one shared "LLM call" function, not scattered direct API calls.
2. That function tries the primary cloud provider first, with a short timeout.
3. On timeout, HTTP error, or rate-limit response, it retries once against the cloud provider, then immediately falls over to the local model for that specific call — the user never sees an error, only (at most) a slightly slower answer.
4. Which path was used (cloud vs. local) is logged and surfaced in the trace panel — this is not hidden, it's shown as evidence of resilience when the moment naturally comes up in the demo or Q&A.
5. The Validator Agent already caps confidence at Medium whenever the fallback path was used (per `03-multi-agent-architecture.md` and `06-evaluation-explainability-safety.md`) — the system is honest about the fact that the fallback model is weaker, rather than pretending both paths are equivalent.

### Local model shortlist

| Option | When to use it |
|---|---|
| `llama3.1:8b` via Ollama | Default local fallback — good instruction-following for narrative generation, runs on a laptop CPU if it has to |
| `qwen2.5:7b` via Ollama | Alternative if llama3.1 underperforms on the actual dataset's domain language during rehearsal |
| NVIDIA NIM endpoint | Preferred over Ollama if venue GPU access is confirmed — faster inference, same fallback role |

## 3. Setup checklist — today (06 Aug), before the event opens

- [ ] Confirm which cloud LLM API key(s) are active and check current rate-limit headroom for each candidate provider
- [ ] Install and test Ollama locally; pull `llama3.1:8b` (or the chosen model) and run one real completion to confirm it works offline
- [ ] If NVIDIA NIM is the intended GPU path, confirm venue GPU/driver access won't be a surprise tomorrow
- [ ] Install Power BI Desktop on the laptop that will own the canonical `.pbix` file; confirm it opens and connects to a local CSV without requiring a cloud sign-in
- [ ] `pip install` and smoke-test: `crewai`, `duckdb`, `pandas`, `streamlit`, `plotly`
- [ ] Load a rehearsal dataset (1k AI Audit Log sample) and run the full five-agent pipeline end to end at least once tonight
- [ ] Confirm GitHub repo exists, is set to public or has reviewer access granted, and the three team members all have push access
- [ ] Freeze this checklist by end of night — no new tool decisions after tonight, only building against the ones above
