// Data Explorer Types

export interface ColumnSchema {
  column_name: string;
  inferred_type: string;
  null_count: number;
  cardinality: number;
  classification: 'dimension' | 'measure' | 'identifier';
  is_pii: boolean;
  outlier_count: number;
}

export interface DataPreview {
  columns: string[];
  rows: Record<string, any>[];
  total_rows: number;
  page: number;
  page_size: number;
}

export interface ColumnStatistic {
  column_name: string;
  type: string;
  count: number;
  null_count: number;
  null_pct: number;
  unique_count: number;
  // Numeric stats
  mean?: number;
  median?: number;
  min?: number;
  max?: number;
  std?: number;
  outlier_count?: number;
  // Categorical stats
  top_values?: Array<{ value: string; count: number }>;
}

export interface DataQuality {
  total_rows: number;
  total_columns: number;
  duplicate_count: number;
  completeness_pct: number;
  columns: Array<{
    column_name: string;
    missing_pct: number;
    outlier_count: number;
    quality_score: number;
  }>;
}

export interface QueryResult {
  columns: string[];
  rows: Record<string, any>[];
  row_count: number;
  execution_time_ms: number;
  sql: string;
}
