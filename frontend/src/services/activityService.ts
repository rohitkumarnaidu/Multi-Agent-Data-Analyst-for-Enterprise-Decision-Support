import { apiClient, USE_MOCK_API } from './apiClient'

export type ActivityEventType = 'agent_execution' | 'hitl_approval' | 'sql_query' | 'model_retrain' | 'guardrail_policy'

export interface ActivityEvent {
  id: string
  timestamp: string
  relativeTime: string
  actor: {
    name: string
    role: string
    avatarType: 'agent' | 'user' | 'system'
  }
  eventType: ActivityEventType
  actionTitle: string
  description: string
  durationMs: number
  status: 'success' | 'blocked' | 'escalated' | 'pending'
  severity: 'low' | 'medium' | 'high' | 'critical'
  details: {
    promptOrGoal?: string
    sqlOrCode?: string
    toolCalls?: Array<{ toolName: string; durationMs: number; status: string }>
    guardrailChecks?: Array<{ rule: string; passed: boolean; score: number }>
    approver?: string
    hash: string
    inputParams?: Record<string, any>
    outputSummary?: string
  }
}

export interface ActivityFilterOptions {
  search?: string
  eventType?: string
  status?: string
  timeRange?: string
}

export interface ActivityStats {
  totalEvents: number
  agentInvocations: number
  humanApprovals: number
  guardrailBlocked: number
  meanLatencyMs: number
  systemVerificationHash: string
}

