import { simulateLatency, USE_MOCK_API, apiClient } from './apiClient'
import type { KPIMetric, AnomalyRecord, WhatIfScenarioResult } from '@/shared/types'

export interface ExecutiveDashboardData {
  timeframe: string
  kpis: {
    revenue: KPIMetric
    margin: KPIMetric
    deliverySla: KPIMetric
    anomalies: KPIMetric
    activeAccounts: KPIMetric
    fulfillmentDays: KPIMetric
  }
  monthlyTrends: {
    months: string[]
    revenue: number[]
    targetRevenue: number[]
    grossMarginPct: number[]
    costOfSales: number[]
  }
  regionalBreakdown: {
    region: string
    revenue: number
    sharePct: number
    yoyGrowthPct: number
    marginPct: number
  }[]
  departmentMatrix: {
    id: string
    name: string
    revenue: number
    marginPct: number
    slaPct: number
    riskScore: number
    anomalyCount: number
    status: 'optimal' | 'warning' | 'critical'
  }[]
  criticalAnomalies: {
    id: string
    recordId: string
    department: string
    model: string
    severity: 'CRITICAL' | 'HIGH' | 'MEDIUM'
    anomalyScore: number
    financialImpact: number
    detectedAt: string
    suggestedAction: string
  }[]
}

const mockDashboardData: ExecutiveDashboardData = {
  timeframe: 'YTD 2026',
  kpis: {
    revenue: {
      name: 'Total Net Revenue',
      value: '$24.84M',
      change_pct: 12.4,
      period: 'vs Last Year',
      status: 'positive',
    },
    margin: {
      name: 'Gross Profit Margin',
      value: '34.21%',
      change_pct: 2.1,
      period: 'vs Target (32.0%)',
      status: 'positive',
    },
    deliverySla: {
      name: 'On-Time Delivery SLA',
      value: '98.42%',
      change_pct: 0.6,
      period: 'Target: 98.0%',
      status: 'positive',
    },
    anomalies: {
      name: 'Flagged Anomalies',
      value: 142,
      change_pct: -8.4,
      period: '18 Critical / $340k Exposure',
      status: 'warning',
    },
    activeAccounts: {
      name: 'Active Enterprise Clients',
      value: '18,420',
      change_pct: 4.8,
      period: '99.2% Retention',
      status: 'positive',
    },
    fulfillmentDays: {
      name: 'Avg Fulfillment Cycle',
      value: '1.82 days',
      change_pct: -14.0,
      period: 'Fastest in Industry',
      status: 'positive',
    },
  },
  monthlyTrends: {
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    revenue: [1.82, 1.95, 2.10, 2.05, 2.22, 2.38, 2.45, 2.52, 2.61, 2.70, 2.85, 3.01],
    targetRevenue: [1.75, 1.85, 2.00, 2.00, 2.15, 2.25, 2.35, 2.45, 2.50, 2.60, 2.75, 2.90],
    grossMarginPct: [32.1, 32.8, 33.4, 33.1, 34.0, 34.5, 34.2, 34.8, 35.1, 35.4, 35.8, 36.2],
    costOfSales: [1.23, 1.31, 1.40, 1.37, 1.46, 1.56, 1.61, 1.64, 1.69, 1.74, 1.83, 1.92],
  },
  regionalBreakdown: [
    { region: 'North America', revenue: 11.42, sharePct: 46.0, yoyGrowthPct: 14.2, marginPct: 36.4 },
    { region: 'Europe (EMEA)', revenue: 6.71, sharePct: 27.0, yoyGrowthPct: 8.9, marginPct: 33.8 },
    { region: 'Asia-Pacific (APAC)', revenue: 4.72, sharePct: 19.0, yoyGrowthPct: 18.7, marginPct: 32.1 },
    { region: 'Latin America (LATAM)', revenue: 1.99, sharePct: 8.0, yoyGrowthPct: 6.1, marginPct: 29.5 },
  ],
  departmentMatrix: [
    {
      id: 'dep-1',
      name: 'Logistics & Supply Chain',
      revenue: 8.24,
      marginPct: 31.4,
      slaPct: 99.1,
      riskScore: 0.04,
      anomalyCount: 12,
      status: 'optimal',
    },
    {
      id: 'dep-2',
      name: 'Enterprise Commercial Sales',
      revenue: 7.42,
      marginPct: 42.1,
      slaPct: 97.8,
      riskScore: 0.12,
      anomalyCount: 28,
      status: 'warning',
    },
    {
      id: 'dep-3',
      name: 'Cloud Infrastructure & SaaS',
      revenue: 4.81,
      marginPct: 38.5,
      slaPct: 99.9,
      riskScore: 0.02,
      anomalyCount: 4,
      status: 'optimal',
    },
    {
      id: 'dep-4',
      name: 'Customer Success & Support',
      revenue: 2.58,
      marginPct: 22.8,
      slaPct: 96.5,
      riskScore: 0.24,
      anomalyCount: 64,
      status: 'critical',
    },
    {
      id: 'dep-5',
      name: 'Financial Operations & Billing',
      revenue: 1.79,
      marginPct: 29.0,
      slaPct: 98.9,
      riskScore: 0.09,
      anomalyCount: 34,
      status: 'warning',
    },
  ],
  criticalAnomalies: [
    {
      id: 'anom-101',
      recordId: 'TX-94821',
      department: 'Logistics & Supply Chain',
      model: 'XGBoost Isolation Scorer',
      severity: 'CRITICAL',
      anomalyScore: 0.942,
      financialImpact: 142500,
      detectedAt: '12 mins ago',
      suggestedAction: 'Hold freight carrier payout & trigger audit verification',
    },
    {
      id: 'anom-102',
      recordId: 'INV-88231',
      department: 'Enterprise Commercial Sales',
      model: 'Isolation Forest (DuckDB)',
      severity: 'HIGH',
      anomalyScore: 0.884,
      financialImpact: 89200,
      detectedAt: '34 mins ago',
      suggestedAction: 'Review discount exception exceeding 25% margin floor',
    },
    {
      id: 'anom-103',
      recordId: 'TX-94772',
      department: 'Customer Success & Support',
      model: 'SHAP Margin Outlier',
      severity: 'HIGH',
      anomalyScore: 0.812,
      financialImpact: 54100,
      detectedAt: '1 hr ago',
      suggestedAction: 'Recalibrate SLA refund trigger threshold for APAC tier',
    },
    {
      id: 'anom-104',
      recordId: 'BILL-44120',
      department: 'Financial Operations & Billing',
      model: 'XGBoost Isolation Scorer',
      severity: 'MEDIUM',
      anomalyScore: 0.749,
      financialImpact: 32000,
      detectedAt: '2 hrs ago',
      suggestedAction: 'Verify duplicate invoice batch token in accounting lake',
    },
  ],
}

