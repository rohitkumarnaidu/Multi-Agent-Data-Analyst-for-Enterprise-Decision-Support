import React from 'react'
import { AlertOctagon, DollarSign, Truck, ShieldCheck, Flame } from 'lucide-react'
import { Card } from '../../../shared/ui/Card'
import { RiskStats as StatsType } from '../../../services/riskService'

interface RiskStatsProps {
  stats: StatsType
}

export const RiskStats: React.FC<RiskStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      {/* 1. Value at Risk */}
      <Card glow="rose" className="p-4 bg-cyber-card/90 border-cyber-border">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-cyber-muted uppercase tracking-wider">
            Total Value at Risk
          </span>
          <DollarSign className="w-4 h-4 text-cyber-rose" />
        </div>
        <div className="mt-2.5 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-cyber-text">
            ${(stats.valueAtRiskUsd / 1000000).toFixed(2)}M
          </span>
          <span className="text-xs font-semibold text-cyber-rose bg-cyber-rose/10 border border-cyber-rose/30 px-1.5 py-0.5 rounded">
            High Exposure
          </span>
        </div>
        <span className="text-[11px] text-cyber-muted mt-1 block">
          Penalties & margin leakage
        </span>
      </Card>

      {/* 2. Critical Incident Count */}
      <Card glow="rose" className="p-4 bg-cyber-card/90 border-cyber-border">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-cyber-muted uppercase tracking-wider">
            Critical Severity Items
          </span>
          <Flame className="w-4 h-4 text-cyber-rose" />
        </div>
        <div className="mt-2.5 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-cyber-text">
            {stats.criticalCount}
          </span>
          <span className="text-xs font-semibold text-cyber-rose bg-cyber-rose/10 border border-cyber-rose/30 px-1.5 py-0.5 rounded">
            Immediate Action
          </span>
        </div>
        <span className="text-[11px] text-cyber-muted mt-1 block">
          &gt; $50k financial exposure each
        </span>
      </Card>

      {/* 3. High Risk Carriers */}
      <Card glow="amber" className="p-4 bg-cyber-card/90 border-cyber-border">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-cyber-muted uppercase tracking-wider">
            High-Risk Carriers
          </span>
          <Truck className="w-4 h-4 text-cyber-amber" />
        </div>
        <div className="mt-2.5 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-cyber-text">
            {stats.highRiskCarriers}
          </span>
          <span className="text-xs font-semibold text-cyber-amber bg-cyber-amber/10 border border-cyber-amber/30 px-1.5 py-0.5 rounded">
            SLA &gt; 20%
          </span>
        </div>
        <span className="text-[11px] text-cyber-muted mt-1 block">
          Regional freight partners
        </span>
      </Card>

      {/* 4. Recovered This Week */}
      <Card glow="emerald" className="p-4 bg-cyber-card/90 border-cyber-border">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-cyber-muted uppercase tracking-wider">
            Recovered This Week
          </span>
          <ShieldCheck className="w-4 h-4 text-cyber-emerald" />
        </div>
        <div className="mt-2.5 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-cyber-text">
            ${(stats.recoveredThisWeekUsd / 1000).toFixed(0)}k
          </span>
          <span className="text-xs font-semibold text-cyber-emerald bg-cyber-emerald/10 border border-cyber-emerald/30 px-1.5 py-0.5 rounded">
            +18.4% WoW
          </span>
        </div>
        <span className="text-[11px] text-cyber-muted mt-1 block">
          Via automated contract clauses
        </span>
      </Card>
    </div>
  )
}
