import React, { useState } from 'react'
import { Card } from '@/shared/ui/Card'
import { Badge } from '@/shared/ui/Badge'
import { Button } from '@/shared/ui/Button'
import { Slider } from '@/shared/ui/Slider'
import { useModelPredict } from '@/hooks/useModels'
import { Play, Zap, CheckCircle2, Clock } from 'lucide-react'
import type { ModelArtifact, ModelPredictionResponse } from '@/shared/types'

interface PredictionPlaygroundProps {
  model: ModelArtifact
}

export const PredictionPlayground: React.FC<PredictionPlaygroundProps> = ({ model }) => {
  const [cogs, setCogs] = useState<number>(450)
  const [latency, setLatency] = useState<number>(4.2)
  const [discount, setDiscount] = useState<number>(5.0)

  const { mutate: runPredict, data: prediction, isPending } = useModelPredict()

  const handleRunInference = () => {
    runPredict({
      modelId: model.id,
      features: {
        cogs_usd: cogs,
        fulfillment_latency_days: latency,
        discount_applied_pct: discount,
      },
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
        <div>
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Zap className="h-3.5 w-3.5 text-cyan-400" />
            Live What-If Inference Engine
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Test real-time predictions by simulating transaction feature attributes against {model.name}.
          </p>
        </div>

        <Button
          size="sm"
          variant="primary"
          onClick={handleRunInference}
          isLoading={isPending}
          leftIcon={<Play className="h-3.5 w-3.5" />}
        >
          Execute Prediction
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Slider 1: COGS */}
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">COGS (Cost of Goods):</span>
            <span className="font-bold text-cyan-300">${cogs}</span>
          </div>
          <Slider
            min={50}
            max={2500}
            step={25}
            value={cogs}
            onChange={v => setCogs(Number(v))}
          />
        </div>

        {/* Slider 2: Latency */}
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">Transit Latency (Days):</span>
            <span className="font-bold text-cyan-300">{latency} d</span>
          </div>
          <Slider
            min={0.5}
            max={15.0}
            step={0.5}
            value={latency}
            onChange={v => setLatency(Number(v))}
          />
        </div>

        {/* Slider 3: Discount */}
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">Discount Applied (%):</span>
            <span className="font-bold text-cyan-300">{discount}%</span>
          </div>
          <Slider
            min={0}
            max={40}
            step={1}
            value={discount}
            onChange={v => setDiscount(Number(v))}
          />
        </div>
      </div>

      {/* Output Display */}
      {prediction && (
        <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono">
          <div className="space-y-1">
            <div className="text-[10px] text-cyan-400 uppercase font-bold tracking-wider">
              Predicted Output ({prediction.units})
            </div>
            <div className="text-2xl font-bold text-slate-100">
              {prediction.prediction}
            </div>
            <div className="text-xs text-slate-400">
              95% Confidence Bounds: [{prediction.confidenceLow} - {prediction.confidenceHigh}]
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs flex items-center gap-1.5 text-slate-300">
              <Clock className="h-3.5 w-3.5 text-cyan-400" />
              <span>Inference Latency: <b>{prediction.latencyMs}ms</b></span>
            </div>
            <Badge variant="success" size="sm" pulseDot>
              Live Validated
            </Badge>
          </div>
        </div>
      )}
    </div>
  )
}

export default PredictionPlayground
