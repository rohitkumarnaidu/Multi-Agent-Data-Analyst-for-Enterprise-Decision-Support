import React from 'react'
import { StatCard } from '@/shared/ui/StatCard'
import { DollarSign, TrendingUp, CheckCircle, AlertTriangle, Users, Clock } from 'lucide-react'
import type { ExecutiveDashboardData } from '@/services/dashboardService'

interface ExecutiveKpiGridProps {
  kpis: ExecutiveDashboardData['kpis']
}

export const ExecutiveKpiGrid: React.FC<ExecutiveKpiGridProps> = ({ kpis }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
      {/* Total Revenue */}
      <StatCard
        title="Net Revenue"
        value={kpis.revenue.value}
        trend={{
          value: kpis.revenue.change_pct,
          label: kpis.revenue.period,
          isPositive: true,
        }}
        icon={<DollarSign className="h-4 w-4 text-sky-600 dark:text-sky-400" />}
        telemetryBar={{ pct: 88, color: 'bg-sky-600 dark:bg-sky-500' }}
      />

      {/* Gross Profit Margin */}
      <StatCard
        title="Gross Margin"
        value={kpis.margin.value}
        trend={{
          value: kpis.margin.change_pct,
          label: kpis.margin.period,
          isPositive: true,
        }}
        icon={<TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />}
        telemetryBar={{ pct: 76, color: 'bg-emerald-600 dark:bg-emerald-500' }}
      />

      {/* On-Time Delivery SLA */}
      <StatCard
        title="Delivery SLA"
        value={kpis.deliverySla.value}
        trend={{
          value: kpis.deliverySla.change_pct,
          label: kpis.deliverySla.period,
          isPositive: true,
        }}
        icon={<CheckCircle className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />}
        telemetryBar={{ pct: 98, color: 'bg-indigo-600 dark:bg-indigo-500' }}
      />

      {/* Flagged Anomalies */}
      <StatCard
        title="Active Anomalies"
        value={kpis.anomalies.value}
        subtitle={kpis.anomalies.period}
        trend={{
          value: kpis.anomalies.change_pct,
          label: 'MoM',
          isPositive: true,
        }}
        icon={<AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />}
        telemetryBar={{ pct: 45, color: 'bg-amber-500' }}
      />

      {/* Active Clients */}
      <StatCard
        title="Active Accounts"
        value={kpis.activeAccounts.value}
        trend={{
          value: kpis.activeAccounts.change_pct,
          label: kpis.activeAccounts.period,
          isPositive: true,
        }}
        icon={<Users className="h-4 w-4 text-teal-600 dark:text-teal-400" />}
        telemetryBar={{ pct: 82, color: 'bg-teal-600 dark:bg-teal-500' }}
      />

      {/* Fulfillment Cycle */}
      <StatCard
        title="Avg Fulfillment"
        value={kpis.fulfillmentDays.value}
        trend={{
          value: kpis.fulfillmentDays.change_pct,
          label: 'Cycle',
          isPositive: true,
        }}
        icon={<Clock className="h-4 w-4 text-purple-600 dark:text-purple-400" />}
        telemetryBar={{ pct: 92, color: 'bg-purple-600 dark:bg-purple-500' }}
      />
    </div>
  )
}
