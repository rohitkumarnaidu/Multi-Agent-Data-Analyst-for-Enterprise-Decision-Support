# 03 — Metrics, Evaluation & Benchmarks, Per Module

**DATASPHERE 26 · Track 06 · Multi-Agent Data Analyst for Enterprise Decision Support**

> Every module in the system, one metrics contract each: what's measured, how it's measured, the tooling, and the target. Use this as the literal checklist during the Hour 9–15 evaluation block. Fill the "Actual" column live during the event — this file is the template, not the result.

---

## 1. Orchestrator

| Metric | Method | Tooling | Target | Actual |
|---|---|---|---|---|
| Routing accuracy | Manual check: does the classified intent match the expected category for each golden test question | Golden test set, human review | ≥ 90% (≥ 21/23) | |
| Clarification precision | Of questions that trigger a clarifying question, what fraction genuinely needed one (GT-11) vs. could have been answered directly | Manual review | No false clarifications on unambiguous questions | |
| Out-of-scope refusal rate | Does GT-12 (weather question) get refused, not answered | Golden test, automated string check for refusal phrase | 100% | |
| Classification latency | Time from question submitted to route decision | Logged timestamp | < 2 seconds (p50) | |

## 2. Knowledge node (Agentic RAG)

| Metric | Method | Tooling | Target | Actual |
|---|---|---|---|---|
| Retrieval precision@k | Of the top-k retrieved chunks/examples, what fraction are actually relevant to the question | RAGAS Context Precision | ≥ 0.7 | |
| Retrieval recall | Of all relevant chunks in the store, what fraction were retrieved | RAGAS Context Recall | ≥ 0.7 | |
| "Decides not to retrieve" accuracy | For questions that don't need retrieval, does the node correctly skip it (not fire on every question) | Manual review against golden set | Retrieval fires on customer-service/ambiguous questions only, not on clean structured queries | |
| Hybrid search improvement | Compare vector-only vs. BM25+vector hybrid on a fixed retrieval test set | Manual A/B on 5–8 sample queries | Hybrid ≥ vector-only on exact-term queries (product codes, category names) | |
| Retrieval latency | Time from Knowledge node fired to context returned | Logged timestamp | < 1.5 seconds | |

## 3. Data node (query & retrieval)

| Metric | Method | Tooling | Target | Actual |
|---|---|---|---|---|
| Text-to-SQL execution accuracy | Exact-match / execution-match rate against the golden dataset's expected query results | Golden test set, automated result comparison | ≥ 85% first-attempt, ≥ 95% including the one self-correction retry | |
| Self-correction success rate | Of queries that fail on first attempt, what fraction succeed on the retry using the real error message | Logged attempt/retry outcomes | ≥ 70% | |
| Query safety | Zero destructive operations ever executed | Read-only connection enforcement + NeMo execution rail | 100% — this is a hard gate, not a target to approach | |
| Query latency | Time from query drafted to result returned | Logged timestamp | < 3 seconds (p50), < 8 seconds hard timeout | |

## 4. Analysis node (deterministic computation)

| Metric | Method | Tooling | Target | Actual |
|---|---|---|---|---|
| Numeric correctness | Every computed value spot-checked against an independent manual calculation | Manual verification, golden test set | 100% match — this node is the deterministic core; any mismatch is a bug, not an acceptable error rate | |
| Chart-type appropriateness | Does the selected chart type match the data shape rule (trend→line, comparison→bar, etc.) | Manual review | 100% rule-compliance | |
| Small-sample flagging | Does `low_sample_size` correctly fire on GT-14 and correctly *not* fire on adequately-sized results | Golden test set | 100% correct flagging | |
| Computation latency | Time to compute the insight skeleton from a raw result table | Logged timestamp | < 0.5 seconds (pure pandas/DuckDB, should be near-instant) | |

## 5. Anomaly/Risk node (XGBoost/LightGBM)

