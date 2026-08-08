import React from 'react'
import { Activity, Bot, UserCheck, ShieldAlert, Zap } from 'lucide-react'
import { Card } from '../../../shared/ui/Card'
import { ActivityStats as StatsType } from '../../../services/activityService'

interface ActivityStatsProps {
  stats: StatsType
}

export const ActivityStats: React.FC<ActivityStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
      {/* 1. Total Logged Events */}
      <Card glow="none" className="p-4 bg-cyber-card/90 border-cyber-border">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-cyber-muted uppercase tracking-wider">
            Total Logged Events
          </span>
          <Activity className="w-4 h-4 text-cyber-cyan" />
        </div>
        <div className="mt-2.5 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-cyber-text">
            {stats.totalEvents.toLocaleString()}
          </span>
          <span className="text-xs font-semibold text-cyber-cyan bg-cyber-cyan/10 border border-cyber-cyan/30 px-1.5 py-0.5 rounded">
            Live Stream
          </span>
        </div>
        <span className="text-[11px] text-cyber-muted mt-1 block">
          Immutable event ledger
        </span>
      </Card>

      {/* 2. Agent Invocations */}
      <Card glow="none" className="p-4 bg-cyber-card/90 border-cyber-border">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-cyber-muted uppercase tracking-wider">
            Agent Invocations
          </span>
          <Bot className="w-4 h-4 text-indigo-400" />
        </div>
        <div className="mt-2.5 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-cyber-text">
            {stats.agentInvocations.toLocaleString()}
          </span>
          <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/30 px-1.5 py-0.5 rounded">
            56.8% of total
          </span>
        </div>
        <span className="text-[11px] text-cyber-muted mt-1 block">
          LangGraph autonomous runs
        </span>
      </Card>

      {/* 3. Human Approvals */}
      <Card glow="emerald" className="p-4 bg-cyber-card/90 border-cyber-border">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-cyber-muted uppercase tracking-wider">
            Human Approvals
          </span>
          <UserCheck className="w-4 h-4 text-cyber-emerald" />
        </div>
        <div className="mt-2.5 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-cyber-text">
            {stats.humanApprovals}
          </span>
          <span className="text-xs font-semibold text-cyber-emerald bg-cyber-emerald/10 border border-cyber-emerald/30 px-1.5 py-0.5 rounded">
            100% Signed
          </span>
        </div>
        <span className="text-[11px] text-cyber-muted mt-1 block">
          HITL intervention approvals
        </span>
      </Card>

      {/* 4. Guardrail Interceptions */}
      <Card glow="amber" className="p-4 bg-cyber-card/90 border-cyber-border">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-cyber-muted uppercase tracking-wider">
            Guardrail Blocks
          </span>
          <ShieldAlert className="w-4 h-4 text-cyber-amber" />
        </div>
        <div className="mt-2.5 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-cyber-text">
            {stats.guardrailBlocked}
          </span>
          <span className="text-xs font-semibold text-cyber-amber bg-cyber-amber/10 border border-cyber-amber/30 px-1.5 py-0.5 rounded">
            Interception Active
          </span>
        </div>
        <span className="text-[11px] text-cyber-muted mt-1 block">
          Unsafe or high-exposure limits
        </span>
      </Card>

      {/* 5. Mean Execution Latency */}
      <Card glow="none" className="p-4 bg-cyber-card/90 border-cyber-border">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-cyber-muted uppercase tracking-wider">
            Mean Tool Latency
          </span>
          <Zap className="w-4 h-4 text-cyber-cyan" />
        </div>
        <div className="mt-2.5 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-cyber-text">
            {stats.meanLatencyMs} ms
          </span>
          <span className="text-xs font-semibold text-cyber-emerald bg-cyber-emerald/10 border border-cyber-emerald/30 px-1.5 py-0.5 rounded">
            Optimal
          </span>
        </div>
        <span className="text-[11px] text-cyber-muted mt-1 block">
          DuckDB & ML pipeline runtime
        </span>
      </Card>
    </div>
  )
}
