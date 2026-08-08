import { simulateLatency, USE_MOCK_API, apiClient } from './apiClient'
import type {
  EDAVariableStats,
  CorrelationMatrixResponse,
  DistributionBin,
  BoxPlotRecord,
  StatisticalHypothesisTest,
} from '@/shared/types'

export const edaService = {
  async getVariableStats(): Promise<EDAVariableStats[]> {
    if (USE_MOCK_API) {
      await simulateLatency(250)
      return [
        {
          name: 'gross_amount_usd',
          inferredType: 'numeric',
          count: 200000,
          nullCount: 0,
          uniqueCount: 45120,
          mean: 5840.5,
          median: 4890.0,
          stdDev: 3420.8,
          min: 150.0,
          max: 48900.0,
          p25: 2900.0,
          p75: 7850.0,
          skewness: 1.42,
          kurtosis: 4.88,
          outlierCount: 142,
        },
        {
          name: 'cogs_usd',
          inferredType: 'numeric',
          count: 200000,
          nullCount: 0,
          uniqueCount: 42100,
          mean: 3620.2,
          median: 3010.0,
          stdDev: 2180.4,
          min: 80.0,
          max: 31200.0,
          p25: 1780.0,
          p75: 4920.0,
          skewness: 1.38,
          kurtosis: 4.62,
          outlierCount: 98,
        },
        {
          name: 'net_revenue_usd',
          inferredType: 'numeric',
          count: 200000,
          nullCount: 0,
          uniqueCount: 46800,
          mean: 5490.1,
          median: 4610.0,
          stdDev: 3210.6,
          min: 140.0,
          max: 46100.0,
          p25: 2720.0,
          p75: 7380.0,
          skewness: 1.40,
          kurtosis: 4.80,
          outlierCount: 114,
        },
        {
          name: 'gross_margin_pct',
          inferredType: 'numeric',
          count: 200000,
          nullCount: 0,
          uniqueCount: 3820,
          mean: 34.07,
          median: 34.8,
          stdDev: 8.45,
          min: -12.4,
          max: 68.2,
          p25: 28.5,
          p75: 40.2,
          skewness: -0.28,
          kurtosis: 3.12,
          outlierCount: 48,
        },
        {
          name: 'fulfillment_latency_days',
          inferredType: 'numeric',
          count: 200000,
          nullCount: 0,
          uniqueCount: 180,
          mean: 1.82,
          median: 1.70,
          stdDev: 0.45,
          min: 0.40,
          max: 5.80,
          p25: 1.45,
          p75: 2.10,
          skewness: 1.88,
          kurtosis: 6.72,
          outlierCount: 64,
        },
        {
          name: 'anomaly_score',
          inferredType: 'numeric',
          count: 200000,
          nullCount: 0,
          uniqueCount: 12400,
          mean: 0.184,
          median: 0.142,
          stdDev: 0.125,
          min: 0.012,
          max: 0.988,
          p25: 0.085,
          p75: 0.245,
          skewness: 2.45,
          kurtosis: 9.14,
          outlierCount: 142,
        },
        {
          name: 'discount_applied_pct',
          inferredType: 'numeric',
          count: 200000,
          nullCount: 0,
          uniqueCount: 50,
          mean: 6.0,
          median: 5.0,
          stdDev: 4.2,
          min: 0.0,
          max: 25.0,
          p25: 0.0,
          p75: 10.0,
          skewness: 0.95,
          kurtosis: 2.85,
          outlierCount: 12,
        },
        {
          name: 'department',
          inferredType: 'categorical',
          count: 200000,
          nullCount: 0,
          uniqueCount: 5,
        },
        {
          name: 'region',
          inferredType: 'categorical',
          count: 200000,
          nullCount: 0,
          uniqueCount: 4,
        },
        {
          name: 'carrier_code',
          inferredType: 'categorical',
          count: 199986,
          nullCount: 14,
          uniqueCount: 8,
        },
      ]
    }
    return apiClient<EDAVariableStats[]>({ url: '/api/eda/variable-stats' })
  },

  async getCorrelationMatrix(method: 'pearson' | 'spearman' = 'pearson'): Promise<CorrelationMatrixResponse> {
    if (USE_MOCK_API) {
      await simulateLatency(200)
      const features = [
        'gross_amount',
        'cogs',
        'net_revenue',
        'gross_margin_%',
        'latency_days',
        'anomaly_score',
        'discount_%',
      ]

      // Realistic correlation matrix
      const matrix = [
        [1.0, 0.94, 0.98, -0.12, 0.28, 0.42, 0.18],
        [0.94, 1.0, 0.91, -0.44, 0.32, 0.48, 0.12],
        [0.98, 0.91, 1.0, 0.04, 0.25, 0.38, 0.08],
        [-0.12, -0.44, 0.04, 1.0, -0.38, -0.29, -0.42],
        [0.28, 0.32, 0.25, -0.38, 1.0, 0.64, 0.14],
        [0.42, 0.48, 0.38, -0.29, 0.64, 1.0, 0.22],
        [0.18, 0.12, 0.08, -0.42, 0.14, 0.22, 1.0],
      ]

      return { features, matrix }
    }
    return apiClient<CorrelationMatrixResponse>({
      url: '/api/eda/correlation-matrix',
      params: { method },
    })
  },

  async getDistribution(variableName: string): Promise<DistributionBin[]> {
    if (USE_MOCK_API) {
      await simulateLatency(200)
      if (variableName === 'fulfillment_latency_days') {
        return [
          { bin: '0.4 - 0.9d', count: 12400, kde: 0.12 },
          { bin: '0.9 - 1.4d', count: 48200, kde: 0.48 },
          { bin: '1.4 - 1.9d', count: 74800, kde: 0.75 },
          { bin: '1.9 - 2.4d', count: 42100, kde: 0.42 },
          { bin: '2.4 - 2.9d', count: 14800, kde: 0.15 },
          { bin: '2.9 - 3.4d', count: 5400, kde: 0.05 },
          { bin: '3.4 - 4.0d', count: 1800, kde: 0.02 },
          { bin: '> 4.0d (Breach)', count: 500, kde: 0.01 },
        ]
      }

      if (variableName === 'gross_margin_pct') {
        return [
          { bin: '< 10%', count: 4200, kde: 0.04 },
          { bin: '10 - 20%', count: 18400, kde: 0.18 },
          { bin: '20 - 30%', count: 46200, kde: 0.46 },
          { bin: '30 - 40%', count: 78500, kde: 0.79 },
          { bin: '40 - 50%', count: 39400, kde: 0.39 },
          { bin: '50 - 60%', count: 11800, kde: 0.12 },
          { bin: '> 60%', count: 1500, kde: 0.02 },
        ]
      }

      // Default for revenue/anomaly
      return [
        { bin: 'Tier 1 (Lowest)', count: 45000, kde: 0.45 },
        { bin: 'Tier 2 (Low-Mid)', count: 68000, kde: 0.68 },
        { bin: 'Tier 3 (Average)', count: 52000, kde: 0.52 },
        { bin: 'Tier 4 (High)', count: 24000, kde: 0.24 },
        { bin: 'Tier 5 (Extreme Outliers)', count: 11000, kde: 0.11 },
      ]
    }
    return apiClient<DistributionBin[]>({
      url: `/api/eda/distribution/${variableName}`,
    })
  },

  async getBoxPlotData(variableName: string, groupBy = 'department'): Promise<BoxPlotRecord[]> {
    if (USE_MOCK_API) {
      await simulateLatency(200)
      if (groupBy === 'department') {
        return [
          { group: 'Logistics', min: 14.2, q1: 24.5, median: 31.2, q3: 36.8, max: 48.0, outliers: [8.2, 54.1, 58.2] },
          { group: 'Enterprise Sales', min: 22.0, q1: 32.4, median: 38.5, q3: 44.1, max: 56.4, outliers: [12.0, 62.4] },
          { group: 'Cloud SaaS', min: 42.0, q1: 58.2, median: 66.4, q3: 74.0, max: 88.2, outliers: [28.0, 94.2] },
          { group: 'Support', min: 18.5, q1: 26.0, median: 32.0, q3: 38.4, max: 49.0, outliers: [9.4] },
          { group: 'Billing', min: 20.0, q1: 28.5, median: 34.0, q3: 39.5, max: 51.0, outliers: [14.0, 58.0] },
        ]
      }

      return [
        { group: 'North America', min: 20.4, q1: 30.1, median: 36.4, q3: 42.8, max: 55.0, outliers: [10.2, 64.0] },
        { group: 'EMEA', min: 18.2, q1: 28.4, median: 34.2, q3: 40.5, max: 52.0, outliers: [8.0, 59.2] },
        { group: 'APAC', min: 22.0, q1: 32.8, median: 39.0, q3: 46.2, max: 58.0, outliers: [14.0, 68.0] },
        { group: 'LATAM', min: 16.0, q1: 24.2, median: 29.8, q3: 36.0, max: 47.5, outliers: [6.4, 52.0] },
      ]
    }
    return apiClient<BoxPlotRecord[]>({
      url: `/api/eda/boxplot/${variableName}`,
      params: { groupBy },
    })
  },

  async getHypothesisTests(): Promise<StatisticalHypothesisTest[]> {
    if (USE_MOCK_API) {
      await simulateLatency(200)
      return [
        {
          id: 'test-anova-dept-margin',
          testName: 'One-Way ANOVA (Gross Margin % vs Department)',
          hypothesis: 'H0: Mean gross margin is identical across all 5 enterprise departments.',
          targetVariable: 'gross_margin_pct',
          groupingVariable: 'department',
          testStatistic: 842.14,
          pValue: 0.000001,
          significanceLevel: 0.05,
          isSignificant: true,
          effectSize: 'Eta-squared (η²) = 0.384 (Large Effect)',
          aiInterpretation: 'Reject H0. Cloud SaaS exhibits statistically significant higher margin (66.4% median) compared to Logistics (31.2% median) at p < 0.001.',
        },
        {
          id: 'test-mann-whitney-carrier-sla',
          testName: 'Mann-Whitney U Test (Fulfillment Latency vs SLA Breach Status)',
          hypothesis: 'H0: Carrier latency distribution is identical for on-time and breached transactions.',
          targetVariable: 'fulfillment_latency_days',
          groupingVariable: 'sla_breached',
          testStatistic: 984120.0,
          pValue: 0.000001,
          significanceLevel: 0.01,
          isSignificant: true,
          effectSize: 'Rank Biserial r = 0.892',
          aiInterpretation: 'Reject H0. Breached orders experience significantly elongated mean transit times (3.82d vs 1.68d).',
        },
        {
          id: 'test-kruskal-wallis-regional-risk',
          testName: 'Kruskal-Wallis H Test (Anomaly Score vs Region)',
          hypothesis: 'H0: Outlier and anomaly distributions are invariant across global operating regions.',
          targetVariable: 'anomaly_score',
          groupingVariable: 'region',
          testStatistic: 14.82,
          pValue: 0.0019,
          significanceLevel: 0.05,
          isSignificant: true,
          effectSize: 'Epsilon-squared (ε²) = 0.074 (Moderate Effect)',
          aiInterpretation: 'Reject H0. LATAM exhibits slightly elevated anomaly clustering attributed to localized carrier transit disruptions.',
        },
      ]
    }
    return apiClient<StatisticalHypothesisTest[]>({ url: '/api/eda/hypothesis-tests' })
  },

  async getMultivariateScatter(): Promise<Array<{ x: number; y: number; size: number; department: string; risk: number; id: string }>> {
    if (USE_MOCK_API) {
      await simulateLatency(250)
      const depts = ['Logistics', 'Enterprise Sales', 'Cloud SaaS', 'Support', 'Billing']
      return Array.from({ length: 60 }).map((_, i) => {
        const dept = depts[i % depts.length]
        const latency = 0.8 + (i % 8) * 0.45 + (Math.random() * 0.4 - 0.2)
        const margin = (dept === 'Cloud SaaS' ? 55 : dept === 'Enterprise Sales' ? 38 : 28) + (i % 10) * 1.5 + (Math.random() * 6 - 3)
        const gross = 2000 + (i * 2800) % 24000
        const risk = i === 12 || i === 42 ? 0.92 : 0.08 + (i % 6) * 0.09

        return {
          id: `TX-${94000 + i}`,
          x: parseFloat(latency.toFixed(2)),
          y: parseFloat(margin.toFixed(1)),
          size: gross,
          department: dept,
          risk: parseFloat(risk.toFixed(3)),
        }
      })
    }
    return apiClient<any[]>({ url: '/api/eda/multivariate-scatter' })
  },
}
