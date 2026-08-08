import React from 'react';
import { BrainCircuit, Trophy, BarChart3, Target, Zap, Clock, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import ReactECharts from 'echarts-for-react';
import { useChampionModel, useModelComparison } from '@/api/enterpriseApi';
import { Skeleton } from '@/shared/ui/Skeleton';

const formatPct = (v: number) => v > 1 ? `${v.toFixed(1)}%` : `${(v * 100).toFixed(1)}%`;

const MetricGauge: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => {
  const pct = value > 1 ? value : value * 100;
  const opt = {
    series: [{
      type: 'gauge' as const, startAngle: 210, endAngle: -30, min: 0, max: 100,
      progress: { show: true, width: 14, itemStyle: { color } },
      axisLine: { lineStyle: { width: 14, color: [[1, '#1e293b']] } },
      axisTick: { show: false }, splitLine: { show: false }, axisLabel: { show: false },
      pointer: { show: false },
      title: { show: true, offsetCenter: [0, '65%'], fontSize: 11, color: '#94a3b8' },
      detail: { valueAnimation: true, fontSize: 22, fontWeight: 'bold', color: '#f8fafc', offsetCenter: [0, '25%'], formatter: (v: number) => `${v.toFixed(1)}%` },
      data: [{ value: parseFloat(pct.toFixed(1)), name: label }],
    }],
  };
  return <ReactECharts option={opt} style={{ height: 180 }} theme="dark" />;
};

const ModelCenterPage: React.FC = () => {
  const { data: champion, isLoading: champLoading } = useChampionModel();
  const { data: comparison, isLoading: compLoading } = useModelComparison();

  if (champLoading || compLoading) {
    return (
      <div className="p-6 space-y-6 max-w-[1800px] mx-auto">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-64 rounded-xl" />
        <Skeleton className="h-96 rounded-xl" />
      </div>
    );
  }

  const m = champion?.metrics;
  const hasMetrics = m && (m.accuracy > 0 || m.f1_score > 0);

  // Feature importance chart
  const fiOpt = champion?.feature_importance?.length ? {
    tooltip: { trigger: 'axis' as const },
    grid: { left: '30%', right: '4%', bottom: '3%', top: '3%', containLabel: false },
    xAxis: { type: 'value' as const, axisLabel: { color: '#94a3b8' }, splitLine: { lineStyle: { color: '#1e293b' } } },
    yAxis: { type: 'category' as const, data: champion.feature_importance.slice(0, 12).reverse().map(f => f.feature), axisLabel: { color: '#94a3b8', fontSize: 10 }, axisLine: { lineStyle: { color: '#334155' } } },
    series: [{ type: 'bar' as const, data: champion.feature_importance.slice(0, 12).reverse().map(f => f.importance), itemStyle: { color: '#8b5cf6', borderRadius: [0, 4, 4, 0] } }],
  } : null;

  return (
    <div className="p-6 space-y-6 max-w-[1800px] mx-auto w-full overflow-y-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-2">
          <BrainCircuit className="h-7 w-7 text-violet-400" /> Model Center
        </h1>
        <p className="text-sm text-slate-400 mt-1">Machine Learning Model Registry & Performance Monitoring</p>
      </motion.div>

      {/* Champion Model Spotlight */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-violet-500/30 bg-gradient-to-br from-violet-500/10 to-violet-600/5 backdrop-blur-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="h-5 w-5 text-amber-400" />
          <h2 className="text-lg font-bold text-white">Champion Model</h2>
          <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30 font-semibold uppercase">Active</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div>
            <p className="text-xs text-slate-400">Model Name</p>
            <p className="text-sm font-semibold text-white mt-1">{champion?.name || 'N/A'}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Type</p>
            <p className="text-sm font-semibold text-white mt-1">{champion?.type || 'N/A'}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Training Date</p>
            <p className="text-sm font-semibold text-white mt-1">{champion?.training_date || 'N/A'}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Dataset Size</p>
            <p className="text-sm font-semibold text-white mt-1">{champion?.dataset_size ? champion.dataset_size.toLocaleString() : 'N/A'}</p>
          </div>
        </div>

        {/* Metric Gauges */}
        {hasMetrics ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2">
            <MetricGauge label="Accuracy" value={m.accuracy} color="#10b981" />
            <MetricGauge label="Precision" value={m.precision} color="#0ea5e9" />
            <MetricGauge label="Recall" value={m.recall} color="#f59e0b" />
            <MetricGauge label="F1 Score" value={m.f1_score} color="#8b5cf6" />
            <MetricGauge label="ROC-AUC" value={m.roc_auc} color="#ec4899" />
          </div>
        ) : (
          <div className="text-center py-8 text-slate-500 text-sm">
            Model metrics will populate after training pipeline completes.
            {champion?.note && <p className="mt-1 text-xs">{champion.note}</p>}
          </div>
        )}
      </motion.div>

      {/* Feature Importance */}
      {fiOpt && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="rounded-xl border border-slate-800/60 bg-slate-900/70 backdrop-blur-xl p-5">
          <h3 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-violet-400" /> Feature Importance
          </h3>
          <ReactECharts option={fiOpt} style={{ height: 360 }} theme="dark" />
        </motion.div>
      )}

      {/* Model Comparison */}
      {comparison?.models && comparison.models.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="rounded-xl border border-slate-800/60 bg-slate-900/70 backdrop-blur-xl overflow-hidden">
          <div className="p-5 border-b border-slate-800/60">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-sky-400" /> Model Comparison
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-slate-900/80">
                <tr>
                  <th className="px-4 py-3 text-left text-slate-400 font-semibold">Model</th>
                  <th className="px-4 py-3 text-left text-slate-400 font-semibold">Type</th>
                  <th className="px-4 py-3 text-right text-slate-400 font-semibold">Accuracy</th>
                  <th className="px-4 py-3 text-right text-slate-400 font-semibold">Precision</th>
                  <th className="px-4 py-3 text-right text-slate-400 font-semibold">Recall</th>
                  <th className="px-4 py-3 text-right text-slate-400 font-semibold">F1</th>
                  <th className="px-4 py-3 text-right text-slate-400 font-semibold">ROC-AUC</th>
                  <th className="px-4 py-3 text-center text-slate-400 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {comparison.models.map(model => (
                  <tr key={model.name} className={`hover:bg-slate-800/30 ${model.is_champion ? 'bg-violet-500/5' : ''}`}>
                    <td className="px-4 py-3 text-slate-200 font-medium">
                      {model.name}
                      {model.is_champion && <Trophy className="h-3 w-3 text-amber-400 inline ml-1.5" />}
                    </td>
                    <td className="px-4 py-3 text-slate-400 font-mono">{model.type}</td>
                    <td className="px-4 py-3 text-right text-slate-300 font-mono">{model.metrics?.accuracy ? formatPct(model.metrics.accuracy) : '—'}</td>
                    <td className="px-4 py-3 text-right text-slate-300 font-mono">{model.metrics?.precision ? formatPct(model.metrics.precision) : '—'}</td>
                    <td className="px-4 py-3 text-right text-slate-300 font-mono">{model.metrics?.recall ? formatPct(model.metrics.recall) : '—'}</td>
                    <td className="px-4 py-3 text-right text-slate-300 font-mono">{model.metrics?.f1_score ? formatPct(model.metrics.f1_score) : '—'}</td>
                    <td className="px-4 py-3 text-right text-slate-300 font-mono">{model.metrics?.roc_auc ? formatPct(model.metrics.roc_auc) : '—'}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${model.is_champion ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' : 'bg-slate-800 text-slate-500 border border-slate-700/40'}`}>
                        {model.is_champion ? 'CHAMPION' : 'CANDIDATE'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {comparison.note && <p className="p-4 text-xs text-slate-500 border-t border-slate-800/40">{comparison.note}</p>}
        </motion.div>
      )}
    </div>
  );
};

export default ModelCenterPage;
