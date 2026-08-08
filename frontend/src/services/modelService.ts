import { simulateLatency, USE_MOCK_API, apiClient } from './apiClient'
import type { ModelArtifact, ModelPredictionResponse } from '@/shared/types'

export const mockModels: ModelArtifact[] = [
  {
    id: 'model-xgb-margin-v24',
    name: 'XGBoost Margin Regressor',
    framework: 'xgboost',
    version: 'v2.4.1',
    taskType: 'regression',
    status: 'champion',
    targetVariable: 'gross_margin_pct',
    datasetVersion: 'ds_tx_200k_clean:v2.1',
    trainedAt: '2026-08-05 14:30 UTC',
    author: 'Elena Rostova (Lead ML Eng)',
    mlflowRunId: 'mlf_99a812b0cf7',
    metrics: {
      r2: 0.884,
      rmse: 2.14,
      mae: 1.48,
      mape: 4.82,
    },
    hyperparameters: {
      n_estimators: 450,
      learning_rate: 0.035,
      max_depth: 6,
      subsample: 0.85,
      colsample_bytree: 0.80,
      reg_alpha: 0.15,
      reg_lambda: 1.20,
      tree_method: 'hist',
    },
  },
  {
    id: 'model-lgbm-sla-v19',
    name: 'LightGBM SLA Breach Classifier',
    framework: 'lightgbm',
    version: 'v1.9.0',
    taskType: 'classification',
    status: 'champion',
    targetVariable: 'sla_breached',
    datasetVersion: 'ds_tx_200k_clean:v2.1',
    trainedAt: '2026-08-04 18:22 UTC',
    author: 'Marcus Vance (Senior Data Scientist)',
    mlflowRunId: 'mlf_44f128bc901',
    metrics: {
      roc_auc: 0.942,
      pr_auc: 0.891,
      f1_score: 0.876,
      precision: 0.892,
      recall: 0.861,
      accuracy: 0.938,
    },
    hyperparameters: {
      num_leaves: 63,
      learning_rate: 0.05,
      n_estimators: 350,
      min_child_samples: 20,
      subsample: 0.8,
      colsample_bytree: 0.75,
      class_weight: 'balanced',
    },
    confusionMatrix: {
      tp: 3840,
      fp: 465,
      fn: 620,
      tn: 35075,
    },
    rocCurve: [
      { fpr: 0.0, tpr: 0.0, threshold: 1.0 },
      { fpr: 0.01, tpr: 0.42, threshold: 0.9 },
      { fpr: 0.03, tpr: 0.76, threshold: 0.7 },
      { fpr: 0.06, tpr: 0.89, threshold: 0.5 },
      { fpr: 0.12, tpr: 0.94, threshold: 0.3 },
      { fpr: 0.25, tpr: 0.98, threshold: 0.15 },
      { fpr: 1.0, tpr: 1.0, threshold: 0.0 },
    ],
    prCurve: [
      { recall: 0.0, precision: 1.0, threshold: 1.0 },
      { recall: 0.42, precision: 0.96, threshold: 0.9 },
      { recall: 0.76, precision: 0.92, threshold: 0.7 },
      { recall: 0.86, precision: 0.89, threshold: 0.5 },
      { recall: 0.94, precision: 0.78, threshold: 0.3 },
      { recall: 0.98, precision: 0.62, threshold: 0.15 },
      { recall: 1.0, precision: 0.10, threshold: 0.0 },
    ],
  },
  {
    id: 'model-isof-anomaly-v21',
    name: 'Isolation Forest Anomaly Guard',
    framework: 'scikit-learn',
    version: 'v2.1.0',
    taskType: 'anomaly_detection',
    status: 'champion',
    targetVariable: 'anomaly_score',
    datasetVersion: 'ds_tx_200k_clean:v2.1',
    trainedAt: '2026-08-03 09:15 UTC',
    author: 'Elena Rostova (Lead ML Eng)',
    mlflowRunId: 'mlf_11b899a22e1',
    metrics: {
      roc_auc: 0.918,
      f1_score: 0.824,
      precision: 0.850,
      recall: 0.800,
    },
    hyperparameters: {
      n_estimators: 200,
      contamination: 0.035,
      max_samples: 'auto',
      bootstrap: false,
      random_state: 42,
    },
  },
  {
    id: 'model-prophet-rev-v11',
    name: 'Prophet Time Series Forecaster',
    framework: 'prophet',
    version: 'v1.1.2',
    taskType: 'time_series',
    status: 'challenger',
    targetVariable: 'net_revenue_usd',
    datasetVersion: 'ds_tx_200k_clean:v2.1',
    trainedAt: '2026-08-06 11:45 UTC',
    author: 'AI Orchestrator AutoTrainer',
    mlflowRunId: 'mlf_88c77209ff4',
    metrics: {
      mape: 3.42,
      rmse: 14250,
      mae: 9800,
      r2: 0.865,
    },
    hyperparameters: {
      growth: 'linear',
      changepoint_prior_scale: 0.05,
      seasonality_prior_scale: 10.0,
      seasonality_mode: 'multiplicative',
      yearly_seasonality: true,
      weekly_seasonality: true,
      daily_seasonality: false,
    },
  },
  {
    id: 'model-rf-margin-v18',
    name: 'Random Forest Regressor (Legacy)',
    framework: 'scikit-learn',
    version: 'v1.8.4',
    taskType: 'regression',
    status: 'retired',
    targetVariable: 'gross_margin_pct',
    datasetVersion: 'ds_tx_200k_clean:v1.0',
    trainedAt: '2026-07-12 10:00 UTC',
    author: 'Legacy Analytics Pipeline',
    mlflowRunId: 'mlf_001928a3bf2',
    metrics: {
      r2: 0.812,
      rmse: 3.45,
      mae: 2.30,
      mape: 7.60,
    },
    hyperparameters: {
      n_estimators: 150,
      max_depth: 12,
      min_samples_split: 5,
      n_jobs: -1,
    },
  },
]

