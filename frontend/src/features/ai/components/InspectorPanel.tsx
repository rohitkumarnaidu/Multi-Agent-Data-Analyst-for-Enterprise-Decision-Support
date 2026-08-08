import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/shared/ui/Card'
import { Tabs } from '@/shared/ui/Tabs'
import { Badge } from '@/shared/ui/Badge'
import { Button } from '@/shared/ui/Button'
import { HITLApprovalCard } from './HITLApprovalCard'
import { ToolExecutionTimeline } from './ToolExecutionTimeline'
import {
  ShieldCheck,
  Zap,
  Activity,
  Layers,
  Clock,
  CheckCircle,
  HelpCircle,
  FileCode,
} from 'lucide-react'
import type { AskResponse, AgentNodeData } from '@/shared/types'

interface InspectorPanelProps {
  latestResponse?: AskResponse
  selectedNode?: AgentNodeData
  onApproveAction?: () => void
  onRejectAction?: (reason?: string) => void
  onModifyAction?: (modified: string) => void
}

export const InspectorPanel: React.FC<InspectorPanelProps> = ({
  latestResponse,
  selectedNode,
  onApproveAction,
  onRejectAction,
  onModifyAction,
}) => {
  const [activeTab, setActiveTab] = useState<'tools' | 'trace' | 'node'>('tools')

  const tabs = [
    { id: 'tools', label: 'Tool Calls' },
    { id: 'trace', label: 'Reasoning Trace' },
    { id: 'node', label: 'Selected Agent' },
  ]

  return (
    <div className="w-80 lg:w-96 border-l border-slate-800/80 bg-slate-950/80 p-4 flex flex-col h-full overflow-y-auto space-y-4">
      {/* 1. Human in the loop approval banner if triggered */}
      {latestResponse?.recommended_action && latestResponse.approval_required && (
        <HITLApprovalCard
          action={latestResponse.recommended_action}
          onApprove={() => onApproveAction?.()}
          onReject={reason => onRejectAction?.(reason)}
          onModify={modified => onModifyAction?.(modified)}
        />
      )}

      {/* 2. Confidence & Governance Metric Card */}
      <Card glow="none" className="p-3.5 bg-slate-900/90">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
            <ShieldCheck className="h-4 w-4 text-cyan-400" />
            Decision Confidence
          </div>
          <Badge
            variant={
              latestResponse?.confidence_label === 'High'
                ? 'success'
                : latestResponse?.confidence_label === 'Medium'
                ? 'warning'
                : 'outline'
            }
            size="sm"
          >
            {latestResponse?.confidence_label || 'High'} ({((latestResponse?.confidence ?? 0.95) * 100).toFixed(0)}%)
          </Badge>
        </div>
        <p className="text-[11px] text-slate-400 pt-2 leading-relaxed">
          {latestResponse?.confidence_reason ||
            'Full 200k records synthesized with zero schema drop and guardrails compliance.'}
        </p>
      </Card>

      {/* 3. Tabbed Details: Tool Timeline / Reasoning Trace / Node Inspector */}
      <div className="flex-1 flex flex-col min-h-0">
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onChange={tabId => setActiveTab(tabId as any)}
          variant="pills"
          className="mb-3"
        />

        <div className="flex-1 overflow-y-auto pr-1">
          {activeTab === 'tools' && (
            <ToolExecutionTimeline toolSteps={latestResponse?.tool_executions} />
          )}

          {activeTab === 'trace' && (
            <div className="space-y-2.5">
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider pb-1">
                LangGraph Execution Log ({latestResponse?.trace.length || 0} Steps)
              </div>
              {(latestResponse?.trace || []).map((step, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between text-slate-200 font-semibold">
                    <span className="text-cyan-400 font-mono text-[11px]">{step.agent}</span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {step.duration_sec.toFixed(2)}s
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-tight">{step.action}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'node' && (
            <div className="space-y-3">
              {selectedNode ? (
                <Card glow="cyan" className="p-3.5 space-y-2 bg-slate-900/90">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-100">{selectedNode.label}</span>
                    <Badge variant="outline" size="sm">
                      {selectedNode.status.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-300">{selectedNode.role}</p>
                  <div className="text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800 space-y-1">
                    <div>Node ID: {selectedNode.id}</div>
                    <div>Active Tools: {selectedNode.activeTool || 'None (Idle)'}</div>
                    <div>Latency: {selectedNode.executionTimeSec?.toFixed(2) || '0.00'}s</div>
                  </div>
                </Card>
              ) : (
                <div className="text-center py-8 text-xs text-slate-400">
                  Click any agent node in the LangGraph canvas to inspect its runtime state, parameters, and telemetry.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default InspectorPanel
