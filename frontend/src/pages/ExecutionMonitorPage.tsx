import React, { useMemo } from 'react';
import { Activity, Clock, CheckCircle2, XCircle, ArrowRight, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { ReactFlow, Background, Controls, type Node, type Edge, Position, MarkerType } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const PIPELINE_NODES = [
  { id: 'user', label: 'User Query', color: '#64748b', icon: '💬' },
  { id: 'orchestrator', label: 'Intent Router', color: '#6366f1', icon: '🧭' },
  { id: 'knowledge', label: 'Knowledge (RAG)', color: '#0284c7', icon: '📚' },
  { id: 'data', label: 'Data Agent (SQL)', color: '#10b981', icon: '🗄️' },
  { id: 'analysis', label: 'Analysis Engine', color: '#ec4899', icon: '📊' },
  { id: 'anomaly', label: 'Anomaly / Risk', color: '#e11d48', icon: '🔍' },
  { id: 'simulation', label: 'Simulation', color: '#8b5cf6', icon: '🔮' },
  { id: 'narrative', label: 'Narrative Gen', color: '#f59e0b', icon: '✍️' },
  { id: 'validator', label: 'Zero-Trust Verify', color: '#0d9488', icon: '✅' },
  { id: 'response', label: 'Final Response', color: '#64748b', icon: '📤' },
];

const ExecutionMonitorPage: React.FC = () => {
  const nodes: Node[] = useMemo(() =>
    PIPELINE_NODES.map((n, i) => ({
      id: n.id,
      type: 'default',
      position: { x: 100 + (i % 5) * 260, y: 80 + Math.floor(i / 5) * 200 },
      data: {
        label: (
          <div className="text-center">
            <div className="text-lg mb-1">{n.icon}</div>
            <div className="text-xs font-semibold text-white">{n.label}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Idle</div>
          </div>
        ),
      },
      style: {
        background: `${n.color}22`,
        border: `1.5px solid ${n.color}66`,
        borderRadius: '12px',
        padding: '12px 16px',
        width: 160,
        color: '#fff',
      },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    })),
  []);

  const edges: Edge[] = useMemo(() => {
    const connections = [
      ['user', 'orchestrator'], ['orchestrator', 'knowledge'], ['orchestrator', 'data'],
      ['knowledge', 'analysis'], ['data', 'analysis'], ['analysis', 'anomaly'],
      ['analysis', 'simulation'], ['anomaly', 'narrative'], ['simulation', 'narrative'],
      ['narrative', 'validator'], ['validator', 'response'],
    ];
    return connections.map(([s, t], i) => ({
      id: `e-${s}-${t}`,
      source: s,
      target: t,
      animated: true,
      style: { stroke: '#334155', strokeWidth: 1.5 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#475569', width: 16, height: 16 },
    }));
  }, []);

  return (
    <div className="p-6 space-y-6 max-w-[1800px] mx-auto w-full overflow-y-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-2">
          <Activity className="h-7 w-7 text-sky-400" /> Execution Monitor
        </h1>
        <p className="text-sm text-slate-400 mt-1">LangGraph Pipeline — Real-Time Orchestration Visualization</p>
      </motion.div>

      {/* Pipeline Legend */}
      <div className="flex flex-wrap gap-2">
        {[
          { label: 'Idle', color: 'bg-slate-500' },
          { label: 'Processing', color: 'bg-sky-500 animate-pulse' },
          { label: 'Completed', color: 'bg-emerald-500' },
          { label: 'Failed', color: 'bg-rose-500' },
        ].map(s => (
          <div key={s.label} className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800/60 border border-slate-700/40">
            <span className={`flex h-2 w-2 rounded-full ${s.color}`} />
            <span className="text-[10px] text-slate-400">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Graph Canvas */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-slate-800/60 bg-slate-900/70 backdrop-blur-xl overflow-hidden"
        style={{ height: 520 }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          fitView
          attributionPosition="bottom-left"
          style={{ background: '#0a0f1a' }}
          proOptions={{ hideAttribution: true }}
        >
          <Background color="#1e293b" gap={24} />
          <Controls style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }} />
        </ReactFlow>
      </motion.div>

      {/* Info Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-slate-800/60 bg-slate-900/70 p-5 space-y-2">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2"><Zap className="h-4 w-4 text-amber-400" />How It Works</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            When you submit a query through the AI Analysis workspace, each node in this graph activates
            in sequence. The Orchestrator routes your intent to the appropriate agents, which process
            data in parallel where possible.
          </p>
        </div>
        <div className="rounded-xl border border-slate-800/60 bg-slate-900/70 p-5 space-y-2">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2"><Clock className="h-4 w-4 text-sky-400" />Execution Flow</h3>
          <div className="space-y-1.5">
            {['Intent Classification', 'Parallel Retrieval (RAG + SQL)', 'Deterministic Analysis', 'Risk & Anomaly Scan', 'Narrative Generation', 'Zero-Trust Validation'].map((step, i) => (
              <div key={step} className="flex items-center gap-2 text-xs text-slate-400">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-800 text-[10px] font-bold text-slate-300 shrink-0">{i + 1}</span>
                {step}
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-slate-800/60 bg-slate-900/70 p-5 space-y-2">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" />Guarantees</h3>
          <ul className="space-y-1.5 text-xs text-slate-400">
            <li className="flex items-start gap-1.5"><span className="text-emerald-400 mt-0.5">✓</span>Every number verified by Validator Agent</li>
            <li className="flex items-start gap-1.5"><span className="text-emerald-400 mt-0.5">✓</span>All SQL is deterministic — no LLM-generated numbers</li>
            <li className="flex items-start gap-1.5"><span className="text-emerald-400 mt-0.5">✓</span>Confidence scores attached to every response</li>
            <li className="flex items-start gap-1.5"><span className="text-emerald-400 mt-0.5">✓</span>Human-in-the-loop for low-confidence decisions</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ExecutionMonitorPage;
