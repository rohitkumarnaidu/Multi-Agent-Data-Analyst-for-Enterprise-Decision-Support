import { simulateLatency, USE_MOCK_API, apiClient } from './apiClient'
import type { ReportArtifact, ReportType } from '@/shared/types'

const initialReports: ReportArtifact[] = [
  {
    id: 'rep-q3-sla-breach-audit',
    title: 'Q3 Enterprise SLA Breach & Margin Leakage Deep-Dive Audit',
    type: 'sla_compliance',
    status: 'published',
    author: 'LangGraph Report Agent (Claude 3.7 Sonnet)',
    generatedAt: '2026-08-07 18:45 UTC',
    readTimeMinutes: 6,
    summary:
      'Comprehensive audit of 200,000 logistics and sales transactions across Q3. Identified $2.4M in annualized margin leakage driven by high fulfillment latency and carrier surcharge overages.',
    tags: ['SLA Compliance', 'Logistics', 'Margin Leakage', 'XGBoost v2.4'],
    keyMetrics: [
      { label: 'Total Audited GMV', value: '$148.2M', delta: '+12.4% YoY', status: 'positive' },
      { label: 'SLA Breach Rate', value: '7.8%', delta: '-1.4% MoM', status: 'positive' },
      { label: 'Identified Leakage', value: '$2.42M', delta: 'High Priority', status: 'negative' },
      { label: 'Predicted Recovery', value: '$1.85M', delta: '76% Recoverable', status: 'positive' },
    ],
    markdownContent: `
# Executive Summary

During the Q3 evaluation cycle, the Multi-Agent Analytics engine ingested and validated **200,000 enterprise transaction records** across five operational hubs. While top-line revenue expanded by **+12.4% YoY** ($148.2M total volume), localized margin compression was observed in high-velocity transit lanes.

### Primary Root Causes Identified:
1. **Third-Party Carrier Latency Surcharges**: Fulfillment latency exceeding 4.5 days triggered expedited air freight penalties, reducing unit gross margins by **-8.4%**.
2. **Uncontrolled Promotional Discounting**: 14% of mid-market tier contracts applied promotional discounts $> 18\%$, eroding gross contribution below target hurdles.
3. **Inventory Re-allocation Friction**: Regional stockout imbalances forced cross-country split shipments.

---

# Key Findings & Quantitative Breakdown

| Operational Category | Audited Volume | Breach Rate | Margin Dilution Impact | Recommended Action |
| :--- | :--- | :--- | :--- | :--- |
| **Tier-1 Carrier Expedited** | 48,200 orders | 4.2% | -$420,000 | Enforce dynamic carrier routing |
| **Regional Freight Splitting** | 22,400 orders | 14.6% | -$1,150,000 | Rebalance West Coast inventory |
| **Commercial Promo Overrides**| 18,900 orders | 9.8% | -$850,000 | Enforce margin floor gating |

---

# Prescriptive Strategic Recommendations

- **Action Item 1 (Immediate)**: Implement real-time margin floor validation at order checkout. Automatically flag any transaction where predicted gross margin drops below **18.0%**.
- **Action Item 2 (30-Day Target)**: Consolidate West Coast split freight shipments to Tier-1 dedicated lanes, capturing an estimated **+$680,000** in quarterly gross margin.
- **Action Item 3 (Governance)**: Retain the Champion **XGBoost Regressor (v2.4.1)** in production with active Drift Sentinel monitors.
`,
  },
  {
    id: 'rep-executive-q3-board-brief',
    title: 'Board of Directors: AI Governance & Decision Support Briefing',
    type: 'executive_brief',
    status: 'published',
    author: 'Principal Analytics Orchestrator',
    generatedAt: '2026-08-06 09:30 UTC',
    readTimeMinutes: 4,
    summary:
      'Executive briefing for the Board of Directors summarizing multi-agent telemetry, human-in-the-loop validation accuracy, and automated decision impact.',
    tags: ['Board Briefing', 'AI Governance', 'ROI', 'HITL'],
    keyMetrics: [
      { label: 'Autonomous Agent Confidence', value: '96.8%', delta: '+2.1% Q3', status: 'positive' },
      { label: 'HITL Review Time', value: '1.4 min', delta: '-45% Efficiency', status: 'positive' },
      { label: 'Annualized Value Generated', value: '$8.4M', delta: '4.8x ROI', status: 'positive' },
      { label: 'Model Drift Score', value: '0.024 PSI', delta: 'Stable (Nominal)', status: 'positive' },
    ],
    markdownContent: `
# Board of Directors Executive Briefing

This briefing provides strategic oversight into the deployment and governance of the **Multi-Agent AI Analytics Platform**.

### Strategic Highlights
- **Decision Velocity**: Mean time to insight across operational datasets decreased from **4.2 business days** to **sub-30 seconds**.
- **Governance & Compliance**: 100% of autonomous tool executions passed cryptographic audit logging and deterministic schema validation.
- **Model Explainability**: All predictive inferences are accompanied by **TreeSHAP additive attributions** and **LIME surrogate fidelity scores ($R^2 > 0.94$)**.
`,
  },
  {
    id: 'rep-risk-monte-carlo-q4',
    title: 'Q4 Enterprise Supply Chain & Pricing Risk Simulation',
    type: 'risk_assessment',
    status: 'published',
    author: 'Simulation Agent (Monte Carlo Core)',
    generatedAt: '2026-08-05 14:15 UTC',
    readTimeMinutes: 8,
    summary:
      'Monte Carlo stress-testing of supply chain disruptions, commodity price volatility, and demand elasticity across 10,000 simulated iterations.',
    tags: ['Risk Center', 'Monte Carlo', 'Stress Test', 'Value at Risk'],
    keyMetrics: [
      { label: '95% Value at Risk (VaR)', value: '$3.8M', delta: 'Under Budget', status: 'positive' },
      { label: 'Worst-Case Margin Shock', value: '14.2%', delta: 'Tail Event (p=0.01)', status: 'negative' },
      { label: 'Hedge Protection Ratio', value: '88.5%', delta: 'Adequate', status: 'positive' },
    ],
    markdownContent: `
# Supply Chain Stress-Testing & Tail-Risk Evaluation

Using a 10,000-path Monte Carlo engine, we simulated extreme macroeconomic scenarios including:
- **Scenario Alpha**: +25% fuel surcharge spike combined with +15% demand surge.
- **Scenario Beta**: Key Tier-1 supplier 14-day outage.

### Simulation Conclusion:
Enterprise pricing buffers are sufficient to absorb fuel shocks up to **+18%** without triggering gross margin deficits. Beyond +18%, dynamic surcharge pass-through mechanisms must be activated.
`,
  },
]

