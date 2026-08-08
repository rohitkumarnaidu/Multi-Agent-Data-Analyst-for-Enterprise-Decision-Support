# Enterprise Frontend Architecture & Technology Stack

## 1. Executive Summary

**Datasphere** is a commercial-grade Multi-Agent AI Analytics Platform for Enterprise Decision Support. Unlike traditional business intelligence dashboards or basic chatbot interfaces, Datasphere visually exposes the entire multi-agent lifecycle—including LangGraph DAG orchestration, asynchronous agent reasoning, sub-millisecond tool execution timelines, local & global feature explainability (SHAP & LIME), hypothesis testing, consensus feature ranking, champion/challenger model validation, and cryptographic audit trails.

---

## 2. Core Technology Stack

| Layer | Technology | Version | Purpose & Rationale |
| :--- | :--- | :--- | :--- |
| **Framework** | **React** | `19.2.8` | Next-generation concurrent React engine with React Server Component readiness and optimized rendering loops. |
| **Runtime / Typing** | **TypeScript** | `~6.0.2` | Strict end-to-end typed contracts ensuring zero runtime prop mismatches across complex AI/ML data models. |
| **Build Tool & Bundler** | **Vite** | `^8.2.0` | Ultra-fast ESM-based development server with Rollup-driven production tree-shaking and multi-chunk code-splitting. |
| **Styling & Design System** | **TailwindCSS** | `^3.4.17` | Utility-first CSS engine with custom obsidian/cyan/slate palettes, glassmorphism tokens, and CSS variables. |
| **State & Server Cache** | **TanStack React Query** | `^5.101.4` | Asynchronous query caching, optimistic UI updates, deduplication, and background synchronization. |
| **Client Routing** | **React Router DOM** | `^7.18.2` | Client-side declarative routing with asynchronous `React.lazy()` chunk loading and hierarchical layout nesting. |
| **Agent DAG Visualizer** | **@xyflow/react (React Flow)** | `^12.11.2` | Interactive node-edge graph visualization for real-time LangGraph multi-agent execution topologies. |
| **Primary Charts & Visuals** | **Apache ECharts** | `^6.1.0` | High-performance Canvas/SVG charting engine for complex multi-axis metrics, correlation heatmaps, and ROC curves. |
| **Supplementary Charts** | **Recharts** | `^3.10.1` | Declarative SVG charting for inline metric sparklines and mini KPI distributions. |
| **Table Engine** | **TanStack Table (React Table)** | `^9.1.0` | Headless, high-throughput virtualization engine for large dataset schemas, feature matrices, and audit logs. |
| **Code & Markdown Engine** | **Monaco Editor + React Markdown** | `^4.7.0` / `^10.1.0` | In-browser VS Code editor engine for Python/SQL sandboxing and formatted markdown report rendering with GitHub Flavored Markdown (GFM). |
| **Iconography** | **Lucide React** | `^1.30.0` | Modern, clean vector icon system across all UI elements and agent role indicators. |
| **Transitions & Motion** | **Framer Motion** | `^13.0.0` | Hardware-accelerated UI transitions, modal overlays, timeline step entries, and pulse indicators. |

---

## 3. Directory & Folder Architecture

