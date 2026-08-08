import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart3, TrendingUp, Database, Zap, ArrowRight,
  AlertTriangle, CheckCircle2, ShieldAlert, Info, Lightbulb,
  Activity, Target, Layers, Users, DollarSign, BrainCircuit,
  Headphones, Shield, UserCheck
} from 'lucide-react';
import { motion } from 'framer-motion';
import ReactECharts from 'echarts-for-react';
import { apiClient } from '@/api/client';
import { useDatasetDiscovery } from '@/api/enterpriseApi';
import { Skeleton } from '@/shared/ui/Skeleton';
import type { DetectedDomain } from '@/types/discovery';

/* ─── Icon Map ─── */
const ICON_MAP: Record<string, React.ElementType> = {
  Users, TrendingUp, DollarSign, Activity, ShieldAlert, UserCheck, BrainCircuit, Headphones, Shield, BarChart3,
};

/* ─── Format ─── */
const fmt = (v: number, f: string) => {
  if (f === 'currency') {
    if (Math.abs(v) >= 1e9) return `$${(v / 1e9).toFixed(1)}B`;
    if (Math.abs(v) >= 1e6) return `$${(v / 1e6).toFixed(1)}M`;
    if (Math.abs(v) >= 1e3) return `$${(v / 1e3).toFixed(1)}K`;
    return `$${v.toFixed(0)}`;
  }
  if (f === 'percent') return `${v.toFixed(1)}%`;
  if (f === 'decimal') return v.toFixed(2);
  if (Math.abs(v) >= 1e6) return `${(v / 1e6).toFixed(1)}M`;
  if (Math.abs(v) >= 1e3) return `${(v / 1e3).toFixed(1)}K`;
  return v.toLocaleString();
};

/* ─── KPI Mini Card ─── */
const KPIMini: React.FC<{ label: string; sql: string; format: string; color: string }> = ({ label, sql, format, color }) => {
  const [val, setVal] = useState<number | null>(null);
  useEffect(() => {
    apiClient.post('/dataset/compute-kpi', { sql }).then(r => setVal(r.data.value ?? 0)).catch(() => setVal(0));
  }, [sql]);
  return (
    <div className="flex flex-col">
      <p className="text-[10px] text-slate-500 uppercase tracking-wider truncate">{label}</p>
      {val === null ? <Skeleton className="h-5 w-16 mt-0.5" /> :
        <p className="text-sm font-bold font-mono" style={{ color }}>{fmt(val, format)}</p>}
    </div>
  );
};

/* ─── Domain Overview Card ─── */
const DomainCard: React.FC<{ domain: DetectedDomain; delay: number }> = ({ domain, delay }) => {
  const Icon = ICON_MAP[domain.icon] || BarChart3;
  const topKPIs = domain.kpi_definitions.slice(0, 4);
  const topChart = domain.chart_recommendations[0];
  const [chartData, setChartData] = useState<Record<string, any>[]>([]);
  const [chartCols, setChartCols] = useState<string[]>([]);

  useEffect(() => {
    if (topChart) {
      apiClient.post('/dataset/compute-chart', { sql: topChart.sql })
        .then(r => { setChartData(r.data.data || []); setChartCols(r.data.columns || []); })
        .catch(() => {});
    }
  }, [topChart?.sql]);

  const sparkOpt = chartData.length && chartCols.length >= 2 ? {
    grid: { left: 0, right: 0, top: 4, bottom: 0 },
    xAxis: { type: 'category' as const, data: chartData.map(d => String(d[chartCols[0]])), show: false },
    yAxis: { type: 'value' as const, show: false },
    series: [{ type: (topChart?.type === 'bar' ? 'bar' : 'line') as any, data: chartData.map(d => Number(d[chartCols[1]] || 0)), smooth: true, showSymbol: false, lineStyle: { color: domain.color, width: 2 }, areaStyle: { opacity: 0.1, color: domain.color }, itemStyle: { color: domain.color, borderRadius: [2, 2, 0, 0] } }],
    tooltip: { show: false },
  } : null;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
      className="rounded-xl border border-slate-800/60 bg-slate-900/70 backdrop-blur-xl p-5 hover:border-slate-700/60 transition-all group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ backgroundColor: `${domain.color}18`, border: `1.5px solid ${domain.color}44` }}>
            <Icon className="h-4.5 w-4.5" style={{ color: domain.color }} />
          </span>
          <div>
            <h3 className="text-sm font-bold text-white">{domain.label}</h3>
            <p className="text-[10px] text-slate-500">{domain.matched_columns.length} columns · {domain.confidence.toFixed(0)}% match</p>
          </div>
        </div>
        <Link to={`/workspace/domain/${domain.domain_id}`}
          className="flex items-center gap-1 text-[10px] text-sky-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity hover:underline">
          Explore <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {topKPIs.map(kpi => (
          <KPIMini key={kpi.id} label={kpi.label} sql={kpi.sql} format={kpi.format} color={domain.color} />
        ))}
      </div>

      {/* Spark Chart */}
      {sparkOpt && <ReactECharts option={sparkOpt} style={{ height: 80 }} theme="dark" />}
    </motion.div>
  );
};

