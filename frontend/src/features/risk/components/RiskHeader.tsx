import React from 'react'
import { AlertOctagon, RefreshCw, Download, ShieldAlert } from 'lucide-react'
import { Button } from '../../../shared/ui/Button'
import { Badge } from '../../../shared/ui/Badge'

interface RiskHeaderProps {
  totalAnomalies: number
  onScan: () => void
  isScanning: boolean
}

export const RiskHeader: React.FC<RiskHeaderProps> = ({
  totalAnomalies,
  onScan,
  isScanning,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
      <div>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800/80 text-rose-600 dark:text-rose-400">
            <AlertOctagon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                Risk & Anomaly Command Center
              </h1>
              <Badge variant="destructive" size="sm" className="flex items-center gap-1">
                <ShieldAlert className="w-3 h-3" />
                {totalAnomalies} Flagged Anomalies
              </Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Automated operational risk detection, high-exposure carrier bottlenecks, and prescriptive mitigation workflows.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.print()}
          leftIcon={<Download className="w-3.5 h-3.5" />}
        >
          Export Risk Report
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={onScan}
          disabled={isScanning}
          isLoading={isScanning}
          leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
        >
          Run Anomaly Scan
        </Button>
      </div>
    </div>
  )
}
