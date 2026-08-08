import React from 'react'
import { Badge } from '@/shared/ui/Badge'
import { Checkbox } from '@/shared/ui/Checkbox'
import type { FeatureRankingItem } from '@/shared/types'

interface ConsensusRankingTableProps {
  rankings: FeatureRankingItem[]
  selectedFeatures: string[]
  onToggleFeature: (featureName: string) => void
  onSelectAll: () => void
  onDeselectAll: () => void
}

export const ConsensusRankingTable: React.FC<ConsensusRankingTableProps> = ({
  rankings,
  selectedFeatures,
  onToggleFeature,
}) => {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800">
      <table className="w-full text-left text-xs font-mono">
        <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
          <tr>
            <th className="p-3 w-10 text-center">Sel</th>
            <th className="p-3">Rank</th>
            <th className="p-3">Feature Name</th>
            <th className="p-3">Category</th>
            <th className="p-3 text-right">Mutual Info</th>
            <th className="p-3 text-right">Random Forest</th>
            <th className="p-3 text-right">LASSO (L1)</th>
            <th className="p-3 text-right">XGBoost Gain</th>
            <th className="p-3 text-right">Consensus</th>
            <th className="p-3 text-center">VIF Score</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60 text-slate-200">
          {rankings.map(item => {
            const isChecked = selectedFeatures.includes(item.featureName)
            const isHighVif = item.vifStatus === 'high'

            return (
              <tr
                key={item.featureName}
                className={`transition-colors ${
                  isChecked
                    ? 'bg-cyan-500/5 hover:bg-cyan-500/10'
                    : 'opacity-60 hover:opacity-100 hover:bg-slate-800/30'
                }`}
              >
                <td className="p-3 text-center">
                  <Checkbox
                    checked={isChecked}
                    onChange={() => onToggleFeature(item.featureName)}
                  />
                </td>
                <td className="p-3 font-bold text-cyan-400">#{item.consensusRank}</td>
                <td className="p-3 font-semibold text-slate-100">{item.featureName}</td>
                <td className="p-3 font-sans">
                  <Badge variant="outline" size="sm">
                    {item.category}
                  </Badge>
                </td>
                <td className="p-3 text-right text-slate-400">{item.mutualInfoScore.toFixed(2)}</td>
                <td className="p-3 text-right text-slate-400">{item.rfScore.toFixed(2)}</td>
                <td className="p-3 text-right text-slate-400">{item.lassoScore.toFixed(2)}</td>
                <td className="p-3 text-right text-slate-400">{item.xgbScore.toFixed(2)}</td>
                <td className="p-3 text-right font-bold text-emerald-400">
                  {item.consensusScore.toFixed(3)}
                </td>
                <td className="p-3 text-center">
                  <Badge
                    variant={isHighVif ? 'destructive' : 'success'}
                    size="sm"
                    pulseDot={isHighVif}
                  >
                    {item.vifScore.toFixed(1)} {isHighVif ? '(Collinear)' : '(Safe)'}
                  </Badge>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default ConsensusRankingTable
