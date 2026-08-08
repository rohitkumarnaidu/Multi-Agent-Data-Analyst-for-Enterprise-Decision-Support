# Hackathon Demo Script & Judge Talking Points
## 5-Minute Executive Walkthrough for DATASPHERE 26

---

## Demo Timing & Sequence (5 Minutes Total)

```
[00:00 - 01:00] ── Executive Dashboard (The Problem & Business Status)
[01:00 - 02:30] ── AI Multi-Agent Workspace (Multi-Agent Orchestration & RAG)
[02:30 - 03:30] ── Monte Carlo Forecasting (What-If Simulation & ROI)
[03:30 - 04:15] ── AI Guardrails & Human-in-the-Loop Safety (Governance)
[04:15 - 05:00] ── Summary & Business Impact (The $3.2M Margin Recovery)
```

---

## 1. Minute 0:00 – 1:00: Executive Dashboard (`/`)
- **What to Click:** Start on the root `/` Executive Dashboard.
- **Talking Script:**
  > *"Judges, enterprise supply chains lose millions to hidden freight billing leakage and carrier SLA drift. Here on the Executive Dashboard, we immediately see our baseline metrics across 50,000 shipment records: $148.2M annualized GMV, with $3.2M in flagged freight leakage and a 7.8% SLA breach rate. Notice the clean, high-contrast design: no confusing neon glows, just actionable executive metrics."*
- **Action:** Point out the 4 primary KPI tiles, the real-time forecast fan chart, and click the **"Run Query in AI Workspace"** button on the top priority recommendation.

---

## 2. Minute 1:00 – 2:30: AI Multi-Agent Workspace (`/workspace`)
- **What to Click:** Open the **"Golden Prompts (GT-01 to GT-20)"** modal. Select **GT-01** (*"Identify shipments with high variance in freight billing margin"*).
- **Talking Script:**
  > *"Instead of a single black-box LLM, DATASPHERE 26 uses a 10-agent LangGraph system. Look at the live agent graph on the right: The Orchestrator routes the intent, the Knowledge Agent retrieves schema metadata, the Data Retrieval Agent executes deterministic DuckDB SQL over 50,000 records, and the Anomaly Agent runs XGBoost isolation scoring."*
- **Action:** Click on the **Inspector Panel** on the right. Show the generated DuckDB SQL query, execution timings, and the reasoning trace.

---

## 3. Minute 2:30 – 3:30: Monte Carlo Forecasting (`/forecasting`)
- **What to Click:** Navigate to **Forecasting & Simulation** via sidebar or top navigation.
- **Talking Script:**
  > *"Enterprise leaders need to test decisions before committing capital. Here in our Forecasting Studio, we run real-time Monte Carlo simulations. Let's adjust the carrier base rate delta slider and expedited ratio. Instantly, the ECharts fan chart updates with 80% and 95% confidence intervals, projecting a +$1.8M recoverable margin under the AI-optimized scenario."*
- **Action:** Drag the **Carrier Base Rate Delta** slider and click **"Apply Scenario"** on the Strategic Matrix.

---

## 4. Minute 3:30 – 4:15: AI Guardrails & Human-in-the-Loop (`/guardrails`)
- **What to Click:** Navigate to **AI Guardrails Center**.
- **Talking Script:**
  > *"Enterprises cannot deploy AI without deterministic safety. Our Guardrails Center enforces AST SQL sandboxing to block unauthorized mutations, automated PII masking, and financial safety limits requiring human approval for actions exceeding $500,000. Every single action is cryptographically hashed with SHA-256 in our immutable audit ledger."*

---

## 5. Minute 4:15 – 5:00: Business Impact & Wrap-up
- **Talking Script:**
  > *"To summarize: DATASPHERE 26 bridges the gap between raw data lakes and C-suite decision-making. By combining multi-agent intelligence, deterministic SQL verification, Monte Carlo simulations, and enterprise-grade design, we unlock millions in margin recovery with full governance. Thank you, and we welcome your questions!"*