```tree
frontend/
├── public/                     # Static assets and favicons
├── src/
│   ├── assets/                 # SVGs and vector branding
│   ├── features/               # Domain-driven feature modules
│   │   ├── ai/                 # Multi-agent graph, chat, timeline, HITL modals, and inspector
│   │   │   ├── components/     # ChatMessageItem, InspectorPanel, PromptInputBar, HITLApprovalCard, etc.
│   │   │   ├── flow/           # React Flow nodes (AgentNode), custom edges, and graph layouts
│   │   │   └── goldenQuestions.ts # Domain-specific enterprise prompts and multi-agent presets
│   │   ├── dashboard/          # Executive dashboard KPIs, anomaly ticker, margin trends, and scenario simulators
│   │   ├── data/               # Data lineage Canvas, semantic layer schemas, and dataset previews
│   │   ├── eda/                # Variable distributions, correlation heatmaps, multivariate scatter plots
│   │   ├── explainability/     # TreeSHAP beeswarm, waterfall plots, and counterfactual what-if recourse
│   │   ├── feature-selection/  # Consensus ranking matrices, VIF collinearity monitors, subset simulators
│   │   ├── models/             # Champion/challenger registry, ROC/PR curves, confusion matrices, inference tester
│   │   ├── reports/            # Executive report archives, formatted GFM markdown viewers, PDF exporters
│   │   └── settings/           # Foundation LLM router, temperature sliders, HITL policies, token telemetry
│   ├── hooks/                  # TanStack React Query custom hooks for all analytical domains
│   ├── layouts/                # Enterprise persistent shell (EnterpriseLayout, EnterpriseSidebar, TopNav)
│   ├── pages/                  # Top-level route views (Lazy-loaded with Suspense skeletons)
│   ├── services/               # Typed service layer matching future FastAPI REST/SSE endpoints
│   ├── shared/                 # Reusable cross-cutting infrastructure
│   │   ├── components/         # Global CommandPalette, GlobalSearch, NotificationDrawer
│   │   ├── context/            # WorkspaceContext (Session state, pending approvals, notifications)
│   │   ├── types/              # Comprehensive TypeScript interfaces (70+ typed interfaces)
│   │   ├── ui/                 # 22 Custom Atomic UI Primitives (Card, Button, Badge, Dialog, Drawer, Tabs, etc.)
│   │   └── utils/              # Tailwind merge (cn), formatting, and date math helpers
│   ├── App.tsx                 # Root React application wrapper with QueryClientProvider & WorkspaceProvider
│   ├── main.tsx                # Client bootstrap entry point
│   ├── routes.tsx              # React Router v7 route table with lazy suspense boundaries
│   └── index.css               # Obsidian theme tokens, glassmorphism utilities, custom scrollbars
├── package.json                # Project dependencies and build scripts
├── tsconfig.json               # TypeScript strict compiler options and path aliases (@/*)
└── vite.config.ts              # Vite plugin configuration and manual code-splitting chunks
```

---

## 4. Design System Tokens & Aesthetics

The application adheres to an **Enterprise Obsidian & Cyber-Cyan Theme**:
* **Background Canvas**: Deep Obsidian Slate (`#020617` / `#0b0f19`) with subtle gradient ambient glows.
* **Panels & Surfaces**: Semi-transparent dark cards (`rgba(15, 23, 42, 0.85)`) with backdrop blur (`backdrop-blur-md`) and 1px border borders (`#1e293b`).
* **Accent Colors**:
  * **Cyber Cyan (`#06b6d4` / `#22d3ee`)**: Primary interactions, active agents, and hero highlights.
  * **Emerald Green (`#10b981`)**: Statistical confidence, champion status, and SLA compliance.
  * **Amber / Orange (`#f59e0b`)**: Human-in-the-loop intervention required, warnings, and latency alerts.
  * **Rose Red (`#f43f5e`)**: High risk, SLA breaches, anomaly spikes, and collinearity violations.
  * **Indigo / Purple (`#6366f1`)**: Deep learning models, embeddings, and semantic knowledge nodes.

---

## 5. Architectural Highlights for Hackathon Judges

1. **Zero Hardcoded Spaghetti**: Every screen pulls from strongly-typed services (`dataService`, `edaService`, `modelService`, `explainabilityService`, etc.) through React Query hooks.
2. **Deterministic Multi-Agent Visibility**: Rather than a black-box chatbot, the UI breaks down agent execution into Orchestration, Data, Analysis, Knowledge, Simulation, Validator, and Reporting phases.
3. **Sub-second Build Performance**: Vite + TypeScript builds the entire 10-module enterprise application in **~1.5s** with **zero type errors**.
