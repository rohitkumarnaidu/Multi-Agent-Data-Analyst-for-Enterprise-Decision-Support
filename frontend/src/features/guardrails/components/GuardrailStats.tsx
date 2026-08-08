import React from 'react'
import { ShieldCheck, ShieldAlert, DollarSign, Lock, Zap } from 'lucide-react'
import { Card } from '../../../shared/ui/Card'
import { GuardrailStats as StatsType } from '../../../services/guardrailService'

interface GuardrailStatsProps {
  stats: StatsType
}

export const GuardrailStats: React.FC<GuardrailStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      {/* 1. Active Enforcement Policies */}
      <Card glow="emerald" className="p-4 bg-cyber-card/90 border-cyber-border">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-cyber-muted uppercase tracking-wider">
            Active Guardrail Rules
          </span>
          <ShieldCheck className="w-4 h-4 text-cyber-emerald" />
        </div>
        <div className="mt-2.5 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-cyber-text">
            {stats.activePolicies} / {stats.totalPolicies}
          </span>
          <span className="text-xs font-semibold text-cyber-emerald bg-cyber-emerald/10 border border-cyber-emerald/30 px-1.5 py-0.5 rounded">
            100% Enforced
          </span>
        </div>
        <span className="text-[11px] text-cyber-muted mt-1 block">
          Pre- & post-execution triggers
        </span>
      </Card>

      {/* 2. Total Intercepted Injections */}
      <Card glow="rose" className="p-4 bg-cyber-card/90 border-cyber-border">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-cyber-muted uppercase tracking-wider">
            Threats Intercepted
          </span>
          <ShieldAlert className="w-4 h-4 text-cyber-rose" />
        </div>
        <div className="mt-2.5 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-cyber-text">
            {stats.interceptedPromptInjections}
          </span>
          <span className="text-xs font-semibold text-cyber-rose bg-cyber-rose/10 border border-cyber-rose/30 px-1.5 py-0.5 rounded">
            Zero Breaches
          </span>
        </div>
        <span className="text-[11px] text-cyber-muted mt-1 block">
          Jailbreaks & SQL exploits
        </span>
      </Card>

      {/* 3. High Exposure Interceptions */}
      <Card glow="amber" className="p-4 bg-cyber-card/90 border-cyber-border">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-cyber-muted uppercase tracking-wider">
            Financial Safety Blocks
          </span>
          <DollarSign className="w-4 h-4 text-cyber-amber" />
        </div>
        <div className="mt-2.5 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-cyber-text">
            {stats.budgetExceededInterceptions}
          </span>
          <span className="text-xs font-semibold text-cyber-amber bg-cyber-amber/10 border border-cyber-amber/30 px-1.5 py-0.5 rounded">
            &gt; $100k Cap
          </span>
        </div>
        <span className="text-[11px] text-cyber-muted mt-1 block">
          HITL intervention escalated
        </span>
      </Card>

      {/* 4. Guardrail Engine Overhead */}
      <Card glow="none" className="p-4 bg-cyber-card/90 border-cyber-border">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-cyber-muted uppercase tracking-wider">
            Evaluation Latency
          </span>
          <Zap className="w-4 h-4 text-cyber-cyan" />
        </div>
        <div className="mt-2.5 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-cyber-text">
            {stats.latencyOverheadMs} ms
          </span>
          <span className="text-xs font-semibold text-cyber-cyan bg-cyber-cyan/10 border border-cyber-cyan/30 px-1.5 py-0.5 rounded">
            Sub-Millisecond
          </span>
        </div>
        <span className="text-[11px] text-cyber-muted mt-1 block">
          LlamaGuard AST compilation
        </span>
      </Card>
    </div>
  )
}
