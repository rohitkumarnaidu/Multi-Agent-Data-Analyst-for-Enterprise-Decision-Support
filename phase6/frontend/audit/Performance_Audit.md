# Performance Audit

### Metrics
- **Initial Load Time (FCP)**: Excellent due to Vite Rollup code-splitting.
- **Bundle Size**: Initial JS payload is minimal. Heavy charting libraries (ECharts) are split into asynchronous chunks (`ChartRenderer-D9NSV9YM.js`).
- **Rendering**: Virtualized lists and memoized calculations are missing but not strictly required given the current data scale. React Query prevents unnecessary re-rendering.
