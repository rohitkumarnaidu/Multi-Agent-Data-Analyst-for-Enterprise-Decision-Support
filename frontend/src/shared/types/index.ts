// ==========================================
// Multi-Agent Enterprise Data Analyst Type Definitions
// ==========================================

export type AgentNodeId =
  | 'orchestrator'
  | 'knowledge'
  | 'data'
  | 'analysis'
  | 'simulation'
  | 'anomaly'
  | 'narrative'
  | 'validator'
  | 'memory'
  | 'report'

export type NodeExecutionStatus = 'idle' | 'waiting' | 'running' | 'completed' | 'retry' | 'failed' | 'requires_approval'

export interface AgentNodeData extends Record<string, unknown> {
  id: AgentNodeId
  label: string
  role: string
  status: NodeExecutionStatus
  executionTimeSec?: number
  confidence?: number
  summary?: string
  toolCallCount?: number
  activeTool?: string
  error?: string
}

export type ToolStatus = 'idle' | 'running' | 'completed' | 'failed'

export interface ToolExecutionStep {
  id: string
  toolName: string
  displayName: string
  category: 'knowledge' | 'database' | 'ml' | 'visualization' | 'governance' | 'export'
  status: ToolStatus
  startedAt?: string
  durationMs?: number
  inputPayload?: Record<string, unknown> | string
  outputPayload?: Record<string, unknown> | string
  error?: string
}

export interface TraceStep {
  agent: string
  action: string
  duration_sec: number
  details?: Record<string, unknown>
}

export interface ChartSpec {
  chart_type: 'bar' | 'line' | 'pie' | 'scatter' | 'heatmap' | 'waterfall' | 'sankey' | 'treemap' | 'radar' | 'table'
  title: string
  data: Record<string, unknown>
  layout?: Record<string, unknown>
}

export interface ResponseMetadata {
  query_used?: string
  records_analyzed: number
  processing_time_sec: number
  agents_invoked: string[]
  steps_taken: number
  llm_provider: string
  model_used: string
}

export interface RecommendedAction {
  action: string
  owner: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  expected_impact: string
  requires_approval: boolean
  approval_status?: 'pending' | 'approved' | 'rejected' | 'modified'
  modified_action?: string
  approval_reason?: string
}

export interface AskRequest {
  question: string
  session_id?: string
  include_simulation?: boolean
  simulation_tier?: 1 | 2
}

export interface AskResponse {
  answer: string
  confidence: number
  confidence_label: 'High' | 'Medium' | 'Low'
  confidence_reason: string
  chart_spec?: ChartSpec
  trace: TraceStep[]
  recommended_action?: RecommendedAction
  approval_required: boolean
  low_sample_size: boolean
  is_out_of_scope: boolean
  is_degraded: boolean
  metadata: ResponseMetadata
  timestamp: string
  reference_date: string
  tool_executions?: ToolExecutionStep[]
}

export interface ApprovalPayload {
  session_id: string
  approved: boolean
  modified_action?: string
  reason?: string
}

export interface HealthResponse {
  status: string
  version: string
  data_loaded: boolean
  model_loaded: boolean
  llm_provider: string
  reference_date: string
  database_type: string
  vector_store_type: string
}

// Session & Conversation Types
export interface ChatSession {
  id: string
  title: string
  createdAt: string
  updatedAt: string
  lastQuestion: string
  isPinned?: boolean
  tags: string[]
  category: 'revenue' | 'operations' | 'risk' | 'simulation' | 'methodology' | 'general'
}

export interface GoldenQuestion {
  id: string
  category: string
  title: string
  prompt: string
  expectedNodeType: AgentNodeId
  description: string
  sampleOutputHint: string
}

// Dashboard & KPI Types
export interface KPIMetric {
  name: string
  value: string | number
  change_pct: number
  period: string
  status: 'positive' | 'negative' | 'neutral' | 'warning'
}

export interface AnomalyRecord {
  id: string
  recordId: string
  department: string
  model: string
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
  anomalyScore: number
  financialImpact: number
  detectedAt: string
  suggestedAction: string
}

export interface WhatIfScenarioResult {
  scenario_name: string
  baseline_metrics: {
    revenue: number
    gross_margin_pct: number
    net_profit: number
  }
  simulated_metrics: {
    revenue: number
    gross_margin_pct: number
    net_profit: number
  }
  delta_pct: {
    revenue: number
    gross_margin: number
    net_profit: number
  }
  confidence_intervals: {
    lower_bound: number
    upper_bound: number
    confidence_level: number
  }
  risk_flags?: string[]
}