/* ─── Executive Dashboard ─── */
const DashboardPage: React.FC = () => {
  const { data: discovery, isLoading } = useDatasetDiscovery();

  if (isLoading) {
    return (
      <div className="p-6 space-y-6 max-w-[1800px] mx-auto">
        <Skeleton className="h-12 w-96" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}</div>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-72 rounded-xl" />)}</div>
      </div>
    );
  }

  const domains = discovery?.detected_domains || [];

  return (
    <div className="p-6 space-y-6 max-w-[1800px] mx-auto w-full overflow-y-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Enterprise Command Center</h1>
        <p className="text-sm text-slate-400 mt-1">
          Dynamic analysis of <span className="text-white font-semibold">{discovery?.table_name}</span>
          {' · '}{discovery?.total_rows.toLocaleString()} records · {discovery?.total_columns} columns
          {' · '}{domains.length} business domain{domains.length !== 1 ? 's' : ''} detected
        </p>
      </motion.div>

      {/* Dataset Overview Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-4">
          <p className="text-[10px] text-sky-400 uppercase font-medium">Total Records</p>
          <p className="text-2xl font-bold text-white font-mono mt-1">{discovery?.total_rows.toLocaleString()}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
          <p className="text-[10px] text-emerald-400 uppercase font-medium">Columns</p>
          <p className="text-2xl font-bold text-white font-mono mt-1">{discovery?.total_columns}</p>
          <p className="text-[10px] text-slate-500 mt-0.5">{discovery?.numeric_columns.length} numeric · {discovery?.categorical_columns.length} categorical</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4">
          <p className="text-[10px] text-violet-400 uppercase font-medium">Business Domains</p>
          <p className="text-2xl font-bold text-white font-mono mt-1">{domains.length}</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Auto-detected</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
          <p className="text-[10px] text-amber-400 uppercase font-medium">Date Columns</p>
          <p className="text-2xl font-bold text-white font-mono mt-1">{discovery?.date_columns.length}</p>
          <p className="text-[10px] text-slate-500 mt-0.5 truncate">{discovery?.date_columns.join(', ') || 'None'}</p>
        </motion.div>
      </div>

      {/* Dynamic Domain Cards */}
      {domains.length > 0 ? (
        <>
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-sky-400" />
            <h2 className="text-sm font-semibold text-slate-200">Detected Business Domains</h2>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">{domains.length}</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {domains.map((domain, i) => <DomainCard key={domain.domain_id} domain={domain} delay={0.05 + i * 0.05} />)}
          </div>
        </>
      ) : (
        <div className="rounded-xl border border-slate-800/60 bg-slate-900/70 p-12 text-center">
          <Database className="h-12 w-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white">No Business Domains Detected</h3>
          <p className="text-sm text-slate-400 mt-2 max-w-md mx-auto">
            Upload a dataset with business-relevant columns (Revenue, Employees, Tickets, etc.)
            and the platform will automatically generate domain-specific dashboards.
          </p>
        </div>
      )}

      {/* Column Overview */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="rounded-xl border border-slate-800/60 bg-slate-900/70 backdrop-blur-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800/60 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Database className="h-4 w-4 text-sky-400" /> Column Schema
          </h3>
          <Link to="/data-explorer" className="text-[11px] text-sky-400 hover:underline flex items-center gap-1">
            Open Data Explorer <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="overflow-x-auto max-h-72 overflow-y-auto">
          <table className="w-full text-xs">
            <thead className="bg-slate-900/80 sticky top-0 z-10">
              <tr>
                <th className="px-3 py-2 text-left text-slate-400 font-semibold">Column</th>
                <th className="px-3 py-2 text-left text-slate-400 font-semibold">Type</th>
                <th className="px-3 py-2 text-left text-slate-400 font-semibold">Semantic</th>
                <th className="px-3 py-2 text-right text-slate-400 font-semibold">Unique</th>
                <th className="px-3 py-2 text-right text-slate-400 font-semibold">Null%</th>
                <th className="px-3 py-2 text-right text-slate-400 font-semibold">Min</th>
                <th className="px-3 py-2 text-right text-slate-400 font-semibold">Max</th>
                <th className="px-3 py-2 text-right text-slate-400 font-semibold">Mean</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {discovery?.columns.map(col => (
                <tr key={col.column_name} className="hover:bg-slate-800/30">
                  <td className="px-3 py-2 text-slate-200 font-mono">{col.column_name}</td>
                  <td className="px-3 py-2 text-slate-400 font-mono text-[10px]">{col.dtype}</td>
                  <td className="px-3 py-2">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                      col.semantic_type === 'numeric' ? 'bg-emerald-500/15 text-emerald-400' :
                      col.semantic_type === 'categorical' ? 'bg-sky-500/15 text-sky-400' :
                      col.semantic_type === 'datetime' ? 'bg-amber-500/15 text-amber-400' :
                      col.semantic_type === 'boolean' ? 'bg-violet-500/15 text-violet-400' :
                      'bg-slate-700/50 text-slate-400'
                    }`}>{col.semantic_type}</span>
                  </td>
                  <td className="px-3 py-2 text-right text-slate-400 font-mono">{col.unique_count.toLocaleString()}</td>
                  <td className={`px-3 py-2 text-right font-mono ${col.null_pct > 5 ? 'text-amber-400' : 'text-slate-400'}`}>{col.null_pct}%</td>
                  <td className="px-3 py-2 text-right text-slate-400 font-mono">{col.min_val != null ? col.min_val.toLocaleString() : '—'}</td>
                  <td className="px-3 py-2 text-right text-slate-400 font-mono">{col.max_val != null ? col.max_val.toLocaleString() : '—'}</td>
                  <td className="px-3 py-2 text-right text-slate-400 font-mono">{col.mean_val != null ? col.mean_val.toLocaleString() : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardPage;
