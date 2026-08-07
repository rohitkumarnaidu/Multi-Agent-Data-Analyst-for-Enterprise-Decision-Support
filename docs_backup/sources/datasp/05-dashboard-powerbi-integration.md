# 05 — Dashboard: Power BI Integration Plan

**DATASPHERE 26 · Track 06 · Multi-Agent Data Analyst for Enterprise Decision Support**

> Planning document. Actual report build happens live during the event against the real dataset.

---

## 1. Why Power BI, specifically

Every comparable public reference project (see `01-problem-analysis-and-competitive-landscape.md`) ships a Streamlit chat window as its entire visual surface. A Power BI report sitting alongside the agent chat does two things a chat window alone can't:

1. It gives the judges an **exec-facing view** they instantly recognize as "real enterprise BI," which directly matches the problem statement's framing ("enterprise decision support").
2. It separates two genuinely different jobs that shouldn't be forced into one interface — **conversational Q&A** (the agent chat) and **at-a-glance monitoring** (the dashboard) — and doing that separation well is itself a design decision worth explaining to judges under Innovation.

## 2. Three integration paths — pick based on how the event day is actually going

### Path A — Primary (default plan for the whole event)
Power BI **Desktop**, running locally, no cloud login required.

- The agents' Data/Analysis layer writes its working tables (raw + a handful of pre-aggregated summary tables) to CSV or Parquet in a fixed `outputs/` folder.
- A Power BI Desktop file (`.pbix`) is built once, pointed at that folder as its data source.
- During the event, re-running the pipeline against updated/real data and clicking **Refresh** in Power BI Desktop updates every visual.
- Zero dependency on venue Wi-Fi, licensing, or a Power BI cloud tenant. This is the path to actually rehearse tonight.

### Path B — Reach (only attempt once Path A is demo-stable and hours remain)
Live-updating Power BI via the **REST API push dataset** pattern: agents call the Power BI REST API to push new rows into a streaming/push dataset as questions are asked, so the report visibly updates in near-real-time while the judges watch.

- Requires a Power BI **Pro** (or trial) account and an internet connection at the venue.
- Higher demo impact (a dashboard tile changing live while an agent answers a question is a strong 10-second moment) — but it is the first thing to abandon if venue connectivity is unreliable.
- Alternative reach option: **publish-to-web** embed of the report inside the Streamlit chat UI via an iframe, so judges never have to context-switch to a second application at all.

### Path C — Fallback (use if Power BI Desktop install/licensing/hardware becomes a blocker mid-event)
A **Power-BI-styled custom dashboard** built in Plotly Dash or Streamlit — same visual language (KPI cards across the top, a slicer/filter bar, a grid of charts below) but with zero Power BI dependency at all.

- This is not a downgrade in substance, only in the specific tool — the KPI logic, the charts, and the "looks like enterprise BI" framing are identical, just self-hosted in Python.
- Because the agents already export clean summary tables for Path A, wiring the same tables into a Plotly Dash page is a small delta, not a rebuild — this is exactly why Section 3's KPI list is defined independently of which path renders it.

**Decision rule:** commit to Path A by hour 16 of the live event regardless of how Paths B/C are going — see the execution plan's stage gates. A working Path A beats an unfinished Path B every time in front of a judge.

## 3. The KPI set (path-independent — build this list first, wire it into whichever path is live)

| KPI | Why it's on the dashboard |
|---|---|
| Total revenue / sales (with period-over-period %) | The single number every business stakeholder asks for first |
| Revenue by region or segment (bar or map) | Directly answers the "where's the problem" framing from the problem statement |
| Trend over time (line, by month/quarter depending on data grain) | Shows trajectory, not just a snapshot |
| Top-N products/customers/categories | Ranking questions are one of the core intents the agents handle — the dashboard should mirror that |
| A cost/margin or efficiency metric (finance/ops domain) | Covers a second business domain beyond sales, matching the problem statement's "sales, finance, operations, customer service" scope |
| A customer-service or ops health indicator (ticket volume, cycle time) | Covers a third domain — avoids the dashboard reading as "just a sales report" |

Four to six KPIs total, per the feature plan's Must-Have — resist the urge to add a seventh chart just because there's room; a dashboard a judge can read in 15 seconds beats one that needs a tour.

## 4. Interactivity (Should-Have)

At minimum one working **slicer** (e.g. filter the whole page by region or by quarter) or one **drill-through** (click a bar to see the underlying rows). Pick whichever is faster to build correctly rather than attempting both — a single interaction that works flawlessly in front of judges outperforms two that are shaky.

## 5. Demo flow for the dashboard specifically

1. Open on the dashboard first (10 seconds) — "here's the exec view, updated from the data the agents just processed."
2. Click the slicer once to show it's real and interactive, not a static image.
3. Switch to the agent chat, ask a question whose answer is one of the KPIs already on screen — this is the moment that proves the two surfaces are actually connected to the same underlying data, not two disconnected demos glued together.
4. Return to the dashboard if Path B/live-refresh is working, to show the number actually reflects what was just asked about.

## 6. Risks specific to this component (full register in `09-risk-register-and-blind-spots.md`)

- Power BI Desktop not installed / install blocked by venue network restrictions → install and license-check **tonight**, not at the venue.
- Power BI Service (cloud) requiring an account/internet for Path B → treat Path B as optional from the start; never let it block Path A.
- `.pbix` file corruption or version mismatch between team laptops → one designated laptop owns the canonical `.pbix` file; others work from exported screenshots/PDF as backup evidence only.
