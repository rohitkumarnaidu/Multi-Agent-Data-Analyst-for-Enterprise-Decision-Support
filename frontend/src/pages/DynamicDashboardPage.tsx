import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
  TrendingUp, TrendingDown, BarChart3, Zap, AlertTriangle, CheckCircle2,
  Info, ShieldAlert, Lightbulb, Target
} from 'lucide-react';
import { motion } from 'framer-motion';
import ReactECharts from 'echarts-for-react';
import { apiClient } from '@/api/client';
import { useDatasetDiscovery } from '@/api/enterpriseApi';
import { Skeleton } from '@/shared/ui/Skeleton';
import type { DetectedDomain, KPIDefinition, ChartRecommendation, DomainInsight } from '@/types/discovery';

/* ─── Format Helpers ─── */
const formatValue = (value: number, format: string) => {
  if (format === 'currency') {
    if (Math.abs(value) >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
    if (Math.abs(value) >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    if (Math.abs(value) >= 1e3) return `$${(value / 1e3).toFixed(1)}K`;
    return `$${value.toFixed(0)}`;
  }
  if (format === 'percent') return `${value.toFixed(1)}%`;
  if (format === 'decimal') return value.toFixed(2);
  if (Math.abs(value) >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
  if (Math.abs(value) >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
  return value.toLocaleString();
};

/* ─── Dynamic KPI Card ─── */
const DynamicKPICard: React.FC<{
  kpi: KPIDefinition; color: string; delay: number;
}> = ({ kpi, color, delay }) => {
  const [value, setValue] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.post('/dataset/compute-kpi', { sql: kpi.sql })
      .then(res => setValue(res.data.value ?? 0))
      .catch(() => setValue(0))
      .finally(() => setLoading(false));
  }, [kpi.sql]);

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
      className="rounded-xl border border-slate-800/60 bg-slate-900/70 backdrop-blur-xl p-4 hover:border-slate-700/80 transition-all group relative overflow-hidden">
      <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">{kpi.label}</p>
      {loading ? <Skeleton className="h-8 w-24 mt-1" /> :
        <p className="text-xl font-bold text-white font-mono mt-1">{value !== null ? formatValue(value, kpi.format) : '—'}</p>
      }
      <p className="text-[9px] text-slate-500 mt-1 font-mono">{kpi.aggregation.toUpperCase()}({kpi.column})</p>
      <div className="absolute inset-x-0 bottom-0 h-0.5 opacity-50" style={{ backgroundColor: color }} />
    </motion.div>
  );
};

/* ─── Dynamic Chart Card ─── */
const DynamicChartCard: React.FC<{
  chart: ChartRecommendation; color: string; delay: number;
}> = ({ chart, color, delay }) => {
  const [data, setData] = useState<Record<string, any>[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.post('/dataset/compute-chart', { sql: chart.sql })
      .then(res => { setData(res.data.data || []); setColumns(res.data.columns || []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [chart.sql]);

  const buildOption = useCallback(() => {
    if (!data.length || !columns.length) return null;
    const xCol = columns[0];
    const yCol = columns.length > 1 ? columns[1] : columns[0];
    const labels = data.map(d => String(d[xCol]));
    const values = data.map(d => Number(d[yCol] || 0));

    const baseGrid = { left: '3%', right: '4%', bottom: '10%', containLabel: true };
    const axisStyle = { axisLabel: { color: '#94a3b8', fontSize: 10 }, axisLine: { lineStyle: { color: '#334155' } } };
    const splitStyle = { splitLine: { lineStyle: { color: '#1e293b' } } };

    if (chart.type === 'line') {
      return {
        tooltip: { trigger: 'axis' as const },
        grid: baseGrid,
        xAxis: { type: 'category' as const, data: labels, ...axisStyle, axisLabel: { ...axisStyle.axisLabel, rotate: labels.length > 8 ? 30 : 0 } },
        yAxis: { type: 'value' as const, ...axisStyle, ...splitStyle },
        series: [{ data: values, type: 'line' as const, smooth: true, areaStyle: { opacity: 0.12, color }, lineStyle: { color, width: 2 }, itemStyle: { color } }],
      };
    }
    if (chart.type === 'bar') {
      return {
        tooltip: { trigger: 'axis' as const },
        grid: baseGrid,
        xAxis: { type: 'category' as const, data: labels, ...axisStyle, axisLabel: { ...axisStyle.axisLabel, rotate: labels.length > 6 ? 35 : 0 } },
        yAxis: { type: 'value' as const, ...axisStyle, ...splitStyle },
        series: [{ data: values, type: 'bar' as const, itemStyle: { color, borderRadius: [4, 4, 0, 0] } }],
      };
    }
    if (chart.type === 'pie') {
      return {
        tooltip: { trigger: 'item' as const },
        series: [{
          type: 'pie' as const, radius: ['35%', '65%'],
          data: data.map(d => ({ name: String(d[xCol]), value: Number(d[yCol] || d[columns[1]] || 0) })),
          label: { color: '#94a3b8', fontSize: 10 },
          itemStyle: { borderColor: '#0f172a', borderWidth: 2 },
        }],
      };
    }
    if (chart.type === 'scatter') {
      return {
        tooltip: { trigger: 'item' as const },
        grid: baseGrid,
        xAxis: { type: 'value' as const, name: xCol.replace(/_/g, ' '), ...axisStyle, ...splitStyle },
        yAxis: { type: 'value' as const, name: yCol.replace(/_/g, ' '), ...axisStyle, ...splitStyle },
        series: [{ type: 'scatter' as const, data: data.map(d => [d[xCol], d[yCol]]), itemStyle: { color, opacity: 0.6 }, symbolSize: 6 }],
      };
    }
    if (chart.type === 'heatmap') {
      const xVals = [...new Set(data.map(d => String(d[columns[0]])))];
      const yVals = [...new Set(data.map(d => String(d[columns[1]])))];
      const heatData = data.map(d => [xVals.indexOf(String(d[columns[0]])), yVals.indexOf(String(d[columns[1]])), Number(d[columns[2]] || 0)]);
      const maxVal = Math.max(...heatData.map(d => d[2]), 1);
      return {
        tooltip: { position: 'top' as const },
        grid: { ...baseGrid, left: '15%', bottom: '25%' },
        xAxis: { type: 'category' as const, data: xVals, ...axisStyle, axisLabel: { ...axisStyle.axisLabel, rotate: 35 } },
        yAxis: { type: 'category' as const, data: yVals, ...axisStyle },
        visualMap: { min: 0, max: maxVal, calculable: true, orient: 'horizontal', left: 'center', bottom: '0', inRange: { color: ['#1e293b', color] }, textStyle: { color: '#94a3b8' } },
        series: [{ type: 'heatmap' as const, data: heatData, label: { show: heatData.length < 50, color: '#e2e8f0', fontSize: 9 }, itemStyle: { borderColor: '#0f172a', borderWidth: 1 } }],
      };
    }
    // Fallback bar
    return {
      tooltip: { trigger: 'axis' as const }, grid: baseGrid,
      xAxis: { type: 'category' as const, data: labels, ...axisStyle },
      yAxis: { type: 'value' as const, ...axisStyle, ...splitStyle },
      series: [{ data: values, type: 'bar' as const, itemStyle: { color, borderRadius: [4, 4, 0, 0] } }],
    };
  }, [data, columns, chart.type, color]);

  const option = buildOption();

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
      className="rounded-xl border border-slate-800/60 bg-slate-900/70 backdrop-blur-xl p-5">
      <h3 className="text-sm font-semibold text-slate-200 mb-3">{chart.title}</h3>
      {loading ? <Skeleton className="h-56 rounded-lg" /> :
        option ? <ReactECharts option={option} style={{ height: 240 }} theme="dark" /> :
        <div className="h-56 flex items-center justify-center text-slate-500 text-xs">No data available</div>
      }
    </motion.div>
  );
};

/* ─── Insight Card ─── */
const InsightTypeConfig: Record<string, { icon: React.ElementType; border: string; text: string }> = {
  success: { icon: CheckCircle2, border: 'border-emerald-500/30 bg-emerald-500/5', text: 'text-emerald-400' },
  warning: { icon: AlertTriangle, border: 'border-amber-500/30 bg-amber-500/5', text: 'text-amber-400' },
  critical: { icon: ShieldAlert, border: 'border-rose-500/30 bg-rose-500/5', text: 'text-rose-400' },
  info: { icon: Info, border: 'border-sky-500/30 bg-sky-500/5', text: 'text-sky-400' },
};

const DomainInsightCard: React.FC<{ insight: DomainInsight; delay: number }> = ({ insight, delay }) => {
  const cfg = InsightTypeConfig[insight.type] || InsightTypeConfig.info;
  const Icon = cfg.icon;
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay }}
      className={`rounded-xl border ${cfg.border} p-4 space-y-2 min-w-[300px] max-w-[360px] shrink-0`}>
      <div className="flex items-start gap-2">
        <Icon className={`h-5 w-5 ${cfg.text} shrink-0 mt-0.5`} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-200">{insight.title}</p>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">{insight.description}</p>
        </div>
        <div className="text-right shrink-0">
          <span className="text-lg font-bold text-sky-400 font-mono">{insight.confidence}%</span>
          <p className="text-[9px] text-slate-500 uppercase">confidence</p>
        </div>
      </div>
      <div className="rounded-lg bg-slate-800/50 px-3 py-2">
        <p className="text-[11px] text-sky-300"><Lightbulb className="h-3 w-3 inline mr-1" />{insight.recommendation}</p>
      </div>
      <div className="flex items-center justify-between">
        <span className={`text-[9px] uppercase font-semibold px-1.5 py-0.5 rounded ${insight.priority === 'critical' ? 'bg-rose-500/15 text-rose-400' : insight.priority === 'high' ? 'bg-amber-500/15 text-amber-400' : 'bg-slate-700/50 text-slate-400'}`}>
          {insight.priority} priority
        </span>
      </div>
    </motion.div>
  );
};

