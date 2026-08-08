# Explainability Studio (XAI) & Model Transparency

This document details the **Explainability Studio** (`/workspace/explainability`), which delivers global and local explainability mechanisms compliant with the EU AI Act and Federal Reserve SR 11-7 model governance standards.

---

## 1. Global TreeSHAP Feature Attribution & Beeswarm Plot ([SHAPBeeswarmChart.tsx](file:///c:/PROJECTS/Datasphere/Multi-Agent%20Data%20Analyst%20for%20Enterprise%20Decision%20Support/frontend/src/features/explainability/components/SHAPBeeswarmChart.tsx))

* **Visual Type**: Apache ECharts SHAP Summary Scatter / Beeswarm Plot.
* **X-Axis**: SHAP Value (Impact on Model Log-Odds Output).
* **Color Scale**: Actual Feature Value (Rose: High Value, Cyan: Low Value).
* **Top Attributed Features**:
  1. `transit_time_hrs`: High values push prediction strongly towards positive breach class ($+1.82$ SHAP).
  2. `carrier_historical_breach_rate`: Strong non-linear positive shift ($+1.41$ SHAP).
  3. `distance_km`: Moderate positive impact ($+0.85$ SHAP).
  4. `weather_severity`: High severity increases breach risk by $+0.72$ log-odds.
* **Business Value**: Identifies system-wide macroeconomic drivers of operational delivery failure.

---

## 2. Local Transaction Waterfall Plot ([WaterfallPlot.tsx](file:///c:/PROJECTS/Datasphere/Multi-Agent%20Data%20Analyst%20for%20Enterprise%20Decision%20Support/frontend/src/features/explainability/components/WaterfallPlot.tsx))

* **Visual Type**: Cascading Waterfall Attribution Chart for individual transactions.
* **Baseline Value ($E[f(x)]$ )**: Expected base rate probability ($12.4\%$).
* **Step Attributions**:
  * Base Probability: `0.124`
  * $+ \text{transit\_time\_hrs} = 38.4\text{ hrs} \implies +0.342$
  * $+ \text{weather\_severity} = 8.2 \implies +0.215$
  * $+ \text{carrier\_breach\_rate} = 28.4\% \implies +0.184$
  * $- \text{expedited\_flag} = 1 \implies -0.075$
* **Final Model Output ($f(x)$ )**: `0.790` ($79.0\%$ Breach Probability).
* **Business Value**: Enables customer support and operational managers to provide clear, legally defensible justifications for specific order delays.

---

## 3. LIME Local Surrogate Model Fidelity Inspector ([ExplainabilityPage.tsx](file:///c:/PROJECTS/Datasphere/Multi-Agent%20Data%20Analyst%20for%20Enterprise%20Decision%20Support/frontend/src/pages/ExplainabilityPage.tsx))

* **Surrogate Type**: Local Interpretable Model-agnostic Explanations (LIME) linear ridge explainer fitted on 1,000 perturbed sample instances.
* **Local Fidelity ($R^2$)**: `0.934` (High fidelity indicates local surrogate accurately mirrors deep gradient-boosted decision boundary).
* **Feature Weights**: Shows local linear slope for individual continuous features.

---

## 4. Counterfactual Recourse What-If Simulator ([CounterfactualsCard.tsx](file:///c:/PROJECTS/Datasphere/Multi-Agent%20Data%20Analyst%20for%20Enterprise%20Decision%20Support/frontend/src/features/explainability/components/CounterfactualsCard.tsx))

* **Purpose**: Generates minimum-distance, feasible operational interventions that flip an unfavorable prediction (e.g. Breach $\to$ On-Time).
* **Simulated Counterfactual Recourse**:
  * **Original State**: Carrier: SwiftLogistics | Transit Time: 38.4 hrs | Route Buffer: 0 hrs $\implies$ **Breach Probability: 79% (High Risk)**.
  * **Recommended Action**: Reassign Carrier to `ApexFreight` (Tier 1) and increase Route Buffer by `+2.0 hours` $\implies$ **Breach Probability Drops to: 14% (Safe)**.
  * **Estimated Recourse Cost**: `+$18.50` vs `$450.00` SLA breach penalty.
  * **Net Savings**: `+$431.50` per shipment.
