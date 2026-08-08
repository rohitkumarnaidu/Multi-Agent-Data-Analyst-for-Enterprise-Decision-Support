# Enterprise Design System Specification
## DATASPHERE 26 Design Tokens, Spacing Grid & Typography Standards

---

## 1. Color System Tokens

The redesigned system uses an **Enterprise Slate & Sky** core palette with semantically governed functional status tokens.

### Core Neutral Surfaces
- **App Background (Light):** `#f8fafc` (`slate-50`)
- **App Background (Dark):** `#090d16` (`slate-950` adjusted)
- **Surface Elevation 1 (Card Light):** `#ffffff` (`white`) with `border-slate-200`
- **Surface Elevation 1 (Card Dark):** `#0f172a` (`slate-900`) with `border-slate-800`
- **Surface Elevation 2 (Elevated):** `#ffffff` / `#1e293b` with subtle `box-shadow: 0 1px 3px rgba(0,0,0,0.08)`

### Brand & Interactive Accent
- **Primary Sky Accent:** `#0284c7` (`sky-600`) / `#38bdf8` (`sky-400`)
- **Interactive Hover:** `#0369a1` (`sky-700`) / `#0ea5e9` (`sky-500`)
- **Focus Ring:** `ring-2 ring-sky-500 ring-offset-2`

### Semantic Feedback Tokens
| Semantic Role | Light Mode Value | Dark Mode Value | Usage Rule |
| :--- | :--- | :--- | :--- |
| **Success / Healthy** | `emerald-700` (`#047857`) on `emerald-50` | `emerald-300` on `emerald-950/60` | Margin increases, SLA compliance, passing guardrails |
| **Warning / Caution** | `amber-700` (`#b45309`) on `amber-50` | `amber-300` on `amber-950/60` | Carrier SLA drift, medium anomaly confidence |
| **Destructive / Risk** | `rose-700` (`#be123c`) on `rose-50` | `rose-300` on `rose-950/60` | SLA breaches, unauthorized prompts, margin erosion |
| **Informational** | `sky-700` (`#0369a1`) on `sky-50` | `sky-300` on `sky-950/60` | Agent status, tool execution, session metadata |

---

## 2. Typography Scale & Hierarchy

The application employs `Inter`, `system-ui`, `-apple-system`, `sans-serif` for high-density legibility and `JetBrains Mono`, `ui-monospace` for SQL, numeric IDs, and cryptographic hashes.

```
Type Token        Font Size / Line Height   Font Weight     Application
----------------------------------------------------------------------------------------
Heading 1 (Page)  24px (1.5rem) / 2rem      Bold (700)      Main Screen Page Titles
Heading 2 (Sec)   18px (1.125rem) / 1.75rem Semibold (600)  Card Headers, Modal Titles
Heading 3 (Card)  14px (0.875rem) / 1.25rem Semibold (600)  Section Groupings, KPI Titles
Body Regular      13px (0.8125rem) / 1.25rem Regular (400)  Content, Descriptions
Body Dense        12px (0.75rem) / 1rem     Regular/Medium  Table Cells, Log Streams
Micro Label       11px (0.6875rem) / 1rem   Semibold (600)  Badges, Category Pill Tags
Code / Monospace  12px (0.75rem) / 1.25rem  Medium (500)    SQL, Hashes, Latency Timings
```

---

## 3. Strict 8px Spacing Grid System

All components, layouts, margins, and padding conform to standard 8px multiples (with 4px half-steps for micro-alignments):

- **4px (`0.25rem` / `p-1`, `gap-1`):** Micro badge padding, inline icon offsets.
- **8px (`0.5rem` / `p-2`, `gap-2`):** Button inner spacing, tight element stacks.
- **12px (`0.75rem` / `p-3`, `gap-3`):** Compact widget cards, table row heights.
- **16px (`1.0rem` / `p-4`, `gap-4`):** Standard KPI cards, panel containers.
- **24px (`1.5rem` / `p-6`, `gap-6`):** Screen-level grid gutters, modal padding.
- **32px (`2.0rem` / `p-8`, `gap-8`):** Major executive dashboard section dividers.

---

## 4. Elevation & Surface Layering

1. **Base Layer (`z-0`):** App Canvas Background (`bg-slate-50 dark:bg-slate-950`).
2. **Card Layer (`z-10`):** Standard Card Containers (`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800`).
3. **Sticky Navigation Layer (`z-30`):** Top Navigation Bar (`backdrop-blur-md bg-white/80 dark:bg-slate-900/80`).
4. **Overlay / Drawer Layer (`z-40`):** Responsive Mobile Navigation Sheet.
5. **Modal & Dialog Layer (`z-50`):** Golden Prompts Modal, HITL Confirmation Dialogs.
6. **Toast Notification Layer (`z-100`):** System Toast Alerts (`bottom-4 right-4`).