/* ─── Main Dynamic Dashboard ─── */
const DynamicDashboardPage: React.FC = () => {
  const { domainId } = useParams<{ domainId: string }>();
  const { data: discovery, isLoading } = useDatasetDiscovery();
  const [insights, setInsights] = useState<DomainInsight[]>([]);
  const [insightsLoading, setInsightsLoading] = useState(false);

  const domain = discovery?.detected_domains?.find(d => d.domain_id === domainId);

  useEffect(() => {
    if (domainId) {
      setInsightsLoading(true);
      apiClient.post('/dataset/domain-insights', { domain_id: domainId })
        .then(res => setInsights(res.data.insights || []))
        .catch(() => setInsights([]))
        .finally(() => setInsightsLoading(false));
    }
  }, [domainId]);

  if (isLoading) {
    return (
      <div className="p-6 space-y-6 max-w-[1800px] mx-auto">
        <Skeleton className="h-10 w-80" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">{Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}</div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-64 rounded-xl" />)}</div>
      </div>
    );
  }

  if (!domain) {
    return (
      <div className="p-6 max-w-[1800px] mx-auto">
        <div className="text-center py-20">
          <BarChart3 className="h-16 w-16 text-slate-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white">Domain Not Found</h2>
          <p className="text-slate-400 mt-2">The business domain "{domainId}" was not detected in the current dataset.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-[1800px] mx-auto w-full overflow-y-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: `${domain.color}22`, border: `1.5px solid ${domain.color}55` }}>
              <BarChart3 className="h-4 w-4" style={{ color: domain.color }} />
            </span>
            {domain.label}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Auto-detected from {domain.matched_columns.length} columns · {domain.confidence.toFixed(0)}% confidence · {discovery?.total_rows.toLocaleString()} records
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full animate-pulse" style={{ backgroundColor: domain.color }} />
          <span className="text-xs text-slate-400 font-mono">Dynamic Dashboard</span>
        </div>
      </motion.div>

      {/* Matched Columns Tags */}
      <div className="flex flex-wrap gap-1.5">
        {domain.matched_columns.map(col => (
          <span key={col} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-400 border border-slate-700/40 font-mono">
            {col}
          </span>
        ))}
      </div>

      {/* Dynamic KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
        {domain.kpi_definitions.map((kpi, i) => (
          <DynamicKPICard key={kpi.id} kpi={kpi} color={domain.color} delay={i * 0.03} />
        ))}
      </div>

      {/* Dynamic Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {domain.chart_recommendations.map((chart, i) => (
          <DynamicChartCard key={chart.id} chart={chart} color={domain.color} delay={0.1 + i * 0.05} />
        ))}
      </div>

      {/* AI Insights & Recommendations */}
      {(insights.length > 0 || insightsLoading) && (
        <div>
          <h3 className="text-sm font-semibold text-slate-200 mb-3 flex items-center gap-2">
            <Zap className="h-4 w-4 text-amber-400" /> AI Insights & Recommendations
          </h3>
          {insightsLoading ? (
            <div className="flex gap-4"><Skeleton className="h-40 w-80 rounded-xl" /><Skeleton className="h-40 w-80 rounded-xl" /></div>
          ) : (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {insights.map((ins, i) => <DomainInsightCard key={i} insight={ins} delay={i * 0.1} />)}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DynamicDashboardPage;
