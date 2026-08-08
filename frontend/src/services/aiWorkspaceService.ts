import { simulateLatency, USE_MOCK_API, apiClient } from './apiClient'
import type {
  AskRequest,
  AskResponse,
  ApprovalPayload,
  AgentNodeData,
  ToolExecutionStep,
} from '@/shared/types'

export const INITIAL_AGENT_NODES: AgentNodeData[] = [
  {
    id: 'orchestrator',
    label: 'Orchestrator Agent',
    role: 'Supervisor & Intent Routing',
    status: 'idle',
    toolCallCount: 0,
  },
  {
    id: 'knowledge',
    label: 'Knowledge & RAG',
    role: 'Vector Store & Schema Metadata',
    status: 'idle',
    toolCallCount: 0,
  },
  {
    id: 'data',
    label: 'Data Retrieval Agent',
    role: 'DuckDB SQL Generator & Executor',
    status: 'idle',
    toolCallCount: 0,
  },
  {
    id: 'analysis',
    label: 'Statistical Analysis Agent',
    role: 'Correlation & Aggregation Engine',
    status: 'idle',
    toolCallCount: 0,
  },
  {
    id: 'anomaly',
    label: 'Anomaly Detection Agent',
    role: 'XGBoost Isolation & SHAP Scorer',
    status: 'idle',
    toolCallCount: 0,
  },
  {
    id: 'simulation',
    label: 'Scenario Simulator',
    role: 'Tier 1 Math & Tier 2 ML Monte Carlo',
    status: 'idle',
    toolCallCount: 0,
  },
  {
    id: 'validator',
    label: 'Guardrails Validator',
    role: 'Hallucination Check & Schema Compliance',
    status: 'idle',
    toolCallCount: 0,
  },
  {
    id: 'narrative',
    label: 'Narrative Synthesis Agent',
    role: 'Executive Summary & Business Context',
    status: 'idle',
    toolCallCount: 0,
  },
  {
    id: 'memory',
    label: 'Memory & Context Agent',
    role: 'Cross-Session Semantic State',
    status: 'idle',
    toolCallCount: 0,
  },
  {
    id: 'report',
    label: 'Report Generator',
    role: 'Document & PDF Artifact Formatter',
    status: 'idle',
    toolCallCount: 0,
  },
]

