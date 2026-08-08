import React from 'react'
import { Card } from '@/shared/ui/Card'
import { Badge } from '@/shared/ui/Badge'
import { CheckCircle2, Sparkles, AlertTriangle, ArrowRight } from 'lucide-react'
import type { StatisticalHypothesisTest } from '@/shared/types'

interface HypothesisTestsListProps {
  tests: StatisticalHypothesisTest[]
}

export const HypothesisTestsList: React.FC<HypothesisTestsListProps> = ({ tests }) => {
  return (
    <div className="space-y-4">
      {tests.map(t => (
        <div
          key={t.id}
          className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-all space-y-2.5"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-xs text-slate-100">{t.testName}</span>
            </div>

            <div className="flex items-center gap-2">
              <Badge
                variant={t.isSignificant ? 'success' : 'outline'}
                size="sm"
                pulseDot={t.isSignificant}
              >
                {t.isSignificant ? 'p < 0.001 (Significant)' : 'Not Significant'}
              </Badge>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 font-mono italic">
            {t.hypothesis}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 border-t border-slate-800/60 font-mono text-[11px]">
            <div>
              <span className="text-slate-500">Statistic:</span>{' '}
              <span className="text-cyan-300 font-bold">{t.testStatistic.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-slate-500">p-value:</span>{' '}
              <span className="text-emerald-400 font-bold">{t.pValue}</span>
            </div>
            <div>
              <span className="text-slate-500">Alpha (α):</span>{' '}
              <span className="text-slate-300">{t.significanceLevel}</span>
            </div>
            <div>
              <span className="text-slate-500">Effect Size:</span>{' '}
              <span className="text-purple-300">{t.effectSize}</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-cyan-950/20 border border-cyan-500/20 flex items-start gap-2">
            <Sparkles className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-300 leading-relaxed">
              <span className="text-cyan-400 font-bold font-mono">Agent Interpretation: </span>
              {t.aiInterpretation}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default HypothesisTestsList
