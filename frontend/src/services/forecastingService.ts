import { apiClient, USE_MOCK_API } from './apiClient'

export interface SimulationParameters {
  carrierRateDelta: number // -$0.20 to +$0.30/km
  expeditedRatio: number // 5% to 40%
  headcountDelta: number // -20% to +50%
  fuelSurchargeDelta: number // -15% to +25%
  avgDistanceKm: number // 300 to 1200 km
  targetSlaHours: number // 24 to 72 hrs
}

export interface ForecastPoint {
  month: string
  historical?: number
  forecast?: number
  lower80?: number
  upper80?: number
  lower95?: number
  upper95?: number
}

export interface ScenarioPreset {
  id: string
  name: string
  description: string
  params: SimulationParameters
  badge: string
}

export interface SensitivityDriver {
  feature: string
  elasticity: number // % change in margin per 1% change in feature
  impactCategory: 'high' | 'medium' | 'low'
  direction: 'positive' | 'negative'
}

export interface SimulationResult {
  scenarioName: string
  projectedGmv: number
  gmvDeltaPct: number
  projectedMarginPct: number
  marginDeltaPct: number
  forecastedSlaBreachRate: number
  slaBreachDeltaPct: number
  projectedRecoveredMargin: number
  confidenceScore: number
  fanChartData: ForecastPoint[]
  sensitivityDrivers: SensitivityDriver[]
}

export const PRESET_SCENARIOS: ScenarioPreset[] = [
  {
    id: 'base',
    name: 'Base Case (Status Quo)',
    description: 'Existing carrier contracts with organic 4% quarterly volume expansion.',
    badge: 'Baseline',
    params: {
      carrierRateDelta: 0.0,
      expeditedRatio: 12.0,
      headcountDelta: 0.0,
      fuelSurchargeDelta: 0.0,
      avgDistanceKm: 650,
      targetSlaHours: 48,
    },
  },
  {
    id: 'bull',
    name: 'Bull Growth & Expedited Surge',
    description: 'Aggressive top-line volume expansion with +25% expedited logistics allocation.',
    badge: 'Expansion',
    params: {
      carrierRateDelta: -0.08,
      expeditedRatio: 28.0,
      headcountDelta: 20.0,
      fuelSurchargeDelta: 5.0,
      avgDistanceKm: 720,
      targetSlaHours: 36,
    },
  },
  {
    id: 'shock',
    name: 'Severe Supply Chain Disruption',
    description: 'Fuel surge spikes +20% and carrier contract renegotiation stalls under weather stress.',
    badge: 'Stress Test',
    params: {
      carrierRateDelta: 0.18,
      expeditedRatio: 8.0,
      headcountDelta: -10.0,
      fuelSurchargeDelta: 22.0,
      avgDistanceKm: 850,
      targetSlaHours: 60,
    },
  },
  {
    id: 'cost_cut',
    name: 'Optimized Margin Recovery (AI Recourse)',
    description: 'Autonomous multi-agent carrier routing with negotiated volume tier discounts.',
    badge: 'Recommended',
    params: {
      carrierRateDelta: -0.14,
      expeditedRatio: 16.0,
      headcountDelta: 5.0,
      fuelSurchargeDelta: -5.0,
      avgDistanceKm: 580,
      targetSlaHours: 42,
    },
  },
]

const MOCK_FAN_CHART_BASE: ForecastPoint[] = [
  { month: 'Jan 2026', historical: 12.8 },
  { month: 'Feb 2026', historical: 13.4 },
  { month: 'Mar 2026', historical: 14.1 },
  { month: 'Apr 2026', historical: 13.9 },
  { month: 'May 2026', historical: 14.8 },
  { month: 'Jun 2026', historical: 15.6 },
  { month: 'Jul 2026', historical: 16.2 },
  { month: 'Aug 2026', historical: 16.5, forecast: 16.5, lower80: 16.5, upper80: 16.5, lower95: 16.5, upper95: 16.5 },
  { month: 'Sep 2026', forecast: 17.1, lower80: 16.2, upper80: 18.0, lower95: 15.5, upper95: 18.8 },
  { month: 'Oct 2026', forecast: 17.8, lower80: 16.6, upper80: 19.1, lower95: 15.7, upper95: 20.0 },
  { month: 'Nov 2026', forecast: 19.4, lower80: 17.8, upper80: 21.2, lower95: 16.5, upper95: 22.6 },
  { month: 'Dec 2026', forecast: 21.2, lower80: 19.1, upper80: 23.4, lower95: 17.4, upper95: 25.1 },
]

