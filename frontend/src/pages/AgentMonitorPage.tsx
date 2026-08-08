import React from 'react';
import { Cpu, Activity, Clock, Zap, CheckCircle2, XCircle, Loader2, Pause } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAgentsList } from '@/api/enterpriseApi';
import { Skeleton } from '@/shared/ui/Skeleton';

const STATUS_CONFIG: Record<string, { color: string; bg: string; icon: React.ElementType; label: string }> = {
  idle: { color: 'text-slate-400', bg: 'bg-slate-500/15 border-slate-500/30', icon: Pause, label: 'Idle' },
  running: { color: 'text-sky-400', bg: 'bg-sky-500/15 border-sky-500/30', icon: Loader2, label: 'Running' },
  completed: { color: 'text-emerald-400', bg: 'bg-emerald-500/15 border-emerald-500/30', icon: CheckCircle2, label: 'Completed' },
  failed: { color: 'text-rose-400', bg: 'bg-rose-500/15 border-rose-500/30', icon: XCircle, label: 'Failed' },
  waiting: { color: 'text-amber-400', bg: 'bg-amber-500/15 border-amber-500/30', icon: Clock, label: 'Waiting' },
};

const HEALTH_COLORS: Record<string, string> = {
  healthy: 'bg-emerald-400',
  degraded: 'bg-amber-400',
  offline: 'bg-rose-400',
};

const AGENT_COLORS: Record<string, string> = {
  'Orchestrator': 'from-indigo-500/20 to-indigo-600/5 border-indigo-500/30',
  'Knowledge Agent': 'from-sky-500/20 to-sky-600/5 border-sky-500/30',
  'Data Agent': 'from-emerald-500/20 to-emerald-600/5 border-emerald-500/30',
  'Analysis Agent': 'from-pink-500/20 to-pink-600/5 border-pink-500/30',
  'Anomaly Agent': 'from-rose-500/20 to-rose-600/5 border-rose-500/30',
  'Simulation Agent': 'from-violet-500/20 to-violet-600/5 border-violet-500/30',
  'Narrative Agent': 'from-amber-500/20 to-amber-600/5 border-amber-500/30',
  'Validator Agent': 'from-teal-500/20 to-teal-600/5 border-teal-500/30',
  'Report Agent': 'from-cyan-500/20 to-cyan-600/5 border-cyan-500/30',
};

const AgentMonitorPage: React.FC = () => {
  const { data: agents, isLoading } = useAgentsList();

  if (isLoading) {
    return (
      <div className="p-6 space-y-6 max-w-[1800px] mx-auto">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, i) => <Skeleton key={i} className="h-56 rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-[1800px] mx-auto w-full overflow-y-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-2">
          <Cpu className="h-7 w-7 text-sky-400" /> Agent Monitor
        </h1>
        <p className="text-sm text-slate-400 mt-1">Multi-Agent Orchestration — Real-Time Agent Status & Health</p>
      </motion.div>

      {/* Summary Bar */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/40">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
          <span className="text-xs text-slate-300 font-medium">{agents?.filter(a => a.health === 'healthy').length || 0} Healthy</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/40">
          <span className="text-xs text-slate-400">{agents?.length || 0} Total Agents</span>
        </div>
      </div>

      {/* Agent Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {agents?.map((agent, i) => {
          const statusCfg = STATUS_CONFIG[agent.status] || STATUS_CONFIG.idle;
          const StatusIcon = statusCfg.icon;
          const gradientClass = AGENT_COLORS[agent.name] || 'from-slate-500/20 to-slate-600/5 border-slate-500/30';

          return (
            <motion.div key={agent.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className={`rounded-xl border bg-gradient-to-br ${gradientClass} backdrop-blur-xl p-5 space-y-4 hover:scale-[1.01] transition-transform`}>
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">{agent.name}</h3>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">{agent.type}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`flex h-2.5 w-2.5 rounded-full ${HEALTH_COLORS[agent.health] || 'bg-slate-400'} ${agent.health === 'healthy' ? 'animate-pulse' : ''}`} />
                  <span className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold border ${statusCfg.bg} ${statusCfg.color}`}>
                    <StatusIcon className={`h-3 w-3 ${agent.status === 'running' ? 'animate-spin' : ''}`} />
                    {statusCfg.label}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{agent.description}</p>

              {/* Capabilities */}
              <div className="flex flex-wrap gap-1">
                {agent.capabilities.slice(0, 4).map(cap => (
                  <span key={cap} className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-400 border border-slate-700/40">{cap}</span>
                ))}
              </div>

              {/* Metrics Row */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/5">
                <div className="text-center">
                  <p className="text-xs font-mono text-slate-300">{agent.execution_time_ms ? `${agent.execution_time_ms}ms` : '—'}</p>
                  <p className="text-[9px] text-slate-500">Exec Time</p>
                </div>
                <div className="text-center">
                  <p className="text-xs font-mono text-slate-300">{agent.queue_depth}</p>
                  <p className="text-[9px] text-slate-500">Queue</p>
                </div>
                <div className="text-center">
                  <p className="text-xs font-mono text-slate-300">{agent.memory_used_mb ? `${agent.memory_used_mb}MB` : '—'}</p>
                  <p className="text-[9px] text-slate-500">Memory</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {(!agents || agents.length === 0) && (
        <div className="text-center py-12 text-slate-500">No agent data available</div>
      )}
    </div>
  );
};

export default AgentMonitorPage;
