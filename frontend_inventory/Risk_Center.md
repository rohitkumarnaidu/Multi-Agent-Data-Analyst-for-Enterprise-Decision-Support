# Risk & Anomaly Command Center Inventory

This document details the **Risk & Anomaly Command Center** (`/workspace/risk`), which provides real-time operational risk monitoring, anomaly triage, and automated remediation workflows.

---

## 1. Executive Summary & Capabilities

* **Screen Route**: `/workspace/risk`
* **Purpose**: Surfaces multi-million-dollar operational bottlenecks, SLA breach risks, and carrier contract price disparities before they result in customer attrition and margin losses.
* **Key Mechanisms**:
  * Multivariate risk factor scoring via radar analytics.
  * Geographic exposure quantification across logistics corridors.
  * 1-click prescriptive remediation with automated carrier contract penalty enforcement.

---

## 2. Component Inventory

| Component Name | File Location | Key Capabilities & Visual Elements |
| :--- | :--- | :--- |
| **RiskHeader** | [`RiskHeader.tsx`](file:///c:/PROJECTS/Datasphere/Multi-Agent%20Data%20Analyst%20for%20Enterprise%20Decision%20Support/frontend/src/features/risk/components/RiskHeader.tsx) | Anomaly count badge, export risk report button, and live anomaly scan trigger. |
| **RiskStats** | [`RiskStats.tsx`](file:///c:/PROJECTS/Datasphere/Multi-Agent%20Data%20Analyst%20for%20Enterprise%20Decision%20Support/frontend/src/features/risk/components/RiskStats.tsx) | 4 live telemetry cards: Total Value at Risk ($2.42M Exposure), Critical Severity Items (14 events), High-Risk Carriers (3 carriers), and Recovered This Week (+$184k). |
| **RiskDistributionChart** | [`RiskDistributionChart.tsx`](file:///c:/PROJECTS/Datasphere/Multi-Agent%20Data%20Analyst%20for%20Enterprise%20Decision%20Support/frontend/src/features/risk/components/RiskDistributionChart.tsx) | Dual chart layout: (1) Radar Profile of Risk Factors (Weather, Carrier Reliability, Volatility, Surcharges) vs Safety Baseline; (2) Regional Financial Exposure Bar Chart by geographic corridor. |
| **AnomalyTriageTable** | [`AnomalyTriageTable.tsx`](file:///c:/PROJECTS/Datasphere/Multi-Agent%20Data%20Analyst%20for%20Enterprise%20Decision%20Support/frontend/src/features/risk/components/AnomalyTriageTable.tsx) | Prioritized queue of operational incidents with category badges, financial exposure dollar amounts, SLA failure rates, root cause summaries, AI recourse plans, and triage action buttons. |
| **RemediationModal** | [`RemediationModal.tsx`](file:///c:/PROJECTS/Datasphere/Multi-Agent%20Data%20Analyst%20for%20Enterprise%20Decision%20Support/frontend/src/features/risk/components/RemediationModal.tsx) | Action modal showing target carrier details, financial risk, prescriptive AI action plan, and 1-click mitigation approval trigger. |

---

## 3. Judge Presentation Script & Q&A Defense

* **Demo Script**: "Judges, in the Risk Command Center, Datasphere continuously scans operational telemetry. It identifies $2.42M in value-at-risk, isolates Apex Freight Systems with a 24.2% SLA failure rate in Chicago, and lets the executive trigger an automated contract renegotiation clause with a single click."
