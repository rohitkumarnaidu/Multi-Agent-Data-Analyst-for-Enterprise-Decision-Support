import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/shared/ui/Card'
import { Badge } from '@/shared/ui/Badge'
import { Button } from '@/shared/ui/Button'
import { Tabs } from '@/shared/ui/Tabs'
import { useModels, usePromoteModel } from '@/hooks/useModels'
import { ModelRegistryTable } from '@/features/models/components/ModelRegistryTable'
import { HyperparametersCard } from '@/features/models/components/HyperparametersCard'
import { ValidationCharts } from '@/features/models/components/ValidationCharts'
import { PredictionPlayground } from '@/features/models/components/PredictionPlayground'
import {
  Cpu,
  Layers,
  Award,
  Sparkles,
  Zap,
  Sliders,
  CheckCircle2,
  Activity,
  History,
} from 'lucide-react'
import type { ModelArtifact } from '@/shared/types'

export const ModelsPage: React.FC = () => {
  const { data: models, isLoading } = useModels()
  const [selectedModelId, setSelectedModelId] = useState<string>('model-lgbm-sla-v19')
  const [activeTab, setActiveTab] = useState<'validation' | 'hyperparameters' | 'playground'>('validation')
  const [promotionMessage, setPromotionMessage] = useState<string | null>(null)

  const { mutate: promoteModel, isPending: isPromoting } = usePromoteModel()

  const selectedModel = (models || []).find(m => m.id === selectedModelId) || models?.[0]

  const handlePromote = (modelId: string) => {
    promoteModel(modelId, {
      onSuccess: res => {
        setPromotionMessage(res.message)
        setTimeout(() => setPromotionMessage(null), 4000)
      },
    })
  }

  const tabs = [
    { id: 'validation', label: 'Evaluation Metrics & Curves' },
    { id: 'hyperparameters', label: 'Hyperparameters & MLflow' },
    { id: 'playground', label: 'Live Prediction Playground' },
  ]

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-100">
              Enterprise Model Center & Registry
            </h1>
            <Badge variant="cyber" size="sm">
              MLflow Production
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Champion/Challenger model registry, ROC-AUC validation curves, hyperparameter provenance, and sub-15ms live inference.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="success" size="sm" pulseDot>
            3 Champion Models Active
          </Badge>
        </div>
      </div>

      {/* Promotion Toast */}
      {promotionMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-xs font-mono text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{promotionMessage}</span>
        </div>
      )}

      {/* 2. Model Registry Leaderboard Table */}
      <Card glow="none" className="p-6 bg-slate-900/90 border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
          <div>
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Cpu className="h-4 w-4 text-cyan-400" />
              Model Artifacts Registry
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Click any model row to inspect validation curves, hyperparameter tuning signatures, and live inference.
            </p>
          </div>

          <Badge variant="outline" size="sm">
            {models?.length || 5} Tracked Versions
          </Badge>
        </div>

        {models && (
          <ModelRegistryTable
            models={models}
            selectedModelId={selectedModelId}
            onSelectModel={m => setSelectedModelId(m.id)}
            onPromoteModel={handlePromote}
          />
        )}
      </Card>

      {/* 3. Selected Model Deep Dive Panel */}
      {selectedModel && (
        <Card glow="cyan" className="p-6 bg-slate-900/90 border-slate-800 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-100">
                  {selectedModel.name}
                </h2>
                <Badge
                  variant={
                    selectedModel.status === 'champion'
                      ? 'success'
                      : selectedModel.status === 'challenger'
                      ? 'cyber'
                      : 'outline'
                  }
                  size="sm"
                  pulseDot={selectedModel.status === 'champion'}
                >
                  {selectedModel.status.toUpperCase()}
                </Badge>
                <Badge variant="outline" size="sm">
                  {selectedModel.version}
                </Badge>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 font-mono">
                Target Variable: <span className="text-cyan-300 font-bold">{selectedModel.targetVariable}</span> •
                Framework: <span className="uppercase text-amber-300 font-bold">{selectedModel.framework}</span>
              </p>
            </div>

            {selectedModel.status === 'challenger' && (
              <Button
                size="sm"
                variant="success"
                onClick={() => handlePromote(selectedModel.id)}
                isLoading={isPromoting}
                leftIcon={<Award className="h-4 w-4" />}
              >
                Promote to Champion
              </Button>
            )}
          </div>

          <Tabs
            tabs={tabs}
            activeTab={activeTab}
            onChange={t => setActiveTab(t as any)}
            variant="underline"
          />

          {/* Tab 1: Validation Curves */}
          {activeTab === 'validation' && (
            <ValidationCharts model={selectedModel} />
          )}

          {/* Tab 2: Hyperparameters & MLflow */}
          {activeTab === 'hyperparameters' && (
            <HyperparametersCard model={selectedModel} />
          )}

          {/* Tab 3: Live Prediction Playground */}
          {activeTab === 'playground' && (
            <PredictionPlayground model={selectedModel} />
          )}
        </Card>
      )}
    </div>
  )
}

export default ModelsPage