| Metric | Method | Tooling | Target | Actual |
|---|---|---|---|---|
| Accuracy | Standard classification accuracy on held-out test split | scikit-learn | Report honestly — no fixed target, since it depends entirely on the real label's difficulty | |
| Precision | True positives / predicted positives | scikit-learn | Report against the Logistic Regression baseline (Section 8 of `02-ENTERPRISE-UPGRADE...`) | |
| Recall | True positives / actual positives | scikit-learn | Same — comparative, not absolute | |
| F1 | Harmonic mean of precision/recall | scikit-learn | Same | |
| ROC-AUC | Area under the ROC curve | scikit-learn | Same | |
| Inference latency | Time to score one record | Logged timestamp | < 200ms | |
| Explainability coverage | Every flagged record has its top-3 driving features attached | SHAP `TreeExplainer` | 100% of flagged records | |
| Proactive-scan trigger rate | Does the standing scan actually surface at least one flagged item on the real dataset (GT-19) | Golden test, manual check | At least 1 genuine flag surfaced before any question is asked | |

## 6. Simulation node (what-if)

| Metric | Method | Tooling | Target | Actual |
|---|---|---|---|---|
| Tier 1 (deterministic) correctness | Recomputed value matches manual calculation using the same formula | Manual verification, GT-20 | 100% | |
| Tier 2 (model-informed) labeling | Every Tier 2 answer is explicitly labeled as directional/estimated, never presented as certain | Manual review, GT-21 | 100% correctly labeled | |
| Refusal correctness | GT-22 (no historical relationship) correctly triggers refusal rather than a fabricated number | Golden test | 100% | |

## 7. Narrative node (LLM, grounded generation)

| Metric | Method | Tooling | Target | Actual |
|---|---|---|---|---|
| Faithfulness | Does the narrative's text match the insight skeleton's actual numbers | RAGAS Faithfulness + independent LLM-as-judge (0.0–1.0 score) | ≥ 0.95 average across the golden set | |
| Answer relevance | Does the narrative actually answer the question asked, or pivot | RAGAS Answer Relevance | ≥ 0.85 average | |
| Readability | Can a non-technical reader restate the answer correctly after one read | Manual test — read the narrative aloud to someone outside the team, ask them to repeat it back | Correct restatement on a spot sample of 5 answers | |
| Fallback quality | When the local model (not cloud) generates the narrative (GT-16), is it still grounded and readable | Manual review during the forced-failure test | No degradation in Faithfulness, acceptable degradation in prose polish | |
| Generation latency | Time from insight skeleton received to draft narrative returned | Logged timestamp | < 4 seconds cloud, < 8 seconds local fallback | |

## 8. Validator node

| Metric | Method | Tooling | Target | Actual |
|---|---|---|---|---|
| Catch rate | Of deliberately injected numeric mismatches (GT-17), what fraction are caught | Golden test, automated check | 100% — this is the whole point of the node | |
| False-positive rate | Of correct narratives, what fraction are incorrectly rejected | Manual review across the full golden set | 0% or as close as achievable — log any occurrence with the exact cause | |
| Confidence calibration | Does "High confidence" correlate with actually-correct answers in spot checks | Manual review, sample of 10 answers across confidence tiers | High-confidence answers are correct in the spot sample | |
| Human-approval trigger accuracy | Does GT-15 (high-risk action) correctly trigger the approval gate, and do low-risk informational answers correctly *not* trigger it | Golden test | 100% correct triggering both directions | |

## 9. Memory (LangGraph checkpoint + ChromaDB)

