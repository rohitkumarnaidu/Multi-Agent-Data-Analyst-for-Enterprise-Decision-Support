import React from 'react'
import { TrendingUp, Sparkles, RefreshCw, Download } from 'lucide-react'
import { Button } from '../../../shared/ui/Button'
import { Badge } from '../../../shared/ui/Badge'
import { ScenarioPreset } from '../../../services/forecastingService'

interface ForecastingHeaderProps {
  presets: ScenarioPreset[]
  selectedPresetId: string
  onSelectPreset: (preset: ScenarioPreset) => void
  onRunSimulation: () => void
  isSimulating: boolean
}

export const ForecastingHeader: React.FC<ForecastingHeaderProps> = ({
  presets,
  selectedPresetId,
  onSelectPreset,
  onRunSimulation,
  isSimulating,
}) => {
  return (
    <div className="flex flex-col gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800/80 text-sky-600 dark:text-sky-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                  Forecasting & Scenario Simulation Engine
                </h1>
                <Badge variant="primary" size="sm">
                  Dual-Tier Engine
                </Badge>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Closed-form deterministic calculation + 5,000-run Monte Carlo simulation with predictive confidence fan bands.
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
            Export Brief
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={onRunSimulation}
            disabled={isSimulating}
            isLoading={isSimulating}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Recalculate Model
          </Button>
        </div>
      </div>

      {/* Preset Scenarios Selector Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pt-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 whitespace-nowrap flex items-center gap-1.5 mr-2">
          <Sparkles className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
          Preset Scenarios:
        </span>
        {presets.map(p => {
          const isSelected = p.id === selectedPresetId
          return (
            <button
              key={p.id}
              onClick={() => onSelectPreset(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 border whitespace-nowrap cursor-pointer ${
                isSelected
                  ? 'bg-sky-50 dark:bg-sky-950/60 border-sky-300 dark:border-sky-700 text-sky-700 dark:text-sky-300 font-semibold shadow-xs'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <span>{p.name}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                  isSelected
                    ? 'bg-sky-200 dark:bg-sky-800 text-sky-900 dark:text-sky-100'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                }`}
              >
                {p.badge}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
