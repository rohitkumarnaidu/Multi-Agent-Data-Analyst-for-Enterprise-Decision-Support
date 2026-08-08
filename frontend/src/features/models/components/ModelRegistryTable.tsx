import React from 'react'
import { Badge } from '@/shared/ui/Badge'
import { Button } from '@/shared/ui/Button'
import { ShieldCheck, Award, Eye, ArrowUpRight } from 'lucide-react'
import type { ModelArtifact } from '@/shared/types'

interface ModelRegistryTableProps {
  models: ModelArtifact[]
  selectedModelId: string
  onSelectModel: (model: ModelArtifact) => void
  onPromoteModel: (modelId: string) => void
}

const frameworkColors: Record<string, string> = {
  xgboost: 'text-amber-400 bg-amber-950/40 border-amber-500/30',
  lightgbm: 'text-cyan-400 bg-cyan-950/40 border-cyan-500/30',
  'scikit-learn': 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30',
  prophet: 'text-purple-400 bg-purple-950/40 border-purple-500/30',
  pytorch: 'text-rose-400 bg-rose-950/40 border-rose-500/30',
}

export const ModelRegistryTable: React.FC<ModelRegistryTableProps> = ({
  models,
  selectedModelId,
  onSelectModel,
  onPromoteModel,
}) => {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800">
      <table className="w-full text-left text-xs font-mono">
        <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
          <tr>
            <th className="p-3">Model Name & Version</th>
            <th className="p-3">Framework</th>
            <th className="p-3">Task Type</th>
            <th className="p-3">Target Variable</th>
            <th className="p-3">Status</th>
            <th className="p-3 text-right">Primary Metric</th>
            <th className="p-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60 text-slate-200">
          {models.map(model => {
            const isSelected = model.id === selectedModelId
            const isChampion = model.status === 'champion'

            const primaryMetric =
              model.metrics.roc_auc !== undefined
                ? `ROC-AUC: ${model.metrics.roc_auc}`
                : model.metrics.r2 !== undefined
                ? `R²: ${model.metrics.r2}`
                : model.metrics.mape !== undefined
                ? `MAPE: ${model.metrics.mape}%`
                : 'N/A'

            return (
              <tr
                key={model.id}
                onClick={() => onSelectModel(model)}
                className={`cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-cyan-500/10 border-l-2 border-l-cyan-400'
                    : 'hover:bg-slate-800/40'
                }`}
              >
                <td className="p-3">
                  <div className="font-bold text-slate-100">{model.name}</div>
                  <div className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                    <span>{model.version}</span>
                    <span>•</span>
                    <span>{model.datasetVersion}</span>
                  </div>
                </td>

                <td className="p-3">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${
                      frameworkColors[model.framework] || 'text-slate-300'
                    }`}
                  >
                    {model.framework}
                  </span>
                </td>

                <td className="p-3">
                  <span className="capitalize text-slate-300">
                    {model.taskType.replace('_', ' ')}
                  </span>
                </td>

                <td className="p-3 text-cyan-300 font-semibold">{model.targetVariable}</td>

                <td className="p-3">
                  <Badge
                    variant={
                      isChampion
                        ? 'success'
                        : model.status === 'challenger'
                        ? 'cyber'
                        : 'outline'
                    }
                    size="sm"
                    pulseDot={isChampion}
                  >
                    {model.status.toUpperCase()}
                  </Badge>
                </td>

                <td className="p-3 text-right font-bold text-emerald-400">
                  {primaryMetric}
                </td>

                <td className="p-3 text-center" onClick={e => e.stopPropagation()}>
                  <div className="flex items-center justify-center gap-1.5">
                    <Button
                      size="xs"
                      variant={isSelected ? 'primary' : 'subtle'}
                      onClick={() => onSelectModel(model)}
                    >
                      Inspect
                    </Button>

                    {model.status === 'challenger' && (
                      <Button
                        size="xs"
                        variant="success"
                        onClick={() => onPromoteModel(model.id)}
                        leftIcon={<Award className="h-3 w-3" />}
                      >
                        Promote
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default ModelRegistryTable
