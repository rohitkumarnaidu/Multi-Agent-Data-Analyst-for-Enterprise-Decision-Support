import React, { useState, useMemo } from 'react';
import { Database, Search, Play, Download, Table2, BarChart3, Filter, Columns } from 'lucide-react';
import { motion } from 'framer-motion';
import ReactECharts from 'echarts-for-react';
import Editor from '@monaco-editor/react';
import { useDataSchema, useDataPreview, useDataStatistics, useDataQuality, useExecuteQuery } from '@/api/enterpriseApi';
import { Skeleton } from '@/shared/ui/Skeleton';

const DataExplorerPage: React.FC = () => {
  const [page, setPage] = useState(0);
  const [activeTab, setActiveTab] = useState<'preview' | 'statistics' | 'quality' | 'sql'>('preview');
  const [sqlValue, setSqlValue] = useState('SELECT Department, COUNT(*) as count,\n  AVG(Revenue_Impact_USD) as avg_revenue\nFROM enterprise_data\nGROUP BY Department\nORDER BY avg_revenue DESC;');

  const { data: schema, isLoading: schemaLoading } = useDataSchema();
  const { data: preview, isLoading: previewLoading } = useDataPreview(50, page * 50);
  const { data: stats } = useDataStatistics();
  const { data: quality } = useDataQuality();
  const queryMutation = useExecuteQuery();

  const dimensions = useMemo(() => schema?.filter(c => c.classification === 'dimension') || [], [schema]);
  const measures = useMemo(() => schema?.filter(c => c.classification === 'measure') || [], [schema]);

  const handleRunQuery = () => {
    if (sqlValue.trim()) queryMutation.mutate({ sql: sqlValue.trim() });
  };

  const handleExportCSV = () => {
    const rows = queryMutation.data?.rows || preview?.rows || [];
    if (!rows.length) return;
    const cols = Object.keys(rows[0]);
    const csv = [cols.join(','), ...rows.map(r => cols.map(c => JSON.stringify(r[c] ?? '')).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'export.csv'; a.click();
  };

  if (schemaLoading) {
    return <div className="p-6 space-y-4 max-w-[1800px] mx-auto"><Skeleton className="h-10 w-64" /><Skeleton className="h-96 rounded-xl" /></div>;
  }

  return (
    <div className="flex h-[calc(100vh-3.5rem)] overflow-hidden">
      {/* Left Panel - Schema Explorer */}
      <div className="w-64 border-r border-slate-800/60 bg-slate-950/50 overflow-y-auto shrink-0 hidden lg:block">
        <div className="p-4 border-b border-slate-800/60">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Dataset Schema</h3>
          <p className="text-[10px] text-slate-500 mt-1 font-mono">enterprise_data</p>
          {preview && <p className="text-[10px] text-slate-500 font-mono">{preview.total_rows.toLocaleString()} rows · {schema?.length || 0} columns</p>}
        </div>
        <div className="p-2 space-y-3">
          <div>
            <p className="text-[10px] font-semibold text-sky-400 uppercase px-2 py-1">Dimensions ({dimensions.length})</p>
            {dimensions.map(col => (
              <div key={col.column_name} className="flex items-center gap-2 px-2 py-1.5 text-xs text-slate-300 hover:bg-slate-800/60 rounded cursor-default">
                <Columns className="h-3 w-3 text-sky-400 shrink-0" />
                <span className="truncate">{col.column_name}</span>
                <span className="ml-auto text-[9px] text-slate-500 font-mono">{col.cardinality}</span>
              </div>
            ))}
          </div>
          <div>
            <p className="text-[10px] font-semibold text-emerald-400 uppercase px-2 py-1">Measures ({measures.length})</p>
            {measures.map(col => (
              <div key={col.column_name} className="flex items-center gap-2 px-2 py-1.5 text-xs text-slate-300 hover:bg-slate-800/60 rounded cursor-default">
                <BarChart3 className="h-3 w-3 text-emerald-400 shrink-0" />
                <span className="truncate">{col.column_name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800/60 bg-slate-900/50 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-sky-400" />
              <h1 className="text-lg font-bold text-white">Data Explorer</h1>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={handleExportCSV} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700/80 rounded-lg border border-slate-700/50 transition-colors">
                <Download className="h-3.5 w-3.5" /> Export CSV
              </button>
            </div>
          </div>
          {/* Tabs */}
          <div className="flex gap-1 mt-3">
            {(['preview', 'statistics', 'quality', 'sql'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${activeTab === tab ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'}`}>
                {tab === 'preview' && <><Table2 className="h-3.5 w-3.5 inline mr-1" />Preview</>}
                {tab === 'statistics' && <><BarChart3 className="h-3.5 w-3.5 inline mr-1" />Statistics</>}
                {tab === 'quality' && <><Filter className="h-3.5 w-3.5 inline mr-1" />Quality</>}
                {tab === 'sql' && <><Play className="h-3.5 w-3.5 inline mr-1" />SQL Query</>}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-auto">
          {activeTab === 'preview' && (
            <div className="overflow-auto">
              {previewLoading ? <Skeleton className="h-96 m-4 rounded-xl" /> : preview?.rows?.length ? (
                <>
                  <table className="w-full text-xs">
                    <thead className="bg-slate-900/80 sticky top-0 z-10">
                      <tr>{preview.columns.map(col => (
                        <th key={col} className="px-3 py-2.5 text-left text-slate-400 font-semibold uppercase tracking-wider whitespace-nowrap border-b border-slate-800/60">{col}</th>
                      ))}</tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/40">
                      {preview.rows.map((row, i) => (
                        <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                          {preview.columns.map(col => (
                            <td key={col} className="px-3 py-2 text-slate-300 whitespace-nowrap max-w-[200px] truncate font-mono">{row[col] != null ? String(row[col]) : <span className="text-slate-600 italic">null</span>}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="flex items-center justify-between p-4 border-t border-slate-800/60 bg-slate-900/50">
                    <span className="text-xs text-slate-400">Showing {page * 50 + 1}–{Math.min((page + 1) * 50, preview.total_rows)} of {preview.total_rows.toLocaleString()}</span>
                    <div className="flex gap-2">
                      <button disabled={page === 0} onClick={() => setPage(p => p - 1)} className="px-3 py-1 text-xs bg-slate-800 text-slate-300 rounded disabled:opacity-30">Previous</button>
                      <button disabled={(page + 1) * 50 >= preview.total_rows} onClick={() => setPage(p => p + 1)} className="px-3 py-1 text-xs bg-slate-800 text-slate-300 rounded disabled:opacity-30">Next</button>
                    </div>
                  </div>
                </>
              ) : <div className="p-8 text-center text-slate-500">No Data Available</div>}
            </div>
          )}

          {activeTab === 'statistics' && (
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {stats?.map(col => (
                <motion.div key={col.column_name} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl border border-slate-800/60 bg-slate-900/70 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-white truncate">{col.column_name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">{col.type}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px]">
                    <div className="flex justify-between"><span className="text-slate-500">Count</span><span className="text-slate-300 font-mono">{col.count.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Unique</span><span className="text-slate-300 font-mono">{col.unique_count.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Null%</span><span className={`font-mono ${col.null_pct > 10 ? 'text-amber-400' : 'text-slate-300'}`}>{col.null_pct}%</span></div>
                    {col.mean != null && <div className="flex justify-between"><span className="text-slate-500">Mean</span><span className="text-slate-300 font-mono">{col.mean.toLocaleString()}</span></div>}
                    {col.min != null && <div className="flex justify-between"><span className="text-slate-500">Min</span><span className="text-slate-300 font-mono">{col.min.toLocaleString()}</span></div>}
                    {col.max != null && <div className="flex justify-between"><span className="text-slate-500">Max</span><span className="text-slate-300 font-mono">{col.max.toLocaleString()}</span></div>}
                  </div>
                  {col.top_values && col.top_values.length > 0 && (
                    <div className="pt-2 border-t border-slate-800/40 space-y-1">
                      {col.top_values.slice(0, 3).map(v => (
                        <div key={v.value} className="flex items-center gap-2 text-[10px]">
                          <div className="flex-1 bg-slate-800 rounded-full h-1.5"><div className="bg-sky-500 h-1.5 rounded-full" style={{ width: `${Math.min(100, (v.count / col.count) * 100)}%` }} /></div>
                          <span className="text-slate-400 truncate max-w-[80px]">{v.value}</span>
                          <span className="text-slate-500 font-mono">{v.count}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
              {(!stats || stats.length === 0) && <div className="col-span-full p-8 text-center text-slate-500">No Data Available</div>}
            </div>
          )}

          {activeTab === 'quality' && quality && (
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="rounded-xl border border-slate-800/60 bg-slate-900/70 p-4 text-center">
                  <p className="text-2xl font-bold text-white font-mono">{quality.total_rows.toLocaleString()}</p>
                  <p className="text-xs text-slate-400">Total Rows</p>
                </div>
                <div className="rounded-xl border border-slate-800/60 bg-slate-900/70 p-4 text-center">
                  <p className="text-2xl font-bold text-white font-mono">{quality.total_columns}</p>
                  <p className="text-xs text-slate-400">Columns</p>
                </div>
                <div className="rounded-xl border border-slate-800/60 bg-slate-900/70 p-4 text-center">
                  <p className="text-2xl font-bold text-emerald-400 font-mono">{quality.completeness_pct}%</p>
                  <p className="text-xs text-slate-400">Completeness</p>
                </div>
                <div className="rounded-xl border border-slate-800/60 bg-slate-900/70 p-4 text-center">
                  <p className="text-2xl font-bold text-amber-400 font-mono">{quality.duplicate_count}</p>
                  <p className="text-xs text-slate-400">Duplicates</p>
                </div>
              </div>
              <div className="rounded-xl border border-slate-800/60 bg-slate-900/70 overflow-hidden">
                <table className="w-full text-xs">
                  <thead className="bg-slate-900/80"><tr>
                    <th className="px-3 py-2.5 text-left text-slate-400 font-semibold">Column</th>
                    <th className="px-3 py-2.5 text-right text-slate-400 font-semibold">Missing%</th>
                    <th className="px-3 py-2.5 text-right text-slate-400 font-semibold">Outliers</th>
                    <th className="px-3 py-2.5 text-right text-slate-400 font-semibold">Quality</th>
                    <th className="px-3 py-2.5 text-left text-slate-400 font-semibold w-32">Score</th>
                  </tr></thead>
                  <tbody className="divide-y divide-slate-800/40">
                    {quality.columns.map(col => (
                      <tr key={col.column_name} className="hover:bg-slate-800/30">
                        <td className="px-3 py-2 text-slate-300 font-mono">{col.column_name}</td>
                        <td className={`px-3 py-2 text-right font-mono ${col.missing_pct > 10 ? 'text-amber-400' : 'text-slate-400'}`}>{col.missing_pct}%</td>
                        <td className="px-3 py-2 text-right text-slate-400 font-mono">{col.outlier_count}</td>
                        <td className={`px-3 py-2 text-right font-mono font-semibold ${col.quality_score >= 90 ? 'text-emerald-400' : col.quality_score >= 70 ? 'text-amber-400' : 'text-rose-400'}`}>{col.quality_score}%</td>
                        <td className="px-3 py-2"><div className="bg-slate-800 rounded-full h-1.5 w-full"><div className={`h-1.5 rounded-full ${col.quality_score >= 90 ? 'bg-emerald-500' : col.quality_score >= 70 ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ width: `${col.quality_score}%` }} /></div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'sql' && (
            <div className="flex flex-col h-full">
              <div className="border-b border-slate-800/60">
                <div className="flex items-center justify-between p-2 bg-slate-900/50">
                  <span className="text-xs text-slate-400 font-mono px-2">DuckDB SQL Editor</span>
                  <button onClick={handleRunQuery} disabled={queryMutation.isPending} className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium text-white bg-sky-600 hover:bg-sky-500 rounded-lg transition-colors disabled:opacity-50">
                    <Play className="h-3.5 w-3.5" /> {queryMutation.isPending ? 'Running...' : 'Run Query'}
                  </button>
                </div>
                <div className="h-48">
                  <Editor height="100%" defaultLanguage="sql" value={sqlValue} onChange={v => setSqlValue(v || '')}
                    theme="vs-dark" options={{ minimap: { enabled: false }, fontSize: 13, lineNumbers: 'on', scrollBeyondLastLine: false, padding: { top: 8 } }} />
                </div>
              </div>
              <div className="flex-1 overflow-auto">
                {queryMutation.isPending && <div className="p-8 text-center"><div className="animate-spin h-6 w-6 border-2 border-sky-400 border-t-transparent rounded-full mx-auto" /><p className="text-xs text-slate-400 mt-2">Executing query...</p></div>}
                {queryMutation.isError && <div className="p-4 m-4 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm">{queryMutation.error.message}</div>}
                {queryMutation.data && (
                  <>
                    <div className="p-2 bg-slate-900/50 border-b border-slate-800/60 flex items-center gap-4 text-xs text-slate-400">
                      <span>{queryMutation.data.row_count} rows</span>
                      <span>{queryMutation.data.execution_time_ms}ms</span>
                    </div>
                    <table className="w-full text-xs">
                      <thead className="bg-slate-900/80 sticky top-0">
                        <tr>{queryMutation.data.columns.map(col => <th key={col} className="px-3 py-2 text-left text-slate-400 font-semibold whitespace-nowrap border-b border-slate-800/60">{col}</th>)}</tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/40">
                        {queryMutation.data.rows.map((row, i) => (
                          <tr key={i} className="hover:bg-slate-800/30">{queryMutation.data!.columns.map(col => <td key={col} className="px-3 py-2 text-slate-300 font-mono whitespace-nowrap">{row[col] != null ? String(row[col]) : <span className="text-slate-600">null</span>}</td>)}</tr>
                        ))}
                      </tbody>
                    </table>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataExplorerPage;
