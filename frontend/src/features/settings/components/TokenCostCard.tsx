import React from 'react'
import { Card } from '@/shared/ui/Card'
import { Badge } from '@/shared/ui/Badge'
import { DollarSign, Zap, TrendingUp } from 'lucide-react'

interface TokenCostCardProps {
  usage: {
    monthlySpendUsd: number
    monthlyBudgetUsd: number
    totalTokensMillions: number
    agentBreakdown: Array<{ agent: string; tokensK: number; costUsd: number }>
  }
}

export const TokenCostCard: React.FC<TokenCostCardProps> = ({ usage }) => {
  const percentBudget = Math.round((usage.monthlySpendUsd / usage.monthlyBudgetUsd) * 100)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div>
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <DollarSign className="h-3.5 w-3.5 text-cyan-400" />
            Token Telemetry & Cloud Spend Monitor
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Real-time tracking of token consumption, context usage, and agent-level operational costs.
          </p>
        </div>

        <Badge variant="outline" size="sm">
          Monthly Budget: ${usage.monthlyBudgetUsd.toFixed(2)}
        </Badge>
      </div>

      {/* Spend Progress Strip */}
      <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-400">Current Month Spend:</span>
          <span className="font-bold text-slate-100">
            ${usage.monthlySpendUsd.toFixed(2)} / ${usage.monthlyBudgetUsd.toFixed(2)}{' '}
            <span className="text-cyan-400 font-semibold">({percentBudget}%)</span>
          </span>
        </div>

        <div className="h-2 w-full rounded-full bg-slate-900 overflow-hidden border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-500"
            style={{ width: `${percentBudget}%` }}
          />
        </div>
      </div>

      {/* Agent Breakdown Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
            <tr>
              <th className="p-3">Agent Component</th>
              <th className="p-3 text-right">Tokens Consumed</th>
              <th className="p-3 text-right">Estimated Cost (USD)</th>
              <th className="p-3 text-right">% of Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-200">
            {usage.agentBreakdown.map(a => {
              const pct = ((a.costUsd / usage.monthlySpendUsd) * 100).toFixed(1)
              return (
                <tr key={a.agent} className="hover:bg-slate-800/30">
                  <td className="p-3 font-semibold text-slate-100">{a.agent}</td>
                  <td className="p-3 text-right text-cyan-300">
                    {(a.tokensK * 1000).toLocaleString()} tokens
                  </td>
                  <td className="p-3 text-right font-bold text-emerald-400">
                    ${a.costUsd.toFixed(2)}
                  </td>
                  <td className="p-3 text-right text-slate-400">{pct}%</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default TokenCostCard
