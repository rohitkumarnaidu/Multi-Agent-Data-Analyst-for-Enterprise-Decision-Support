import { apiClient, USE_MOCK_API } from './apiClient'

export interface RiskAnomaly {
  id: string
  timestamp: string
  category: 'Carrier SLA' | 'Cost Spikes' | 'Weather Impact' | 'Volume Outlier' | 'Margin Leakage'
  carrierOrRoute: string
  region: string
  severity: 'critical' | 'high' | 'medium'
  riskScore: number // 0-100
  financialExposureUsd: number
  rootCause: string
  aiRecommendation: string
  status: 'active' | 'investigating' | 'mitigated' | 'dismissed'
  slaBreachPct: number
}

export interface RiskStats {
  totalAnomalies: number
  criticalCount: number
  valueAtRiskUsd: number
  recoveredThisWeekUsd: number
  highRiskCarriers: number
}

export interface RadarRiskFactor {
  factor: string
  score: number // 0-100
  benchmark: number
}

const MOCK_ANOMALIES: RiskAnomaly[] = [
  {
    id: 'RSK-1049',
    timestamp: '14 mins ago',
    category: 'Carrier SLA',
    carrierOrRoute: 'SwiftLogistics (Route: ORD -> DFW)',
    region: 'Midwest',
    severity: 'critical',
    riskScore: 94,
    financialExposureUsd: 142000,
    rootCause: 'Driver shortage during regional severe convective thunderstorm cluster.',
    aiRecommendation: 'Re-route 420 remaining pallet consignments to ApexFreight Tier 1 partner hub.',
    status: 'active',
    slaBreachPct: 34.2,
  },
  {
    id: 'RSK-1048',
    timestamp: '32 mins ago',
    category: 'Margin Leakage',
    carrierOrRoute: 'PacificExpress (Tier 3 Contract)',
    region: 'West Coast',
    severity: 'critical',
    riskScore: 89,
    financialExposureUsd: 98500,
    rootCause: 'Unscheduled fuel surcharge escalation exceeding contract SLA terms by 18.5%.',
    aiRecommendation: 'Execute automated contract clause 14.B penalty withholding on pending remittance.',
    status: 'active',
    slaBreachPct: 28.1,
  },
  {
    id: 'RSK-1047',
    timestamp: '1 hour ago',
    category: 'Cost Spikes',
    carrierOrRoute: 'Midwest Cross-Dock Hub #4',
    region: 'Midwest',
    severity: 'high',
    riskScore: 82,
    financialExposureUsd: 64200,
    rootCause: 'Overtime handling charges triggered due to unscheduled freight consolidation delays.',
    aiRecommendation: 'Reallocate 2 floating warehouse teams from Hub #2 to balance dock queue.',
    status: 'investigating',
    slaBreachPct: 18.4,
  },
  {
    id: 'RSK-1046',
    timestamp: '2 hours ago',
    category: 'Weather Impact',
    carrierOrRoute: 'Appalachian Transit Corridor (I-80)',
    region: 'Northeast',
    severity: 'high',
    riskScore: 78,
    financialExposureUsd: 52000,
    rootCause: 'Flash flooding risk advisory slowing transit velocities below 35 km/h.',
    aiRecommendation: 'Extend customer promised delivery window by +12 hrs to prevent contract penalty.',
    status: 'investigating',
    slaBreachPct: 15.6,
  },
  {
    id: 'RSK-1045',
    timestamp: '4 hours ago',
    category: 'Volume Outlier',
    carrierOrRoute: 'Atlanta Southeast Sortation Facility',
    region: 'Southeast',
    severity: 'medium',
    riskScore: 64,
    financialExposureUsd: 28400,
    rootCause: 'Flash promotional order surge (+180% normal volume) creating temporary sorting bottleneck.',
    aiRecommendation: 'Activate auxiliary third-party overflow carrier capacity.',
    status: 'mitigated',
    slaBreachPct: 9.8,
  },
  {
    id: 'RSK-1044',
    timestamp: '6 hours ago',
    category: 'Carrier SLA',
    carrierOrRoute: 'MetroSpeed Courier Express',
    region: 'Midwest',
    severity: 'medium',
    riskScore: 58,
    financialExposureUsd: 19800,
    rootCause: 'Repeated last-mile drop-off scanning failures across 12 delivery postal codes.',
    aiRecommendation: 'Issue formal carrier compliance warning and audit telematics logs.',
    status: 'active',
    slaBreachPct: 8.2,
  },
]

export const riskService = {
  getStats: async (): Promise<RiskStats> => {
    return {
      totalAnomalies: 142,
      criticalCount: 18,
      valueAtRiskUsd: 2420000,
      recoveredThisWeekUsd: 640000,
      highRiskCarriers: 6,
    }
  },

  getRadarRiskFactors: async (): Promise<RadarRiskFactor[]> => {
    return [
      { factor: 'Weather Severity', score: 84, benchmark: 40 },
      { factor: 'Carrier Reliability', score: 76, benchmark: 30 },
      { factor: 'Fuel Surcharge Volatility', score: 68, benchmark: 35 },
      { factor: 'Volume Surge Stress', score: 54, benchmark: 25 },
      { factor: 'Warehouse Bottleneck', score: 72, benchmark: 28 },
    ]
  },

  getAnomalies: async (filterSeverity?: string): Promise<RiskAnomaly[]> => {
    if (!USE_MOCK_API) {
      return apiClient<RiskAnomaly[]>({
        url: '/api/v1/risk/anomalies',
        method: 'GET',
        params: { severity: filterSeverity },
      })
    }

    if (filterSeverity && filterSeverity !== 'all') {
      return MOCK_ANOMALIES.filter(a => a.severity === filterSeverity)
    }
    return MOCK_ANOMALIES
  },
}
