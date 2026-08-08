import React from 'react'
import { CheckCircle2, ArrowRight } from 'lucide-react'
import { Card } from '../../../shared/ui/Card'
import { PRESET_SCENARIOS, ScenarioPreset } from '../../../services/forecastingService'

interface ScenarioComparisonTableProps {
  currentScenarioId: string
  onSelectScenario: (preset: ScenarioPreset) => void
}

export const ScenarioComparisonTable: React.FC<ScenarioComparisonTableProps> = ({
  currentScenarioId,
  onSelectScenario,
}) => {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200 dark:border-slate-800">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          Strategic Scenario Comparison Matrix
        </h3>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          Comparative outlook
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-medium">
              <th className="py-2.5 px-3">Scenario</th>
              <th className="py-2.5 px-3">Rate Delta</th>
              <th className="py-2.5 px-3">Expedited</th>
              <th className="py-2.5 px-3">Sim. GMV</th>
              <th className="py-2.5 px-3">Margin</th>
              <th className="py-2.5 px-3">SLA Breach</th>
              <th className="py-2.5 px-3 text-right">Select</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {PRESET_SCENARIOS.map(s => {
              const isCurrent = s.id === currentScenarioId
              return (
                <tr
                  key={s.id}
                  className={`hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors ${
                    isCurrent ? 'bg-sky-50/60 dark:bg-sky-950/30' : ''
                  }`}
                >
                  <td className="py-2.5 px-3 font-medium text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    {isCurrent && <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0" />}
                    <div>
                      <span className={isCurrent ? 'text-sky-600 dark:text-sky-400 font-semibold' : ''}>{s.name}</span>
                      <span className="block text-[10px] text-slate-400 font-normal">{s.badge}</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 font-mono">
                    {s.params.carrierRateDelta > 0 ? '+' : ''}${s.params.carrierRateDelta.toFixed(2)}/km
                  </td>
                  <td className="py-2.5 px-3 font-mono">{s.params.expeditedRatio}%</td>
                  <td className="py-2.5 px-3 font-mono font-semibold text-slate-900 dark:text-slate-100">
                    $152.4M
                  </td>
                  <td className="py-2.5 px-3 font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                    36.2%
                  </td>
                  <td className="py-2.5 px-3 font-mono text-amber-600 dark:text-amber-400">
                    6.4%
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    {isCurrent ? (
                      <span className="text-[11px] font-semibold text-sky-600 dark:text-sky-400">Active</span>
                    ) : (
                      <button
                        onClick={() => onSelectScenario(s)}
                        className="text-[11px] font-medium text-slate-500 hover:text-sky-600 dark:hover:text-sky-400 inline-flex items-center gap-1 cursor-pointer"
                      >
                        Apply <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
