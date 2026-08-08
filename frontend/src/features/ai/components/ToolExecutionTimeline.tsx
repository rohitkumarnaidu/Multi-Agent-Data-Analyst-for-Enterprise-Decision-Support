import React from 'react'
import { Accordion, AccordionItem } from '@/shared/ui/Accordion'
import { Wrench, CheckCircle2, Clock, Database, Brain, LineChart, ShieldCheck } from 'lucide-react'
import type { ToolExecutionStep } from '@/shared/types'

interface ToolExecutionTimelineProps {
  toolSteps?: ToolExecutionStep[]
}

export const ToolExecutionTimeline: React.FC<ToolExecutionTimelineProps> = ({ toolSteps }) => {
  if (!toolSteps || toolSteps.length === 0) {
    return (
      <div className="p-4 text-center text-xs text-slate-400">
        No tool execution steps recorded for this session.
      </div>
    )
  }

  const getCategoryIcon = (category: ToolExecutionStep['category']) => {
    switch (category) {
      case 'database':
        return <Database className="h-3.5 w-3.5 text-blue-400" />
      case 'knowledge':
        return <Brain className="h-3.5 w-3.5 text-purple-400" />
      case 'ml':
        return <LineChart className="h-3.5 w-3.5 text-rose-400" />
      case 'governance':
        return <ShieldCheck className="h-3.5 w-3.5 text-teal-400" />
      default:
        return <Wrench className="h-3.5 w-3.5 text-cyan-400" />
    }
  }

  const accordionItems: AccordionItem[] = toolSteps.map(step => ({
    id: step.id,
    title: (
      <div className="flex items-center justify-between w-full pr-2 text-xs">
        <div className="flex items-center gap-2">
          {getCategoryIcon(step.category)}
          <span className="font-semibold text-slate-200">{step.displayName}</span>
          <span className="font-mono text-[10px] text-cyan-400 bg-cyan-950/80 px-1.5 py-0.5 rounded border border-cyan-500/30">
            {step.toolName}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {step.durationMs}ms
          </span>
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
        </div>
      </div>
    ),
    content: (
      <div className="space-y-2 pt-2 text-xs font-mono">
        {step.inputPayload && (
          <div>
            <span className="text-[10px] text-slate-400 block pb-1">Input Parameters:</span>
            <pre className="p-2.5 rounded bg-slate-950 border border-slate-800 text-[11px] text-cyan-300 overflow-x-auto">
              {typeof step.inputPayload === 'string'
                ? step.inputPayload
                : JSON.stringify(step.inputPayload, null, 2)}
            </pre>
          </div>
        )}

        {step.outputPayload && (
          <div>
            <span className="text-[10px] text-slate-400 block pb-1">Output Payload:</span>
            <pre className="p-2.5 rounded bg-slate-950 border border-slate-800 text-[11px] text-emerald-300 overflow-x-auto">
              {typeof step.outputPayload === 'string'
                ? step.outputPayload
                : JSON.stringify(step.outputPayload, null, 2)}
            </pre>
          </div>
        )}
      </div>
    ),
  }))

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs text-slate-400 pb-1">
        <span className="font-semibold uppercase text-[10px] tracking-wider text-slate-400">
          Tool Execution Trail ({toolSteps.length} Steps)
        </span>
        <span className="font-mono text-[10px]">
          Total Latency: {toolSteps.reduce((acc, s) => acc + (s.durationMs || 0), 0)}ms
        </span>
      </div>

      <Accordion items={accordionItems} allowMultiple />
    </div>
  )
}

export default ToolExecutionTimeline
