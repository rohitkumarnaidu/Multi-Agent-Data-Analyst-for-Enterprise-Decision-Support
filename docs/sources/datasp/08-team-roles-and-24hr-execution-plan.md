# 08 — Team Roles & 24-Hour Execution Plan

**DATASPHERE 26 · Track 06 · Multi-Agent Data Analyst for Enterprise Decision Support**
**Event: 07 August 2026 · Today (06 Aug) is final prep, not build day**

---

## 1. Role split — 3 members

### Member A — Data & Agent-Core Lead
Owns: schema handling, data cleaning pass, Data Agent, Analysis Agent, the deterministic numeric core, DuckDB/pandas layer.
Primary artifact: a correct, reproducible numeric answer for every golden test question.

### Member B — GenAI & Orchestration Lead
Owns: Orchestrator Agent, Narrative Agent, Validator Agent, CrewAI wiring, hybrid cloud/local LLM routing, prompt design.
Primary artifact: the full agent pipeline running end to end, with the fallback and guardrail behavior from `03-multi-agent-architecture.md` actually working, not just documented.

### Member C — Delivery & Product Lead
Owns: Streamlit UI, Power BI report, presentation deck, documentation, judge Q&A prep, submission checklist, demo rehearsal coordination.
Primary artifact: a working, rehearsed, non-technical-user-usable demo and everything the submission requires around it.

### Shared, all three
Architecture decisions (already made — see `03-multi-agent-architecture.md`'s ADRs; revisit only if reality forces it), integration points between each person's piece, final rehearsal, judge Q&A, submission verification.

## 2. Working rules

- **Every status update includes:** what was completed, what result was obtained, what evidence was saved, what's blocked, what's needed next, who owns the next step. No "still working on it" updates without at least the first two.
- **Git discipline:** each member works on their own branch (`data-core`, `orchestration`, `delivery`), merges to `main` at the end of each planned block below, not continuously — avoids mid-block merge conflicts eating build time.
- **Blocker escalation:** if any member is stuck for more than 30 minutes without a path forward, say so immediately in the team channel — don't silently burn an hour.
- **No solo scope changes:** if someone wants to add a feature not on the Must/Should list, it goes through a 2-minute team check first, not straight into the branch.

## 3. TODAY — 06 August (remaining hours before the event)

This is the last night before problem statements/dataset go live — not a learning day, a **freeze-and-rehearse** day.

- [ ] Run the full setup checklist in `07-tech-stack-and-tooling.md`, Section 3 — all three members, own laptops
- [ ] Member A: get the data cleaning pass (Section 3 of `04-data-strategy-and-nl-to-insight-pipeline.md`) running against the 1k AI Audit Log sample
- [ ] Member B: get the five-agent CrewAI pipeline running end to end against that same rehearsal dataset — even a rough version, working beats polished-and-broken
- [ ] Member C: get a bare Streamlit chat box wired to the pipeline, and Power BI Desktop opening against the exported CSVs
- [ ] All three: run the team through 3–5 golden test questions tonight as a full rehearsal of the real thing
- [ ] Confirm repository access, confirm everyone can push, confirm the `.pbix` file's canonical laptop
- [ ] Sleep. Hour 20–24 tomorrow depends on everyone being sharp, not on squeezing one more feature in tonight.

## 4. TOMORROW — 07 August, the 24-hour window

### Hour 0–1 — Problem lock-in
- Read the actual released problem statement and dataset description the moment they're available
- Confirm the schema against the assumptions in `04-data-strategy-and-nl-to-insight-pipeline.md`, Section 1 — update the doc if reality differs
- **Gate:** all three members can independently explain the problem and the plan the same way

### Hour 1–3 — Real data in
- Load the real dataset through the cleaning pass; run the schema scan; answer the five open questions listed at the end of `01-problem-analysis-and-competitive-landscape.md`
- Log every cleaning decision (rows dropped/flagged, types corrected) — this is graded evidence, not just internal work
- **Gate:** the real dataset loads cleanly and the schema-reading step correctly classifies identifier/measure/dimension columns without manual hardcoding

### Hour 3–6 — Core pipeline against real data
- Member A: Data Agent + Analysis Agent working against the real schema
- Member B: Orchestrator + Narrative Agent wired to the same schema
- **Gate:** at least 3 of the golden test questions return a correct, grounded answer end to end

### Hour 6–9 — Validator, guardrails, hybrid routing
- Validator Agent live, confidence scoring live, human-approval gate live
- Hybrid cloud/local LLM fallback tested with the cloud key deliberately disabled (GT-16)
- **Gate:** GT-16 and GT-17 (fallback and mismatch-catch tests) both pass

### Hour 9–12 — Full golden test set
- Run all 18 golden test questions; fix what fails; re-run
- **Gate:** 16/18 or better, with the four safety-related tests at 100% (see `06-evaluation-explainability-safety.md`, Section 3)

### Hour 12–15 — Power BI + UI polish
- Member C: `.pbix` report built against real data, KPI set from `05-dashboard-powerbi-integration.md`, Section 3
- Streamlit UI: trace panel, confidence badges, approval gate, chart rendering all visible and working
- **Gate:** the full demo flow in `05-dashboard-powerbi-integration.md`, Section 5 runs without a hitch, twice in a row

### Hour 15–18 — Documentation and repository
- README with exact run instructions, requirements.txt frozen, secrets removed, architecture diagram exported
- System card (`06-evaluation-explainability-safety.md`, Section 6) filled in with real numbers
- **Gate:** a fresh clone of the repo on an unused laptop, following only the README, reproduces the working demo

### Hour 18–20 — Presentation build
- Slide deck built from `10-presentation-and-judge-qa.md`
- Prediction/output results file generated in the required format
- **Gate:** every one of the 7 required deliverables (`11-submission-checklist.md`) has a file or artifact that exists, right now, not "will add later"

### Hour 20–22 — Rehearsal
- Two full run-throughs of the 3–5 minute demo, timed
- Judge Q&A dry run — one member asks, the presenter answers cold from the Q&A doc
- **Gate:** both rehearsals hit time and don't require touching the keyboard to recover from an error

### Hour 22–23 — Freeze
- No new features. Fix only what's actively broken.
- Repository check, output-file check, presentation check, reviewer access check
- **Gate:** submission checklist (`11-submission-checklist.md`) is fully checked, with two-person verification on the critical items

### Hour 23–24 — Submit
- Submit before the deadline; save the submission confirmation
- **Gate:** confirmation saved, screenshot taken, all three members have verified the submission independently

## 5. Emergency scope reduction (use if running behind at any gate above)

**Cut first, in this order:** the Could-Have list in full → Power BI Path B/live-refresh (fall back to Path A or C) → the second domain in the KPI set → GT-18 (follow-up memory) → any chart type beyond bar/line.

**Never cut:** the deterministic numeric core, the Validator Agent, the human-approval gate, the golden test set run, the README/reproducibility, the required output file. These are the Must-Haves for a reason — cutting them doesn't save the demo, it removes the thing being judged.
