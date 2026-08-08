import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/shared/ui/Card'
import { Badge } from '@/shared/ui/Badge'
import { Button } from '@/shared/ui/Button'
import { Tabs } from '@/shared/ui/Tabs'
import { Input } from '@/shared/ui/Input'
import { DataLineageCanvas } from '@/features/data/DataLineageCanvas'
import {
  useDatasets,
  useDatasetSchema,
  useDatasetSample,
  useDataLineage,
} from '@/hooks/useDataModules'
import {
  Database,
  ShieldCheck,
  CheckCircle2,
  Table as TableIcon,
  GitBranch,
  Layers,
  Search,
  Download,
  AlertCircle,
  FileCode,
} from 'lucide-react'

export const DatasetsPage: React.FC = () => {
  const { data: datasets, isLoading: isDatasetsLoading } = useDatasets()
  const { data: lineage } = useDataLineage()

  const [selectedDatasetId, setSelectedDatasetId] = useState('ds-transactions-200k')
  const [activeTab, setActiveTab] = useState<'schema' | 'sample' | 'lineage' | 'quality'>('schema')
  const [searchQuery, setSearchQuery] = useState('')

  const { data: schema, isLoading: isSchemaLoading } = useDatasetSchema(selectedDatasetId)
  const { data: sampleRows, isLoading: isSampleLoading } = useDatasetSample(selectedDatasetId, 12)

  const selectedDataset = datasets?.find(d => d.id === selectedDatasetId) || datasets?.[0]

  const tabs = [
    { id: 'schema', label: 'Schema & Profiling' },
    { id: 'sample', label: 'Sample Data Explorer' },
    { id: 'lineage', label: 'Data Lineage DAG' },
    { id: 'quality', label: 'Zero-Drop Quality Audit' },
  ]

  const filteredSchema = (schema || []).filter(
    col =>
      col.column_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      col.inferred_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      col.classification.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* 1. Page Header & Key Data Compliance Metrics */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-100">
              Enterprise Datasets & Lineage
            </h1>
            <Badge variant="success" size="sm" pulseDot>
              Zero-Drop Compliant
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Profiling 200,000 transaction records in DuckDB with automatic schema inference and SHA-256 PII masking.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" variant="subtle" leftIcon={<Download className="h-4 w-4" />}>
            Export Parquet Schema
          </Button>
        </div>
      </div>

      {/* 2. Top Summary KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card glow="cyan" className="p-4 bg-slate-900/80">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>Total Rows Indexed</span>
            <Database className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-100 mt-1">200,000</div>
          <div className="text-[11px] text-emerald-400 font-mono mt-1">100% Ingested (48.6 MB)</div>
        </Card>

        <Card glow="emerald" className="p-4 bg-slate-900/80">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>Data Quality Score</span>
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">99.4%</div>
          <div className="text-[11px] text-slate-400 font-mono mt-1">0 Records Dropped</div>
        </Card>

        <Card glow="none" className="p-4 bg-slate-900/80">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>PII Masked Columns</span>
            <CheckCircle2 className="h-4 w-4 text-teal-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-teal-300 mt-1">100%</div>
          <div className="text-[11px] text-slate-400 font-mono mt-1">SHA-256 Customer Tokens</div>
        </Card>

        <Card glow="none" className="p-4 bg-slate-900/80">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>Storage Engine</span>
            <Layers className="h-4 w-4 text-purple-400" />
          </div>
          <div className="text-lg font-bold font-mono text-purple-300 mt-1">DuckDB In-Memory</div>
          <div className="text-[11px] text-slate-400 font-mono mt-1">Vector RAG Sync Active</div>
        </Card>
      </div>

      {/* 3. Dataset Selector Chips */}
      <div className="flex gap-2 border-b border-slate-800 pb-3 flex-wrap">
        {(datasets || []).map(ds => (
          <button
            key={ds.id}
            onClick={() => setSelectedDatasetId(ds.id)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all ${
              selectedDatasetId === ds.id
                ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 shadow-glow-cyan'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database className="h-3.5 w-3.5" />
            <span>{ds.name}</span>
            <span className="font-mono text-[10px] text-slate-400">
              ({ds.totalRows.toLocaleString()} rows)
            </span>
          </button>
        ))}
      </div>

      {/* 4. Tab Navigation & Content Container */}
      <Card glow="none" className="p-6 bg-slate-900/90 border-slate-800 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
          <Tabs
            tabs={tabs}
            activeTab={activeTab}
            onChange={t => setActiveTab(t as any)}
            variant="underline"
          />

          {activeTab === 'schema' && (
            <div className="w-full sm:w-64">
              <Input
                placeholder="Search columns..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                leftIcon={<Search className="h-3.5 w-3.5" />}
              />
            </div>
          )}
        </div>

        {/* TAB 1: Schema & Profiling */}
        {activeTab === 'schema' && (
          <div className="space-y-4">
            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="p-3">Column Name</th>
                    <th className="p-3">Inferred Type</th>
                    <th className="p-3">Classification</th>
                    <th className="p-3 text-right">Null Count</th>
                    <th className="p-3 text-right">Cardinality</th>
                    <th className="p-3 text-center">PII Guard</th>
                    <th className="p-3 text-right">Outliers</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono text-slate-200">
                  {filteredSchema.map(col => (
                    <tr key={col.column_name} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3 font-semibold text-cyan-300">{col.column_name}</td>
                      <td className="p-3 text-slate-400">{col.inferred_type}</td>
                      <td className="p-3 font-sans">
                        <Badge
                          variant={
                            col.classification === 'measure'
                              ? 'cyber'
                              : col.classification === 'dimension'
                              ? 'primary'
                              : col.classification === 'temporal'
                              ? 'warning'
                              : 'outline'
                          }
                          size="sm"
                        >
                          {col.classification}
                        </Badge>
                      </td>
                      <td className="p-3 text-right text-slate-400">
                        {col.null_count === 0 ? (
                          <span className="text-emerald-400">0 (0.0%)</span>
                        ) : (
                          <span className="text-amber-400">{col.null_count}</span>
                        )}
                      </td>
                      <td className="p-3 text-right text-slate-300">
                        {col.cardinality.toLocaleString()}
                      </td>
                      <td className="p-3 text-center">
                        {col.is_pii ? (
                          <Badge variant="destructive" size="sm">
                            SHA-256 MASKED
                          </Badge>
                        ) : (
                          <span className="text-slate-500 text-[10px]">None</span>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        {col.outlier_count > 0 ? (
                          <span className="text-amber-400 font-bold">{col.outlier_count}</span>
                        ) : (
                          <span className="text-slate-500">0</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: Sample Data Explorer */}
        {activeTab === 'sample' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400 pb-1">
              <span>Showing 12 Preview Rows from DuckDB Lakehouse</span>
              <span className="font-mono text-[11px] text-cyan-400">
                Table: {selectedDataset?.fileName}
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="p-2.5">TX ID</th>
                    <th className="p-2.5">Timestamp</th>
                    <th className="p-2.5">Department</th>
                    <th className="p-2.5">Region</th>
                    <th className="p-2.5">Carrier</th>
                    <th className="p-2.5 text-right">Net Rev ($)</th>
                    <th className="p-2.5 text-right">Margin (%)</th>
                    <th className="p-2.5 text-right">Latency</th>
                    <th className="p-2.5 text-center">Risk Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono text-slate-200 text-[11px]">
                  {(sampleRows || []).map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-2.5 text-cyan-400 font-bold">{row.transaction_id as string}</td>
                      <td className="p-2.5 text-slate-400">{row.timestamp as string}</td>
                      <td className="p-2.5 font-sans font-medium text-slate-200">{row.department as string}</td>
                      <td className="p-2.5 font-sans text-slate-300">{row.region as string}</td>
                      <td className="p-2.5 text-slate-400">{row.carrier_code as string}</td>
                      <td className="p-2.5 text-right font-bold text-slate-100">
                        ${(row.net_revenue_usd as number)?.toLocaleString()}
                      </td>
                      <td className="p-2.5 text-right text-emerald-400">
                        {(row.gross_margin_pct as number)?.toFixed(1)}%
                      </td>
                      <td className="p-2.5 text-right text-slate-300">
                        {(row.fulfillment_latency_days as number)?.toFixed(2)}d
                      </td>
                      <td className="p-2.5 text-center">
                        <Badge
                          variant={(row.anomaly_score as number) > 0.8 ? 'destructive' : 'outline'}
                          size="sm"
                        >
                          {(row.anomaly_score as number)?.toFixed(3)}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: Data Lineage DAG */}
        {activeTab === 'lineage' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400 pb-1">
              <span>Full Pipeline Traceability (Ingestion → Cleaning → Lakehouse → ML Models)</span>
              <Badge variant="cyber" size="sm">
                Interactive Graph Flow
              </Badge>
            </div>

            {lineage && <DataLineageCanvas lineage={lineage} />}
          </div>
        )}

        {/* TAB 4: Zero-Drop Quality Audit */}
        {activeTab === 'quality' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="text-xs font-semibold text-slate-200 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  Zero-Drop Policy Enforcement
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Every single row is preserved. Outliers and format irregularities are flagged and imputed via statistical bounds rather than dropped.
                </p>
                <div className="text-[11px] font-mono text-emerald-400 pt-1">
                  Compliance: 100% (200k / 200k records)
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="text-xs font-semibold text-slate-200 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-cyan-400" />
                  PII Sanitization Gate
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Tax IDs, emails, and direct client identifiers are hashed into irreversible SHA-256 tokens prior to in-memory ingestion.
                </p>
                <div className="text-[11px] font-mono text-cyan-300 pt-1">
                  Status: 18,420 unique customer hashes
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="text-xs font-semibold text-slate-200 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-400" />
                  Outlier Boundary Thresholds
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Tukey 1.5x IQR fencing applied to gross order revenue ($50k ceiling) and freight ratios (0.45 threshold).
                </p>
                <div className="text-[11px] font-mono text-amber-300 pt-1">
                  Outliers Flagged: 142 records (0.07%)
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}

export default DatasetsPage
