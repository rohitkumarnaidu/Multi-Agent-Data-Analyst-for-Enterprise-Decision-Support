import React from 'react'
import { ShieldCheck, RefreshCw } from 'lucide-react'
import { Button } from '../../../shared/ui/Button'
import { Badge } from '../../../shared/ui/Badge'

interface GuardrailsHeaderProps {
  onResetDefaults: () => void
  onSavePolicies: () => void
  isSaving: boolean
}

export const GuardrailsHeader: React.FC<GuardrailsHeaderProps> = ({
  onResetDefaults,
  onSavePolicies,
  isSaving,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
      <div>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                Enterprise AI Guardrails & Governance
              </h1>
              <Badge variant="success" size="sm" className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Active Runtime Enforcement
              </Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Deterministic boundary controls, prompt injection defense, automated PII masking, and financial safety limits.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onResetDefaults}
        >
          Reset Defaults
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={onSavePolicies}
          disabled={isSaving}
          isLoading={isSaving}
          leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
        >
          Save & Publish Rules
        </Button>
      </div>
    </div>
  )
}
