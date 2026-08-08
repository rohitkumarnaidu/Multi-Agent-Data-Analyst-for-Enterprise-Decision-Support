import React from 'react';
import { Layers, MessageSquare, HardDrive, Clock, Database, Archive } from 'lucide-react';
import { motion } from 'framer-motion';
import ReactECharts from 'echarts-for-react';
import { useMemoryThreads, useMemoryUsage } from '@/api/enterpriseApi';
import { Skeleton } from '@/shared/ui/Skeleton';

const MemoryCenterPage: React.FC = () => {
  const { data: threads, isLoading: threadsLoading } = useMemoryThreads();
  const { data: usage, isLoading: usageLoading } = useMemoryUsage();

  if (threadsLoading || usageLoading) {
    return <div className="p-6 space-y-4 max-w-[1800px] mx-auto"><Skeleton className="h-10 w-64" /><Skeleton className="h-96 rounded-xl" /></div>;
  }

  const storageGaugeOpt = {
    series: [{
      type: 'gauge' as const, startAngle: 210, endAngle: -30, min: 0, max: 100,
      progress: { show: true, width: 18, itemStyle: { color: '#0ea5e9' } },
      axisLine: { lineStyle: { width: 18, color: [[1, '#1e293b']] } },
      axisTick: { show: false }, splitLine: { show: false }, axisLabel: { show: false },
      pointer: { show: false },
      title: { show: true, offsetCenter: [0, '65%'], fontSize: 12, color: '#94a3b8' },
      detail: { valueAnimation: true, fontSize: 28, fontWeight: 'bold', color: '#f8fafc', offsetCenter: [0, '20%'], formatter: '{value} MB' },
      data: [{ value: parseFloat(((usage?.db_size_mb || 0) + (usage?.checkpoint_db_size_mb || 0)).toFixed(1)), name: 'Total Storage' }],
    }],
  };

  return (
    <div className="p-6 space-y-6 max-w-[1800px] mx-auto w-full overflow-y-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-2">
          <Layers className="h-7 w-7 text-sky-400" /> Memory Center
        </h1>
        <p className="text-sm text-slate-400 mt-1">Conversation Memory & State Persistence — Session Management</p>
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Conversation Threads', value: usage?.total_threads ?? threads?.length ?? 0, icon: MessageSquare, color: 'text-sky-400' },
          { label: 'Checkpoints', value: usage?.total_checkpoints ?? 0, icon: Archive, color: 'text-violet-400' },
          { label: 'Session DB', value: `${(usage?.db_size_mb || 0).toFixed(1)} MB`, icon: Database, color: 'text-emerald-400' },
          { label: 'Checkpoint DB', value: `${(usage?.checkpoint_db_size_mb || 0).toFixed(1)} MB`, icon: HardDrive, color: 'text-amber-400' },
        ].map(s => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-slate-800/60 bg-slate-900/70 p-4">
            <div className="flex items-center gap-2">
              <s.icon className={`h-4 w-4 ${s.color}`} />
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">{s.label}</span>
            </div>
            <p className="text-xl font-bold text-white font-mono mt-2">{typeof s.value === 'number' ? s.value.toLocaleString() : s.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Storage Gauge */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-slate-800/60 bg-slate-900/70 backdrop-blur-xl p-5">
          <h3 className="text-sm font-semibold text-slate-200 mb-2">Memory Storage Usage</h3>
          <ReactECharts option={storageGaugeOpt} style={{ height: 240 }} theme="dark" />
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div className="flex items-center gap-2 text-xs">
              <span className="flex h-3 w-3 rounded-sm bg-sky-500" />
              <span className="text-slate-400">Session Store</span>
              <span className="ml-auto text-slate-300 font-mono">{(usage?.db_size_mb || 0).toFixed(1)} MB</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="flex h-3 w-3 rounded-sm bg-violet-500" />
              <span className="text-slate-400">LangGraph Checkpoints</span>
              <span className="ml-auto text-slate-300 font-mono">{(usage?.checkpoint_db_size_mb || 0).toFixed(1)} MB</span>
            </div>
          </div>
        </motion.div>

        {/* Memory Architecture */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="rounded-xl border border-slate-800/60 bg-slate-900/70 backdrop-blur-xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-slate-200">Memory Architecture</h3>
          <div className="space-y-3">
            {[
              { title: 'Short-Term Memory', desc: 'Current session context, recent messages, active thread state', color: 'border-sky-500/40 bg-sky-500/5', dot: 'bg-sky-400' },
              { title: 'Long-Term Memory', desc: 'SQLite-persisted session history, conversation checkpoints, feedback loop', color: 'border-violet-500/40 bg-violet-500/5', dot: 'bg-violet-400' },
              { title: 'LangGraph Checkpoints', desc: 'Full graph execution state snapshots for reproducibility and resume', color: 'border-emerald-500/40 bg-emerald-500/5', dot: 'bg-emerald-400' },
              { title: 'Knowledge Memory', desc: 'ChromaDB vectors + BM25 index for hybrid retrieval context', color: 'border-amber-500/40 bg-amber-500/5', dot: 'bg-amber-400' },
            ].map(layer => (
              <div key={layer.title} className={`rounded-lg border ${layer.color} p-3`}>
                <div className="flex items-center gap-2">
                  <span className={`flex h-2 w-2 rounded-full ${layer.dot}`} />
                  <span className="text-xs font-semibold text-slate-200">{layer.title}</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 pl-4">{layer.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Thread List */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="rounded-xl border border-slate-800/60 bg-slate-900/70 backdrop-blur-xl overflow-hidden">
        <div className="p-5 border-b border-slate-800/60">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Clock className="h-4 w-4 text-sky-400" /> Conversation Threads
          </h3>
        </div>
        {threads && threads.length > 0 ? (
          <div className="divide-y divide-slate-800/40">
            {threads.map((t: any, i: number) => (
              <div key={i} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-800/30 transition-colors">
                <MessageSquare className="h-4 w-4 text-slate-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-200 font-mono truncate">{t.thread_id || t.session_id || `Thread ${i + 1}`}</p>
                  <p className="text-[10px] text-slate-500">{t.message_count || 0} messages · {t.last_active || 'Unknown'}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-slate-500 text-sm">No conversation threads recorded yet. Start a conversation in AI Analysis.</div>
        )}
      </motion.div>
    </div>
  );
};

export default MemoryCenterPage;