export const dashboardService = {
  async getDashboardData(timeframe = 'YTD 2026'): Promise<ExecutiveDashboardData> {
    if (USE_MOCK_API) {
      await simulateLatency(300)
      return { ...mockDashboardData, timeframe }
    }
    return apiClient<ExecutiveDashboardData>({
      url: `/api/dashboard`,
      method: 'GET',
      params: { timeframe },
    })
  },

  async runScenarioSimulation(params: {
    priceChangePct: number
    volumeChangePct: number
    costInflationPct: number
  }): Promise<WhatIfScenarioResult> {
    if (USE_MOCK_API) {
      await simulateLatency(200)
      const baseRevenue = 24.84
      const baseCost = 16.34
      const baseProfit = baseRevenue - baseCost
      const baseMargin = (baseProfit / baseRevenue) * 100

      const simRevenue =
        baseRevenue * (1 + params.priceChangePct / 100) * (1 + params.volumeChangePct / 100)
      const simCost =
        baseCost * (1 + params.costInflationPct / 100) * (1 + params.volumeChangePct / 100)
      const simProfit = simRevenue - simCost
      const simMargin = (simProfit / simRevenue) * 100
      const deltaProfit = simProfit - baseProfit

      return {
        scenario_name: `Custom Executive Simulation (P: ${params.priceChangePct}%, V: ${params.volumeChangePct}%, C: ${params.costInflationPct}%)`,
        baseline_metrics: {
          revenue: baseRevenue,
          gross_margin_pct: baseMargin,
          net_profit: baseProfit,
        },
        simulated_metrics: {
          revenue: Number(simRevenue.toFixed(2)),
          gross_margin_pct: Number(simMargin.toFixed(2)),
          net_profit: Number(simProfit.toFixed(2)),
        },
        delta_pct: {
          revenue: Number((((simRevenue - baseRevenue) / baseRevenue) * 100).toFixed(2)),
          gross_margin: Number((simMargin - baseMargin).toFixed(2)),
          net_profit: Number(((deltaProfit / baseProfit) * 100).toFixed(2)),
        },
        confidence_intervals: {
          lower_bound: Number((simProfit * 0.95).toFixed(2)),
          upper_bound: Number((simProfit * 1.05).toFixed(2)),
          confidence_level: 0.95,
        },
        risk_flags:
          params.priceChangePct > 10
            ? ['High price increase may trigger customer elasticity churn in EU sector']
            : params.costInflationPct > 8
            ? ['Cost inflation exceeds projected 6.5% buffer for FY26']
            : [],
      }
    }

    return apiClient<WhatIfScenarioResult>({
      url: `/api/simulation/run`,
      method: 'POST',
      data: params,
    })
  },
}
