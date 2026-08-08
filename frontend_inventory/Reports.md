# Enterprise Reports & Multi-Format Exporters

This document details the **Enterprise Reports Hub** (`/workspace/reports`), which automates the synthesis of multi-agent analytical findings into boardroom-ready briefing artifacts.

---

## 1. Executive Report Archive ([ReportListCard.tsx](file:///c:/PROJECTS/Datasphere/Multi-Agent%20Data%20Analyst%20for%20Enterprise%20Decision%20Support/frontend/src/features/reports/components/ReportListCard.tsx))

### Curated Briefings Catalog:
1. **`Q3 Logistics SLA Breach & Root Cause Audit`** (`Executive Briefing` | 6 min read | Author: Autonomous Report Agent)
   * **Audited Scope**: 200,000 national logistics transactions.
   * **Identified Leakage**: `$2.42M`.
   * **Tags**: `Supply Chain`, `SLA Breach`, `Carrier Performance`, `Q3 Audit`.
2. **`Regional Carrier Margin Optimization & Renegotiation`** (`Financial Briefing` | 4 min read)
   * **Identified Savings**: `$1.85M` recoverable margin via carrier tier restructuring.
   * **Tags**: `Cost Reduction`, `Procurement`, `Contract Terms`.
3. **`Automated ML Multicollinearity & Feature Governance Brief`** (`Technical Report` | 8 min read)
   * **Focus**: VIF reduction, LASSO selection, and model inference latency improvements.
   * **Tags**: `MLOps`, `Feature Store`, `Governance`.

---

## 2. Structured Report Viewer with Live KPI Grids ([ReportViewer.tsx](file:///c:/PROJECTS/Datasphere/Multi-Agent%20Data%20Analyst%20for%20Enterprise%20Decision%20Support/frontend/src/features/reports/components/ReportViewer.tsx))

* **Executive KPI Summary Header**:
  * **Total Audited GMV**: `$148.2M`
  * **SLA Breach Rate**: `7.8%`
  * **Identified Leakage**: `$2.42M`
  * **Recoverable Margin**: `$1.85M`
* **Markdown Renderer**: Formats complex analytical reports with:
  * GitHub Flavored Markdown (GFM) tables.
  * Root-cause breakdown matrices.
  * Prescriptive strategic action plans with estimated implementation timelines.

---

## 3. Multi-Format Exporter Toolbar

* **1-Click PDF Export**: Utilizes custom `@media print` stylesheets to format the report into an executive document layout ready for distribution.
* **Download Raw Markdown (`.md`)**: Generates an instant client-side UTF-8 encoded `.md` file download.
* **Copy Markdown to Clipboard**: Copies formatted markdown text with instant visual feedback.
* **Share Briefing Link**: Generates a shareable URL with embedded authorization tokens.

---

## 4. Autonomous Report Generation Modal ([GenerateReportModal.tsx](file:///c:/PROJECTS/Datasphere/Multi-Agent%20Data%20Analyst%20for%20Enterprise%20Decision%20Support/frontend/src/features/reports/components/GenerateReportModal.tsx))

* **Input Form Controls**:
  * **Report Title**: Customizable string input.
  * **Report Type**: `Executive Briefing`, `Technical Audit`, `Risk Assessment`, `Quarterly Review`.
  * **Target Analytical Scope**: Natural language scope definition (e.g., *"Focus on Midwest region carrier breach penalties"*).
  * **Synthesis Depth**: `Executive Summary (High-Level)` vs `Technical Deep-Dive (Code & Statistics)`.
* **Multi-Agent Compilation Hook**: Calls `useGenerateReport` mutation, triggering the autonomous Report Agent to synthesize live metrics into a newly published report artifact.
