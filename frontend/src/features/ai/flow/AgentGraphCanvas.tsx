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
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { AgentGraphNode } from './AgentGraphNode'
import type { AgentNodeData } from '@/shared/types'

const nodeTypes = {
  agentNode: AgentGraphNode,
}

interface AgentGraphCanvasProps {
  nodesData: AgentNodeData[]
  onNodeClick?: (nodeId: string) => void
  activeNodeId?: string
}

export const AgentGraphCanvas: React.FC<AgentGraphCanvasProps> = ({
  nodesData,
  onNodeClick,
  activeNodeId,
}) => {
  // Convert AgentNodeData into React Flow nodes with layout positions
  const initialNodes: Node[] = useMemo(() => {
    const nodeMap = new Map(nodesData.map(n => [n.id, n]))

    return [
      // Level 0: Supervisor
      {
        id: 'orchestrator',
        type: 'agentNode',
        position: { x: 380, y: 30 },
        data: nodeMap.get('orchestrator') || { id: 'orchestrator', label: 'Orchestrator', role: 'Supervisor', status: 'idle' },
      },
      // Level 1: Knowledge & Retrieval
      {
        id: 'knowledge',
        type: 'agentNode',
        position: { x: 100, y: 160 },
        data: nodeMap.get('knowledge') || { id: 'knowledge', label: 'Knowledge & RAG', role: 'Vector Schema', status: 'idle' },
      },
      {
        id: 'data',
        type: 'agentNode',
        position: { x: 660, y: 160 },
        data: nodeMap.get('data') || { id: 'data', label: 'Data Retrieval', role: 'DuckDB Engine', status: 'idle' },
      },
      // Level 2: Core Analytical & ML Engines
      {
        id: 'analysis',
        type: 'agentNode',
        position: { x: 100, y: 300 },
        data: nodeMap.get('analysis') || { id: 'analysis', label: 'Statistical Analysis', role: 'Correlation Engine', status: 'idle' },
      },
      {
        id: 'anomaly',
        type: 'agentNode',
        position: { x: 380, y: 300 },
        data: nodeMap.get('anomaly') || { id: 'anomaly', label: 'Anomaly Scorer', role: 'XGBoost Isolation', status: 'idle' },
      },
      {
        id: 'simulation',
        type: 'agentNode',
        position: { x: 660, y: 300 },
        data: nodeMap.get('simulation') || { id: 'simulation', label: 'Scenario Simulator', role: 'Monte Carlo ML', status: 'idle' },
      },
      // Level 3: Guardrails & Validation
      {
        id: 'validator',
        type: 'agentNode',
        position: { x: 380, y: 440 },
        data: nodeMap.get('validator') || { id: 'validator', label: 'Guardrails Validator', role: 'Compliance Filter', status: 'idle' },
      },
      // Level 4: Synthesis & Output
      {
        id: 'narrative',
        type: 'agentNode',
        position: { x: 100, y: 580 },
        data: nodeMap.get('narrative') || { id: 'narrative', label: 'Narrative Synthesis', role: 'Executive Briefing', status: 'idle' },
      },
      {
        id: 'report',
        type: 'agentNode',
        position: { x: 380, y: 580 },
        data: nodeMap.get('report') || { id: 'report', label: 'Report Generator', role: 'Document Formatter', status: 'idle' },
      },
      {
        id: 'memory',
        type: 'agentNode',
        position: { x: 660, y: 580 },
        data: nodeMap.get('memory') || { id: 'memory', label: 'Memory & Context', role: 'Cross-Session State', status: 'idle' },
      },
    ]
  }, [nodesData])

  // Directed edges representing the LangGraph workflow
  const initialEdges: Edge[] = useMemo(() => {
    const isOrchestratorActive = nodesData.some(n => n.id === 'orchestrator' && (n.status === 'running' || n.status === 'completed'))

    const defaultEdgeStyle = {
      stroke: '#334155',
      strokeWidth: 2,
    }

    const activeEdgeStyle = {
      stroke: '#06B6D4',
      strokeWidth: 2.5,
      strokeDasharray: '4 4',
      animation: 'dashdraw 1s linear infinite',
    }

    const edges: Edge[] = [
      {
        id: 'e-orch-knowledge',
        source: 'orchestrator',
        target: 'knowledge',
        animated: isOrchestratorActive,
        style: isOrchestratorActive ? activeEdgeStyle : defaultEdgeStyle,
        markerEnd: { type: MarkerType.ArrowClosed, color: isOrchestratorActive ? '#06B6D4' : '#334155' },
      },
      {
        id: 'e-orch-data',
        source: 'orchestrator',
        target: 'data',
        animated: isOrchestratorActive,
        style: isOrchestratorActive ? activeEdgeStyle : defaultEdgeStyle,
        markerEnd: { type: MarkerType.ArrowClosed, color: isOrchestratorActive ? '#06B6D4' : '#334155' },
      },
      {
        id: 'e-knowledge-analysis',
        source: 'knowledge',
        target: 'analysis',
        style: defaultEdgeStyle,
        markerEnd: { type: MarkerType.ArrowClosed, color: '#334155' },
      },
      {
        id: 'e-data-anomaly',
        source: 'data',
        target: 'anomaly',
        style: defaultEdgeStyle,
        markerEnd: { type: MarkerType.ArrowClosed, color: '#334155' },
      },
      {
        id: 'e-data-simulation',
        source: 'data',
        target: 'simulation',
        style: defaultEdgeStyle,
        markerEnd: { type: MarkerType.ArrowClosed, color: '#334155' },
      },
      {
        id: 'e-analysis-validator',
        source: 'analysis',
        target: 'validator',
        style: defaultEdgeStyle,
        markerEnd: { type: MarkerType.ArrowClosed, color: '#334155' },
      },
      {
        id: 'e-anomaly-validator',
        source: 'anomaly',
        target: 'validator',
        style: defaultEdgeStyle,
        markerEnd: { type: MarkerType.ArrowClosed, color: '#334155' },
      },
      {
        id: 'e-simulation-validator',
        source: 'simulation',
        target: 'validator',
        style: defaultEdgeStyle,
        markerEnd: { type: MarkerType.ArrowClosed, color: '#334155' },
      },
      {
        id: 'e-validator-narrative',
        source: 'validator',
        target: 'narrative',
        style: defaultEdgeStyle,
        markerEnd: { type: MarkerType.ArrowClosed, color: '#334155' },
      },
      {
        id: 'e-validator-report',
        source: 'validator',
        target: 'report',
        style: defaultEdgeStyle,
        markerEnd: { type: MarkerType.ArrowClosed, color: '#334155' },
      },
      {
        id: 'e-narrative-memory',
        source: 'narrative',
        target: 'memory',
        style: defaultEdgeStyle,
        markerEnd: { type: MarkerType.ArrowClosed, color: '#334155' },
      },
    ]

    return edges
  }, [nodesData])

  return (
    <div className="w-full h-full min-h-[560px] rounded-xl overflow-hidden border border-slate-800 bg-slate-950/80 relative">
      <ReactFlow
        nodes={initialNodes}
        edges={initialEdges}
        nodeTypes={nodeTypes}
        onNodeClick={(_, node) => onNodeClick?.(node.id)}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.5}
        maxZoom={1.5}
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#1E293B" />
        <Controls
          className="!bg-slate-900 !border-slate-700 !fill-slate-300"
          showInteractive={false}
        />
        <MiniMap
          nodeColor={n => {
            const status = (n.data as any)?.status
            if (status === 'running') return '#06B6D4'
            if (status === 'completed') return '#10B981'
            if (status === 'requires_approval') return '#F59E0B'
            return '#334155'
          }}
          maskColor="rgba(11, 15, 25, 0.85)"
          className="!bg-slate-950 !border-slate-800 !rounded-lg"
        />
      </ReactFlow>
    </div>
  )
}

export default AgentGraphCanvas
