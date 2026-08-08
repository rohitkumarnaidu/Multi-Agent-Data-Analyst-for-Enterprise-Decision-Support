import React from 'react'
import { Activity, ShieldCheck, Download, KeyRound } from 'lucide-react'
import { Button } from '../../../shared/ui/Button'
import { Badge } from '../../../shared/ui/Badge'

interface ActivityHeaderProps {
  systemVerificationHash: string
  onExport: () => void
}

export const ActivityHeader: React.FC<ActivityHeaderProps> = ({
  systemVerificationHash,
  onExport,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
      <div>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800/80 text-sky-600 dark:text-sky-400">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                Activity Stream & Audit Trail
              </h1>
              <Badge variant="success" size="sm" className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Immutable Ledger
              </Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              SOC2 Type II compliant log of agent runs, human approval decisions, and analytical executions.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-lg px-3 py-1.5 font-mono text-xs text-slate-600 dark:text-slate-400">
          <KeyRound className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
          <span className="text-slate-500">Hash:</span>
          <span className="text-sky-700 dark:text-sky-300 font-semibold">{systemVerificationHash}</span>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onExport}
          leftIcon={<Download className="w-3.5 h-3.5" />}
        >
          Export Audit JSON
        </Button>
      </div>
    </div>
  )
}