export const modelService = {
  async getModels(): Promise<ModelArtifact[]> {
    if (USE_MOCK_API) {
      await simulateLatency(250)
      return [...mockModels]
    }
    return apiClient<ModelArtifact[]>({ url: '/api/models' })
  },

  async getModelById(id: string): Promise<ModelArtifact | undefined> {
    if (USE_MOCK_API) {
      await simulateLatency(150)
      return mockModels.find(m => m.id === id)
    }
    return apiClient<ModelArtifact>({ url: `/api/models/${id}` })
  },

  async predict(modelId: string, features: Record<string, number>): Promise<ModelPredictionResponse> {
    if (USE_MOCK_API) {
      await simulateLatency(180)
      const model = mockModels.find(m => m.id === modelId) || mockModels[0]

      if (model.taskType === 'classification') {
        // SLA breach probability
        const latency = features.fulfillment_latency_days || 4.2
        const cogs = features.cogs_usd || 450
        const prob = Math.min(0.99, Math.max(0.01, (latency / 10) * 0.7 + (cogs / 2000) * 0.2))
        return {
          prediction: parseFloat(prob.toFixed(3)),
          confidenceLow: parseFloat(Math.max(0.01, prob - 0.04).toFixed(3)),
          confidenceHigh: parseFloat(Math.min(0.99, prob + 0.04).toFixed(3)),
          latencyMs: 14,
          units: 'Probability (0.0 - 1.0)',
        }
      } else {
        // Margin regression
        const cogs = features.cogs_usd || 500
        const latency = features.fulfillment_latency_days || 4.2
        const discount = features.discount_applied_pct || 5.0
        const margin = Math.max(5.0, 48.5 - (cogs / 100) * 1.8 - latency * 0.9 - discount * 0.4)
        return {
          prediction: parseFloat(margin.toFixed(2)),
          confidenceLow: parseFloat((margin - 1.48).toFixed(2)),
          confidenceHigh: parseFloat((margin + 1.48).toFixed(2)),
          latencyMs: 8,
          units: '% Gross Margin',
        }
      }
    }
    return apiClient<ModelPredictionResponse>({
      url: `/api/models/${modelId}/predict`,
      method: 'POST',
      data: { features },
    })
  },

  async promoteModel(modelId: string): Promise<{ success: boolean; message: string }> {
    if (USE_MOCK_API) {
      await simulateLatency(300)
      const model = mockModels.find(m => m.id === modelId)
      if (model) {
        // Demote existing champion for same target
        mockModels.forEach(m => {
          if (m.targetVariable === model.targetVariable && m.status === 'champion') {
            m.status = 'shadow'
          }
        })
        model.status = 'champion'
      }
      return {
        success: true,
        message: `Model ${model?.name} (${model?.version}) successfully promoted to Production Champion.`,
      }
    }
    return apiClient<{ success: boolean; message: string }>({
      url: `/api/models/${modelId}/promote`,
      method: 'POST',
    })
  },
}
