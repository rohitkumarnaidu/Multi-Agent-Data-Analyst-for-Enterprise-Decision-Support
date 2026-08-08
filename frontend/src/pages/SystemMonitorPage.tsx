import React from 'react';
import { Server, Cpu, HardDrive, MemoryStick, Gauge, Activity, Wifi, WifiOff, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import ReactECharts from 'echarts-for-react';
import { useSystemTelemetry } from '@/api/enterpriseApi';
import { useSystemHealth } from '@/api/systemApi';
import { Skeleton } from '@/shared/ui/Skeleton';

const ResourceGauge: React.FC<{ label: string; value: number; color: string; unit?: string }> = ({ label, value, color, unit = '%' }) => {
  const opt = {
    series: [{
      type: 'gauge' as const, startAngle: 210, endAngle: -30, min: 0, max: 100,
      progress: { show: true, width: 12, itemStyle: { color } },
      axisLine: { lineStyle: { width: 12, color: [[1, '#1e293b']] } },
      axisTick: { show: false }, splitLine: { show: false }, axisLabel: { show: false },
      pointer: { show: false },
      title: { show: true, offsetCenter: [0, '70%'], fontSize: 11, color: '#94a3b8' },
      detail: { valueAnimation: true, fontSize: 20, fontWeight: 'bold', color: '#f8fafc', offsetCenter: [0, '25%'], formatter: `{value}${unit}` },
      data: [{ value: parseFloat(value.toFixed(1)), name: label }],
    }],
  };
  return <ReactECharts option={opt} style={{ height: 160 }} theme="dark" />;
};

const STATUS_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  online: { bg: 'bg-emerald-500/15 border-emerald-500/30', text: 'text-emerald-400', dot: 'bg-emerald-400' },
  offline: { bg: 'bg-rose-500/15 border-rose-500/30', text: 'text-rose-400', dot: 'bg-rose-400' },
  degraded: { bg: 'bg-amber-500/15 border-amber-500/30', text: 'text-amber-400', dot: 'bg-amber-400' },
};

const SystemMonitorPage: React.FC = () => {
  const { data: telemetry, isLoading } = useSystemTelemetry();
  const { data: health } = useSystemHealth();

  if (isLoading) {
    return <div className="p-6 space-y-4 max-w-[1800px] mx-auto"><Skeleton className="h-10 w-64" /><Skeleton className="h-96 rounded-xl" /></div>;
  }

  const formatUptime = (sec: number) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  return (
    <div className="p-6 space-y-6 max-w-[1800px] mx-auto w-full overflow-y-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-2">
            <Server className="h-7 w-7 text-sky-400" /> System Monitor
          </h1>
          <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/15 text-rose-400 border border-rose-500/30 font-semibold uppercase">Developer Only</span>
        </div>
        <p className="text-sm text-slate-400 mt-1">Infrastructure Health — Service Status & Resource Monitoring</p>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="rounded-xl border border-slate-800/60 bg-slate-900/70 p-4">
          <p className="text-[10px] text-slate-400 uppercase">Python</p>
          <p className="text-sm font-semibold text-white font-mono mt-1">{telemetry?.python_version || 'N/A'}</p>
        </div>
        <div className="rounded-xl border border-slate-800/60 bg-slate-900/70 p-4">
          <p className="text-[10px] text-slate-400 uppercase">Platform</p>
          <p className="text-sm font-semibold text-white font-mono mt-1 truncate">{telemetry?.platform?.split('-').slice(0, 2).join(' ') || 'N/A'}</p>
        </div>
        <div className="rounded-xl border border-slate-800/60 bg-slate-900/70 p-4">
          <p className="text-[10px] text-slate-400 uppercase">LLM Provider</p>
          <p className="text-sm font-semibold text-white font-mono mt-1">{telemetry?.llm_provider || 'N/A'}</p>
        </div>
        <div className="rounded-xl border border-slate-800/60 bg-slate-900/70 p-4">
          <p className="text-[10px] text-slate-400 uppercase flex items-center gap-1"><Clock className="h-3 w-3" /> Uptime</p>
          <p className="text-sm font-semibold text-white font-mono mt-1">{formatUptime(telemetry?.uptime_sec || 0)}</p>
        </div>
      </div>

      {/* Resource Gauges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-slate-800/60 bg-slate-900/70 backdrop-blur-xl p-4">
          <ResourceGauge label="CPU Usage" value={telemetry?.cpu_percent || 0} color="#0ea5e9" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="rounded-xl border border-slate-800/60 bg-slate-900/70 backdrop-blur-xl p-4">
          <ResourceGauge label="Memory" value={telemetry?.memory_percent || 0} color="#8b5cf6" />
          <p className="text-center text-[10px] text-slate-500 font-mono -mt-2">
            {((telemetry?.memory_used_mb || 0) / 1024).toFixed(1)} / {((telemetry?.memory_total_mb || 0) / 1024).toFixed(1)} GB
          </p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="rounded-xl border border-slate-800/60 bg-slate-900/70 backdrop-blur-xl p-4">
          <ResourceGauge label="Disk" value={telemetry?.disk_total_gb ? (telemetry.disk_used_gb / telemetry.disk_total_gb) * 100 : 0} color="#10b981" />
          <p className="text-center text-[10px] text-slate-500 font-mono -mt-2">
            {(telemetry?.disk_used_gb || 0).toFixed(0)} / {(telemetry?.disk_total_gb || 0).toFixed(0)} GB
          </p>
        </motion.div>
      </div>

      {/* Service Status Grid */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="rounded-xl border border-slate-800/60 bg-slate-900/70 backdrop-blur-xl overflow-hidden">
        <div className="p-5 border-b border-slate-800/60">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Activity className="h-4 w-4 text-sky-400" /> Service Status
          </h3>
        </div>
        <div className="divide-y divide-slate-800/40">
          {telemetry?.services?.map((svc, i) => {
            const sc = STATUS_COLORS[svc.status] || STATUS_COLORS.offline;
            return (
              <div key={i} className="flex items-center gap-4 px-5 py-3 hover:bg-slate-800/20 transition-colors">
                <div className="flex items-center gap-2 w-48 shrink-0">
                  <span className={`flex h-2.5 w-2.5 rounded-full ${sc.dot} ${svc.status === 'online' ? 'animate-pulse' : ''}`} />
                  <span className="text-sm text-slate-200 font-medium">{svc.name}</span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded font-semibold border ${sc.bg} ${sc.text} uppercase w-20 text-center`}>
                  {svc.status}
                </span>
                {svc.version && <span className="text-xs text-slate-400 font-mono">{svc.version}</span>}
                {svc.response_time_ms && <span className="text-xs text-slate-500 font-mono">{svc.response_time_ms}ms</span>}
                <span className="flex-1 text-xs text-slate-500 text-right truncate">{svc.details || ''}</span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Health Check */}
      {health && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="rounded-xl border border-slate-800/60 bg-slate-900/70 p-5">
          <h3 className="text-sm font-semibold text-slate-200 mb-3">API Health Check</h3>
          <pre className="text-xs text-slate-400 font-mono bg-slate-800/50 rounded-lg p-4 overflow-auto max-h-48">
            {JSON.stringify(health, null, 2)}
          </pre>
        </motion.div>
      )}
    </div>
  );
};

export default SystemMonitorPage;
