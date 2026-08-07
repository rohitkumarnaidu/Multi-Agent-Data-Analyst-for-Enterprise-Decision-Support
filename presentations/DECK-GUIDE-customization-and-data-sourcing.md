# Deck guide — customization, data sourcing, accessibility

**File:** `Multi-Agent-Data-Analyst-DATASPHERE26.pptx` · 29 slides (24 main + 5 appendix) · 16:9 widescreen

---

## 1. Read this first

Three slides ship deliberately incomplete. They are not oversights, and filling them with plausible-looking numbers is the fastest way to lose the credibility the rest of the deck is built on.

| Slide | What's blank | Fill it from |
|---|---|---|
| 16 — ML component | Baseline vs. model results table | Held-out test split, both models, same features |
| 21 — Success metrics | Targets shown; no actuals | Golden-set run output |
| 22 — Evaluation | Single-prompt vs. pipeline table | Same 23 questions through both systems |

If the evaluation run never happens, **delete slides 16 and 22 rather than present blank cells to judges.** A shorter honest deck beats a longer one with holes in it.

---

## 2. Slide map

| # | Slide | Type |
|---|---|---|
| 1 | Title | Dark |
| 2 | Executive summary (one-pager) | Light |
| 3 | Problem description — **verbatim** | Light |
| 4 | Why a chatbot on a database isn't enough | Light |
| 5 | Objectives — **verbatim, all seven** | Light |
| 6 | Four design decisions | Dark |
| 7 | Architecture diagram | Light |
| 8 | Agent roles 1 of 2 | Light |
| 9 | Agent roles 2 of 2 | Light |
| 10 | Data pipeline schematic | Light |
| 11 | Workflow walkthrough + output mockup | Light |
| 12 | Use-case scenarios (4 departments) | Light |
| 13 | Visualizations + chart selection rule | Light, 2 native charts |
| 14 | Explainability — four layers | Light |
| 15 | Interface design mockup | Light |
| 16 | ML model component | Light, **blank table** |
| 17 | Implementation gates | Light |
| 18 | Deliverables — **verbatim, all seven** | Light |
| 19 | Roadmap — 3 phases | Dark |
| 20 | Risk and mitigation | Light |
| 21 | Success metrics | Light, **targets only** |
| 22 | Evaluation approach | Light, **blank table** |
| 23 | Close | Dark |
| 24 | Appendix divider | Dark |
| 25 | A1 — Data schema | Light |
| 26 | A2 — Agent responsibility matrix | Light |
| 27 | A3 — Stack decisions and exclusions | Light |
| 28 | A4 — Golden test set composition | Light |
| 29 | A5 — Team fill-in checklist | Light |

Slide 29 is internal. Delete it before final submission if you want a clean deck; leaving it in does no harm.

---

## 3. Design tokens

Change these in one place if you need to rebrand.

| Token | Hex | Used for |
|---|---|---|
| Ink (dominant) | `0B2545` | Dark slide backgrounds, headings, emphasis cards |
| Deep | `13385E` | Secondary dark surfaces, cards on dark slides |
| Teal | `1C7293` | Primary accent, icon circles, node borders |
| Mint (sharp accent) | `00B39B` | The Validator, "verified answer", highlights |
| Gray | `5C6B7A` | Body text |
| Muted | `92A2B1` | Captions, footers, de-emphasized column |
| Light | `F2F6FA` | Card fills on light slides |
| Line | `DCE5EE` | Card borders, grid lines |
| Amber | `C77D02` | Warnings, the rejection loop, deliberate-failure cases |

**Typography:** Calibri throughout. Titles 32pt bold, section headers 14–15pt bold, body 11–12.5pt, captions 9–10.5pt. Calibri is deliberate — it ships with every Office install, so nothing re-flows on the venue laptop. Swapping to a decorative font risks text overflow you won't see until you're presenting.

**Visual motif:** icons in filled circles, repeated on every content slide. Mint is reserved — it only appears on the Validator and on verified output, so the colour itself carries the argument.

---

## 4. Data sourcing — what goes where

### Slide 10, step 01 (Source)
Currently reads "Official event dataset — sales, finance, operations, customer service tables." Replace with the actual dataset name and table count once you have it. **Rehearsal datasets do not belong in the submission** — your own environment doc flags external private datasets as prohibited and rehearsal data as rehearsal-only. Keep that line clean.

### Slide 13 (Charts)
Both charts carry sample values and a footer saying so. Two options:
- Replace the values with real query output (right-click chart → Edit Data in PowerPoint).
- Leave the samples and say the word "sample" out loud while it's on screen.

Do not do a third thing, which is leave the samples and let judges assume they're real.

### Slide 11 (Sample narrative)
The returns-spike narrative is illustrative and labelled. If you run that class of question successfully in rehearsal, paste the real output in and delete the "Illustrative narrative" caption.

### Appendix A1 (Schema)
Drawn as a designed star schema, not a claim about the event data. Redraw to match the real grain, fact tables, and whether a free-text column actually exists. If there's no free-text field, delete the Tickets box and its connector line — an orphaned box in a schema diagram is the kind of detail a technical judge notices.

### Metrics targets (Slide 21)
Targets came from your metrics document. If you renegotiated any target during the build, change it here rather than reporting against a target you abandoned.

---

## 5. Accessibility

**Alt text.** Every slide's speaker notes end with a line beginning `ALT TEXT:`. PowerPoint doesn't import these automatically. To apply: right-click the visual → View Alt Text → paste. Prioritize slides 7, 10, 11, 13, 15, and 25 — those carry meaning that text alone doesn't.

**Contrast.** All text/background pairs in the deck clear WCAG AA at their sizes. Two things to preserve if you edit: never put Muted (`92A2B1`) on white below 10pt, and keep icon glyphs white inside their colour circles rather than tinting them.

**Language.** Sentences are short and jargon is either avoided or defined in-line. If you add content, the test is whether a non-technical reader gets it on one read — that's also literally one of your success metrics.

**Projector note.** Mint on white is the lowest-contrast pairing in the deck. It appears only on small labels. If the venue projector washes out, those degrade to illegible but carry no essential meaning.

---

## 6. Editing the deck

Two paths:

**In PowerPoint.** Everything is native — real text boxes, real shapes, real charts, no flattened images except the icons. Edit freely. If you move a card, its icon badge is a separate shape; select both.

**Regenerating from source.** The deck is generated by a script (`build_deck.js` + `icons.js`, pptxgenjs). If you want bulk changes — a new palette, a renamed agent across all slides — editing the script and re-running is faster and more consistent than 29 manual edits. Ask and I'll regenerate.

**Google Slides.** File → Import Slides. Expect two degradations: Calibri substitutes to Arial (slightly wider — check slides 8, 9, 20 for wrapping), and the native charts convert to static images, so you'd lose the ability to edit chart data. If Google Slides is your presentation surface, tell me and I'll rebuild with wider text boxes to absorb the font swap.

---

## 7. Presenting it

- **Speaker notes carry the argument, not the slides.** Each one opens with the line to say and names the likely challenge. Read them once beforehand — not during.
- **Slide 2 is your fallback.** If you get cut to two minutes, present slide 2 and stop.
- **Slide 11 is your demo insurance.** It tells the end-to-end story without a laptop.
- **Slide 22's dark caveat card is a feature.** Volunteering the limits of a 23-question test set is what buys belief in everything else you claim.
- Have the repository open in a browser tab for slide 18. Showing a folder in four seconds beats any sentence about it.
