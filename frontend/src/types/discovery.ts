// ─── Dataset Discovery Types ─── //

export interface ColumnMeta {
  column_name: string;
  dtype: string;
  semantic_type: 'datetime' | 'numeric' | 'categorical' | 'boolean' | 'text';
  null_count: number;
  null_pct: number;
  unique_count: number;
  cardinality: number;
  min_val?: number;
  max_val?: number;
  mean_val?: number;
  median_val?: number;
  std_val?: number;
  top_values?: Array<{ value: string; count: number }>;
  is_dimension: boolean;
  is_measure: boolean;
  is_date: boolean;
}

export interface KPIDefinition {
  id: string;
  label: string;
  sql: string;
  format: 'number' | 'currency' | 'percent' | 'decimal';
  aggregation: string;
  column: string;
}

export interface ChartRecommendation {
  id: string;
  type: 'line' | 'bar' | 'pie' | 'scatter' | 'heatmap' | 'histogram' | 'treemap';
  title: string;
  sql: string;
  x_column: string;
  y_column: string;
  aggregation: string;
}

export interface DetectedDomain {
  domain_id: string;
  label: string;
  icon: string;
  color: string;
  confidence: number;
  matched_columns: string[];
  kpi_definitions: KPIDefinition[];
  chart_recommendations: ChartRecommendation[];
}

export interface DatasetDiscovery {
  table_name: string;
  total_rows: number;
  total_columns: number;
  columns: ColumnMeta[];
  date_columns: string[];
  numeric_columns: string[];
  categorical_columns: string[];
  boolean_columns: string[];
  detected_domains: DetectedDomain[];
}

export interface DomainInsight {
  type: 'success' | 'warning' | 'critical' | 'info';
  title: string;
  description: string;
  recommendation: string;
  confidence: number;
  priority: 'critical' | 'high' | 'medium' | 'low';
}

export interface DomainInsightsResponse {
  domain_id: string;
  insights: DomainInsight[];
}
