import { simulateLatency, USE_MOCK_API, apiClient } from './apiClient'
import type {
  GlobalSHAPFeature,
  LocalExplanation,
  CounterfactualRecourse,
} from '@/shared/types'

export const mockTransactions = [
  { id: 'TX-89241', description: 'Enterprise SaaS Annual Renewal (Breached SLA Risk)', department: 'Cloud SaaS' },
  { id: 'TX-90412', description: 'Logistics Bulk Freight Expedite (Negative Margin)', department: 'Logistics' },
  { id: 'TX-11823', description: 'Hardware Server Cluster Order (Optimal Margin)', department: 'Enterprise Sales' },
]

export const explainabilityService = {
  async getGlobalSHAP(modelId = 'model-xgb-margin-v24'): Promise<GlobalSHAPFeature[]> {
    if (USE_MOCK_API) {
      await simulateLatency(250)
      return [
        {
          featureName: 'cogs_usd',
          meanAbsoluteShap: 4.82,
          direction: 'negative',
          points: [
            { featureValueNorm: 0.95, shapValue: -5.4 },
            { featureValueNorm: 0.85, shapValue: -4.2 },
            { featureValueNorm: 0.70, shapValue: -2.8 },
            { featureValueNorm: 0.50, shapValue: 0.1 },
            { featureValueNorm: 0.20, shapValue: 3.5 },
            { featureValueNorm: 0.05, shapValue: 5.1 },
          ],
        },
        {
          featureName: 'fulfillment_latency_days',
          meanAbsoluteShap: 3.65,
          direction: 'negative',
          points: [
            { featureValueNorm: 0.90, shapValue: -4.1 },
            { featureValueNorm: 0.80, shapValue: -3.2 },
            { featureValueNorm: 0.60, shapValue: -1.4 },
            { featureValueNorm: 0.40, shapValue: 0.8 },
            { featureValueNorm: 0.15, shapValue: 2.9 },
          ],
        },
        {
          featureName: 'freight_cost_ratio',
          meanAbsoluteShap: 2.94,
          direction: 'negative',
          points: [
            { featureValueNorm: 0.88, shapValue: -3.6 },
            { featureValueNorm: 0.65, shapValue: -1.9 },
            { featureValueNorm: 0.45, shapValue: 0.2 },
            { featureValueNorm: 0.10, shapValue: 2.4 },
          ],
        },
        {
          featureName: 'discount_applied_pct',
          meanAbsoluteShap: 2.15,
          direction: 'negative',
          points: [
            { featureValueNorm: 0.92, shapValue: -3.1 },
            { featureValueNorm: 0.75, shapValue: -1.8 },
            { featureValueNorm: 0.30, shapValue: 1.2 },
            { featureValueNorm: 0.05, shapValue: 2.0 },
          ],
        },
        {
          featureName: 'customer_tenure_months',
          meanAbsoluteShap: 1.48,
          direction: 'positive',
          points: [
            { featureValueNorm: 0.95, shapValue: 2.2 },
            { featureValueNorm: 0.70, shapValue: 1.4 },
            { featureValueNorm: 0.40, shapValue: -0.3 },
            { featureValueNorm: 0.10, shapValue: -1.6 },
          ],
        },
        {
          featureName: 'rolling_7d_return_rate',
          meanAbsoluteShap: 1.12,
          direction: 'negative',
          points: [
            { featureValueNorm: 0.85, shapValue: -1.8 },
            { featureValueNorm: 0.50, shapValue: 0.0 },
            { featureValueNorm: 0.15, shapValue: 1.1 },
          ],
        },
        {
          featureName: 'anomaly_xgboost_score',
          meanAbsoluteShap: 0.88,
          direction: 'negative',
          points: [
            { featureValueNorm: 0.90, shapValue: -1.5 },
            { featureValueNorm: 0.30, shapValue: 0.4 },
            { featureValueNorm: 0.05, shapValue: 0.9 },
          ],
        },
        {
          featureName: 'carrier_latency_lag_1d',
          meanAbsoluteShap: 0.65,
          direction: 'negative',
          points: [
            { featureValueNorm: 0.80, shapValue: -0.9 },
            { featureValueNorm: 0.40, shapValue: 0.2 },
            { featureValueNorm: 0.10, shapValue: 0.7 },
          ],
        },
      ]
    }
    return apiClient<GlobalSHAPFeature[]>({
      url: `/api/explainability/${modelId}/global-shap`,
    })
  },

  async getLocalExplanation(
    transactionId = 'TX-89241',
    modelId = 'model-xgb-margin-v24'
  ): Promise<LocalExplanation> {
    if (USE_MOCK_API) {
      await simulateLatency(220)
      if (transactionId === 'TX-90412') {
        return {
          transactionId: 'TX-90412',
          modelName: 'XGBoost Margin Regressor (v2.4.1)',
          baseValue: 24.2,
          predictedValue: 8.6,
          units: '% Gross Margin',
          limeSurrogateR2: 0.948,
          agentReasoning:
            'Gross margin collapsed from the population baseline of 24.2% down to 8.6% primarily driven by extreme freight expedite surcharges (-8.4%) and fulfillment latency of 9.5 days (-4.8%), offsetting high gross contract value.',
          waterfall: [
            { featureName: 'Base Value (E[f(x)])', actualValue: 'Baseline', shapValue: 24.2, runningTotal: 24.2 },
            { featureName: 'freight_cost_ratio', actualValue: '0.42 (High)', shapValue: -8.4, runningTotal: 15.8 },
            { featureName: 'fulfillment_latency_days', actualValue: '9.5 days', shapValue: -4.8, runningTotal: 11.0 },
            { featureName: 'discount_applied_pct', actualValue: '18.0%', shapValue: -2.1, runningTotal: 8.9 },
            { featureName: 'customer_tenure_months', actualValue: '36 mos', shapValue: +0.9, runningTotal: 9.8 },
            { featureName: 'cogs_usd', actualValue: '$1,850', shapValue: -1.2, runningTotal: 8.6 },
          ],
        }
      } else if (transactionId === 'TX-11823') {
        return {
          transactionId: 'TX-11823',
          modelName: 'XGBoost Margin Regressor (v2.4.1)',
          baseValue: 24.2,
          predictedValue: 38.9,
          units: '% Gross Margin',
          limeSurrogateR2: 0.962,
          agentReasoning:
            'Gross margin exceeded baseline by +14.7% due to zero-discount enterprise pricing (+6.5%), minimal localized freight cost (+4.8%), and expedited 1.2-day fulfillment (+3.4%).',
          waterfall: [
            { featureName: 'Base Value (E[f(x)])', actualValue: 'Baseline', shapValue: 24.2, runningTotal: 24.2 },
            { featureName: 'discount_applied_pct', actualValue: '0.0%', shapValue: +6.5, runningTotal: 30.7 },
            { featureName: 'freight_cost_ratio', actualValue: '0.04 (Low)', shapValue: +4.8, runningTotal: 35.5 },
            { featureName: 'fulfillment_latency_days', actualValue: '1.2 days', shapValue: +3.4, runningTotal: 38.9 },
          ],
        }
      }

      // Default: TX-89241
      return {
        transactionId: 'TX-89241',
        modelName: 'XGBoost Margin Regressor (v2.4.1)',
        baseValue: 24.2,
        predictedValue: 14.8,
        units: '% Gross Margin',
        limeSurrogateR2: 0.935,
        agentReasoning:
          'Gross margin dropped by -9.4% below expected mean. The primary negative contributors were a high enterprise promotional discount of 22% (-5.8%) and elevated vendor COGS (-3.2%).',
        waterfall: [
          { featureName: 'Base Value (E[f(x)])', actualValue: 'Baseline', shapValue: 24.2, runningTotal: 24.2 },
          { featureName: 'discount_applied_pct', actualValue: '22.0%', shapValue: -5.8, runningTotal: 18.4 },
          { featureName: 'cogs_usd', actualValue: '$1,420', shapValue: -3.2, runningTotal: 15.2 },
          { featureName: 'fulfillment_latency_days', actualValue: '5.8 days', shapValue: -1.6, runningTotal: 13.6 },
          { featureName: 'customer_tenure_months', actualValue: '48 mos', shapValue: +1.2, runningTotal: 14.8 },
        ],
      }
    }
    return apiClient<LocalExplanation>({
      url: `/api/explainability/transactions/${transactionId}`,
      params: { modelId },
    })
  },

  async getCounterfactuals(transactionId = 'TX-89241'): Promise<CounterfactualRecourse[]> {
    if (USE_MOCK_API) {
      await simulateLatency(180)
      return [
        {
          featureName: 'discount_applied_pct',
          currentValue: '22.0%',
          targetValue: '≤ 10.0%',
          difficulty: 'easy',
          impactDescription: 'Restoring discount cap lifts predicted gross margin by +4.2% instantly.',
        },
        {
          featureName: 'fulfillment_latency_days',
          currentValue: '5.8 days',
          targetValue: '≤ 3.0 days',
          difficulty: 'moderate',
          impactDescription: 'Routing via Tier-1 carrier cuts latency and increases margin by +1.6%.',
        },
        {
          featureName: 'freight_cost_ratio',
          currentValue: '0.28',
          targetValue: '≤ 0.15',
          difficulty: 'hard',
          impactDescription: 'Consolidating regional pallet freight saves +2.1% net margin.',
        },
      ]
    }
    return apiClient<CounterfactualRecourse[]>({
      url: `/api/explainability/transactions/${transactionId}/counterfactuals`,
    })
  },
}
