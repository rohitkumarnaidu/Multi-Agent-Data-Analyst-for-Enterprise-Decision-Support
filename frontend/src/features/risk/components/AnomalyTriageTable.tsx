import React from 'react'
import { AlertOctagon, ArrowUpRight, Zap, CheckCircle2, Bot } from 'lucide-react'
import { RiskAnomaly } from '../../../services/riskService'
import { Card } from '../../../shared/ui/Card'
import { Badge } from '../../../shared/ui/Badge'
import { useNavigate } from 'react-router-dom'

interface AnomalyTriageTableProps {
  anomalies: RiskAnomaly[]
  onSelectRemediate: (anomaly: RiskAnomaly) => void
}

export const AnomalyTriageTable: React.FC<AnomalyTriageTableProps> = ({
  anomalies,
  onSelectRemediate,
}) => {
  const navigate = useNavigate()

  return (
    <Card glow="none" className="p-4 bg-cyber-card/90 border-cyber-border">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-cyber-text">
            Prioritized Operational Incident Triage Queue
          </h3>
          <p className="text-xs text-cyber-muted">
            Ranked by risk score, financial exposure, and contract SLA impact.
          </p>
        </div>
        <span className="text-xs text-cyber-muted font-mono">
          {anomalies.length} Flagged Events
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-cyber-border/60 text-cyber-muted font-semibold">
              <th className="py-2.5 px-3">Incident ID & Time</th>
              <th className="py-2.5 px-3">Category</th>
              <th className="py-2.5 px-3">Carrier / Route Target</th>
              <th className="py-2.5 px-3">Exposure ($)</th>
              <th className="py-2.5 px-3">SLA Failure</th>
              <th className="py-2.5 px-3">Root Cause & AI Recourse</th>
              <th className="py-2.5 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cyber-border/30">
            {anomalies.map(a => (
              <tr key={a.id} className="hover:bg-cyber-card/60 transition-colors">
                <td className="py-3 px-3">
                  <span className="font-mono font-bold text-cyber-cyan block">{a.id}</span>
                  <span className="text-[10px] text-cyber-muted">{a.timestamp}</span>
                </td>
                <td className="py-3 px-3">
                  <Badge
                    variant={
                      a.severity === 'critical'
                        ? 'destructive'
                        : a.severity === 'high'
                        ? 'warning'
                        : 'default'
                    }
                    className="text-[10px]"
                  >
                    {a.category}
                  </Badge>
                </td>
                <td className="py-3 px-3 font-medium text-cyber-text">
                  <span>{a.carrierOrRoute}</span>
                  <span className="block text-[10px] text-slate-400 font-normal">{a.region}</span>
                </td>
                <td className="py-3 px-3 font-mono font-bold text-cyber-rose">
                  ${a.financialExposureUsd.toLocaleString()}
                </td>
                <td className="py-3 px-3 font-mono font-semibold text-cyber-amber">
                  {a.slaBreachPct}%
                </td>
                <td className="py-3 px-3 max-w-xs">
                  <p className="text-[11px] text-cyber-text line-clamp-1">{a.rootCause}</p>
                  <p className="text-[10px] text-cyan-400 line-clamp-1 mt-0.5 flex items-center gap-1">
                    <Bot className="w-3 h-3 shrink-0" />
                    {a.aiRecommendation}
                  </p>
                </td>
                <td className="py-3 px-3 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => navigate('/workspace/ai')}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                      title="Investigate in AI Workspace"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onSelectRemediate(a)}
                      className="px-2.5 py-1.5 rounded-lg bg-cyber-rose/20 text-cyber-rose hover:bg-cyber-rose/30 font-semibold text-xs transition-colors flex items-center gap-1"
                    >
                      <Zap className="w-3 h-3" />
                      Mitigate
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
