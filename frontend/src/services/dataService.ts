import { simulateLatency, USE_MOCK_API, apiClient } from './apiClient'
import type {
  DatasetSummary,
  ColumnSchema,
  SemanticMetric,
  FeatureItem,
  FeatureDriftReport,
  LineageNode,
  LineageEdge,
} from '@/shared/types'

export const dataService = {
  async getDatasets(): Promise<DatasetSummary[]> {
    if (USE_MOCK_API) {
      await simulateLatency(250)
      return [
        {
          id: 'ds-transactions-200k',
          name: 'Enterprise Global Transactions (200k)',
          fileName: 'transactions_200k.parquet',
          totalRows: 200000,
          totalColumns: 24,
          fileSizeBytes: 48600000, // ~48.6 MB
          format: 'parquet',
          lastUpdated: '2026-08-08 00:00:00 UTC',
          dataQualityScore: 99.4,
          zeroDropPolicyCompliant: true,
          piiMaskedCount: 200000,
        },
        {
          id: 'ds-carrier-routes',
          name: 'Carrier Logistics & Transit Routes',
          fileName: 'carrier_routes_sla.parquet',
          totalRows: 14200,
          totalColumns: 12,
          fileSizeBytes: 2400000,
          format: 'parquet',
          lastUpdated: '2026-08-07 18:30:00 UTC',
          dataQualityScore: 98.8,
          zeroDropPolicyCompliant: true,
          piiMaskedCount: 0,
        },
        {
          id: 'ds-department-targets',
          name: 'Department Budgets & SLA Benchmarks',
          fileName: 'dept_targets_fy26.csv',
          totalRows: 500,
          totalColumns: 8,
          fileSizeBytes: 120000,
          format: 'csv',
          lastUpdated: '2026-08-01 09:00:00 UTC',
          dataQualityScore: 100.0,
          zeroDropPolicyCompliant: true,
          piiMaskedCount: 0,
        },
      ]
    }
    return apiClient<DatasetSummary[]>({ url: '/api/data/datasets' })
  },

  async getDatasetSchema(datasetId: string): Promise<ColumnSchema[]> {
    if (USE_MOCK_API) {
      await simulateLatency(200)
      return [
        { column_name: 'transaction_id', inferred_type: 'VARCHAR(32)', null_count: 0, cardinality: 200000, classification: 'identifier', is_pii: false, outlier_count: 0 },
        { column_name: 'timestamp', inferred_type: 'TIMESTAMP', null_count: 0, cardinality: 198420, classification: 'temporal', is_pii: false, outlier_count: 0 },
        { column_name: 'department', inferred_type: 'VARCHAR(24)', null_count: 0, cardinality: 5, classification: 'dimension', is_pii: false, outlier_count: 0 },
        { column_name: 'region', inferred_type: 'VARCHAR(16)', null_count: 0, cardinality: 4, classification: 'dimension', is_pii: false, outlier_count: 0 },
        { column_name: 'carrier_code', inferred_type: 'VARCHAR(12)', null_count: 14, cardinality: 8, classification: 'dimension', is_pii: false, outlier_count: 0 },
        { column_name: 'customer_id_hash', inferred_type: 'VARCHAR(64)', null_count: 0, cardinality: 18420, classification: 'identifier', is_pii: true, outlier_count: 0 },
        { column_name: 'gross_amount_usd', inferred_type: 'DOUBLE', null_count: 0, cardinality: 45120, classification: 'measure', is_pii: false, outlier_count: 142 },
        { column_name: 'cogs_usd', inferred_type: 'DOUBLE', null_count: 0, cardinality: 42100, classification: 'measure', is_pii: false, outlier_count: 98 },
        { column_name: 'net_revenue_usd', inferred_type: 'DOUBLE', null_count: 0, cardinality: 46800, classification: 'measure', is_pii: false, outlier_count: 114 },
        { column_name: 'gross_margin_pct', inferred_type: 'DOUBLE', null_count: 0, cardinality: 3820, classification: 'measure', is_pii: false, outlier_count: 48 },
        { column_name: 'fulfillment_latency_days', inferred_type: 'DOUBLE', null_count: 0, cardinality: 180, classification: 'measure', is_pii: false, outlier_count: 64 },
        { column_name: 'sla_breached', inferred_type: 'BOOLEAN', null_count: 0, cardinality: 2, classification: 'measure', is_pii: false, outlier_count: 0 },
        { column_name: 'anomaly_score', inferred_type: 'DOUBLE', null_count: 0, cardinality: 12400, classification: 'measure', is_pii: false, outlier_count: 142 },
        { column_name: 'discount_applied_pct', inferred_type: 'DOUBLE', null_count: 0, cardinality: 50, classification: 'measure', is_pii: false, outlier_count: 12 },
      ]
    }
    return apiClient<ColumnSchema[]>({ url: `/api/data/datasets/${datasetId}/schema` })
  },

  async getSampleRows(datasetId: string, limit = 10): Promise<Record<string, unknown>[]> {
    if (USE_MOCK_API) {
      await simulateLatency(300)
      const depts = ['Logistics', 'Enterprise Sales', 'Cloud SaaS', 'Support', 'Billing']
      const regions = ['North America', 'EMEA', 'APAC', 'LATAM']
      const carriers = ['FedEx-Air', 'DHL-Express', 'UPS-Ground', 'SeaFreight', 'ExpressPac']

      return Array.from({ length: limit }).map((_, i) => {
        const gross = 1200 + (i * 3420) % 18000
        const cogs = gross * (0.58 + (i % 5) * 0.05)
        const netRev = gross * 0.94
        const margin = ((netRev - cogs) / netRev) * 100
        const latency = 1.2 + (i % 4) * 0.8
        const score = (0.12 + (i === 2 ? 0.82 : (i % 6) * 0.08))

        return {
          transaction_id: `TX-948${20 + i}`,
          timestamp: `2026-08-08 1${i % 10}:${(i * 7) % 60}:12`,
          department: depts[i % depts.length],
          region: regions[i % regions.length],
          carrier_code: carriers[i % carriers.length],
          customer_id_hash: `sha256:e8f9${(i * 314159).toString(16).padEnd(8, '0')}`,
          gross_amount_usd: parseFloat(gross.toFixed(2)),
          cogs_usd: parseFloat(cogs.toFixed(2)),
          net_revenue_usd: parseFloat(netRev.toFixed(2)),
          gross_margin_pct: parseFloat(margin.toFixed(2)),
          fulfillment_latency_days: parseFloat(latency.toFixed(2)),
          sla_breached: latency > 3.0,
          anomaly_score: parseFloat(score.toFixed(3)),
          discount_applied_pct: (i % 4) * 5,
        }
      })
    }
    return apiClient<Record<string, unknown>[]>({
      url: `/api/data/datasets/${datasetId}/sample`,
      params: { limit },
    })
  },

  async getSemanticMetrics(): Promise<SemanticMetric[]> {
    if (USE_MOCK_API) {
      await simulateLatency(200)
      return [
        {
          name: 'gross_margin_pct',
          category: 'financial',
          description: 'Calculates overall gross margin percentage after direct COGS and carrier adjustments.',
          allowed_dimensions: ['department', 'region', 'carrier_code', 'time_bucket'],
          sql: `SELECT department, (SUM(net_revenue_usd) - SUM(cogs_usd)) / NULLIF(SUM(net_revenue_usd), 0) * 100 AS gross_margin_pct FROM transactions_200k GROUP BY department;`,
          formulaExplanation: '(Net Revenue - Cost of Goods Sold) / Net Revenue * 100',
        },
        {
          name: 'net_revenue_usd',
          category: 'financial',
          description: 'Net realized revenue after standard enterprise tier discounts and partner rebates.',
          allowed_dimensions: ['department', 'region', 'time_bucket', 'product_category'],
          sql: `SELECT region, SUM(net_revenue_usd) AS total_revenue FROM transactions_200k GROUP BY region ORDER BY total_revenue DESC;`,
          formulaExplanation: 'SUM(gross_amount_usd * (1 - discount_applied_pct / 100))',
        },
        {
          name: 'fulfillment_sla_pct',
          category: 'operational',
          description: 'Percentage of customer shipments meeting the guaranteed SLA window (< 2.5 days).',
          allowed_dimensions: ['carrier_code', 'region', 'fulfillment_center'],
          sql: `SELECT carrier_code, COUNT(CASE WHEN fulfillment_latency_days <= 2.5 THEN 1 END) * 100.0 / COUNT(*) AS sla_compliance_pct FROM transactions_200k GROUP BY carrier_code;`,
          formulaExplanation: 'Count(latency <= SLA_Threshold) / Total_Shipments * 100',
        },
        {
          name: 'anomaly_exposure_usd',
          category: 'ai_performance',
          description: 'Total financial dollar volume at risk across transactions flagged by XGBoost Isolation Scorer (> 0.85).',
          allowed_dimensions: ['department', 'severity_level', 'risk_cluster'],
          sql: `SELECT department, SUM(net_revenue_usd) AS exposed_capital FROM transactions_200k WHERE anomaly_score > 0.85 GROUP BY department;`,
          formulaExplanation: 'SUM(net_revenue_usd) WHERE anomaly_score >= 0.85',
        },
        {
          name: 'carrier_on_time_rate',
          category: 'operational',
          description: 'Carrier punctuality metric tracking transit fulfillment SLA against SLA benchmarks.',
          allowed_dimensions: ['carrier_code', 'origin_hub', 'destination_hub'],
          sql: `SELECT carrier_code, AVG(CASE WHEN sla_breached = FALSE THEN 1.0 ELSE 0.0 END) * 100 AS on_time_rate FROM transactions_200k GROUP BY carrier_code;`,
          formulaExplanation: 'AVG(is_on_time) * 100',
        },
      ]
    }
    return apiClient<SemanticMetric[]>({ url: '/api/data/semantic-metrics' })
  },

  async getFeatures(): Promise<FeatureItem[]> {
    if (USE_MOCK_API) {
      await simulateLatency(250)
      return [
        {
          name: 'fulfillment_latency_days',
          type: 'float',
          category: 'business',
          version: 'v2.1',
          owner: 'Logistics ML Squad',
          status: 'Production',
          description: 'End-to-end transit elapsed time from dispatch to delivery timestamp.',
          importanceScore: 0.384,
          nullRatePct: 0.0,
          meanValue: 1.82,
          stdDev: 0.45,
          driftStatus: 'stable',
          psiScore: 0.012,
        },
        {
          name: 'freight_cost_ratio',
          type: 'float',
          category: 'business',
          version: 'v2.1',
          owner: 'Finance Analytics',
          status: 'Production',
          description: 'Ratio of logistics freight surcharge against gross order valuation.',
          importanceScore: 0.291,
          nullRatePct: 0.0,
          meanValue: 0.142,
          stdDev: 0.038,
          driftStatus: 'stable',
          psiScore: 0.018,
        },
        {
          name: 'discount_applied_pct',
          type: 'float',
          category: 'business',
          version: 'v1.4',
          owner: 'Commercial Sales',
          status: 'Production',
          description: 'Commercial percentage discount applied during invoice generation.',
          importanceScore: 0.238,
          nullRatePct: 0.0,
          meanValue: 8.5,
          stdDev: 4.2,
          driftStatus: 'stable',
          psiScore: 0.024,
        },
        {
          name: 'rolling_7d_return_rate',
          type: 'float',
          category: 'temporal_aggregate',
          version: 'v2.0',
          owner: 'Customer Success AI',
          status: 'Production',
          description: '7-day moving window average of customer RMA replacement requests.',
          importanceScore: 0.185,
          nullRatePct: 0.0,
          meanValue: 0.028,
          stdDev: 0.012,
          driftStatus: 'warning',
          psiScore: 0.082,
        },
        {
          name: 'carrier_latency_lag_1d',
          type: 'float',
          category: 'temporal_lag',
          version: 'v1.2',
          owner: 'Logistics ML Squad',
          status: 'Production',
          description: 'T-1 day lag feature capturing localized regional transit bottlenecks.',
          importanceScore: 0.142,
          nullRatePct: 0.01,
          meanValue: 1.79,
          stdDev: 0.51,
          driftStatus: 'stable',
          psiScore: 0.015,
        },
        {
          name: 'customer_tenure_months',
          type: 'int',
          category: 'business',
          version: 'v1.0',
          owner: 'Growth Analytics',
          status: 'Production',
          description: 'Duration of enterprise contract tenure measured in calendar months.',
          importanceScore: 0.098,
          nullRatePct: 0.0,
          meanValue: 34.2,
          stdDev: 14.8,
          driftStatus: 'stable',
          psiScore: 0.008,
        },
        {
          name: 'anomaly_xgboost_score',
          type: 'float',
          category: 'ai',
          version: 'v3.0',
          owner: 'Risk Intelligence',
          status: 'Production',
          description: 'Real-time XGBoost Isolation Forest predicted outlier score [0.0 - 1.0].',
          importanceScore: 0.412,
          nullRatePct: 0.0,
          meanValue: 0.184,
          stdDev: 0.125,
          driftStatus: 'stable',
          psiScore: 0.019,
        },
      ]
    }
    return apiClient<FeatureItem[]>({ url: '/api/data/features' })
  },

  async getDriftReports(): Promise<FeatureDriftReport[]> {
    if (USE_MOCK_API) {
      await simulateLatency(200)
      return [
        {
          featureName: 'fulfillment_latency_days',
          baselineMean: 1.84,
          productionMean: 1.82,
          ksStatistic: 0.038,
          pValue: 0.42,
          psiScore: 0.012,
          status: 'stable',
          lastEvaluated: '10 mins ago',
        },
        {
          featureName: 'freight_cost_ratio',
          baselineMean: 0.138,
          productionMean: 0.142,
          ksStatistic: 0.045,
          pValue: 0.31,
          psiScore: 0.018,
          status: 'stable',
          lastEvaluated: '10 mins ago',
        },
        {
          featureName: 'rolling_7d_return_rate',
          baselineMean: 0.021,
          productionMean: 0.028,
          ksStatistic: 0.098,
          pValue: 0.048,
          psiScore: 0.082,
          status: 'warning',
          lastEvaluated: '10 mins ago',
        },
      ]
    }
    return apiClient<FeatureDriftReport[]>({ url: '/api/data/drift' })
  },

  async getDataLineage(): Promise<{ nodes: LineageNode[]; edges: LineageEdge[] }> {
    if (USE_MOCK_API) {
      await simulateLatency(250)
      return {
        nodes: [
          { id: 'src-erp', label: 'Enterprise ERP & SAP Invoices', type: 'source', technology: 'Kafka / CDC', recordCount: 200000, status: 'healthy' },
          { id: 'src-wms', label: 'WMS Logistics Telemetry', type: 'source', technology: 'REST API Webhook', recordCount: 14200, status: 'healthy' },
          { id: 'pipe-cleaning', label: 'Zero-Drop Cleaning & PII Masking', type: 'pipeline', technology: 'Python / Polars', recordCount: 200000, sla: '< 50ms', status: 'healthy' },
          { id: 'lake-duckdb', label: 'DuckDB Semantic Lakehouse', type: 'storage', technology: 'DuckDB In-Memory Parquet', recordCount: 200000, status: 'healthy' },
          { id: 'store-features', label: 'Enterprise Feature Store (32 Cols)', type: 'feature_store', technology: 'Feast / Parquet', recordCount: 200000, status: 'healthy' },
          { id: 'model-xgboost', label: 'XGBoost Isolation & SHAP Scorer', type: 'model', technology: 'XGBoost 2.0 / TreeSHAP', status: 'healthy' },
          { id: 'cons-dashboard', label: 'Executive Dashboard & AI Workspace', type: 'consumption', technology: 'React 19 / LangGraph UI', status: 'healthy' },
        ],
        edges: [
          { id: 'e1', source: 'src-erp', target: 'pipe-cleaning', label: 'CDC Ingest', latencyMs: 14 },
          { id: 'e2', source: 'src-wms', target: 'pipe-cleaning', label: 'Webhook', latencyMs: 22 },
          { id: 'e3', source: 'pipe-cleaning', target: 'lake-duckdb', label: 'Zero-Drop Parquet', latencyMs: 45 },
          { id: 'e4', source: 'lake-duckdb', target: 'store-features', label: 'Feature Engineering', latencyMs: 82 },
          { id: 'e5', source: 'store-features', target: 'model-xgboost', label: 'Real-Time Inference', latencyMs: 12 },
          { id: 'e6', source: 'lake-duckdb', target: 'cons-dashboard', label: 'Semantic Queries', latencyMs: 38 },
          { id: 'e7', source: 'model-xgboost', target: 'cons-dashboard', label: 'SHAP & Anomaly Scores', latencyMs: 15 },
        ],
      }
    }
    return apiClient<{ nodes: LineageNode[]; edges: LineageEdge[] }>({ url: '/api/data/lineage' })
  },
}