export interface ExecutiveKPIs {
  totalRevenueImpactUSD: number
  totalCostSavingsUSD: number
  totalGrossMarginUSD: number
  slaBreachRatePct: number
  anomalyCount: number
  totalRecordsProcessed: number
  avgQueryProcessingTimeSec: number
  avgTokensPerSecond: number
  graphTraversalLatencySec: number
  llmDistribution: {
    primaryGroqPct: number
    fallbackOllamaPct: number
  }
  humanReviewRatePct: number
}

// Dataset & Schema Types
export interface ColumnSchema {
  column_name: string
  inferred_type: string
  null_count: number
  cardinality: number
  classification: 'identifier' | 'dimension' | 'measure' | 'temporal'
  is_pii: boolean
  outlier_count: number
}

export interface DatasetSummary {
  id: string
  name: string
  fileName: string
  totalRows: number
  totalColumns: number
  fileSizeBytes: number
  format: 'parquet' | 'csv' | 'duckdb'
  lastUpdated: string
  dataQualityScore: number
  zeroDropPolicyCompliant: boolean
  piiMaskedCount: number
}

// Semantic Metrics
export interface SemanticMetric {
  name: string
  sql: string
  allowed_dimensions: string[]
  description: string
  category: 'financial' | 'operational' | 'ai_performance' | 'quality'
  formulaExplanation?: string
}

// Feature Store Types
export interface FeatureItem {
  name: string
  type: 'float' | 'int' | 'categorical' | 'datetime' | 'boolean'
  category: 'temporal' | 'business' | 'ai' | 'temporal_aggregate' | 'temporal_lag' | 'ranking'
  version: string
  owner: string
  status: 'Production' | 'Staging' | 'Experimental'
  description?: string
  importanceScore?: number
  nullRatePct?: number
  meanValue?: number
  stdDev?: number
  driftStatus?: 'stable' | 'warning' | 'drifted'
  psiScore?: number
}

export interface FeatureDriftReport {
  featureName: string
  baselineMean: number
  productionMean: number
  ksStatistic: number
  pValue: number
  psiScore: number
  status: 'stable' | 'warning' | 'drifted'
  lastEvaluated: string
}

export interface LineageNode {
  id: string
  label: string
  type: 'source' | 'pipeline' | 'storage' | 'feature_store' | 'model' | 'consumption'
  technology: string
  recordCount?: number
  sla?: string
  status: 'healthy' | 'warning' | 'syncing'
}

export interface LineageEdge {
  id: string
  source: string
  target: string
  label?: string
  latencyMs?: number
}

// EDA Studio Types
export interface EDAVariableStats {
  name: string
  inferredType: 'numeric' | 'categorical' | 'temporal'
  count: number
  nullCount: number
  uniqueCount: number
  mean?: number
  median?: number
  stdDev?: number
  min?: number
  max?: number
  p25?: number
  p75?: number
  skewness?: number
  kurtosis?: number
  outlierCount?: number
}

export interface CorrelationMatrixResponse {
  features: string[]
  matrix: number[][] // [i][j] correlation value between -1.0 and 1.0
}

export interface DistributionBin {
  bin: string
  count: number
  kde: number
}

export interface BoxPlotRecord {
  group: string
  min: number
  q1: number
  median: number
  q3: number
  max: number
  outliers: number[]
}

export interface StatisticalHypothesisTest {
  id: string
  testName: string
  hypothesis: string
  targetVariable: string
  groupingVariable: string
  testStatistic: number
  pValue: number
  significanceLevel: number
  isSignificant: boolean
  effectSize: string
  aiInterpretation: string
}

// Feature Selection Types
export interface FeatureRankingItem {
  featureName: string
  category: 'business' | 'temporal' | 'ai' | 'temporal_aggregate' | 'temporal_lag'
  mutualInfoScore: number
  rfScore: number
  lassoScore: number
  xgbScore: number
  consensusScore: number
  consensusRank: number
  vifScore: number
  vifStatus: 'low' | 'moderate' | 'high'
  isSelected: boolean
}

