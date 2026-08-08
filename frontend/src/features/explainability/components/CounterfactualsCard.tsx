import React from 'react'
import { Card } from '@/shared/ui/Card'
import { Badge } from '@/shared/ui/Badge'
import { Compass, Sparkles, ArrowRight } from 'lucide-react'
import type { CounterfactualRecourse } from '@/shared/types'

interface CounterfactualsCardProps {
  counterfactuals: CounterfactualRecourse[]
}

const difficultyBadgeVariant: Record<string, 'success' | 'outline' | 'destructive'> = {
  easy: 'success',
  moderate: 'outline',
  hard: 'destructive',
}

export const CounterfactualsCard: React.FC<CounterfactualsCardProps> = ({ counterfactuals }) => {
  return (
    <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
      <div className="flex items-center gap-2">
        <Compass className="h-4 w-4 text-cyan-400" />
        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
          Counterfactual Actionable Recourse Recommendations
        </h3>
      </div>

      <p className="text-xs text-slate-400">
        Minimal necessary operational adjustments required to lift this transaction's margin above target threshold:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
        {counterfactuals.map(c => (
          <div
            key={c.featureName}
            className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2 flex flex-col justify-between"
          >
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-slate-100">{c.featureName}</span>
                <Badge variant={difficultyBadgeVariant[c.difficulty] || 'outline'} size="sm">
                  {c.difficulty.toUpperCase()}
                </Badge>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono pt-1">
                <span className="text-rose-400 line-through">{c.currentValue}</span>
                <ArrowRight className="h-3 w-3 text-slate-500" />
                <span className="text-emerald-400 font-bold">{c.targetValue}</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-300 leading-relaxed border-t border-slate-800/60 pt-2">
              {c.impactDescription}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CounterfactualsCard
