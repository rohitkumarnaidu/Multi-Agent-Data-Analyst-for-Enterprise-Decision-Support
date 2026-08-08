import React, { useMemo } from 'react';
import { 
  ReactFlow, 
  Background, 
  Controls, 
  MarkerType,
  Handle,
  Position,
  useNodesState,
  useEdgesState
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { StatusChip, StatusType } from './StatusChip';

interface PipelineNodeData {
  label: string;
  status: StatusType;
  latency?: string;
  icon?: React.ReactNode;
}

const CustomNode = ({ data }: { data: PipelineNodeData }) => {
  return (
    <div className="px-4 py-2 shadow-sm rounded-xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col gap-2 min-w-[150px]">
      <Handle type="target" position={Position.Top} className="w-16 !bg-slate-300 dark:!bg-gray-600" />
      <div className="flex items-center gap-2">
        {data.icon}
        <div className="font-medium text-sm text-slate-800 dark:text-slate-100">{data.label}</div>
      </div>
      <div className="flex justify-between items-center mt-1">
        <StatusChip status={data.status} pulse={data.status === 'running'} />
        {data.latency && <span className="text-xs text-slate-400 font-mono">{data.latency}</span>}
      </div>
      <Handle type="source" position={Position.Bottom} className="w-16 !bg-slate-300 dark:!bg-gray-600" />
    </div>
  );
};

const nodeTypes = {
  custom: CustomNode,
};

interface AnimatedPipelineProps {
  trace: any[];
}

export const AnimatedPipeline: React.FC<AnimatedPipelineProps> = ({ trace }) => {
  // A static layout representing the agent graph
  // In a real app we might dynamically build this based on the trace, but for visual effect
  // we can show all agents and light up the ones that were executed.
  
  const nodes = [
    { id: 'user', type: 'custom', position: { x: 250, y: 0 }, data: { label: 'User Request', status: 'completed' as StatusType } },
    { id: 'router', type: 'custom', position: { x: 250, y: 100 }, data: { label: 'Intent Router', status: 'idle' as StatusType } },
    { id: 'knowledge', type: 'custom', position: { x: 50, y: 220 }, data: { label: 'Knowledge Agent', status: 'idle' as StatusType } },
    { id: 'memory', type: 'custom', position: { x: 450, y: 220 }, data: { label: 'Memory Agent', status: 'idle' as StatusType } },
    { id: 'data', type: 'custom', position: { x: 250, y: 340 }, data: { label: 'Data Agent', status: 'idle' as StatusType } },
    { id: 'analysis', type: 'custom', position: { x: 250, y: 460 }, data: { label: 'Analysis Agent', status: 'idle' as StatusType } },
    { id: 'ml', type: 'custom', position: { x: 50, y: 460 }, data: { label: 'ML Agent', status: 'idle' as StatusType } },
    { id: 'simulation', type: 'custom', position: { x: 450, y: 460 }, data: { label: 'Simulation Agent', status: 'idle' as StatusType } },
    { id: 'narrative', type: 'custom', position: { x: 250, y: 580 }, data: { label: 'Narrative Agent', status: 'idle' as StatusType } },
    { id: 'validator', type: 'custom', position: { x: 250, y: 700 }, data: { label: 'Validator Agent', status: 'idle' as StatusType } },
  ];

  const edges = [
    { id: 'e1', source: 'user', target: 'router', animated: true },
    { id: 'e2', source: 'router', target: 'knowledge', animated: true },
    { id: 'e3', source: 'router', target: 'memory', animated: true },
    { id: 'e4', source: 'router', target: 'data', animated: true },
    { id: 'e5', source: 'knowledge', target: 'data', animated: true },
    { id: 'e6', source: 'memory', target: 'data', animated: true },
    { id: 'e7', source: 'data', target: 'analysis', animated: true },
    { id: 'e8', source: 'data', target: 'ml', animated: true },
    { id: 'e9', source: 'data', target: 'simulation', animated: true },
    { id: 'e10', source: 'analysis', target: 'narrative', animated: true },
    { id: 'e11', source: 'ml', target: 'narrative', animated: true },
    { id: 'e12', source: 'simulation', target: 'narrative', animated: true },
    { id: 'e13', source: 'narrative', target: 'validator', animated: true },
  ];

  // Map the trace onto the nodes to update their status
  const traceString = JSON.stringify(trace || []).toLowerCase();
  
  const mappedNodes = nodes.map(node => {
    let status: StatusType = 'idle';
    if (trace.length > 0) {
      if (node.id === 'user') status = 'completed';
      else if (traceString.includes(node.id) || traceString.includes(node.data.label.toLowerCase())) {
        status = 'completed';
      }
    }
    return { ...node, data: { ...node.data, status } };
  });

  return (
    <div className="w-full h-full min-h-[500px]">
      <ReactFlow
        nodes={mappedNodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        className="bg-slate-50 dark:bg-gray-900/50 rounded-xl"
      >
        <Background gap={12} size={1} />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
};
