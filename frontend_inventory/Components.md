# Reusable UI Primitives & Component Catalog

This document catalogues all 22 custom atomic UI primitives located in [`frontend/src/shared/ui/`](file:///c:/PROJECTS/Datasphere/Multi-Agent%20Data%20Analyst%20for%20Enterprise%20Decision%20Support/frontend/src/shared/ui/) and global components in [`frontend/src/shared/components/`](file:///c:/PROJECTS/Datasphere/Multi-Agent%20Data%20Analyst%20for%20Enterprise%20Decision%20Support/frontend/src/shared/components/).

---

## 1. Atomic UI Primitives

| Component | File Path | Props & Variants | Purpose |
| :--- | :--- | :--- | :--- |
| **Card** | `src/shared/ui/Card.tsx` | `glow`: `cyan`, `rose`, `amber`, `emerald`, `indigo`, `none`; `padding`: `sm`, `md`, `lg` | Glassmorphic surface container with customizable ambient edge glows. |
| **Button** | `src/shared/ui/Button.tsx` | `variant`: `primary`, `secondary`, `outline`, `destructive`, `ghost`, `cyber`; `size`: `xs`, `sm`, `md`, `lg`; `isLoading` | Interactive action trigger with loading spinner and icon support. |
| **Badge** | `src/shared/ui/Badge.tsx` | `variant`: `default`, `cyber`, `success`, `warning`, `destructive`, `outline`; `pulseDot`: boolean | Status indicator pill with animated glowing LED option. |
| **StatCard** | `src/shared/ui/StatCard.tsx` | `title`, `value`, `delta`, `trend` (`up`/`down`), `sparklineData`, `icon` | KPI metric tile with inline trend delta and SVG sparkline. |
| **StatusBadge** | `src/shared/ui/StatusBadge.tsx` | `status`: `online`, `offline`, `busy`, `error`, `paused` | Dedicated system and agent availability indicator. |
| **Tabs** | `src/shared/ui/Tabs.tsx` | `tabs`: `Array<{id, label, icon}>`, `variant`: `pill`, `underline`, `segmented` | Multi-view switcher with smooth active pill transitions. |
| **Dialog (Modal)** | `src/shared/ui/Dialog.tsx` | `isOpen`, `onClose`, `title`, `description`, `size`: `sm`, `md`, `lg`, `xl` | Accessible backdrop overlay dialog for critical workflows. |
| **Drawer** | `src/shared/ui/Drawer.tsx` | `isOpen`, `onClose`, `position`: `left`, `right`, `top`, `bottom` | Slide-out overlay panel for inspectors and configuration. |
| **DropdownMenu** | `src/shared/ui/DropdownMenu.tsx` | `trigger`, `items`: `Array<{label, icon, onClick, destructive}>` | Contextual action dropdown menu. |
| **Input** | `src/shared/ui/Input.tsx` | `type`, `placeholder`, `leftIcon`, `rightIcon`, `error`, `helperText` | Form text input with focus rings and error states. |
| **Select** | `src/shared/ui/Select.tsx` | `options`: `Array<{value, label}>`, `value`, `onChange`, `error` | Styled select dropdown for filtering and model picking. |
| **Slider** | `src/shared/ui/Slider.tsx` | `min`, `max`, `step`, `value`, `onChange`, `showValue` | Continuous parameter slider for temperature and thresholds. |
| **Switch** | `src/shared/ui/Switch.tsx` | `checked`, `onChange`, `label`, `disabled` | Toggle switch for boolean configurations and guardrails. |
| **Checkbox** | `src/shared/ui/Checkbox.tsx` | `checked`, `onChange`, `label`, `indeterminate` | Accessible checkbox for multi-item table selection. |
| **Timeline** | `src/shared/ui/Timeline.tsx` | `items`: `Array<{title, timestamp, status, details}>` | Sequential event timeline for agent tool steps and audits. |
| **Accordion** | `src/shared/ui/Accordion.tsx` | `items`: `Array<{id, title, content}>`, `allowMultiple` | Expandable disclosure container for nested metadata. |
| **Skeleton** | `src/shared/ui/Skeleton.tsx` | `className`, `variant`: `text`, `circular`, `rectangular` | Shimmering loading placeholder for suspense fallbacks. |
| **Toast** | `src/shared/ui/Toast.tsx` | `type`: `success`, `error`, `info`, `warning`; `message`, `duration` | Floating notification banner for asynchronous mutations. |
| **Tooltip** | `src/shared/ui/Tooltip.tsx` | `content`, `position`: `top`, `bottom`, `left`, `right`, `delay` | Micro-interaction hover tooltip for formulas and abbreviations. |
| **EmptyState** | `src/shared/ui/EmptyState.tsx` | `icon`, `title`, `description`, `action` | Fallback view for empty search results and zero-data states. |
| **ErrorState** | `src/shared/ui/ErrorState.tsx` | `title`, `errorMessage`, `onRetry` | User-friendly error boundary display with retry triggers. |

---

## 2. Global Shared Components

### A. Global Command Palette ([CommandPalette.tsx](file:///c:/PROJECTS/Datasphere/Multi-Agent%20Data%20Analyst%20for%20Enterprise%20Decision%20Support/frontend/src/shared/components/CommandPalette.tsx))
* **Shortcut**: `Ctrl + K` or `Cmd + K`.
* **Features**: Fuzzy search across all 15 screens, active datasets, models, reports, and quick agent actions.

### B. Global Top Navigation Bar ([TopNav.tsx](file:///c:/PROJECTS/Datasphere/Multi-Agent%20Data%20Analyst%20for%20Enterprise%20Decision%20Support/frontend/src/layouts/TopNav.tsx))
* **Breadcrumbs**: Hierarchical route tracking.
* **Notification Drawer Trigger**: Amber counter for unread HITL approval requests and anomaly alerts.
* **User Profile & Organization Badge**: Shows active enterprise role (e.g. `Lead Data Scientist`).
