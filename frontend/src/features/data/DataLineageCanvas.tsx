import React, { useMemo } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  MarkerType,
  BackgroundVariant,
  Handle,
  Position,
  NodeProps,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { Badge } from '@/shared/ui/Badge'
import {
  Database,
  Layers,
  Cpu,
  LayoutDashboard,
  Zap,
  CheckCircle2,
  HardDrive,
  GitBranch,
} from 'lucide-react'
import type { LineageNode, LineageEdge } from '@/shared/types'
import { cn } from '@/shared/utils/cn'

interface LineageNodeData extends Record<string, unknown> {
  label: string
  nodeType: LineageNode['type']
  technology: string
  recordCount?: number
  sla?: string
  status: 'healthy' | 'warning' | 'syncing'
}

const lineageIcons: Record<LineageNode['type'], React.ReactNode> = {
  source: <HardDrive className="h-4 w-4 text-blue-400" />,
  pipeline: <Zap className="h-4 w-4 text-amber-400" />,
  storage: <Database className="h-4 w-4 text-cyan-400" />,
  feature_store: <Layers className="h-4 w-4 text-purple-400" />,
  model: <Cpu className="h-4 w-4 text-rose-400" />,
  consumption: <LayoutDashboard className="h-4 w-4 text-emerald-400" />,
}

const CustomLineageNode: React.FC<NodeProps> = ({ data, selected }) => {
  const nodeData = data as unknown as LineageNodeData
  const icon = lineageIcons[nodeData.nodeType] || <GitBranch className="h-4 w-4 text-cyan-400" />

  return (
    <div
      className={cn(
        'w-64 rounded-xl p-3.5 backdrop-blur-md bg-slate-900/90 border shadow-lg transition-all',
        selected
          ? 'border-cyan-400 ring-2 ring-cyan-400 shadow-glow-cyan'
          : 'border-slate-800 hover:border-slate-700'
      )}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="w-2.5 h-2.5 bg-slate-600 border border-slate-400 !left-[-5px]"
      />

      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-slate-800 border border-slate-700/80">
            {icon}
          </div>
          <div>
            <div className="font-semibold text-xs text-slate-100 leading-tight">
              {nodeData.label}
            </div>
            <div className="text-[10px] text-cyan-400 font-mono">
              {nodeData.technology}
            </div>
          </div>
        </div>

        <Badge variant="success" size="sm" pulseDot>
          {nodeData.status.toUpperCase()}
        </Badge>
      </div>

      <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-400">
        {nodeData.recordCount !== undefined && (
          <span>{nodeData.recordCount.toLocaleString()} Rows</span>
        )}
        {nodeData.sla && <span className="text-amber-400">SLA: {nodeData.sla}</span>}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="w-2.5 h-2.5 bg-cyan-500 border border-cyan-300 !right-[-5px]"
      />
    </div>
  )
}

const nodeTypes = {
  lineageNode: CustomLineageNode,
}

interface DataLineageCanvasProps {
  lineage: {
    nodes: LineageNode[]
    edges: LineageEdge[]
  }
}

export const DataLineageCanvas: React.FC<DataLineageCanvasProps> = ({ lineage }) => {
  const initialNodes: Node[] = useMemo(() => {
    // Map layout positions by pipeline stage
    const positions: Record<string, { x: number; y: number }> = {
      'src-erp': { x: 50, y: 80 },
      'src-wms': { x: 50, y: 260 },
      'pipe-cleaning': { x: 380, y: 170 },
      'lake-duckdb': { x: 710, y: 170 },
      'store-features': { x: 1040, y: 80 },
      'model-xgboost': { x: 1370, y: 80 },
      'cons-dashboard': { x: 1370, y: 260 },
    }

    return lineage.nodes.map(n => ({
      id: n.id,
      type: 'lineageNode',
      position: positions[n.id] || { x: 100, y: 100 },
      data: {
        label: n.label,
        nodeType: n.type,
        technology: n.technology,
        recordCount: n.recordCount,
        sla: n.sla,
        status: n.status,
      } as LineageNodeData,
    }))
  }, [lineage.nodes])

  const initialEdges: Edge[] = useMemo(() => {
    return lineage.edges.map(e => ({
      id: e.id,
      source: e.source,
      target: e.target,
      label: e.label ? `${e.label} (${e.latencyMs || 0}ms)` : undefined,
      animated: true,
      style: { stroke: '#06B6D4', strokeWidth: 2 },
      labelStyle: { fill: '#94A3B8', fontSize: 10, fontFamily: 'monospace' },
      labelBgStyle: { fill: '#0F172A', fillOpacity: 0.9 },
      labelBgPadding: [4, 4] as [number, number],
      labelBgBorderRadius: 4,
      markerEnd: { type: MarkerType.ArrowClosed, color: '#06B6D4' },
    }))
  }, [lineage.edges])

  return (
    <div className="w-full h-[520px] rounded-xl overflow-hidden border border-slate-800 bg-slate-950/80 relative">
      <ReactFlow
        nodes={initialNodes}
        edges={initialEdges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        minZoom={0.4}
        maxZoom={1.5}
      >
        <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="#1E293B" />
        <Controls className="!bg-slate-900 !border-slate-700 !fill-slate-300" showInteractive={false} />
        <MiniMap
          nodeColor="#06B6D4"
          maskColor="rgba(11, 15, 25, 0.85)"
          className="!bg-slate-950 !border-slate-800 !rounded-lg"
        />
      </ReactFlow>
    </div>
  )
}

export default DataLineageCanvas
