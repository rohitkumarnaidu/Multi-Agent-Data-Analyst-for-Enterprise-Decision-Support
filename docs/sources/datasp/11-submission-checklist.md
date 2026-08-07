# 11 — Submission Checklist

**DATASPHERE 26 · Track 06 · Multi-Agent Data Analyst for Enterprise Decision Support**

> Complete this in the final freeze hour (23:00–24:00 of the live event, per `08-team-roles-and-24hr-execution-plan.md`). Every critical item needs two names, not one.

---

## 1. The 7 required deliverables, mapped to what actually satisfies each one

| # | Deliverable | What satisfies it here | Prepared by | Verified by |
|---|---|---|---|---|
| 1 | **Source Code** | Full repo: agent code (Orchestrator/Data/Analysis/Narrative/Validator), Streamlit UI, data-cleaning pipeline code | | |
| 2 | **Machine Learning / AI Model** | The agent pipeline itself + the LLM configuration (prompts, routing logic, fallback config) — documented as the "model" since this is an agentic system, not a trained classifier | | |
| 3 | **Data Preprocessing Pipeline** | The cleaning pass from `04-data-strategy-and-nl-to-insight-pipeline.md`, Section 3 — schema scan, type correction, missing-value report, duplicate check, outlier flagging, identifier/measure classification, all logged | | |
| 4 | **Dashboard / Visualization** | The `.pbix` Power BI report (Path A minimum) + in-chat Plotly charts | | |
| 5 | **Technical Documentation** | This planning set + the finalized architecture doc + the system card (`06`, Section 6) filled in with real results | | |
| 6 | **Presentation (PPT)** | The 9-slide deck from `10-presentation-and-judge-qa.md` | | |
| 7 | **Prediction Results** | The output file (CSV/JSON) containing the golden test set's questions and the system's actual answers/confidence scores — this is the closest analogue to "prediction output" for a question-answering system | | |

## 2. Source code checklist

- [ ] Repository is public, or reviewer access is explicitly granted and tested from a logged-out/incognito view
- [ ] README states exact run instructions, tested by someone who didn't write the code
- [ ] `requirements.txt` is complete and pinned to versions that were actually tested
- [ ] No API keys, tokens, or secrets anywhere in the repo (check commit history too, not just the latest commit)
- [ ] The correct branch is what's actually pointed to/merged into `main`
- [ ] Main application starts from the documented command with no undocumented manual steps

## 3. Model / pipeline checklist

- [ ] Agent configuration (roles, prompts, routing rules) is committed, not left as untracked local files
- [ ] Which LLMs were actually used (cloud + local fallback) is recorded, with model names/versions
- [ ] Golden test set results are saved as a file, not just verbally reported

## 4. Output file checklist

- [ ] Format matches whatever the event's submission portal expects (CSV/JSON) — confirmed against the actual instructions released with the dataset, not assumed
- [ ] Column/field names are exactly what's expected, no stray index column
- [ ] File opens cleanly in a fresh environment
- [ ] Row/record count matches expectations (18 golden test questions, or the event's specified requirement if different)

## 5. Documentation checklist

- [ ] Methodology section covers: data cleaning decisions, architecture, why multi-agent, evaluation approach
- [ ] Architecture diagram included (from `03-multi-agent-architecture.md`, Section 1)
- [ ] Limitations stated honestly, not omitted
- [ ] Ethics/safety section present: human-approval gate, PII-handling stance, honest hallucination-mitigation claim (catches, doesn't guarantee zero)
- [ ] Reproduction steps match what's actually in the README, not a stale earlier version

## 6. Presentation checklist

- [ ] Slide deck opens correctly on the presentation laptop specifically, not just the laptop it was built on
- [ ] Fonts and charts render correctly after transfer
- [ ] Demo flow confirmed working on the actual presentation laptop, with the actual venue network conditions if testable in advance
- [ ] Backup screenshots of the working demo saved, in case live demo has to be aborted
- [ ] Final presenter assigned and has rehearsed the full flow, not just their own slide

## 7. Final cross-check

- [ ] Correct track selected in the submission form
- [ ] Correct team details entered
- [ ] Correct repository URL entered (test the link itself, don't just copy-paste and assume)
- [ ] Correct output file attached
- [ ] Correct slide deck attached
- [ ] Correct model/pipeline files committed or shared
- [ ] Submitted before the deadline, with time buffer for upload issues
- [ ] Submission confirmation saved (screenshot + any confirmation email/ID)

## 8. Two-person verification sign-off

| Artifact | Prepared by (name, time) | Verified by (name, time) |
|---|---|---|
| Source code / repo access | | |
| Model / pipeline files | | |
| Output/prediction file | | |
| Documentation | | |
| Presentation deck | | |
| Final submission | | |

**Rule:** the person who verifies an artifact is never the same person who prepared it. If only two people are free at freeze hour, the third member's earliest available slot still gets a retroactive check before the deadline — never skip verification to save time on this specific step.
