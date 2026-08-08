import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/shared/ui/Card'
import { Badge } from '@/shared/ui/Badge'
import { Button } from '@/shared/ui/Button'
import { Tabs } from '@/shared/ui/Tabs'
import {
  useEDAVariableStats,
  useCorrelationMatrix,
  useDistribution,
  useHypothesisTests,
  useMultivariateScatter,
} from '@/hooks/useEDA'
import { CorrelationHeatmap } from '@/features/eda/components/CorrelationHeatmap'
import { DistributionChart } from '@/features/eda/components/DistributionChart'
import { MultivariateScatterChart } from '@/features/eda/components/MultivariateScatterChart'
import { HypothesisTestsList } from '@/features/eda/components/HypothesisTestsList'
import {
  BarChart2,
  TrendingUp,
  Activity,
  Calculator,
  Layers,
  Sparkles,
  Search,
  Sigma,
  PieChart,
} from 'lucide-react'

export const EDAPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'correlation' | 'distribution' | 'scatter' | 'hypothesis'>('correlation')
  const [corrMethod, setCorrMethod] = useState<'pearson' | 'spearman'>('pearson')
  const [selectedVariable, setSelectedVariable] = useState<string>('gross_margin_pct')

  const { data: variableStats } = useEDAVariableStats()
  const { data: correlationData } = useCorrelationMatrix(corrMethod)
  const { data: distributionData } = useDistribution(selectedVariable)
  const { data: hypothesisTests } = useHypothesisTests()
  const { data: scatterData } = useMultivariateScatter()

  const activeStat = (variableStats || []).find(v => v.name === selectedVariable) || variableStats?.[0]

  const tabs = [
    { id: 'correlation', label: 'Correlation Heatmap' },
    { id: 'distribution', label: 'Distribution & KDE' },
    { id: 'scatter', label: 'Multivariate Scatter' },
    { id: 'hypothesis', label: 'Hypothesis Testing (ANOVA / U-Test)' },
  ]

  const numericVariables = (variableStats || []).filter(v => v.inferredType === 'numeric')

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-100">
              Exploratory Data Analysis (EDA) Studio
            </h1>
            <Badge variant="cyber" size="sm">
              DuckDB Statistical Engine
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Multivariate distributions, correlation heatmaps, parametric hypothesis testing, and outlier isolation on 200,000 transactions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="success" size="sm" pulseDot>
            200k Rows Profiled
          </Badge>
        </div>
      </div>

      {/* 2. Statistical Profile Bar of Selected Metric */}
      {activeStat && (
        <Card glow="cyan" className="p-4 bg-slate-900/80">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Sigma className="h-4 w-4 text-cyan-400" />
              <span className="text-xs font-semibold text-slate-200">
                Active Variable Profile:
              </span>
              <div className="flex gap-1.5 flex-wrap">
                {numericVariables.map(v => (
                  <button
                    key={v.name}
                    onClick={() => setSelectedVariable(v.name)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
                      selectedVariable === v.name
                        ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {v.name}
                  </button>
                ))}
              </div>
            </div>

            <Badge variant="outline" size="sm">
              {activeStat.uniqueCount.toLocaleString()} Unique Values
            </Badge>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 pt-3 font-mono text-xs">
            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
              <div className="text-[10px] text-slate-400">Mean</div>
              <div className="font-bold text-slate-100 mt-0.5">{activeStat.mean?.toLocaleString()}</div>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
              <div className="text-[10px] text-slate-400">Median</div>
              <div className="font-bold text-slate-100 mt-0.5">{activeStat.median?.toLocaleString()}</div>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
              <div className="text-[10px] text-slate-400">Std Dev (σ)</div>
              <div className="font-bold text-cyan-300 mt-0.5">±{activeStat.stdDev?.toLocaleString()}</div>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
              <div className="text-[10px] text-slate-400">Min - Max</div>
              <div className="font-bold text-slate-200 mt-0.5">
                {activeStat.min} - {activeStat.max?.toLocaleString()}
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
              <div className="text-[10px] text-slate-400">IQR (P25 - P75)</div>
              <div className="font-bold text-slate-200 mt-0.5">
                {activeStat.p25?.toLocaleString()} - {activeStat.p75?.toLocaleString()}
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
              <div className="text-[10px] text-slate-400">Skewness</div>
              <div className="font-bold text-purple-300 mt-0.5">{activeStat.skewness}</div>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
              <div className="text-[10px] text-slate-400">Outliers Flagged</div>
              <div className="font-bold text-amber-400 mt-0.5">{activeStat.outlierCount || 0}</div>
            </div>
          </div>
        </Card>
      )}

      {/* 3. Main EDA Tabs & Visualizations */}
      <Card glow="none" className="p-6 bg-slate-900/90 border-slate-800 space-y-4">
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onChange={t => setActiveTab(t as any)}
          variant="underline"
        />

        {/* Tab 1: Correlation Heatmap */}
        {activeTab === 'correlation' && correlationData && (
          <CorrelationHeatmap
            data={correlationData}
            method={corrMethod}
            onMethodChange={m => setCorrMethod(m)}
          />
        )}

        {/* Tab 2: Distribution & KDE */}
        {activeTab === 'distribution' && distributionData && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Binned Frequency Distribution with Kernel Density Estimation (KDE)</span>
              <span className="font-mono text-cyan-400">{selectedVariable}</span>
            </div>
            <DistributionChart data={distributionData} variableName={selectedVariable} />
          </div>
        )}

        {/* Tab 3: Multivariate Scatter */}
        {activeTab === 'scatter' && scatterData && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Multivariate Scatter: Latency vs Gross Margin % (Bubble Size = Order Value)</span>
              <Badge variant="outline" size="sm">
                Colored by Department
              </Badge>
            </div>
            <MultivariateScatterChart data={scatterData} />
          </div>
        )}

        {/* Tab 4: Hypothesis Testing */}
        {activeTab === 'hypothesis' && hypothesisTests && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400 pb-1">
              <span>Automated Inferential Statistics & Parametric Significance Verification</span>
              <Badge variant="cyber" size="sm">
                α = 0.05 / α = 0.01
              </Badge>
            </div>
            <HypothesisTestsList tests={hypothesisTests} />
          </div>
        )}
      </Card>
    </div>
  )
}

export default EDAPage
