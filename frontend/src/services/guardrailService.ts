import { apiClient, USE_MOCK_API, simulateLatency } from './apiClient'

export interface GuardrailPolicy {
  id: string
  name: string
  category: 'safety' | 'financial' | 'privacy' | 'governance' | 'compliance'
  description: string
  enabled: boolean
  strictness: 'strict' | 'advisory' | 'disabled'
  thresholdValue?: number
  thresholdUnit?: string
  thresholdMin?: number
  thresholdMax?: number
  thresholdStep?: number
  violationsCount: number
}

export interface GuardrailStats {
  totalPolicies: number
  activePolicies: number
  interceptedPromptInjections: number
  budgetExceededInterceptions: number
  piiMaskingEvents: number
  latencyOverheadMs: number
}

export interface TriggeredRule {
  ruleId: string
  ruleName: string
  actionTaken: string
}

export interface GuardrailEvaluationResult {
  allowed: boolean
  decision: 'allow' | 'block' | 'escalate_hitl'
  riskScore: number
  triggeredRules: TriggeredRule[]
  sanitizedPrompt: string
}

export const INITIAL_GUARDRAIL_POLICIES: GuardrailPolicy[] = [
  {
    id: 'POL-SEC-01',
    name: 'Prompt Injection & SQL Jailbreak Defense',
    category: 'safety',
    description: 'Intercepts adversarial system prompt overrides, DROP TABLE / DDL injection vectors, and unauthorized system commands.',
    enabled: true,
    strictness: 'strict',
    violationsCount: 38,
  },
  {
    id: 'POL-FIN-01',
    name: 'Financial Exposure & Transaction Ceiling Limit',
    category: 'financial',
    description: 'Automatically halts and escalates any autonomous tool execution or refund recommendation exceeding maximum dollar cap.',
    enabled: true,
    strictness: 'strict',
    thresholdValue: 100000,
    thresholdUnit: '$',
    thresholdMin: 10000,
    thresholdMax: 500000,
    thresholdStep: 10000,
    violationsCount: 14,
  },
  {
    id: 'POL-PRIV-01',
    name: 'PII & Customer Identification Masking (RegEx + NER)',
    category: 'privacy',
    description: 'Masks SSN, credit cards, customer phone numbers, and physical residential addresses before LLM inference.',
    enabled: true,
    strictness: 'strict',
    violationsCount: 124,
  },
  {
    id: 'POL-GOV-01',
    name: 'Carrier Rate Margin Compression Floor (30% Minimum)',
    category: 'governance',
    description: 'Prevents agent from recommending carrier contract price adjustments that drop gross operating margin below statutory minimum floor.',
    enabled: true,
    strictness: 'strict',
    thresholdValue: 30,
    thresholdUnit: '%',
    thresholdMin: 15,
    thresholdMax: 45,
    thresholdStep: 1,
    violationsCount: 9,
  },
  {
    id: 'POL-COMP-01',
    name: 'EU AI Act & Federal Reserve SR 11-7 Explainability Gate',
    category: 'compliance',
    description: 'Mandates SHAP global importance & local waterfall generation before any algorithmic model champion promotion.',
    enabled: true,
    strictness: 'strict',
    violationsCount: 4,
  },
  {
    id: 'POL-AUD-01',
    name: 'Tamper-Proof HMAC-SHA256 Audit Stream Verification',
    category: 'compliance',
    description: 'Requires cryptographic signature hashing on all LangGraph agent state changes and human sign-offs.',
    enabled: true,
    strictness: 'strict',
    violationsCount: 0,
  },
]

export const guardrailService = {
  async getPolicies(): Promise<GuardrailPolicy[]> {
    if (USE_MOCK_API) {
      await simulateLatency(150)
      return INITIAL_GUARDRAIL_POLICIES
    }
    return apiClient<GuardrailPolicy[]>({
      url: '/api/v1/guardrails/policies',
      method: 'GET',
    })
  },

  async getStats(): Promise<GuardrailStats> {
    if (USE_MOCK_API) {
      await simulateLatency(120)
      return {
        totalPolicies: 6,
        activePolicies: 6,
        interceptedPromptInjections: 42,
        budgetExceededInterceptions: 14,
        piiMaskingEvents: 189,
        latencyOverheadMs: 12,
      }
    }
    return apiClient<GuardrailStats>({
      url: '/api/v1/guardrails/stats',
      method: 'GET',
    })
  },

  async savePolicies(policies: GuardrailPolicy[]): Promise<{ status: string }> {
    if (USE_MOCK_API) {
      await simulateLatency(300)
      return { status: 'success' }
    }
    return apiClient<{ status: string }>({
      url: '/api/v1/guardrails/policies',
      method: 'PUT',
      data: { policies },
    })
  },

  async evaluatePrompt(promptText: string, proposedAmount: number): Promise<GuardrailEvaluationResult> {
    if (USE_MOCK_API) {
      await simulateLatency(400)
      const isDangerous =
        promptText.toLowerCase().includes('drop table') ||
        promptText.toLowerCase().includes('ignore previous') ||
        promptText.toLowerCase().includes('ssn') ||
        proposedAmount > 100000

      const triggered: TriggeredRule[] = []
      if (promptText.toLowerCase().includes('drop table') || promptText.toLowerCase().includes('ignore previous')) {
        triggered.push({
          ruleId: 'POL-SEC-01',
          ruleName: 'Prompt Injection / SQL DDL Interception',
          actionTaken: 'BLOCKED (AST sanitizer intercepted DDL keyword)',
        })
      }
      if (promptText.toLowerCase().includes('ssn')) {
        triggered.push({
          ruleId: 'POL-PRIV-01',
          ruleName: 'PII Sensitive Data Detection',
          actionTaken: 'REDACTED [SSN_REDACTED_***-**-****]',
        })
      }
      if (proposedAmount > 100000) {
        triggered.push({
          ruleId: 'POL-FIN-01',
          ruleName: 'Financial Ceiling Limit ($100k)',
          actionTaken: 'ESCALATED_HITL (Mandatory executive sign-off)',
        })
      }

      const sanitized = promptText
        .replace(/000-12-3456/g, '[REDACTED_SSN]')
        .replace(/DROP TABLE \w+;/gi, '[BLOCKED_DDL_QUERY]')

      return {
        allowed: !isDangerous || proposedAmount <= 100000,
        decision: isDangerous ? (proposedAmount > 100000 ? 'escalate_hitl' : 'block') : 'allow',
        riskScore: isDangerous ? 88 : 12,
        triggeredRules: triggered,
        sanitizedPrompt: sanitized,
      }
    }

    return apiClient<GuardrailEvaluationResult>({
      url: '/api/v1/guardrails/evaluate',
      method: 'POST',
      data: { prompt: promptText, amount: proposedAmount },
    })
  },
}