| Metric | Method | Tooling | Target | Actual |
|---|---|---|---|---|
| Immediate follow-up resolution | GT-23 style question referencing the prior turn resolves correctly | Golden test, manual review | Correct resolution | |
| Semantic recall accuracy | A much later follow-up referencing an earlier turn by content (not by "that") is retrieved correctly from ChromaDB | Manual test, 3–5 constructed multi-turn scenarios | Correct retrieval in at least 4/5 | |
| Session persistence | Killing and restarting the Streamlit app mid-session (if using LangGraph's persistent checkpointing) recovers state | Manual test | Recovers, or fails visibly with a clear "session reset" message — never silently wrong | |

## 10. Report/Export (PDF)

| Metric | Method | Tooling | Target | Actual |
|---|---|---|---|---|
| Content fidelity | Every number in the generated PDF matches the source answer exactly | Manual spot check, 3 generated PDFs | 100% match | |
| Generation latency | Time from "generate PDF" click to file ready | Logged timestamp | < 5 seconds | |
| Cross-platform rendering | PDF opens correctly on a laptop that didn't generate it | Manual test | Opens cleanly, fonts/layout intact | |

## 11. Streamlit UI (live application)

| Metric | Method | Tooling | Target | Actual |
|---|---|---|---|---|
| End-to-end task completion | A non-technical test user (ideally someone outside the team) successfully asks a question and understands the answer unaided | Manual usability test, at least 2 outside testers | Both complete the task without team intervention | |
| Trace panel comprehensibility | Does the "how this was produced" panel make sense to someone who didn't build it | Same usability test | Tester can correctly explain what happened, in their own words | |
| Failure-state clarity | When a forced failure occurs (GT-16), does the UI communicate degraded mode clearly rather than looking broken | Manual test during rehearsal | Clear, non-alarming degraded-mode messaging | |
| Demo reliability | Two full rehearsal runs, back to back | Team rehearsal, timed | Both complete without a crash or unrecoverable state | |

## 12. Power BI dashboard

| Metric | Method | Tooling | Target | Actual |
|---|---|---|---|---|
| KPI accuracy | Every number on the dashboard matches the same number if independently queried via the Data node | Manual cross-check, all 4–6 KPIs | 100% match | |
| Refresh correctness | Refreshing the report after new data actually updates every visual, not just some | Manual test against real event-day data | Full refresh confirmed working before Hour 15 gate | |
| Interactivity | The committed slicer/drill-through actually filters correctly | Manual test | Works as intended, tested twice | |

## 13. Whole-system / end-to-end

| Metric | Method | Tooling | Target | Actual |
|---|---|---|---|---|
| Golden test pass rate | Full 23-question run | All the above, aggregated | ≥ 21/23, safety-critical tests (GT-12, 13, 16, 17, 22) at 100% | |
| Baseline vs. pipeline comparison | Single-prompt baseline vs. full graph, same golden set | Manual/automated comparison, groundedness + correctness | Pipeline meaningfully outperforms baseline on groundedness | |
| End-to-end latency | Full question-to-rendered-answer time | Logged timestamp | < 15 seconds (p50) | |
| Demo-day resilience | Full rehearsal with one deliberately forced failure (network kill, API key disabled) | Team rehearsal | Recovers gracefully, no crash, no silent wrong answer | |
| Rubric self-score | Team's own honest walk-through of the 8 official evaluation categories against what's actually built | Team review, Hour 20–22 | No category scored higher than what can be demonstrated live | |

---

## Notes on tooling setup

- **RAGAS:** `pip install ragas` — needs the insight skeleton (ground truth), the retrieved context (for retrieval metrics), and the narrative (for generation metrics) in its expected input shape; wire this as a batch script run over the full golden set once, not a per-question live call.
- **LLM-as-judge:** any capable model can serve as the judge — the requirement is that it's a *different* model/call from the one that generated the narrative, so the check is genuinely independent, not the same model grading its own homework.
- **SHAP:** `pip install shap`; `TreeExplainer` is fast enough for live, per-prediction use with XGBoost/LightGBM specifically — this is why it was chosen over model-agnostic SHAP methods, which would be too slow for the <200ms latency target.
- **imbalanced-learn (SMOTE):** `pip install imbalanced-learn` — only invoked if Hour 6–9's class-balance check on the real label shows meaningful skew.