export const reportService = {
  async getReports(): Promise<ReportArtifact[]> {
    if (USE_MOCK_API) {
      await simulateLatency(220)
      return initialReports
    }
    return apiClient<ReportArtifact[]>({ url: '/api/reports' })
  },

  async getReportById(id: string): Promise<ReportArtifact | undefined> {
    if (USE_MOCK_API) {
      await simulateLatency(150)
      return initialReports.find(r => r.id === id)
    }
    return apiClient<ReportArtifact>({ url: `/api/reports/${id}` })
  },

  async generateReport(payload: {
    title: string
    type: ReportType
    targetScope: string
    depth: 'executive' | 'technical'
  }): Promise<ReportArtifact> {
    if (USE_MOCK_API) {
      await simulateLatency(800)
      const newReport: ReportArtifact = {
        id: `rep-gen-${Date.now()}`,
        title: payload.title,
        type: payload.type,
        status: 'published',
        author: 'Report Generation Agent',
        generatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
        readTimeMinutes: payload.depth === 'executive' ? 4 : 9,
        summary: `Custom ${payload.depth} analytics report covering ${payload.targetScope}. Compiled automatically by multi-agent analysis graph.`,
        tags: [payload.type, payload.depth, 'AI Generated'],
        keyMetrics: [
          { label: 'Scope Samples', value: '200,000 records', status: 'neutral' },
          { label: 'Evaluation Confidence', value: '98.2%', status: 'positive' },
          { label: 'Calculated Variance', value: '±1.2%', status: 'positive' },
        ],
        markdownContent: `
# ${payload.title}

### Scope & Methodology
This report was generated on demand for **${payload.targetScope}** utilizing the ${payload.depth} analytical framework.

### Automated Synthesis
All data signals were processed through the **Consensus Feature Selection** and **XGBoost Regressor (v2.4.1)** pipelines with 100% data lineage verification.
        `,
      }
      initialReports.unshift(newReport)
      return newReport
    }
    return apiClient<ReportArtifact>({
      url: '/api/reports/generate',
      method: 'POST',
      data: payload,
    })
  },
}
