import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/shared/ui/Card'
import { Badge } from '@/shared/ui/Badge'
import { Button } from '@/shared/ui/Button'
import {
  useFeatureRankings,
  useSubsetImpact,
} from '@/hooks/useFeatureSelection'
import { ConsensusRankingTable } from '@/features/feature-selection/ConsensusRankingTable'
import { VIFMonitorCard } from '@/features/feature-selection/VIFMonitorCard'
import { SubsetImpactCard } from '@/features/feature-selection/SubsetImpactCard'
import {
  Layers,
  Sparkles,
  Sliders,
  CheckCircle2,
  Filter,
  RefreshCw,
  TrendingUp,
} from 'lucide-react'

export const FeatureSelectionPage: React.FC = () => {
  const [targetMetric, setTargetMetric] = useState('gross_margin_pct')
  const { data: rankings, isLoading } = useFeatureRankings(targetMetric)

  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])

  // Initialize selected features from rankings
  useEffect(() => {
    if (rankings && selectedFeatures.length === 0) {
      setSelectedFeatures(rankings.filter(r => r.isSelected).map(r => r.featureName))
    }
  }, [rankings])

  const { data: impact } = useSubsetImpact(targetMetric, selectedFeatures)

  const handleToggleFeature = (featureName: string) => {
    setSelectedFeatures(prev =>
      prev.includes(featureName) ? prev.filter(f => f !== featureName) : [...prev, featureName]
    )
  }

  const handleSelectTopK = (k: number) => {
    if (!rankings) return
    const topKNames = rankings.slice(0, k).map(r => r.featureName)
    setSelectedFeatures(topKNames)
  }

  const handleAutoPruneCollinear = () => {
    if (!rankings) return
    const safeNames = rankings.filter(r => r.vifStatus !== 'high').map(r => r.featureName)
    setSelectedFeatures(safeNames)
  }

  const handleSelectAll = () => {
    if (!rankings) return
    setSelectedFeatures(rankings.map(r => r.featureName))
  }

  const handleDeselectAll = () => {
    setSelectedFeatures([])
  }

  return (
    <div className="space-y-6">
      {/* 1. Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-100">
              Feature Selection & Stability Ranking
            </h1>
            <Badge variant="cyber" size="sm">
              4-Method Consensus
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Ensemble feature importance combining Mutual Information, Random Forest, LASSO L1, and XGBoost Gain with VIF multicollinearity pruning.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="success" size="sm" pulseDot>
            {selectedFeatures.length} of {rankings?.length || 12} Features Active
          </Badge>
        </div>
      </div>

      {/* 2. Target Variable & Quick Selection Toolbar */}
      <Card glow="none" className="p-4 bg-slate-900/90 border-slate-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Filter className="h-4 w-4 text-cyan-400" />
              Optimization Target:
            </span>
            <div className="flex gap-1.5 flex-wrap">
              {['gross_margin_pct', 'sla_breached', 'anomaly_score'].map(target => (
                <button
                  key={target}
                  onClick={() => {
                    setTargetMetric(target)
                    setSelectedFeatures([]) // Reset selection on target change
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                    targetMetric === target
                      ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40 shadow-glow-cyan'
                      : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-700/60'
                  }`}
                >
                  {target}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-slate-400 font-mono">Quick Presets:</span>
            <Button size="xs" variant="subtle" onClick={() => handleSelectTopK(5)}>
              Top 5
            </Button>
            <Button size="xs" variant="subtle" onClick={() => handleSelectTopK(8)}>
              Top 8 (Recommended)
            </Button>
            <Button size="xs" variant="subtle" onClick={handleAutoPruneCollinear}>
              Prune Collinear
            </Button>
            <Button size="xs" variant="outline" onClick={handleSelectAll}>
              Select All
            </Button>
            <Button size="xs" variant="ghost" onClick={handleDeselectAll}>
              Clear
            </Button>
          </div>
        </div>
      </Card>

      {/* 3. Live Subset Impact Preview Card */}
      {impact && (
        <SubsetImpactCard impact={impact} selectedFeatures={selectedFeatures} />
      )}

      {/* 4. VIF Multicollinearity Pruning Guard */}
      {rankings && (
        <VIFMonitorCard
          rankings={rankings}
          onAutoPruneCollinear={handleAutoPruneCollinear}
        />
      )}

      {/* 5. Main 4-Method Consensus Ranking Table */}
      <Card glow="none" className="p-6 bg-slate-900/90 border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
          <div>
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Layers className="h-4 w-4 text-cyan-400" />
              Multi-Method Consensus Feature Matrix
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Features ranked by normalized harmonic mean across all 4 algorithmic selectors.
            </p>
          </div>

          <Badge variant="outline" size="sm">
            Target: {targetMetric}
          </Badge>
        </div>

        {rankings && (
          <ConsensusRankingTable
            rankings={rankings}
            selectedFeatures={selectedFeatures}
            onToggleFeature={handleToggleFeature}
            onSelectAll={handleSelectAll}
            onDeselectAll={handleDeselectAll}
          />
        )}
      </Card>
    </div>
  )
}

export default FeatureSelectionPage
