# Executive Dashboard Feature & Component Inventory

This document details every KPI card, chart, graph, matrix, filter, simulation widget, and notification present on the **Executive Dashboard** (`/workspace/dashboard`).

---

## 1. Executive KPI Cards Grid

The top grid renders 6 high-priority business metrics via [ExecutiveKpiGrid.tsx](file:///c:/PROJECTS/Datasphere/Multi-Agent%20Data%20Analyst%20for%20Enterprise%20Decision%20Support/frontend/src/features/dashboard/ExecutiveKpiGrid.tsx):

| KPI Name | Current Value | Trend / Delta | Sparkline Trend | Business Meaning | Data Source / API | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Total Enterprise GMV** | `$148.2M` | `+12.4% vs last period` (Positive) | Upward 7-point curve | Total gross merchandise volume across all active business units. | `dashboardService.getKpis()` | ✅ Implemented |
| **Gross Margin Rate** | `34.8%` | `-1.8% margin dip` (Negative) | Slight downward slope | Enterprise operating margin after logistics and partner deductions. | `dashboardService.getKpis()` | ✅ Implemented |
| **SLA Delivery Rate** | `92.2%` | `-2.1% SLA breach alert` (Warning) | Dip in mid-week | On-time delivery performance against enterprise contract agreements. | `dashboardService.getKpis()` | ✅ Implemented |
| **Active Incidents** | `14` | `+3 new critical events` (Critical) | Rising spike | Open operational disruptions across carrier logistics networks. | `dashboardService.getKpis()` | ✅ Implemented |
| **Identified Leakage** | `$2.42M` | `-$450k recovered` (Improving) | Flattening curve | Financial losses identified by AI anomaly detection models. | `dashboardService.getKpis()` | ✅ Implemented |
| **AI Decision Confidence** | `96.4%` | `+0.8% high certainty` (Optimal) | Stable high band | Weighted statistical confidence score across active multi-agent graphs. | `dashboardService.getKpis()` | ✅ Implemented |

---

## 2. Interactive Charts & Analytical Visualizations

### A. Enterprise Revenue & Margin Trendline ([RevenueMarginChart.tsx](file:///c:/PROJECTS/Datasphere/Multi-Agent%20Data%20Analyst%20for%20Enterprise%20Decision%20Support/frontend/src/features/dashboard/RevenueMarginChart.tsx))
* **Type**: Multi-axis Apache ECharts line & bar chart.
* **Metrics**: Monthly Net Revenue (Cyan bars), Gross Margin % (Emerald line), and Target Baseline (Dashed slate line).
* **Interactions**: Interactive crosshair tooltips with exact currency formatting, legend toggles, and timeframe zooming.
* **Business Purpose**: Visually correlates gross revenue spikes with operational margin compression to identify unprofitable growth phases.
* **Backend API**: `GET /api/dashboard/revenue-trends` (Mocked in `dashboardService.ts`).

### B. Regional Performance & SLA Compliance ([RegionalBreakdownChart.tsx](file:///c:/PROJECTS/Datasphere/Multi-Agent%20Data%20Analyst%20for%20Enterprise%20Decision%20Support/frontend/src/features/dashboard/RegionalBreakdownChart.tsx))
* **Type**: Horizontal grouped stacked bar chart.
* **Dimensions**: North America, EMEA, APAC, LATAM.
* **Metrics**: On-Time Deliveries (Emerald), Delayed Deliveries (Amber), and SLA Breaches (Rose).
* **Business Purpose**: Isolates regional logistics bottlenecks (e.g. LATAM experiencing 18.4% breach rates due to regional carrier delays).
* **Backend API**: `GET /api/dashboard/regional-breakdown`.

---

## 3. Operational Risk & Anomaly Ticker

### Operational Incident Stream ([ExecutiveAnomalyFeed.tsx](file:///c:/PROJECTS/Datasphere/Multi-Agent%20Data%20Analyst%20for%20Enterprise%20Decision%20Support/frontend/src/features/dashboard/ExecutiveAnomalyFeed.tsx))
* **Type**: Live prioritized event feed with real-time severity badges.
* **Severity Levels**:
  * `CRITICAL (Rose)`: High-dollar risk ($> \$100k exposure, severe SLA breach).
  * `WARNING (Amber)`: Emerging carrier delay, warehouse bottleneck.
  * `INFO (Cyan)`: Automated agent reconciliation completed.
* **Interactive Actions**:
  * **"Investigate in AI Workspace" Button**: Deep-links directly to the AI Workspace with the incident context pre-loaded into the prompt bar.
  * **Filter by Severity**: Toggles between All, Critical-only, and Pending.
* **Backend API**: `GET /api/dashboard/anomalies`.

---

## 4. Cross-Departmental Performance Matrix

### Business Unit Grid ([DepartmentMatrix.tsx](file:///c:/PROJECTS/Datasphere/Multi-Agent%20Data%20Analyst%20for%20Enterprise%20Decision%20Support/frontend/src/features/dashboard/DepartmentMatrix.tsx))
* **Type**: Interactive status matrix table.
* **Columns**: Department Name, Lead Owner, Headcount, Quarterly Budget, Operating Efficiency %, Risk Score, Status Badge.
* **Business Units Monitored**:
  1. Logistics & Fulfillment (Risk: High, Efficiency: 84%)
  2. Inventory Operations (Risk: Moderate, Efficiency: 91%)
  3. Customer Service & Returns (Risk: Low, Efficiency: 96%)
  4. Procurement & Vendor Mgmt (Risk: Moderate, Efficiency: 88%)
* **Actions**: Click-to-filter dashboard metrics by selected department.

---

## 5. Executive What-If Scenario Simulator

### Strategic Causal Dial ([ExecutiveScenarioWidget.tsx](file:///c:/PROJECTS/Datasphere/Multi-Agent%20Data%20Analyst%20for%20Enterprise%20Decision%20Support/frontend/src/features/dashboard/ExecutiveScenarioWidget.tsx))
* **Type**: Interactive multi-slider decision simulator.
* **Simulation Dials**:
  1. **Carrier Rate Adjustment Slider**: `-$0.15/km` to `+$0.25/km`.
  2. **Expedited Shipping Ratio**: `5%` to `40%`.
  3. **Warehouse Buffer Days**: `1 day` to `7 days`.
* **Real-Time Simulated Outputs**:
  * **Projected Margin Impact**: `+$420,000` (Emerald) or `-$180,000` (Rose).
  * **Projected SLA Improvement**: `+3.4%` on-time rate.
  * **Estimated ROI**: `3.2x`.
* **Action Buttons**:
  * **"Run Agent Simulation"**: Dispatches the scenario parameters to the multi-agent Simulation Node for Monte Carlo validation.
  * **"Export Executive Brief"**: Packages scenario findings into a 1-click briefing artifact.

---

## 6. Header Actions & Global Controls ([ExecutiveHeader.tsx](file:///c:/PROJECTS/Datasphere/Multi-Agent%20Data%20Analyst%20for%20Enterprise%20Decision%20Support/frontend/src/features/dashboard/ExecutiveHeader.tsx))
* **Date Range Picker**: Toggles between `Today (24h)`, `Last 7 Days`, `Last 30 Days`, `Quarter to Date (Q3)`.
* **Live Refresh Button**: Trigger instant background React Query invalidation.
* **Export Menu**: Multi-format export dropdown (`PDF Summary`, `Raw CSV Data`, `JSON Payload`).
* **Ask AI Shortcut**: Floating cyber button launching the AI Workspace command bar.
