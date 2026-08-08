# Analytics Architecture

Analytics visualization relies on the `ChartSpec` JSON contract defined by the backend. The `ChartRenderer` dynamically decides to render ECharts (if options are provided) or Recharts (for standard tabular data).