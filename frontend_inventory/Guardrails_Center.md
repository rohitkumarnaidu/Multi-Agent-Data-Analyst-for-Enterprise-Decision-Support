# Enterprise AI Guardrails & Policy Enforcement Center

This document details the **Guardrails & Policy Enforcement Center** (`/workspace/guardrails`), which provides runtime AST validation, prompt injection defense, PII redaction, and financial ceiling limits.

---

## 1. Executive Summary & Capabilities

* **Screen Route**: `/workspace/guardrails`
* **Purpose**: Prevents AI jailbreaks, unauthorized database DDL mutations (`DROP TABLE`), customer PII leakage, and unauthorized autonomous financial expenditures.
* **Key Architecture**:
  * **Dual-Layer Evaluation**: Pre-execution AST sanitization + Post-execution budget ceiling enforcement.
  * **Interactive Attack Sandbox**: Allows developers and auditors to test adversarial prompt injections and inspect real-time AST sanitization outputs.

---

## 2. Component Inventory

| Component Name | File Location | Key Capabilities & Visual Elements |
| :--- | :--- | :--- |
| **GuardrailsHeader** | [`GuardrailsHeader.tsx`](file:///c:/PROJECTS/Datasphere/Multi-Agent%20Data%20Analyst%20for%20Enterprise%20Decision%20Support/frontend/src/features/guardrails/components/GuardrailsHeader.tsx) | Active enforcement badge, reset defaults button, and save & publish policy trigger. |
| **GuardrailStats** | [`GuardrailStats.tsx`](file:///c:/PROJECTS/Datasphere/Multi-Agent%20Data%20Analyst%20for%20Enterprise%20Decision%20Support/frontend/src/features/guardrails/components/GuardrailStats.tsx) | 4 live telemetry cards: Active Guardrail Rules (6/6), Threats Intercepted (42 zero breaches), Financial Safety Blocks (14 > $100k blocks), and AST Overhead Latency (12 ms). |
| **GuardrailSimulationTester** | [`GuardrailSimulationTester.tsx`](file:///c:/PROJECTS/Datasphere/Multi-Agent%20Data%20Analyst%20for%20Enterprise%20Decision%20Support/frontend/src/features/guardrails/components/GuardrailSimulationTester.tsx) | Interactive attack sandbox with live prompt input, proposed financial slider ($10k - $500k), simulation trigger, decision badge (`BLOCK` / `ESCALATE_HITL`), triggered violation breakdown, and sanitized payload output. |
| **PolicyRuleCard** | [`PolicyRuleCard.tsx`](file:///c:/PROJECTS/Datasphere/Multi-Agent%20Data%20Analyst%20for%20Enterprise%20Decision%20Support/frontend/src/features/guardrails/components/PolicyRuleCard.tsx) | Dynamic policy cards for all 6 enterprise rules, featuring enable/disable toggles, strictness selectors (Strict / Advisory / Disabled), and threshold adjustment sliders. |

---

## 3. Judge Presentation Script & Q&A Defense

* **Demo Script**: "Judges, the biggest fear enterprise executives have with autonomous AI is catastrophic safety failure. In our Guardrails Center, we enforce strict AST policies. If an adversarial prompt tries to DROP TABLE or leak SSNs, or if an agent tries to approve a $250k discount, our dual-layer guardrails block the injection and enforce mandatory human sign-off."
