import { apiClient, USE_MOCK_API } from './apiClient'

export interface AnalyticsKpis {
  totalAnalyzedVolume: number
  avgOrderValueUsd: number
  fulfillmentCostRatioPct: number
  repeatOrderMarginPct: number
  avgTransitTimeHours: number
}

export interface CostBreakdownItem {
  category: string
  costUsd: number
  percentage: number
  benchmarkPct: number
}

export interface CohortRetentionCell {
  cohort: string
  m0: number
  m1: number
  m2: number
  m3: number
  m4: number
  m5: number
}

export interface PivotRecord {
  id: string
  region: string
  carrierTier: string
  productCategory: string
  totalOrders: number
  gmvUsd: number
  grossMarginPct: number
  onTimeDeliveryPct: number
  riskLevel: 'Low' | 'Moderate' | 'High'
}

export const analyticsService = {
  getKpis: async (): Promise<AnalyticsKpis> => {
    return {
      totalAnalyzedVolume: 200000,
      avgOrderValueUsd: 741.0,
      fulfillmentCostRatioPct: 8.2,
      repeatOrderMarginPct: 42.1,
      avgTransitTimeHours: 24.2,
    }
  },

  getCostBreakdown: async (): Promise<CostBreakdownItem[]> => {
    return [
      { category: 'Long-Haul Linehaul', costUsd: 6420000, percentage: 52.4, benchmarkPct: 50.0 },
      { category: 'Last-Mile Delivery', costUsd: 2840000, percentage: 23.2, benchmarkPct: 22.0 },
      { category: 'Cross-Dock & Sorting', costUsd: 1420000, percentage: 11.6, benchmarkPct: 10.0 },
      { category: 'Fuel Surcharges', costUsd: 980000, percentage: 8.0, benchmarkPct: 5.5 },
      { category: 'SLA Breach Penalties', costUsd: 590000, percentage: 4.8, benchmarkPct: 1.5 },
    ]
  },

  getCohortRetention: async (): Promise<CohortRetentionCell[]> => {
    return [
      { cohort: 'Jan 2026', m0: 100, m1: 78.4, m2: 68.2, m3: 62.1, m4: 58.4, m5: 55.2 },
      { cohort: 'Feb 2026', m0: 100, m1: 81.2, m2: 71.0, m3: 64.8, m4: 61.2, m5: 0 },
      { cohort: 'Mar 2026', m0: 100, m1: 79.5, m2: 69.4, m3: 63.5, m4: 0, m5: 0 },
      { cohort: 'Apr 2026', m0: 100, m1: 82.8, m2: 73.1, m3: 0, m4: 0, m5: 0 },
      { cohort: 'May 2026', m0: 100, m1: 84.6, m2: 0, m3: 0, m4: 0, m5: 0 },
      { cohort: 'Jun 2026', m0: 100, m1: 0, m2: 0, m3: 0, m4: 0, m5: 0 },
    ]
  },

  getPivotData: async (): Promise<PivotRecord[]> => {
    return [
      { id: 'PV-1', region: 'North America (Midwest)', carrierTier: 'Tier 1 (National)', productCategory: 'Industrial Machinery', totalOrders: 42100, gmvUsd: 38400000, grossMarginPct: 36.8, onTimeDeliveryPct: 94.2, riskLevel: 'Low' },
      { id: 'PV-2', region: 'North America (Midwest)', carrierTier: 'Tier 3 (Regional)', productCategory: 'Automotive Parts', totalOrders: 28400, gmvUsd: 21200000, grossMarginPct: 24.1, onTimeDeliveryPct: 78.4, riskLevel: 'High' },
      { id: 'PV-3', region: 'North America (West Coast)', carrierTier: 'Tier 1 (National)', productCategory: 'Consumer Electronics', totalOrders: 54000, gmvUsd: 49800000, grossMarginPct: 38.4, onTimeDeliveryPct: 96.1, riskLevel: 'Low' },
      { id: 'PV-4', region: 'EMEA (Central Europe)', carrierTier: 'Tier 2 (Regional Partner)', productCategory: 'Healthcare & Pharma', totalOrders: 32000, gmvUsd: 28900000, grossMarginPct: 32.2, onTimeDeliveryPct: 91.8, riskLevel: 'Moderate' },
      { id: 'PV-5', region: 'APAC (East Asia)', carrierTier: 'Tier 1 (National)', productCategory: 'Chemicals & Raw Materials', totalOrders: 24500, gmvUsd: 19800000, grossMarginPct: 29.5, onTimeDeliveryPct: 88.4, riskLevel: 'Moderate' },
      { id: 'PV-6', region: 'LATAM (South America)', carrierTier: 'Tier 3 (Regional)', productCategory: 'Apparel & Retail', totalOrders: 19000, gmvUsd: 12100000, grossMarginPct: 21.8, onTimeDeliveryPct: 74.2, riskLevel: 'High' },
    ]
  },
}
