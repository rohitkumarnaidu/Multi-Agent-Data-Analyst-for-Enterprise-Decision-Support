import React from 'react'
import { Card } from '@/shared/ui/Card'
import { Badge } from '@/shared/ui/Badge'
import { Button } from '@/shared/ui/Button'
import { ShieldCheck, Lock, AlertTriangle, CheckCircle2 } from 'lucide-react'
import type { HITLPolicy } from '@/shared/types'

interface HITLPoliciesCardProps {
  policies: HITLPolicy[]
  onTogglePolicy: (policyId: string, enabled: boolean) => void
  isToggling: boolean
}

export const HITLPoliciesCard: React.FC<HITLPoliciesCardProps> = ({
  policies,
  onTogglePolicy,
  isToggling,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div>
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />
            Human-in-the-Loop (HITL) Guardrail Policies
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Deterministic governance rules that automatically intercept and pause autonomous agent execution for human review.
          </p>
        </div>

        <Badge variant="success" size="sm" pulseDot>
          Active Enforcement
        </Badge>
      </div>

      <div className="space-y-3">
        {policies.map(pol => (
          <div
            key={pol.id}
            className={`p-4 rounded-xl border transition-all ${
              pol.enabled
                ? 'bg-slate-950/80 border-slate-800'
                : 'bg-slate-950/40 border-slate-900 opacity-60'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-slate-100">{pol.name}</span>
                  {pol.requireDualApproval && (
                    <Badge variant="warning" size="sm">
                      <Lock className="h-3 w-3 mr-1" />
                      Dual Lead Approval
                    </Badge>
                  )}
                  <Badge variant={pol.enabled ? 'success' : 'outline'} size="sm">
                    {pol.enabled ? 'ENFORCED' : 'BYPASSED'}
                  </Badge>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {pol.description}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  size="xs"
                  variant={pol.enabled ? 'outline' : 'primary'}
                  onClick={() => onTogglePolicy(pol.id, !pol.enabled)}
                  isLoading={isToggling}
                >
                  {pol.enabled ? 'Disable Policy' : 'Enable Policy'}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default HITLPoliciesCard
