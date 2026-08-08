import React from 'react'
import { Card } from '@/shared/ui/Card'
import { Badge } from '@/shared/ui/Badge'
import { Button } from '@/shared/ui/Button'
import { AlertTriangle, Scissors, CheckCircle2 } from 'lucide-react'
import type { FeatureRankingItem } from '@/shared/types'

interface VIFMonitorCardProps {
  rankings: FeatureRankingItem[]
  onAutoPruneCollinear: () => void
}

export const VIFMonitorCard: React.FC<VIFMonitorCardProps> = ({
  rankings,
  onAutoPruneCollinear,
}) => {
  const collinearFeatures = rankings.filter(r => r.vifStatus === 'high')

  return (
    <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-400" />
          <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
            Multicollinearity & VIF Pruning Guard
          </h3>
        </div>

        {collinearFeatures.length > 0 && (
          <Button
            size="xs"
            variant="destructive"
            onClick={onAutoPruneCollinear}
            leftIcon={<Scissors className="h-3 w-3" />}
          >
            Auto-Prune {collinearFeatures.length} Collinear Features (VIF &gt; 10)
          </Button>
        )}
      </div>

      <p className="text-xs text-slate-400 leading-relaxed">
        Variance Inflation Factor (VIF) measures how much the variance of an estimated regression coefficient increases if features are correlated.
        Features with <span className="font-mono text-amber-400 font-bold">VIF &gt; 10.0</span> destabilize TreeSHAP explainability and tree splitting efficiency.
      </p>

      {collinearFeatures.length > 0 ? (
        <div className="flex gap-2 flex-wrap pt-1">
          {collinearFeatures.map(f => (
            <div
              key={f.featureName}
              className="px-3 py-1.5 rounded-lg bg-rose-950/30 border border-rose-500/30 flex items-center gap-2 text-xs font-mono text-rose-300"
            >
              <span>{f.featureName}</span>
              <span className="font-bold text-rose-400">VIF {f.vifScore.toFixed(1)}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Zero collinear feature conflicts detected in active selection set.
        </div>
      )}
    </div>
  )
}

export default VIFMonitorCard
