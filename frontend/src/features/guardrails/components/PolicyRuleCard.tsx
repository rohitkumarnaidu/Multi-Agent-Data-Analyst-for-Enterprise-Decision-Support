import React from 'react'
import { ShieldCheck, ShieldAlert, AlertTriangle, Sliders, ToggleLeft, ToggleRight } from 'lucide-react'
import { GuardrailPolicy } from '../../../services/guardrailService'
import { Card } from '../../../shared/ui/Card'
import { Badge } from '../../../shared/ui/Badge'

interface PolicyRuleCardProps {
  policy: GuardrailPolicy
  onToggleEnabled: (id: string) => void
  onChangeStrictness: (id: string, strictness: 'strict' | 'advisory' | 'disabled') => void
  onChangeThreshold: (id: string, value: number) => void
}

export const PolicyRuleCard: React.FC<PolicyRuleCardProps> = ({
  policy,
  onToggleEnabled,
  onChangeStrictness,
  onChangeThreshold,
}) => {
  return (
    <Card
      glow={policy.enabled ? (policy.strictness === 'strict' ? 'emerald' : 'amber') : 'none'}
      className={`p-4 transition-all ${
        policy.enabled ? 'bg-cyber-card/90 border-cyber-border' : 'bg-slate-950/60 border-slate-800 opacity-60'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-xs text-cyber-cyan font-bold">{policy.id}</span>
            <h4 className="text-sm font-bold text-cyber-text">{policy.name}</h4>
            <Badge variant="outline" className="text-[10px] uppercase">
              {policy.category}
            </Badge>
          </div>
          <p className="text-xs text-cyber-muted">{policy.description}</p>
        </div>

        {/* Master Enable/Disable Toggle */}
        <button
          onClick={() => onToggleEnabled(policy.id)}
          className="p-1 rounded-lg text-cyber-muted hover:text-cyber-cyan transition-colors"
          title={policy.enabled ? 'Disable Policy' : 'Enable Policy'}
        >
          {policy.enabled ? (
            <ToggleRight className="w-6 h-6 text-cyber-emerald" />
          ) : (
            <ToggleLeft className="w-6 h-6 text-slate-600" />
          )}
        </button>
      </div>

      {/* Strictness Level Selector & Threshold Slider */}
      {policy.enabled && (
        <div className="mt-4 pt-3 border-t border-cyber-border/40 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-cyber-muted">Enforcement Mode:</span>
            <div className="flex items-center gap-1">
              {(['strict', 'advisory', 'disabled'] as const).map(s => {
                const isSelected = policy.strictness === s
                return (
                  <button
                    key={s}
                    onClick={() => onChangeStrictness(policy.id, s)}
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all uppercase ${
                      isSelected
                        ? s === 'strict'
                          ? 'bg-cyber-emerald/20 text-cyber-emerald border border-cyber-emerald/40'
                          : s === 'advisory'
                          ? 'bg-cyber-amber/20 text-cyber-amber border border-cyber-amber/40'
                          : 'bg-slate-800 text-slate-400'
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {s}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Threshold Slider (if applicable) */}
          {policy.thresholdValue !== undefined && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-cyber-muted font-medium">Safety Trigger Threshold:</span>
                <span className="font-mono font-bold text-cyber-cyan">
                  {policy.thresholdUnit === '$' ? '$' : ''}
                  {policy.thresholdValue.toLocaleString()}
                  {policy.thresholdUnit !== '$' ? ` ${policy.thresholdUnit}` : ''}
                </span>
              </div>
              <input
                type="range"
                min={policy.thresholdMin || 0}
                max={policy.thresholdMax || 500000}
                step={policy.thresholdStep || 5000}
                value={policy.thresholdValue}
                onChange={e => onChangeThreshold(policy.id, parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyber-cyan"
              />
            </div>
          )}
        </div>
      )}
    </Card>
  )
}
