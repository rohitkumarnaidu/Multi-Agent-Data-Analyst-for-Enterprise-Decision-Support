# Forecasting & Scenario Simulation Engine Inventory

This document details the **Forecasting & Scenario Simulation Engine** (`/workspace/forecasting`), which provides dual-tier mathematical recalculation and probabilistic Monte Carlo simulation.

---

## 1. Executive Summary & Capabilities

* **Screen Route**: `/workspace/forecasting`
* **Purpose**: Allows executive decision-makers to simulate operational changes (e.g., carrier rate renegotiations, expedited volume adjustments, fuel surcharge volatility) and project their impact on Gross Merchandise Value (GMV), operating margins, and SLA breach rates over a 12-month horizon.
* **Engine Architecture**:
  * **Tier 1**: Closed-form mathematical elasticity and margin recalculation.
  * **Tier 2**: Probabilistic Monte Carlo simulation (5,000 iterations) producing 80% and 95% predictive confidence fan bands.

---

## 2. Component Inventory

| Component Name | File Location | Key Capabilities & Visual Elements |
| :--- | :--- | :--- |
| **ForecastingHeader** | [`ForecastingHeader.tsx`](file:///c:/PROJECTS/Datasphere/Multi-Agent%20Data%20Analyst%20for%20Enterprise%20Decision%20Support/frontend/src/features/forecasting/components/ForecastingHeader.tsx) | Preset scenario selection pills (Base Case, Bull Market, Fuel Shock, Carrier Renegotiated), live status badges, export button, and recalculate model trigger. |
| **ForecastingKpis** | [`ForecastingKpis.tsx`](file:///c:/PROJECTS/Datasphere/Multi-Agent%20Data%20Analyst%20for%20Enterprise%20Decision%20Support/frontend/src/features/forecasting/components/ForecastingKpis.tsx) | 5 live projected metrics: Projected GMV ($148.2M+), Simulated Margin Rate (34.8% - 38.4%), Forecasted SLA Breach Rate, Recoverable Net Margin, and Prediction Confidence Score (R² = 0.94). |
| **FanChart** | [`FanChart.tsx`](file:///c:/PROJECTS/Datasphere/Multi-Agent%20Data%20Analyst%20for%20Enterprise%20Decision%20Support/frontend/src/features/forecasting/components/FanChart.tsx) | High-performance Apache ECharts fan chart with Historical Actuals line, Forecast Mean line, 80% Confidence Band (light cyan), and 95% Confidence Band (translucent indigo). |
| **SimulationSliders** | [`SimulationSliders.tsx`](file:///c:/PROJECTS/Datasphere/Multi-Agent%20Data%20Analyst%20for%20Enterprise%20Decision%20Support/frontend/src/features/forecasting/components/SimulationSliders.tsx) | Multi-variable interactive simulation sliders for Carrier Rate Delta (-$0.20 to +$0.30/km), Expedited Ratio (5% to 40%), Headcount Delta (-20% to +50%), Fuel Surcharge (-15% to +25%), Avg Distance (300 to 1200 km), and SLA Window (24h to 72h). |
| **SensitivityTornado** | [`SensitivityTornado.tsx`](file:///c:/PROJECTS/Datasphere/Multi-Agent%20Data%20Analyst%20for%20Enterprise%20Decision%20Support/frontend/src/features/forecasting/components/SensitivityTornado.tsx) | Horizontal tornado bar chart ranking driver elasticities (% margin shift per 1% change) for key operational levers. |
| **ScenarioComparisonTable** | [`ScenarioComparisonTable.tsx`](file:///c:/PROJECTS/Datasphere/Multi-Agent%20Data%20Analyst%20for%20Enterprise%20Decision%20Support/frontend/src/features/forecasting/components/ScenarioComparisonTable.tsx) | Side-by-side comparison matrix showing carrier rate, expedited ratio, projected GMV, margin, and SLA breach rate across all saved scenarios with 1-click apply triggers. |

---

## 3. Judge Presentation Script & Q&A Defense

* **Demo Script**: "Judges, rather than just displaying static historical charts, Datasphere gives executives a live dual-tier predictive simulation engine. We can drag carrier rate dials or select a 'Carrier Renegotiation' preset, and the engine immediately recomputes the 12-month Monte Carlo fan envelope—projecting an expansion from 34.8% to 38.4% margin with 95% confidence bounds."
* **Judge Q&A**:
  * *Q: How is the fan envelope generated?*
  * *A: We use an XGBoost regression model trained on 50,000 historical enterprise shipments, coupled with a 5,000-sample Monte Carlo uncertainty distribution to construct the 80% and 95% prediction interval bands.*
