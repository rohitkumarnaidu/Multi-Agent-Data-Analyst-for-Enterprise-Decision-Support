import React from 'react'
import { Card } from '@/shared/ui/Card'
import { Badge } from '@/shared/ui/Badge'
import { Sliders, Cpu, User, Calendar, Database, Hash } from 'lucide-react'
import type { ModelArtifact } from '@/shared/types'

interface HyperparametersCardProps {
  model: ModelArtifact
}

export const HyperparametersCard: React.FC<HyperparametersCardProps> = ({ model }) => {
  const hyperEntries = Object.entries(model.hyperparameters)

  return (
    <div className="space-y-4">
      {/* 1. Training Provenance Metadata */}
      <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2.5">
        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <Database className="h-3.5 w-3.5 text-cyan-400" />
          Model Metadata & MLflow Lineage
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div>
            <div className="text-[10px] text-slate-500">Author</div>
            <div className="text-slate-200 truncate mt-0.5">{model.author}</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-500">Trained At</div>
            <div className="text-slate-200 mt-0.5">{model.trainedAt}</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-500">Dataset Version</div>
            <div className="text-cyan-300 font-bold mt-0.5">{model.datasetVersion}</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-500">MLflow Run ID</div>
            <div className="text-purple-300 truncate mt-0.5">{model.mlflowRunId}</div>
          </div>
        </div>
      </div>

      {/* 2. Hyperparameter Configuration Grid */}
      <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2.5">
        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <Sliders className="h-3.5 w-3.5 text-cyan-400" />
          Hyperparameter Configuration
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-xs">
          {hyperEntries.map(([key, val]) => (
            <div
              key={key}
              className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 flex flex-col justify-between"
            >
              <span className="text-[10px] text-slate-400">{key}</span>
              <span className="font-bold text-cyan-300 mt-1">{String(val)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default HyperparametersCard
