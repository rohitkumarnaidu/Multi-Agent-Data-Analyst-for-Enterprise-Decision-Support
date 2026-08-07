# 09 — Risk Register & Blind Spots

**DATASPHERE 26 · Track 06 · Multi-Agent Data Analyst for Enterprise Decision Support**

---

## 1. Risk register

| ID | Risk | Prob. | Impact | Score | Prevention | Fallback |
|---|---|---|---|---|---|---|
| R-01 | Real dataset schema doesn't match rehearsal assumptions | High | High | Critical | Design Data Agent to read schema dynamically, not hardcoded (`04`, Section 4) | Manual schema-mapping session at Hour 1–3 gate before building further |
| R-02 | Cloud LLM API rate-limited or down during the demo | Medium | High | High | Hybrid routing built in from the start (`07`, Section 2) | Local model fallback, already tested at GT-16 |
| R-03 | Venue Wi-Fi unreliable | Medium | High | High | Local model doesn't need internet; Power BI Path A doesn't need internet | Full local-only demo mode confirmed working before hour 20 |
| R-04 | Power BI Desktop won't install / license issue at venue | Low | High | Medium | Install and verify tonight, not at the venue | Path C custom dashboard (`05`, Section 2) ready as a real fallback, not a hypothetical one |
| R-05 | GPU unavailable for NIM | Medium | Low | Low | Ollama on CPU works without a GPU | Default to Ollama, treat NIM as a bonus only |
| R-06 | One team member unavailable for part of the event | Low | High | Medium | Roles documented (`08`, Section 1) with enough overlap that any two people can cover the third's area | Redistribute per the role doc, not improvised on the spot |
| R-07 | Agent pipeline works on rehearsal data but breaks on the real dataset's edge cases | Medium | High | High | Golden test set includes ambiguous/missing/out-of-scope cases, not just happy-path | Graceful refusal paths are Must-Have, not Should-Have, specifically because of this risk |
| R-08 | Validator Agent produces false positives (rejects correct narratives) | Low | Medium | Low | Tolerance margin on numeric matching (rounding-aware, not exact-string) | Manual override logged, not silently patched over |
| R-09 | Demo runs long, cut off mid-flow by time | Medium | Medium | Medium | Rehearsed twice, timed, with markers (`10`, presentation section) | Pre-recorded backup only if event rules explicitly permit it — confirm this before assuming it's allowed |
| R-10 | Repository access broken for reviewers (private repo, wrong permissions) | Low | Critical | High | Two-person verification in `11-submission-checklist.md` | Fix before freeze hour, not discovered at submission |
| R-11 | Output/prediction file in wrong format | Low | Critical | High | Format checked against the exact deliverable requirement, tested by opening the file fresh | Regenerate before freeze hour, verified by a second team member |
| R-12 | Laptop hardware failure mid-event | Low | High | Medium | Git pushes at every block boundary (`08`, Section 2) so no laptop is a single point of failure | Any team member's laptop can pick up from the last pushed commit |
| R-13 | Team over-builds the Could-Have list and runs out of time for Must-Have polish | Medium | High | High | Feature plan's MoSCoW split is explicit and was agreed before build started | Emergency scope reduction order (`08`, Section 5) |
| R-14 | Judges ask a question the team hasn't prepared for | Medium | Medium | Medium | Broad Q&A bank in `10-presentation-and-judge-qa.md` covering data, model, agents, safety, business impact | Answer honestly from first principles using the architecture docs — don't guess a number |
| R-15 | Text/comment column (if present) contains something unexpected that trips the Narrative Agent | Low | Medium | Low | PII/sensitive-column exclusion rule (`06`, Section 5) applied automatically | Column excluded from narrative generation, flagged, moves on |

## 2. Blind spots — things teams at exactly this kind of event routinely miss

These aren't generic hackathon advice; each one is specific to *this* problem shape and has bitten similar public projects or is an easy trap given the plan above.

1. **Confusing "the demo works" with "the system is accurate."** A fluent-sounding wrong answer looks identical to a correct one to an audience in a 3-minute demo. This is exactly why the Validator Agent and golden test set exist — don't let rehearsal success on 3 familiar questions substitute for the full 18-question run.

2. **Forgetting that "explainability" has to be visible, not just true.** A system that internally computes everything correctly but only shows the final sentence gets zero credit for explainability in a live demo — the trace panel has to actually be opened and shown, not just exist in the code.

3. **Treating the human-approval gate as a nice-to-have and cutting it under time pressure.** It's cheap to build (one UI state) and expensive to explain the absence of when a judge asks "what stops this from doing something wrong automatically" — keep it on the Must-Have list mentally, even though it's technically filed under Should-Have.

4. **Assuming "last quarter" and similar relative-time phrases have an obvious meaning.** They don't, inside a static dataset with no real "today." Resolved explicitly in `04`, Section 5 — don't let this surface as a live bug during the demo.

5. **Building the Power BI report against rehearsal data and never re-testing the refresh against the real dataset.** The refresh mechanism, not just the visuals, needs to be proven against real data before hour 20 — a `.pbix` that looks right but silently didn't refresh is worse than an honest "still on rehearsal data" caveat.

6. **Not rehearsing the failure paths on purpose.** Every team rehearses the happy path. Almost none rehearse "what happens when I ask it something it can't answer" live, in front of the room — and that's often the single most convincing 20 seconds of the whole demo, because it's the one thing competitors can't easily fake.

7. **Silent data cleaning.** Dropping rows or "fixing" values without a visible log is a fast way to lose Data Preprocessing credit even when the underlying work was good — log every decision (`04`, Section 3).

8. **Over-indexing on Token Costs and ignoring Business Impact / SLAs.** The problem statement names efficiency explicitly, but an AI Command Center that only tracks token costs while ignoring whether the agents are actually solving problems under-delivers against its own brief.

9. **Assuming the judges will ask about the AI.** Several likely questions are about the *data* (preprocessing decisions, leakage, missing values) and the *business impact* (who actually benefits, what changes for them) — the Q&A bank in `10` deliberately covers both, not just the agent architecture.

10. **Not having a plan for "what if the real dataset is much smaller/larger/messier than expected."** Rehearsing on exactly one well-behaved 1k chunk creates false confidence — the 5k scaling chunk in the rehearsal plan exists specifically to stress-test this before it becomes a live surprise.

11. **Underestimating how long Power BI Desktop installs/updates take on an unfamiliar laptop.** This has derailed more than one team's dashboard plan at other events for reasons that have nothing to do with the actual system — it's a Section-3-of-`07`, tonight problem, not a during-the-event problem.

12. **Presenting the recommended-action feature as if the system decided something, rather than recommended something.** The language in the demo and the slides needs to consistently say "recommended" and "requires approval," not "the system decided" — a small wording discipline that protects the entire safety/explainability narrative the rest of the build earns.
