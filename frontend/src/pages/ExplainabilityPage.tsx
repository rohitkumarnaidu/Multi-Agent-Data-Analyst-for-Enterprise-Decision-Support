import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/shared/ui/Card'
import { Badge } from '@/shared/ui/Badge'
import { Button } from '@/shared/ui/Button'
import { Tabs } from '@/shared/ui/Tabs'
import {
  useGlobalSHAP,
  useLocalExplanation,
  useCounterfactuals,
} from '@/hooks/useExplainability'
import { mockTransactions } from '@/services/explainabilityService'
import { SHAPBeeswarmChart } from '@/features/explainability/components/SHAPBeeswarmChart'
import { WaterfallPlot } from '@/features/explainability/components/WaterfallPlot'
import { CounterfactualsCard } from '@/features/explainability/components/CounterfactualsCard'
import {
  Sparkles,
  Layers,
  Compass,
  CheckCircle2,
  TrendingUp,
  Search,
  Activity,
  FileCode,
} from 'lucide-react'

export const ExplainabilityPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'local' | 'global'>('local')
  const [selectedTxId, setSelectedTxId] = useState<string>('TX-89241')

  const { data: globalShap } = useGlobalSHAP()
  const { data: localExp } = useLocalExplanation(selectedTxId)
  const { data: counterfactuals } = useCounterfactuals(selectedTxId)

  const tabs = [
    { id: 'local', label: 'Local Instance Waterfall & Recourse' },
    { id: 'global', label: 'Global TreeSHAP Importance' },
  ]

  return (
    <div className="space-y-6">
      {/* 1. Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-100">
              Explainability & Trust Center (XAI)
            </h1>
            <Badge variant="cyber" size="sm">
              TreeSHAP & LIME Engine
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Exact additive Shapley values, local waterfall attribution paths, surrogate fidelity verification, and actionable counterfactual recourse.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="success" size="sm" pulseDot>
            Exact Additivity Verified
          </Badge>
        </div>
      </div>

      {/* 2. Main Navigation Tabs */}
      <Card glow="none" className="p-6 bg-slate-900/90 border-slate-800 space-y-5">
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onChange={t => setActiveTab(t as any)}
          variant="underline"
        />

        {/* Tab 1: Local Instance Waterfall & Counterfactuals */}
        {activeTab === 'local' && (
          <div className="space-y-5">
            {/* Transaction Picker Strip */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-cyan-400" />
                <span className="text-xs font-semibold text-slate-200">
                  Select Transaction Instance:
                </span>
                <div className="flex gap-2 flex-wrap">
                  {mockTransactions.map(tx => (
                    <button
                      key={tx.id}
                      onClick={() => setSelectedTxId(tx.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                        selectedTxId === tx.id
                          ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40 shadow-glow-cyan'
                          : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                      }`}
                    >
                      {tx.id} ({tx.department})
                    </button>
                  ))}
                </div>
              </div>

              {localExp && (
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                  <span>LIME Surrogate Fidelity:</span>
                  <span className="text-emerald-400 font-bold">R² = {localExp.limeSurrogateR2}</span>
                </div>
              )}
            </div>

            {/* AI Reasoning Summary Box */}
            {localExp && (
              <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/20 flex items-start gap-3">
                <Sparkles className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono">
                    AI Decision Explainer & Causal Attribution
                  </h4>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {localExp.agentReasoning}
                  </p>
                </div>
              </div>
            )}

            {/* Waterfall Decomposition Chart */}
            {localExp && (
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                <WaterfallPlot
                  waterfall={localExp.waterfall}
                  baseValue={localExp.baseValue}
                  predictedValue={localExp.predictedValue}
                />
              </div>
            )}

            {/* Counterfactual Actionable Recourse */}
            {counterfactuals && (
              <CounterfactualsCard counterfactuals={counterfactuals} />
            )}
          </div>
        )}

        {/* Tab 2: Global TreeSHAP Summary */}
        {activeTab === 'global' && globalShap && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400 pb-1">
              <span>Population-level Mean Absolute SHAP Attribution Across 200k Transactions</span>
              <Badge variant="outline" size="sm">
                Model: XGBoost v2.4.1
              </Badge>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
              <SHAPBeeswarmChart data={globalShap} />
            </div>

            {/* Global SHAP Data Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="p-3">Rank</th>
                    <th className="p-3">Feature Name</th>
                    <th className="p-3 text-right">Mean |SHAP Value|</th>
                    <th className="p-3 text-center">Primary Influence Direction</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-200">
                  {globalShap.map((g, idx) => (
                    <tr key={g.featureName} className="hover:bg-slate-800/30">
                      <td className="p-3 text-cyan-400 font-bold">#{idx + 1}</td>
                      <td className="p-3 font-semibold text-slate-100">{g.featureName}</td>
                      <td className="p-3 text-right font-bold text-emerald-400">
                        {g.meanAbsoluteShap.toFixed(2)}% margin
                      </td>
                      <td className="p-3 text-center">
                        <Badge
                          variant={g.direction === 'positive' ? 'success' : 'destructive'}
                          size="sm"
                        >
                          {g.direction === 'positive' ? '↑ Margin Accretive' : '↓ Margin Dilutive'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}

export default ExplainabilityPage
