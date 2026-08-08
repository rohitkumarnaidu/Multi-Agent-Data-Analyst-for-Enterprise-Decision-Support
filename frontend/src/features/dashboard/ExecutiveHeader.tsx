import React from 'react'
import { Sparkles, Download, RefreshCw, ShieldCheck } from 'lucide-react'
import { Button } from '@/shared/ui/Button'
import { Select } from '@/shared/ui/Select'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/shared/ui/Toast'

interface ExecutiveHeaderProps {
  timeframe: string
  onTimeframeChange: (val: string) => void
  onRefresh: () => void
  isRefreshing?: boolean
}

export const ExecutiveHeader: React.FC<ExecutiveHeaderProps> = ({
  timeframe,
  onTimeframeChange,
  onRefresh,
  isRefreshing,
}) => {
  const navigate = useNavigate()
  const { showToast } = useToast()

  const handleExport = () => {
    showToast({
      title: 'Generating Boardroom Report',
      message: 'Compiling executive KPI aggregates, charts, and risk summaries to PDF...',
      type: 'info',
    })
    setTimeout(() => {
      navigate('/workspace/reports')
    }, 800)
  }

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Executive Decision Dashboard
          </h1>
          <span className="flex items-center gap-1 rounded-md bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300">
            <ShieldCheck className="h-3 w-3" />
            Live Sync
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Operational intelligence synthesized across 50,000 carrier shipments and multi-agent analytics.
        </p>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {/* Timeframe Selector */}
        <div className="w-36">
          <Select
            value={timeframe}
            onChange={e => onTimeframeChange(e.target.value)}
            options={[
              { value: 'YTD 2026', label: 'YTD 2026' },
              { value: 'Q3 2026', label: 'Q3 2026' },
              { value: 'Q2 2026', label: 'Q2 2026' },
              { value: 'Last 30 Days', label: 'Last 30 Days' },
              { value: 'Full Year 2025', label: 'Full Year 2025' },
            ]}
          />
        </div>

        {/* Refresh Button */}
        <Button
          size="sm"
          variant="secondary"
          isLoading={isRefreshing}
          leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
          onClick={onRefresh}
          title="Refresh Data"
        >
          Refresh
        </Button>

        {/* Golden Prompt Briefing */}
        <Button
          size="sm"
          variant="primary"
          leftIcon={<Sparkles className="h-3.5 w-3.5" />}
          onClick={() => navigate('/workspace/ai?prompt=GT-01')}
        >
          Run AI Briefing
        </Button>

        {/* Export PDF */}
        <Button
          size="sm"
          variant="outline"
          leftIcon={<Download className="h-3.5 w-3.5" />}
          onClick={handleExport}
        >
          Export PDF
        </Button>
      </div>
    </div>
  )
}