export interface FeatureSubsetImpact {
  targetMetric: string
  selectedCount: number
  totalCount: number
  estimatedR2: number
  baselineR2: number
  estimatedAuc: number
  baselineAuc: number
  trainingSpeedupFactor: number
  memorySavedPct: number
  collinearFeaturesPruned: number
}

// Model Center & Registry Types
export type ModelFramework = 'xgboost' | 'lightgbm' | 'scikit-learn' | 'prophet' | 'pytorch'
export type ModelTaskType = 'regression' | 'classification' | 'time_series' | 'anomaly_detection'
export type ModelDeploymentStatus = 'champion' | 'challenger' | 'shadow' | 'retired'

export interface ModelArtifact {
  id: string
  name: string
  framework: ModelFramework
  version: string
  taskType: ModelTaskType
  status: ModelDeploymentStatus
  targetVariable: string
  datasetVersion: string
  trainedAt: string
  author: string
  mlflowRunId: string
  metrics: {
    r2?: number
    rmse?: number
    mae?: number
    mape?: number
    roc_auc?: number
    pr_auc?: number
    f1_score?: number
    precision?: number
    recall?: number
    accuracy?: number
  }
  hyperparameters: Record<string, any>
  confusionMatrix?: {
    tp: number
    fp: number
    fn: number
    tn: number
  }
  rocCurve?: Array<{ fpr: number; tpr: number; threshold: number }>
  prCurve?: Array<{ precision: number; recall: number; threshold: number }>
}

export interface ModelPredictionResponse {
  prediction: number
  confidenceLow: number
  confidenceHigh: number
  latencyMs: number
  units: string
}

// Explainability & XAI Types
export interface GlobalSHAPFeature {
  featureName: string
  meanAbsoluteShap: number
  direction: 'positive' | 'negative' | 'bidirectional'
  points: Array<{
    featureValueNorm: number // 0 (Low/Blue) to 1 (High/Red)
    shapValue: number
  }>
}

export interface LocalWaterfallItem {
  featureName: string
  actualValue: string | number
  shapValue: number
  runningTotal: number
}

export interface LocalExplanation {
  transactionId: string
  modelName: string
  baseValue: number
  predictedValue: number
  units: string
  waterfall: LocalWaterfallItem[]
  limeSurrogateR2: number
  agentReasoning: string
}

export interface CounterfactualRecourse {
  featureName: string
  currentValue: string | number
  targetValue: string | number
  difficulty: 'easy' | 'moderate' | 'hard'
  impactDescription: string
}

// Enterprise Reports Types
export type ReportType = 'executive_brief' | 'operational_audit' | 'risk_assessment' | 'sla_compliance'
export type ReportStatus = 'published' | 'draft' | 'scheduled'

export interface ReportKeyMetric {
  label: string
  value: string
  delta?: string
  status: 'positive' | 'negative' | 'neutral'
}

export interface ReportArtifact {
  id: string
  title: string
  type: ReportType
  status: ReportStatus
  author: string
  generatedAt: string
  readTimeMinutes: number
  summary: string
  keyMetrics: ReportKeyMetric[]
  markdownContent: string
  tags: string[]
}

// Governance & Administration Types
export interface LLMConfig {
  primaryModel: string
  fastModel: string
  embeddingModel: string
  temperature: number
  maxTokens: number
  enableStreaming: boolean
  apiKeyStatus: 'configured' | 'missing' | 'vault_secured'
}

export interface HITLPolicy {
  id: string
  name: string
  description: string
  thresholdType: 'financial_impact' | 'model_confidence' | 'risk_severity'
  thresholdValue: number
  requireDualApproval: boolean
  enabled: boolean
}

export interface AuditLogEntry {
  id: string
  timestamp: string
  actor: string
  action: string
  resource: string
  status: 'success' | 'blocked' | 'escalated'
  details: string
}





// User Profile & Roles
export type UserRole = 'Executive' | 'Lead Data Scientist' | 'Compliance Officer' | 'Risk Manager' | 'Operations Lead'

export interface UserProfile {
  id: string
  name: string
  email: string
  role: UserRole
  avatarUrl?: string
}

// System Notification
export interface SystemNotification {
  id: string
  title: string
  message: string
  type: 'info' | 'warning' | 'error' | 'success' | 'approval_required'
  timestamp: string
  isRead: boolean
  actionUrl?: string
}
