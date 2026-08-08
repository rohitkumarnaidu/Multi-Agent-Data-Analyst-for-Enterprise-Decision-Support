import React from 'react'
import { X, ShieldAlert, CheckCircle2, DollarSign, Bot, ArrowRight } from 'lucide-react'
import { RiskAnomaly } from '../../../services/riskService'
import { Button } from '../../../shared/ui/Button'
import { Badge } from '../../../shared/ui/Badge'

interface RemediationModalProps {
  anomaly: RiskAnomaly | null
  onClose: () => void
  onConfirm: () => void
  isRemediating: boolean
}

export const RemediationModal: React.FC<RemediationModalProps> = ({
  anomaly,
  onClose,
  onConfirm,
  isRemediating,
}) => {
  if (!anomaly) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-slate-950 border border-cyber-border rounded-2xl p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-cyber-border/60">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="destructive" className="text-xs">
                {anomaly.severity.toUpperCase()} PRIORITY
              </Badge>
              <span className="font-mono text-xs text-cyber-cyan">{anomaly.id}</span>
            </div>
            <h2 className="text-lg font-bold text-cyber-text">
              Execute Autonomous Remediation
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Incident Summary Card */}
        <div className="p-3.5 bg-cyber-card/60 border border-cyber-border/40 rounded-xl space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-cyber-muted">Target Carrier / Route:</span>
            <span className="font-semibold text-cyber-text">{anomaly.carrierOrRoute}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-cyber-muted">Financial Exposure:</span>
            <span className="font-bold text-cyber-rose">${anomaly.financialExposureUsd.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-cyber-muted">SLA Failure Rate:</span>
            <span className="font-bold text-cyber-amber">{anomaly.slaBreachPct}%</span>
          </div>
        </div>

        {/* Prescriptive Recommendation */}
        <div className="p-4 bg-cyan-950/20 border border-cyber-cyan/30 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-cyber-cyan">
            <Bot className="w-4 h-4" />
            <span>AI Prescriptive Action Plan</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {anomaly.aiRecommendation}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-cyber-border/60 flex items-center justify-end gap-3">
          <Button variant="outline" size="sm" onClick={onClose} disabled={isRemediating}>
            Cancel
          </Button>
          <Button
            variant="cyber"
            size="sm"
            onClick={onConfirm}
            disabled={isRemediating}
            className="flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            {isRemediating ? 'Executing Action...' : 'Approve & Trigger Mitigation'}
          </Button>
        </div>
      </div>
    </div>
  )
}