const sampleResponsesByKeyword: Record<string, Partial<AskResponse>> = {
  'department': {
    answer: `### Executive Departmental Performance Summary (FY2026)

Based on the synthesis of **200,000 transaction records** in DuckDB:

1. **Logistics & Supply Chain**:
   - **Net Revenue**: **$8.24M** (33.2% total share)
   - **Gross Margin**: **31.4%** (Target: 30.0%)
   - **On-Time Delivery SLA**: **99.1%** (Exceeds SLA threshold)
2. **Enterprise Commercial Sales**:
   - **Net Revenue**: **$7.42M** (29.9% share)
   - **Gross Margin**: **42.1%** (Highest margin driver)
   - **On-Time SLA**: **97.8%**
3. **Cloud Infrastructure & SaaS**:
   - **Net Revenue**: **$4.81M** (19.4% share)
   - **Gross Margin**: **38.5%**
   - **On-Time SLA**: **99.9%** (Best-in-class SLA)
4. **Customer Success & Support**:
   - **Net Revenue**: **$2.58M** (10.4% share)
   - **Gross Margin**: **22.8%** (Degraded margin due to Q2 warranty replacements)
   - **On-Time SLA**: **96.5%**
5. **Financial Operations & Billing**:
   - **Net Revenue**: **$1.79M** (7.2% share)
   - **Gross Margin**: **29.0%**
   - **On-Time SLA**: **98.9%**

#### Strategic Recommendation:
Reallocate **$350k** in operational buffer from High-Performing Cloud SaaS into **Customer Success & Support automation** to recover gross margin to baseline **28.0%**.`,
    confidence: 0.96,
    confidence_label: 'High',
    confidence_reason: '100% of 200,000 records queried without sampling degradation. Zero nulls in department dimension.',
    approval_required: false,
    chart_spec: {
      chart_type: 'bar',
      title: 'Department Revenue ($M) vs Gross Margin (%)',
      data: {
        categories: ['Logistics', 'Enterprise Sales', 'Cloud SaaS', 'Support', 'Billing'],
        series: [
          { name: 'Revenue ($M)', data: [8.24, 7.42, 4.81, 2.58, 1.79] },
          { name: 'Gross Margin (%)', data: [31.4, 42.1, 38.5, 22.8, 29.0] },
        ],
      },
    },
  },
  'anomaly': {
    answer: `### High-Exposure Anomaly Audit Report

The **Anomaly Detection Agent** (powered by **XGBoost Isolation Scorer & SHAP Explainer**) identified **18 critical transactions** exceeding the **0.85 anomaly threshold**, totaling **$340,800** in exposed financial risk.

#### Critical Incident Breakdown:
- **TX-94821** (Logistics & Supply Chain) — **Risk Score: 0.942**
  - **Financial Exposure**: **$142,500**
  - **Root Cause**: Freight surcharge multiplier (3.8x baseline) triggered by unverified expedited air freight exception.
- **INV-88231** (Enterprise Sales) — **Risk Score: 0.884**
  - **Financial Exposure**: **$89,200**
  - **Root Cause**: Discount override applied at 32.5% exceeding the 25% executive margin floor.
- **TX-94772** (Customer Success) — **Risk Score: 0.812**
  - **Financial Exposure**: **$54,100**
  - **Root Cause**: Automated customer refund loop triggered across 14 identical APAC ticket IDs.

#### Governance & Action Required:
A hold has been requested on the carrier settlement batch for **TX-94821**. Human approval is required to confirm the payment freeze.`,
    confidence: 0.92,
    confidence_label: 'High',
    confidence_reason: 'XGBoost Isolation Forest output validated with TreeSHAP force values.',
    approval_required: true,
    recommended_action: {
      action: 'Freeze carrier payout for TX-94821 and initiate Level-2 compliance audit',
      owner: 'Lead Risk Officer',
      priority: 'critical',
      expected_impact: 'Prevents $142,500 unauthorized freight disbursement',
      requires_approval: true,
      approval_status: 'pending',
    },
  },
  'simulation': {
    answer: `### Scenario Simulation: Supply Chain Inflation (+12%) & Demand Growth (+5%)

The **Scenario Simulation Agent** executed both Tier-1 closed-form math and Tier-2 XGBoost ML sensitivity modeling:

#### Projected Impact on Core Financials:
- **Baseline Net Profit**: **$8.50M** (Gross Margin: 34.21%)
- **Projected Net Profit**: **$9.21M** (+8.35% YoY increase)
- **Projected Gross Margin**: **33.72%** (-49 bps margin compression)
- **Projected Net Revenue**: **$26.08M** (+5.00% volume-driven expansion)
- **Projected COGS**: **$16.87M** (+17.6% driven by compounded inflation + volume)

#### 95% Confidence Interval:
- Lower Bound: **$8.74M**
- Upper Bound: **$9.67M**
- Empirical Variance: $\pm 4.9\%$ across 1,000 Monte Carlo draws.

#### Risk Advisory:
Despite positive net profit growth, gross margin compresses by 49 bps. A targeted **2.5% price index adjustment** in the freight surcharge tier will fully neutralize margin erosion.`,
    confidence: 0.94,
    confidence_label: 'High',
    confidence_reason: 'Tier 1 closed-form verified; Tier 2 Monte Carlo converged over 1,000 iterations.',
    approval_required: false,
    chart_spec: {
      chart_type: 'line',
      title: 'Monte Carlo Profit Probability Density ($M)',
      data: {
        categories: ['$8.4M', '$8.7M', '$9.0M', '$9.2M (Mean)', '$9.4M', '$9.7M', '$10.0M'],
        series: [
          { name: 'Probability Density', data: [0.05, 0.18, 0.35, 0.42, 0.28, 0.12, 0.03] },
        ],
      },
    },
  },
}

