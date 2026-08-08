import { simulateLatency, USE_MOCK_API, apiClient } from './apiClient'
import type { LLMConfig, HITLPolicy, AuditLogEntry } from '@/shared/types'

let currentLLMConfig: LLMConfig = {
  primaryModel: 'claude-3-7-sonnet-20250219',
  fastModel: 'claude-3-5-haiku-20241022',
  embeddingModel: 'text-embedding-3-large',
  temperature: 0.15,
  maxTokens: 4096,
  enableStreaming: true,
  apiKeyStatus: 'vault_secured',
}

let currentHITLPolicies: HITLPolicy[] = [
  {
    id: 'pol-financial-cap',
    name: 'Financial Action Impact Threshold',
    description: 'Require explicit human approval before executing interventions exceeding $100,000 in simulated financial impact.',
    thresholdType: 'financial_impact',
    thresholdValue: 100000,
    requireDualApproval: true,
    enabled: true,
  },
  {
    id: 'pol-model-confidence',
    name: 'Model Confidence Safety Floor',
    description: 'Trigger human review whenever autonomous agent confidence drops below 85.0%.',
    thresholdType: 'model_confidence',
    thresholdValue: 85.0,
    requireDualApproval: false,
    enabled: true,
  },
  {
    id: 'pol-production-promotion',
    name: 'Champion Model Promotion Gating',
    description: 'Mandate Dual Data Science Lead sign-off before promoting challenger models into production traffic.',
    thresholdType: 'risk_severity',
    thresholdValue: 1,
    requireDualApproval: true,
    enabled: true,
  },
]

const mockAuditLogs: AuditLogEntry[] = [
  {
    id: 'aud-98214',
    timestamp: '2026-08-07 19:42:15 UTC',
    actor: 'Lead Data Scientist (Elena Rostova)',
    action: 'Promote Model to Champion',
    resource: 'model-lgbm-sla-v19 (ROC-AUC: 0.942)',
    status: 'success',
    details: 'Validated against 40,000 holdout transactions. Dual approval recorded.',
  },
  {
    id: 'aud-98213',
    timestamp: '2026-08-07 18:30:02 UTC',
    actor: 'Report Agent (Claude 3.7 Sonnet)',
    action: 'Compile Executive Report',
    resource: 'rep-q3-sla-breach-audit',
    status: 'success',
    details: 'Compiled 14-page executive audit and PDF artifact.',
  },
  {
    id: 'aud-98212',
    timestamp: '2026-08-07 17:14:50 UTC',
    actor: 'Orchestrator Agent',
    action: 'Trigger What-If Causal Intervention',
    resource: 'dataset-tx-200k-clean',
    status: 'escalated',
    details: 'Exceeded $100k threshold ($240k impact). Routed to Operations Lead queue.',
  },
  {
    id: 'aud-98211',
    timestamp: '2026-08-07 15:02:18 UTC',
    actor: 'System Guardrail Engine',
    action: 'Block High-VIF Feature Subset',
    resource: 'feature_carrier_id (VIF: 14.8)',
    status: 'blocked',
    details: 'Multicollinearity guardrail rejected feature insertion.',
  },
]

export const settingsService = {
  async getLLMConfig(): Promise<LLMConfig> {
    if (USE_MOCK_API) {
      await simulateLatency(150)
      return currentLLMConfig
    }
    return apiClient<LLMConfig>({ url: '/api/settings/llm' })
  },

  async updateLLMConfig(newConfig: Partial<LLMConfig>): Promise<LLMConfig> {
    if (USE_MOCK_API) {
      await simulateLatency(200)
      currentLLMConfig = { ...currentLLMConfig, ...newConfig }
      return currentLLMConfig
    }
    return apiClient<LLMConfig>({
      url: '/api/settings/llm',
      method: 'PUT',
      data: newConfig,
    })
  },

  async getHITLPolicies(): Promise<HITLPolicy[]> {
    if (USE_MOCK_API) {
      await simulateLatency(150)
      return currentHITLPolicies
    }
    return apiClient<HITLPolicy[]>({ url: '/api/settings/hitl-policies' })
  },

  async toggleHITLPolicy(policyId: string, enabled: boolean): Promise<HITLPolicy[]> {
    if (USE_MOCK_API) {
      await simulateLatency(150)
      currentHITLPolicies = currentHITLPolicies.map(p =>
        p.id === policyId ? { ...p, enabled } : p
      )
      return currentHITLPolicies
    }
    return apiClient<HITLPolicy[]>({
      url: `/api/settings/hitl-policies/${policyId}/toggle`,
      method: 'POST',
      data: { enabled },
    })
  },

  async getTokenUsage(): Promise<{
    monthlySpendUsd: number
    monthlyBudgetUsd: number
    totalTokensMillions: number
    agentBreakdown: Array<{ agent: string; tokensK: number; costUsd: number }>
  }> {
    if (USE_MOCK_API) {
      await simulateLatency(180)
      return {
        monthlySpendUsd: 84.5,
        monthlyBudgetUsd: 500.0,
        totalTokensMillions: 14.2,
        agentBreakdown: [
          { agent: 'Orchestrator Agent', tokensK: 4800, costUsd: 36.2 },
          { agent: 'Analysis & Code Agent', tokensK: 3900, costUsd: 24.5 },
          { agent: 'Report Agent', tokensK: 2600, costUsd: 14.1 },
          { agent: 'Knowledge Agent', tokensK: 1500, costUsd: 5.8 },
          { agent: 'Validator & Guardrails', tokensK: 1400, costUsd: 3.9 },
        ],
      }
    }
    return apiClient({ url: '/api/settings/token-usage' })
  },

  async getAuditLogs(): Promise<AuditLogEntry[]> {
    if (USE_MOCK_API) {
      await simulateLatency(200)
      return mockAuditLogs
    }
    return apiClient<AuditLogEntry[]>({ url: '/api/settings/audit-logs' })
  },
}