export const forecastingService = {
  getPresets: async (): Promise<ScenarioPreset[]> => {
    return PRESET_SCENARIOS
  },

  runSimulation: async (params: SimulationParameters, scenarioName = 'Custom Scenario'): Promise<SimulationResult> => {
    if (!USE_MOCK_API) {
      return apiClient<SimulationResult>({
        url: '/api/v1/forecasting/simulate',
        method: 'POST',
        data: { params, scenarioName },
      })
    }

    // Dynamic Closed-Form Mathematical Recalculation + XGBoost Simulation
    const rateMultiplier = 1 - params.carrierRateDelta * 0.4
    const expeditedBoost = (params.expeditedRatio - 12) * 0.006
    const fuelDrag = params.fuelSurchargeDelta * 0.003
    const distanceFactor = (params.avgDistanceKm - 650) / 1000

    const projectedGmv = 148.2 * (1 + expeditedBoost - fuelDrag * 0.5)
    const baseMargin = 34.8
    const marginShift = -params.carrierRateDelta * 12 + (params.headcountDelta * 0.05) - (params.fuelSurchargeDelta * 0.15)
    const projectedMarginPct = Math.max(15, Math.min(50, baseMargin + marginShift))

    const baseBreachRate = 7.8
    const slaShift = (params.carrierRateDelta * 4) + (distanceFactor * 3.5) - ((params.targetSlaHours - 48) * 0.08) - (params.headcountDelta * 0.04)
    const forecastedSlaBreachRate = Math.max(2.0, Math.min(22.0, baseBreachRate + slaShift))

    const projectedRecoveredMargin = Math.max(0, (projectedMarginPct - 33.0) * (projectedGmv / 100))

    // Scale fan chart dynamically
    const multiplier = 1 + (projectedGmv - 148.2) / 148.2
    const fanChartData: ForecastPoint[] = MOCK_FAN_CHART_BASE.map(pt => {
      if (!pt.forecast) return pt
      return {
        ...pt,
        forecast: Number((pt.forecast * multiplier).toFixed(1)),
        lower80: Number(((pt.lower80 || pt.forecast) * (multiplier * 0.95)).toFixed(1)),
        upper80: Number(((pt.upper80 || pt.forecast) * (multiplier * 1.05)).toFixed(1)),
        lower95: Number(((pt.lower95 || pt.forecast) * (multiplier * 0.91)).toFixed(1)),
        upper95: Number(((pt.upper95 || pt.forecast) * (multiplier * 1.10)).toFixed(1)),
      }
    })

    const sensitivityDrivers: SensitivityDriver[] = [
      { feature: 'Carrier Contract Base Rate', elasticity: -1.42, impactCategory: 'high', direction: 'negative' },
      { feature: 'Fuel Surcharge Rate', elasticity: -0.88, impactCategory: 'high', direction: 'negative' },
      { feature: 'Expedited Order Share', elasticity: +0.64, impactCategory: 'medium', direction: 'positive' },
      { feature: 'Warehouse Headcount Buffer', elasticity: +0.42, impactCategory: 'medium', direction: 'positive' },
      { feature: 'Average Shipment Distance', elasticity: -0.38, impactCategory: 'low', direction: 'negative' },
    ]

    return {
      scenarioName,
      projectedGmv: Number(projectedGmv.toFixed(1)),
      gmvDeltaPct: Number((((projectedGmv - 148.2) / 148.2) * 100).toFixed(1)),
      projectedMarginPct: Number(projectedMarginPct.toFixed(1)),
      marginDeltaPct: Number((projectedMarginPct - 34.8).toFixed(1)),
      forecastedSlaBreachRate: Number(forecastedSlaBreachRate.toFixed(1)),
      slaBreachDeltaPct: Number((forecastedSlaBreachRate - 7.8).toFixed(1)),
      projectedRecoveredMargin: Number(projectedRecoveredMargin.toFixed(2)),
      confidenceScore: 94.2,
      fanChartData,
      sensitivityDrivers,
    }
  },
}
