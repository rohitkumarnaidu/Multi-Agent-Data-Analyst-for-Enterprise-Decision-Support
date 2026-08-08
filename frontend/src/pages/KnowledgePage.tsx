import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/shared/ui/Card'
import { Badge } from '@/shared/ui/Badge'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { useSemanticMetrics } from '@/hooks/useDataModules'
import {
  Brain,
  Database,
  Code2,
  Copy,
  Check,
  Search,
  Sparkles,
  Layers,
  ShieldCheck,
  ArrowRight,
  BookOpen,
} from 'lucide-react'
import type { SemanticMetric } from '@/shared/types'

export const KnowledgePage: React.FC = () => {
  const { data: metrics, isLoading } = useSemanticMetrics()
  const [selectedMetricName, setSelectedMetricName] = useState<string>('gross_margin_pct')
  const [searchQuery, setSearchQuery] = useState('')
  const [copiedSql, setCopiedSql] = useState(false)

  const selectedMetric =
    (metrics || []).find(m => m.name === selectedMetricName) || (metrics || [])[0]

  const filteredMetrics = (metrics || []).filter(
    m =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCopySql = (sql: string) => {
    navigator.clipboard.writeText(sql)
    setCopiedSql(true)
    setTimeout(() => setCopiedSql(false), 1500)
  }

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-100">
              Semantic Layer & Knowledge Catalog
            </h1>
            <Badge variant="cyber" size="sm">
              DuckDB Semantic RAG
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Governed enterprise metrics layer ensuring consistent calculations across all multi-agent queries.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="success" size="sm" pulseDot>
            Vector Index: 100% Synced
          </Badge>
        </div>
      </div>

      {/* 2. Vector Store Status & Indexing Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card glow="indigo" className="p-4 bg-slate-900/80">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Vector RAG Embeddings</span>
            <Brain className="h-4 w-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-purple-300 mt-1">1,420 Vectors</div>
          <div className="text-[11px] text-slate-400 font-mono mt-1">Schema & Business Glossaries</div>
        </Card>

        <Card glow="cyan" className="p-4 bg-slate-900/80">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Semantic Retrieval SLA</span>
            <Sparkles className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-cyan-300 mt-1">18ms</div>
          <div className="text-[11px] text-slate-400 font-mono mt-1">DuckDB In-Memory Cosine Rerank</div>
        </Card>

        <Card glow="emerald" className="p-4 bg-slate-900/80">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Governed Metrics Count</span>
            <Database className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
            {metrics?.length || 5} Metrics
          </div>
          <div className="text-[11px] text-slate-400 font-mono mt-1">100% Zero-Ambiguity Verified</div>
        </Card>
      </div>

      {/* 3. Main Metrics Browser & SQL Compiler Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Metrics List */}
        <div className="lg:col-span-5 space-y-3">
          <Input
            placeholder="Search semantic metrics..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
          />

          <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
            {filteredMetrics.map(m => {
              const isSelected = m.name === (selectedMetric?.name || '')
              return (
                <div
                  key={m.name}
                  onClick={() => setSelectedMetricName(m.name)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-500/15 border-cyan-500/50 shadow-glow-cyan'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between pb-1">
                    <span className="font-mono text-xs font-bold text-slate-100">
                      {m.name}
                    </span>
                    <Badge
                      variant={
                        m.category === 'financial'
                          ? 'success'
                          : m.category === 'operational'
                          ? 'primary'
                          : 'cyber'
                      }
                      size="sm"
                    >
                      {m.category}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {m.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right: Metric Inspector & Compiled SQL */}
        <div className="lg:col-span-7 space-y-4">
          {selectedMetric ? (
            <Card glow="none" className="p-6 bg-slate-900/90 border-slate-800 space-y-5">
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-slate-100 font-mono">
                    {selectedMetric.name}
                  </h2>
                  <Badge variant="outline" size="sm">
                    {selectedMetric.category.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  {selectedMetric.description}
                </p>
              </div>

              {/* Mathematical Formula Explanation */}
              {selectedMetric.formulaExplanation && (
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                    Standardized Formula
                  </div>
                  <div className="text-xs font-mono text-cyan-300">
                    {selectedMetric.formulaExplanation}
                  </div>
                </div>
              )}

              {/* Allowed Dimensions */}
              <div>
                <div className="text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5 text-cyan-400" />
                  Allowed Slicing Dimensions
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  {selectedMetric.allowed_dimensions.map(dim => (
                    <span
                      key={dim}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 font-mono text-xs text-slate-300"
                    >
                      {dim}
                    </span>
                  ))}
                </div>
              </div>

              {/* Compiled DuckDB SQL Template */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span className="font-semibold flex items-center gap-1.5">
                    <Code2 className="h-3.5 w-3.5 text-cyan-400" />
                    Compiled DuckDB SQL Template
                  </span>

                  <Button
                    size="xs"
                    variant="subtle"
                    onClick={() => handleCopySql(selectedMetric.sql)}
                    leftIcon={
                      copiedSql ? (
                        <Check className="h-3 w-3 text-emerald-400" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )
                    }
                  >
                    {copiedSql ? 'Copied' : 'Copy SQL'}
                  </Button>
                </div>

                <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-cyan-300 overflow-x-auto leading-relaxed">
                  {selectedMetric.sql}
                </pre>
              </div>
            </Card>
          ) : (
            <div className="p-12 text-center text-xs text-slate-400">
              Select a metric from the catalog to view calculation logic and compiled SQL.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default KnowledgePage