const MOCK_ACTIVITY_EVENTS: ActivityEvent[] = [
  {
    id: 'ACT-98214',
    timestamp: '2026-08-07T20:25:12Z',
    relativeTime: '6 mins ago',
    actor: {
      name: 'Elena Rostova',
      role: 'Lead Data Scientist',
      avatarType: 'user',
    },
    eventType: 'hitl_approval',
    actionTitle: 'Signed Human-in-the-Loop Override: Carrier Rate Reallocation',
    description: 'Approved automated carrier re-routing for 1,420 high-risk shipments moving through Chicago hub.',
    durationMs: 4200,
    status: 'success',
    severity: 'high',
    details: {
      promptOrGoal: 'Approve $240,000 carrier contract re-allocation to ApexFreight',
      approver: 'Elena Rostova (ID: USR-84021)',
      hash: 'sha256:7f8a9e21b4c3d8e5f1029384756abcdef1234567890abcdef1234567890abc',
      inputParams: {
        targetCarrier: 'ApexFreight Logistics',
        reallocatedVolume: 1420,
        projectedSavingsUsd: 185000,
        riskScoreThreshold: 0.75,
      },
      outputSummary: 'Action dispatched to TMS execution API. 1,420 shipments rerouted with zero customer delay.',
    },
  },
  {
    id: 'ACT-98213',
    timestamp: '2026-08-07T20:24:45Z',
    relativeTime: '7 mins ago',
    actor: {
      name: 'Guardrail & Safety Node',
      role: 'Security Agent',
      avatarType: 'system',
    },
    eventType: 'guardrail_policy',
    actionTitle: 'Enforced Financial Exposure Constraint ($> $100k Intervention)',
    description: 'Autonomous action paused because projected financial impact ($240k) exceeded the unassisted threshold ($100k).',
    durationMs: 42,
    status: 'escalated',
    severity: 'critical',
    details: {
      guardrailChecks: [
        { rule: 'Financial Exposure Floor ($100,000 cap)', passed: false, score: 240000 },
        { rule: 'Model Prediction Confidence (> 85%)', passed: true, score: 0.942 },
        { rule: 'Data Leakage Verification', passed: true, score: 1.0 },
      ],
      hash: 'sha256:8899aabbccddeeff00112233445566778899aabbccddeeff0011223344556677',
      outputSummary: 'Dispatched HITLApprovalCard to active user session. Execution paused awaiting human signature.',
    },
  },
  {
    id: 'ACT-98212',
    timestamp: '2026-08-07T20:24:18Z',
    relativeTime: '8 mins ago',
    actor: {
      name: 'Analysis & ML Agent',
      role: 'Autonomous Reasoning Worker',
      avatarType: 'agent',
    },
    eventType: 'agent_execution',
    actionTitle: 'Computed TreeSHAP Attributions & Counterfactual Recourse',
    description: 'Generated Shapley values across 24 logistics features for 200,000 transaction instances in DuckDB.',
    durationMs: 384,
    status: 'success',
    severity: 'medium',
    details: {
      promptOrGoal: 'Explain root causes of Q3 SLA breaches in Midwest logistics network',
      sqlOrCode: `import shap
explainer = shap.TreeExplainer(champion_model)
shap_values = explainer.shap_values(midwest_transactions_df)
recourse = dice_explainer.generate_counterfactuals(instance, total_CFs=3)`,
      toolCalls: [
        { toolName: 'duckdb_query_executor', durationMs: 48, status: 'success' },
        { toolName: 'tree_shap_explainer', durationMs: 242, status: 'success' },
        { toolName: 'dice_recourse_optimizer', durationMs: 94, status: 'success' },
      ],
      hash: 'sha256:3344556677889900aabbccddeeff00112233445566778899aabbccddeeff0011',
    },
  },
  {
    id: 'ACT-98211',
    timestamp: '2026-08-07T20:23:50Z',
    relativeTime: '8 mins ago',
    actor: {
      name: 'Data Agent',
      role: 'SQL & Database Worker',
      avatarType: 'agent',
    },
    eventType: 'sql_query',
    actionTitle: 'Executed Analytical Join on Logistics & Weather Telemetry',
    description: 'Joined 200k orders against NOAA weather severe storm alerts partitioned by 3-digit postal prefix.',
    durationMs: 118,
    status: 'success',
    severity: 'low',
    details: {
      sqlOrCode: `SELECT 
    t.order_id, 
    t.carrier_id, 
    t.distance_km, 
    w.weather_severity, 
    t.transit_time_hrs, 
    t.sla_breached
FROM read_parquet('data/enterprise_logistics_transactions.parquet') t
LEFT JOIN read_parquet('data/noaa_weather_telemetry.parquet') w 
    ON t.dest_postal_prefix = w.postal_prefix
WHERE t.region = 'Midwest' AND t.quarter = 'Q3';`,
      hash: 'sha256:11223344556677889900aabbccddeeff00112233445566778899aabbccddeeff',
      outputSummary: 'Returned 48,120 rows in 118ms. 0 null values detected in target join key.',
    },
  },
  {
    id: 'ACT-98210',
    timestamp: '2026-08-07T20:20:05Z',
    relativeTime: '12 mins ago',
    actor: {
      name: 'Model Registry Worker',
      role: 'MLOps Pipeline',
      avatarType: 'system',
    },
    eventType: 'model_retrain',
    actionTitle: 'Promoted LightGBM v1.9.2 to Production Champion Model',
    description: 'Challenger model exceeded champion ROC-AUC threshold (0.942 vs 0.938) on 50k out-of-time test set.',
    durationMs: 14200,
    status: 'success',
    severity: 'medium',
    details: {
      inputParams: {
        modelId: 'model-lgbm-sla-v19',
        targetMetric: 'roc_auc',
        achievedScore: 0.942,
        f1Score: 0.884,
        latencyP95Ms: 8.4,
      },
      hash: 'sha256:5566778899aabbccddeeff00112233445566778899aabbccddeeff0011223344',
      outputSummary: 'Updated live model alias champion_sla_classifier. Traffic routed 100% to v1.9.2.',
    },
  },
  {
    id: 'ACT-98209',
    timestamp: '2026-08-07T20:15:30Z',
    relativeTime: '16 mins ago',
    actor: {
      name: 'Orchestrator Agent',
      role: 'LangGraph State Controller',
      avatarType: 'agent',
    },
    eventType: 'agent_execution',
    actionTitle: 'Autonomous Sub-Graph Routing: Dispatched 4 Concurrent Workers',
    description: 'Parsed natural language prompt and decomposed into SQL retrieval, correlation analysis, and report drafting.',
    durationMs: 54,
    status: 'success',
    severity: 'low',
    details: {
      promptOrGoal: 'Investigate margin leakage on Q3 Midwest carrier contracts',
      hash: 'sha256:66778899aabbccddeeff00112233445566778899aabbccddeeff001122334455',
    },
  },
]

export const activityService = {
  getStats: async (): Promise<ActivityStats> => {
    return {
      totalEvents: 1482,
      agentInvocations: 842,
      humanApprovals: 34,
      guardrailBlocked: 12,
      meanLatencyMs: 142,
      systemVerificationHash: 'SHA-256: 7f8a9e21b4c3d8e5f1029384756',
    }
  },

  getEvents: async (filters?: ActivityFilterOptions): Promise<ActivityEvent[]> => {
    if (!USE_MOCK_API) {
      return apiClient<ActivityEvent[]>({
        url: '/api/v1/activity/events',
        method: 'GET',
        params: filters,
      })
    }

    let filtered = [...MOCK_ACTIVITY_EVENTS]
    if (filters?.eventType && filters.eventType !== 'all') {
      filtered = filtered.filter(e => e.eventType === filters.eventType)
    }
    if (filters?.status && filters.status !== 'all') {
      filtered = filtered.filter(e => e.status === filters.status)
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase()
      filtered = filtered.filter(e => 
        e.actionTitle.toLowerCase().includes(q) ||
        e.actor.name.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.details.hash.toLowerCase().includes(q)
      )
    }
    return filtered
  },
}
