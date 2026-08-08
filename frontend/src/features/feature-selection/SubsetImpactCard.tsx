import React, { useState } from 'react'
import { Card } from '@/shared/ui/Card'
import { Badge } from '@/shared/ui/Badge'
import { Button } from '@/shared/ui/Button'
import {
  TrendingUp,
  Zap,
  HardDrive,
  Download,
  Copy,
  Check,
  CheckCircle2,
  FileCode,
} from 'lucide-react'
import type { FeatureSubsetImpact } from '@/shared/types'

interface SubsetImpactCardProps {
  impact: FeatureSubsetImpact
  selectedFeatures: string[]
}

export const SubsetImpactCard: React.FC<SubsetImpactCardProps> = ({
  impact,
  selectedFeatures,
}) => {
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null)

  const handleExport = (format: 'json' | 'yaml' | 'sql') => {
    let payload = ''
    if (format === 'json') {
      payload = JSON.stringify(
        {
          target: impact.targetMetric,
          feature_count: selectedFeatures.length,
          selected_features: selectedFeatures,
          generated_at: new Date().toISOString(),
        },
        null,
        2
      )
    } else if (format === 'yaml') {
      payload = `target_metric: ${impact.targetMetric}\nfeature_count: ${selectedFeatures.length}\nfeatures:\n${selectedFeatures.map(f => `  - ${f}`).join('\n')}`
    } else {
      payload = `SELECT ${selectedFeatures.join(', ')} FROM transactions_200k;`
    }

    navigator.clipboard.writeText(payload)
    setCopiedFormat(format)
    setTimeout(() => setCopiedFormat(null), 1500)
  }

  const r2Retention = ((impact.estimatedR2 / impact.baselineR2) * 100).toFixed(1)

  return (
    <Card glow="cyan" className="p-6 bg-slate-900/90 border-slate-800 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-cyan-400" />
            Live Feature Subset Impact Preview
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Evaluating performance trade-offs vs Full 12-Feature Baseline for target:{' '}
            <span className="font-mono text-cyan-400">{impact.targetMetric}</span>
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            size="xs"
            variant="subtle"
            onClick={() => handleExport('json')}
            leftIcon={
              copiedFormat === 'json' ? (
                <Check className="h-3 w-3 text-emerald-400" />
              ) : (
                <Copy className="h-3 w-3" />
              )
            }
          >
            {copiedFormat === 'json' ? 'Copied' : 'JSON'}
          </Button>
          <Button
            size="xs"
            variant="subtle"
            onClick={() => handleExport('yaml')}
            leftIcon={
              copiedFormat === 'yaml' ? (
                <Check className="h-3 w-3 text-emerald-400" />
              ) : (
                <Copy className="h-3 w-3" />
              )
            }
          >
            {copiedFormat === 'yaml' ? 'Copied' : 'YAML'}
          </Button>
          <Button
            size="xs"
            variant="primary"
            onClick={() => handleExport('sql')}
            leftIcon={
              copiedFormat === 'sql' ? (
                <Check className="h-3 w-3 text-emerald-400" />
              ) : (
                <FileCode className="h-3 w-3" />
              )
            }
          >
            {copiedFormat === 'sql' ? 'Copied SQL' : 'Export SQL'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
          <div className="text-[10px] text-slate-400 uppercase">Model Retention (R²)</div>
          <div className="text-xl font-bold text-slate-100 mt-0.5">
            {impact.estimatedR2}{' '}
            <span className="text-xs text-slate-400 font-normal">/ {impact.baselineR2}</span>
          </div>
          <div className="text-[11px] text-emerald-400">{r2Retention}% Predictive Signal Retained</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
          <div className="text-[10px] text-slate-400 uppercase">ROC-AUC Discrim.</div>
          <div className="text-xl font-bold text-cyan-300 mt-0.5">
            {impact.estimatedAuc}{' '}
            <span className="text-xs text-slate-400 font-normal">/ {impact.baselineAuc}</span>
          </div>
          <div className="text-[11px] text-slate-400">Class Separation Quality</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
          <div className="text-[10px] text-slate-400 uppercase">Inference Speedup</div>
          <div className="text-xl font-bold text-purple-300 mt-0.5">
            {impact.trainingSpeedupFactor}x
          </div>
          <div className="text-[11px] text-emerald-400">Faster Tree Partitioning</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
          <div className="text-[10px] text-slate-400 uppercase">Memory Saved</div>
          <div className="text-xl font-bold text-emerald-400 mt-0.5">
            {impact.memorySavedPct}%
          </div>
          <div className="text-[11px] text-slate-400">
            {impact.selectedCount} of {impact.totalCount} Features Selected
          </div>
        </div>
      </div>
    </Card>
  )
}

export default SubsetImpactCard