export const aiWorkspaceService = {
  async askQuestion(request: AskRequest): Promise<AskResponse> {
    if (USE_MOCK_API) {
      await simulateLatency(800)
      const qLower = request.question.toLowerCase()
      let matchedData = sampleResponsesByKeyword['department']

      if (qLower.includes('anomaly') || qLower.includes('flagged') || qLower.includes('risk') || qLower.includes('audit')) {
        matchedData = sampleResponsesByKeyword['anomaly']
      } else if (qLower.includes('simulate') || qLower.includes('scenario') || qLower.includes('inflation') || qLower.includes('elasticity')) {
        matchedData = sampleResponsesByKeyword['simulation']
      }

      const toolExecutions: ToolExecutionStep[] = [
        {
          id: 'step-1',
          toolName: 'duckdb_sql_query',
          displayName: 'DuckDB Semantic Aggregator',
          category: 'database',
          status: 'completed',
          startedAt: '12:00:01',
          durationMs: 42,
          inputPayload: {
            sql: `SELECT department, SUM(net_revenue_usd) AS revenue, AVG(gross_margin_pct) AS margin FROM transactions_200k GROUP BY department ORDER BY revenue DESC;`,
          },
          outputPayload: { rows_returned: 5, execution_time_ms: 41.8 },
        },
        {
          id: 'step-2',
          toolName: 'xgboost_isolation_scorer',
          displayName: 'XGBoost Risk Evaluator',
          category: 'ml',
          status: 'completed',
          startedAt: '12:00:02',
          durationMs: 118,
          inputPayload: { threshold: 0.85, target_dimension: 'gross_margin_pct' },
          outputPayload: { anomalies_flagged: 18, max_score: 0.942 },
        },
        {
          id: 'step-3',
          toolName: 'guardrails_output_validator',
          displayName: 'Governance Validator',
          category: 'governance',
          status: 'completed',
          startedAt: '12:00:03',
          durationMs: 15,
          inputPayload: { compliance_rules: ['zero_drop_check', 'pii_sanitization', 'hallucination_filter'] },
          outputPayload: { status: 'passed', violations_found: 0 },
        },
      ]

      return {
        answer: matchedData.answer || 'Analysis complete across 200,000 transaction records.',
        confidence: matchedData.confidence ?? 0.95,
        confidence_label: matchedData.confidence_label ?? 'High',
        confidence_reason: matchedData.confidence_reason ?? 'Full dataset queried with verified SQL aggregations.',
        chart_spec: matchedData.chart_spec,
        approval_required: matchedData.approval_required ?? false,
        recommended_action: matchedData.recommended_action,
        low_sample_size: false,
        is_out_of_scope: false,
        is_degraded: false,
        metadata: {
          query_used: `SELECT department, SUM(net_revenue_usd) AS revenue FROM transactions_200k GROUP BY department;`,
          records_analyzed: 200000,
          processing_time_sec: 1.24,
          agents_invoked: ['Orchestrator', 'Data Retrieval', 'Analysis Engine', 'Anomaly Scorer', 'Validator'],
          steps_taken: 5,
          llm_provider: 'Groq Cloud',
          model_used: 'llama-3.3-70b-versatile',
        },
        timestamp: new Date().toISOString(),
        reference_date: '2026-08-08',
        trace: [
          { agent: 'Orchestrator', action: 'Parsed intent, classified as Multi-Agent Analytical Query', duration_sec: 0.12 },
          { agent: 'Knowledge & RAG', action: 'Retrieved DuckDB schema and semantic metrics for department dimension', duration_sec: 0.18 },
          { agent: 'Data Retrieval', action: 'Executed vector-verified SQL query on 200k records in DuckDB', duration_sec: 0.04 },
          { agent: 'Analysis Agent', action: 'Calculated margin ratios, YoY trends, and variance bounds', duration_sec: 0.22 },
          { agent: 'Validator Agent', action: 'Ran guardrails validation, verified zero hallucinated metrics', duration_sec: 0.15 },
          { agent: 'Narrative Agent', action: 'Synthesized executive markdown briefing with strategic recommendations', duration_sec: 0.53 },
        ],
        tool_executions: toolExecutions,
      }
    }

    return apiClient<AskResponse>({
      url: `/api/ask`,
      method: 'POST',
      data: request,
    })
  },

  async submitApproval(payload: ApprovalPayload): Promise<{ success: boolean; message: string }> {
    if (USE_MOCK_API) {
      await simulateLatency(300)
      return {
        success: true,
        message: payload.approved
          ? `Action approved and recorded in governance audit trail.`
          : `Action rejected: "${payload.reason || 'No reason provided'}". State updated.`,
      }
    }
    return apiClient<{ success: boolean; message: string }>({
      url: `/api/approval/submit`,
      method: 'POST',
      data: payload,
    })
  },
}
