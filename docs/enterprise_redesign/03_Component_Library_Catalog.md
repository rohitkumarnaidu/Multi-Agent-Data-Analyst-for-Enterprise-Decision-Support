# Enterprise Component Library Catalog
## Standardized Atomic & Compound UI Primitives in `src/shared/ui/`

---

## 1. Core Component Inventory

```
src/shared/ui/
├── Card.tsx          # Base container with CardHeader, CardTitle, CardContent, CardFooter
├── StatCard.tsx      # High-density KPI indicator with delta pills and sparklines
├── Button.tsx        # Standard enterprise button (primary, secondary, outline, ghost, destructive)
├── Badge.tsx         # Semantic pill badge (default, primary, success, warning, destructive)
├── Tabs.tsx          # Accessible segmented navigation controls
├── Dialog.tsx        # Accessible focus-trapped modal overlay
├── Toast.tsx         # Context-driven toast feedback provider
├── Switch.tsx        # Binary toggle switch with smooth state transition
├── Input.tsx         # Text & search inputs with prefix/suffix icon slots
└── Slider.tsx        # Range inputs with tick markers and value labels
```

---

## 2. Component Specifications & Code Patterns

### 1. `Card` & Compound Sub-Components
- **File:** `src/shared/ui/Card.tsx`
- **Variants:** `default` (standard border), `elevated` (subtle shadow), `muted` (shaded surface), `outline` (transparent).
- **Code Pattern:**
  ```tsx
  <Card variant="default" className="p-4">
    <CardHeader>
      <CardTitle>Carrier On-Time Performance</CardTitle>
      <CardDescription>Rolling 30-day performance by lane</CardDescription>
    </CardHeader>
    <CardContent>
      <PerformanceChart data={data} />
    </CardContent>
  </Card>
  ```

### 2. `StatCard` (Executive KPI Tile)
- **File:** `src/shared/ui/StatCard.tsx`
- **Props:** `title`, `value`, `delta`, `deltaType` (`positive` | `negative` | `neutral`), `icon`, `subtitle`.
- **Code Pattern:**
  ```tsx
  <StatCard
    title="Net Operating Margin"
    value="36.4%"
    delta="+2.8% vs Baseline"
    deltaType="positive"
    icon={<Percent className="w-4 h-4" />}
    subtitle="Simulated Carrier Optimization"
  />
  ```

### 3. `Button`
- **File:** `src/shared/ui/Button.tsx`
- **Variants:** `primary`, `secondary`, `outline`, `ghost`, `destructive`, `link`.
- **Sizes:** `xs` (24px), `sm` (32px), `md` (38px), `lg` (44px), `icon` (square).
- **Capabilities:** Built-in `isLoading` spinner state, `leftIcon`, `rightIcon` slots.

### 4. `Badge`
- **File:** `src/shared/ui/Badge.tsx`
- **Variants:** `default` (slate), `primary` (sky), `success` (emerald), `warning` (amber), `destructive` (rose), `outline`.
- **Sizes:** `sm` (18px height, 10px font), `md` (22px height, 11px font).

### 5. `Tabs`
- **File:** `src/shared/ui/Tabs.tsx`
- **Variants:** `pills` (segmented pill container), `underline` (horizontal border tab).
- **Code Pattern:**
  ```tsx
  <Tabs
    tabs={[
      { id: 'summary', label: 'Executive Summary' },
      { id: 'trace', label: 'Reasoning Trace' },
      { id: 'sql', label: 'DuckDB SQL' }
    ]}
    activeTab={activeTab}
    onChange={setActiveTab}
    variant="pills"
  />
  ```

---

## 3. Best Practices for Developers
1. **Never use ad-hoc hex values:** Always rely on Tailwind design system utility classes (`text-slate-900`, `bg-sky-50`, `border-slate-200`).
2. **Standardize Card Padding:** Use `p-4` for compact widgets and `p-6` for primary layout sections.
3. **Always specify Button variants:** Use `primary` for main call-to-action (1 per view) and `outline`/`ghost` for secondary tools.
