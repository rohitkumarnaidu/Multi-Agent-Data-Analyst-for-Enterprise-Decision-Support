import React from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'
import { StatusBadge } from '@/shared/ui/StatusBadge'
import {
  Bot,
  Brain,
  Database,
  LineChart,
  ShieldAlert,
  Cpu,
  CheckCircle,
  FileText,
  History,
  Layers,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/shared/utils/cn'
import type { AgentNodeData } from '@/shared/types'

const agentIcons: Record<string, React.ReactNode> = {
  orchestrator: <Bot className="h-4 w-4 text-cyan-400" />,
  knowledge: <Brain className="h-4 w-4 text-purple-400" />,
  data: <Database className="h-4 w-4 text-blue-400" />,
  analysis: <LineChart className="h-4 w-4 text-emerald-400" />,
  anomaly: <ShieldAlert className="h-4 w-4 text-rose-400" />,
  simulation: <Cpu className="h-4 w-4 text-amber-400" />,
  validator: <CheckCircle className="h-4 w-4 text-teal-400" />,
  narrative: <Sparkles className="h-4 w-4 text-indigo-400" />,
  memory: <History className="h-4 w-4 text-pink-400" />,
  report: <FileText className="h-4 w-4 text-slate-300" />,
}

export const AgentGraphNode: React.FC<NodeProps> = ({ data, selected }) => {
  const nodeData = data as unknown as AgentNodeData
  const icon = agentIcons[nodeData.id] || <Layers className="h-4 w-4 text-cyan-400" />
  const isRunning = nodeData.status === 'running'
  const isCompleted = nodeData.status === 'completed'
  const isWaitingApproval = nodeData.status === 'requires_approval'

  return (
    <div
      className={cn(
        'w-64 rounded-xl p-3.5 transition-all duration-200 backdrop-blur-md bg-slate-900/90 border shadow-lg',
        selected
          ? 'ring-2 ring-cyan-400 border-cyan-400/80 shadow-glow-cyan'
          : isRunning
          ? 'border-cyan-400 animate-pulse shadow-glow-cyan'
          : isWaitingApproval
          ? 'border-amber-400 shadow-glow-amber'
          : isCompleted
          ? 'border-emerald-500/60'
          : 'border-slate-800 hover:border-slate-700'
      )}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-2.5 h-2.5 bg-slate-600 border border-slate-400 !top-[-5px]"
      />

      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/60">
            {icon}
          </div>
          <div>
            <div className="font-semibold text-xs text-slate-100 leading-tight">
              {nodeData.label}
            </div>
            <div className="text-[10px] text-slate-400 truncate max-w-[120px]">
              {nodeData.role}
            </div>
          </div>
        </div>

        <StatusBadge status={nodeData.status} size="sm" />
      </div>

      {nodeData.activeTool && (
        <div className="mt-2 text-[10px] font-mono text-cyan-300 bg-cyan-950/60 border border-cyan-500/20 px-2 py-0.5 rounded flex items-center justify-between">
          <span className="truncate">Tool: {nodeData.activeTool}</span>
        </div>
      )}

      {nodeData.executionTimeSec !== undefined && nodeData.executionTimeSec > 0 && (
        <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-800/80 pt-1.5 font-mono">
          <span>Latency:</span>
          <span className="text-slate-200">{nodeData.executionTimeSec.toFixed(2)}s</span>
        </div>
      )}

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2.5 h-2.5 bg-cyan-500 border border-cyan-300 !bottom-[-5px]"
      />
    </div>
  )
}

export default AgentGraphNode
