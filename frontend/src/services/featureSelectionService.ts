import { simulateLatency, USE_MOCK_API, apiClient } from './apiClient'
import type { FeatureRankingItem, FeatureSubsetImpact } from '@/shared/types'

export const featureSelectionService = {
  async getFeatureRankings(targetMetric = 'gross_margin_pct'): Promise<FeatureRankingItem[]> {
    if (USE_MOCK_API) {
      await simulateLatency(250)
      return [
        {
          featureName: 'cogs_usd',
          category: 'business',
          mutualInfoScore: 0.88,
          rfScore: 0.92,
          lassoScore: 0.86,
          xgbScore: 0.95,
          consensusScore: 0.903,
          consensusRank: 1,
          vifScore: 4.12,
          vifStatus: 'low',
          isSelected: true,
        },
        {
          featureName: 'fulfillment_latency_days',
          category: 'business',
          mutualInfoScore: 0.74,
          rfScore: 0.81,
          lassoScore: 0.78,
          xgbScore: 0.84,
          consensusScore: 0.793,
          consensusRank: 2,
          vifScore: 1.84,
          vifStatus: 'low',
          isSelected: true,
        },
        {
          featureName: 'freight_cost_ratio',
          category: 'business',
          mutualInfoScore: 0.69,
          rfScore: 0.75,
          lassoScore: 0.72,
          xgbScore: 0.78,
          consensusScore: 0.735,
          consensusRank: 3,
          vifScore: 2.15,
          vifStatus: 'low',
          isSelected: true,
        },
        {
          featureName: 'discount_applied_pct',
          category: 'business',
          mutualInfoScore: 0.62,
          rfScore: 0.68,
          lassoScore: 0.65,
          xgbScore: 0.71,
          consensusScore: 0.665,
          consensusRank: 4,
          vifScore: 1.45,
          vifStatus: 'low',
          isSelected: true,
        },
        {
          featureName: 'anomaly_xgboost_score',
          category: 'ai',
          mutualInfoScore: 0.58,
          rfScore: 0.64,
          lassoScore: 0.59,
          xgbScore: 0.68,
          consensusScore: 0.623,
          consensusRank: 5,
          vifScore: 1.62,
          vifStatus: 'low',
          isSelected: true,
        },
        {
          featureName: 'carrier_latency_lag_1d',
          category: 'temporal_lag',
          mutualInfoScore: 0.48,
          rfScore: 0.52,
          lassoScore: 0.45,
          xgbScore: 0.56,
          consensusScore: 0.503,
          consensusRank: 6,
          vifScore: 2.88,
          vifStatus: 'low',
          isSelected: true,
        },
        {
          featureName: 'rolling_7d_return_rate',
          category: 'temporal_aggregate',
          mutualInfoScore: 0.41,
          rfScore: 0.46,
          lassoScore: 0.38,
          xgbScore: 0.49,
          consensusScore: 0.435,
          consensusRank: 7,
          vifScore: 1.95,
          vifStatus: 'low',
          isSelected: true,
        },
        {
          featureName: 'customer_tenure_months',
          category: 'business',
          mutualInfoScore: 0.35,
          rfScore: 0.39,
          lassoScore: 0.31,
          xgbScore: 0.42,
          consensusScore: 0.368,
          consensusRank: 8,
          vifScore: 1.18,
          vifStatus: 'low',
          isSelected: true,
        },
        {
          featureName: 'gross_amount_usd',
          category: 'business',
          mutualInfoScore: 0.72,
          rfScore: 0.65,
          lassoScore: 0.12,
          xgbScore: 0.69,
          consensusScore: 0.545,
          consensusRank: 9,
          vifScore: 14.85, // High collinearity with net_revenue and cogs
          vifStatus: 'high',
          isSelected: false,
        },
        {
          featureName: 'net_revenue_usd',
          category: 'business',
          mutualInfoScore: 0.81,
          rfScore: 0.79,
          lassoScore: 0.10,
          xgbScore: 0.82,
          consensusScore: 0.630,
          consensusRank: 10,
          vifScore: 16.40, // High collinearity with gross_amount
          vifStatus: 'high',
          isSelected: false,
        },
        {
          featureName: 'order_item_count',
          category: 'business',
          mutualInfoScore: 0.22,
          rfScore: 0.25,
          lassoScore: 0.18,
          xgbScore: 0.28,
          consensusScore: 0.233,
          consensusRank: 11,
          vifScore: 1.25,
          vifStatus: 'low',
          isSelected: false,
        },
        {
          featureName: 'is_weekend_order',
          category: 'temporal',
          mutualInfoScore: 0.08,
          rfScore: 0.09,
          lassoScore: 0.02,
          xgbScore: 0.11,
          consensusScore: 0.075,
          consensusRank: 12,
          vifScore: 1.05,
          vifStatus: 'low',
          isSelected: false,
        },
      ]
    }
    return apiClient<FeatureRankingItem[]>({
      url: '/api/feature-selection/rankings',
      params: { targetMetric },
    })
  },

  async getSubsetImpact(
    targetMetric = 'gross_margin_pct',
    selectedFeatures: string[] = []
  ): Promise<FeatureSubsetImpact> {
    if (USE_MOCK_API) {
      await simulateLatency(200)
      const count = selectedFeatures.length
      const total = 12

      // Compute realistic estimated metrics based on selection
      const baselineR2 = 0.884
      const estimatedR2 = count >= 8 ? 0.879 : count >= 5 ? 0.842 : count * 0.15
      const baselineAuc = 0.942
      const estimatedAuc = count >= 8 ? 0.938 : count >= 5 ? 0.912 : 0.75

      const speedup = (total / Math.max(1, count)) * 1.35
      const memorySaved = ((total - count) / total) * 100

      return {
        targetMetric,
        selectedCount: count,
        totalCount: total,
        estimatedR2: parseFloat(estimatedR2.toFixed(3)),
        baselineR2,
        estimatedAuc: parseFloat(estimatedAuc.toFixed(3)),
        baselineAuc,
        trainingSpeedupFactor: parseFloat(speedup.toFixed(2)),
        memorySavedPct: parseFloat(memorySaved.toFixed(1)),
        collinearFeaturesPruned: 2,
      }
    }
    return apiClient<FeatureSubsetImpact>({
      url: '/api/feature-selection/subset-impact',
      params: { targetMetric, features: selectedFeatures.join(',') },
    })
  },
}
