import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/shared/ui/Card'
import { Badge } from '@/shared/ui/Badge'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { useFeatures, useDriftReports } from '@/hooks/useDataModules'
import {
  Layers,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Search,
  Zap,
  TrendingUp,
  BarChart3,
} from 'lucide-react'

export const FeatureStorePage: React.FC = () => {
  const { data: features, isLoading: isFeaturesLoading } = useFeatures()
  const { data: driftReports } = useDriftReports()

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  const categories = ['All', 'business', 'temporal', 'temporal_aggregate', 'temporal_lag', 'ai']

  const filteredFeatures = (features || []).filter(f => {
    const matchesSearch =
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.description && f.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      f.owner.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || f.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-6">
      {/* 1. Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-100">
              Enterprise Feature Store
            </h1>
            <Badge variant="cyber" size="sm">
              32 Engineered Features
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Centralized feature registry serving low-latency features for XGBoost, Random Forest, and scenario simulations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="success" size="sm" pulseDot>
            Online Sync: Active (&lt; 15ms)
          </Badge>
        </div>
      </div>

      {/* 2. Top Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card glow="cyan" className="p-4 bg-slate-900/80">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>Total Features</span>
            <Layers className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-100 mt-1">32</div>
          <div className="text-[11px] text-emerald-400 font-mono mt-1">100% Production Ready</div>
        </Card>

        <Card glow="emerald" className="p-4 bg-slate-900/80">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>Feature Drift (PSI)</span>
            <Activity className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">0.016</div>
          <div className="text-[11px] text-slate-400 font-mono mt-1">Below Warning Ceiling (0.10)</div>
        </Card>

        <Card glow="none" className="p-4 bg-slate-900/80">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>Drift Warnings</span>
            <AlertTriangle className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-400 mt-1">1 Feature</div>
          <div className="text-[11px] text-slate-400 font-mono mt-1">rolling_7d_return_rate (PSI 0.082)</div>
        </Card>

        <Card glow="none" className="p-4 bg-slate-900/80">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>Online Ingestion Latency</span>
            <Zap className="h-4 w-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-purple-300 mt-1">12ms</div>
          <div className="text-[11px] text-slate-400 font-mono mt-1">Feast Redis Cache</div>
        </Card>
      </div>

      {/* 3. Feature Drift Monitoring Strip */}
      <Card glow="none" className="p-5 bg-slate-900/90 border-slate-800 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div>
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Activity className="h-4 w-4 text-cyan-400" />
              Statistical Feature Drift Monitor (Kolmogorov-Smirnov & PSI)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Continuous hypothesis testing comparing baseline distribution against the active 200,000 transaction window.
            </p>
          </div>
          <Badge variant="outline" size="sm">
            Audited 10m ago
          </Badge>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-2.5">Feature Name</th>
                <th className="p-2.5 text-right">Baseline Mean</th>
                <th className="p-2.5 text-right">Prod Mean</th>
                <th className="p-2.5 text-right">KS Statistic</th>
                <th className="p-2.5 text-right">p-value</th>
                <th className="p-2.5 text-right">PSI Score</th>
                <th className="p-2.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200 text-[11px]">
              {(driftReports || []).map(r => (
                <tr key={r.featureName} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-2.5 font-bold text-cyan-300">{r.featureName}</td>
                  <td className="p-2.5 text-right text-slate-400">{r.baselineMean}</td>
                  <td className="p-2.5 text-right text-slate-200">{r.productionMean}</td>
                  <td className="p-2.5 text-right text-slate-400">{r.ksStatistic}</td>
                  <td className="p-2.5 text-right text-slate-400">{r.pValue}</td>
                  <td className="p-2.5 text-right font-bold text-slate-100">{r.psiScore}</td>
                  <td className="p-2.5 text-center font-sans">
                    <Badge
                      variant={r.status === 'stable' ? 'success' : 'warning'}
                      size="sm"
                      pulseDot={r.status === 'warning'}
                    >
                      {r.status.toUpperCase()}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 4. Searchable Feature Catalog */}
      <Card glow="none" className="p-6 bg-slate-900/90 border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
          <div className="flex gap-1.5 flex-wrap">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                  selectedCategory === cat
                    ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 font-semibold'
                    : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="w-full sm:w-64">
            <Input
              placeholder="Search features..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              leftIcon={<Search className="h-3.5 w-3.5" />}
            />
          </div>
        </div>

        {/* Feature Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-3">Feature Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">Type</th>
                <th className="p-3">Owner</th>
                <th className="p-3 text-right">Importance</th>
                <th className="p-3 text-right">Mean ± Std</th>
                <th className="p-3 text-center">Drift</th>
                <th className="p-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-slate-200">
              {filteredFeatures.map(f => (
                <tr key={f.name} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 font-semibold text-cyan-300">
                    <div>{f.name}</div>
                    <div className="text-[10px] text-slate-400 font-sans">{f.description}</div>
                  </td>
                  <td className="p-3 font-sans">
                    <Badge variant="outline" size="sm">
                      {f.category}
                    </Badge>
                  </td>
                  <td className="p-3 text-slate-400">{f.type}</td>
                  <td className="p-3 font-sans text-slate-300">{f.owner}</td>
                  <td className="p-3 text-right">
                    {f.importanceScore !== undefined ? (
                      <span className="text-cyan-400 font-bold">
                        {f.importanceScore.toFixed(3)}
                      </span>
                    ) : (
                      <span className="text-slate-500">-</span>
                    )}
                  </td>
                  <td className="p-3 text-right text-slate-400">
                    {f.meanValue !== undefined ? `${f.meanValue} ± ${f.stdDev}` : '-'}
                  </td>
                  <td className="p-3 text-center font-sans">
                    <Badge
                      variant={f.driftStatus === 'warning' ? 'warning' : 'success'}
                      size="sm"
                    >
                      {f.driftStatus || 'stable'}
                    </Badge>
                  </td>
                  <td className="p-3 text-center font-sans">
                    <Badge variant="success" size="sm">
                      {f.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

export default FeatureStorePage
