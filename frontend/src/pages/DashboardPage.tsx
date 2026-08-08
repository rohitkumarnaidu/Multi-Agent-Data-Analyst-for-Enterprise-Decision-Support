import React, { useState } from 'react'
import { useDashboardData } from '@/hooks/useDashboardData'
import { ExecutiveHeader } from '@/features/dashboard/ExecutiveHeader'
import { ExecutiveKpiGrid } from '@/features/dashboard/ExecutiveKpiGrid'
import { RevenueMarginChart } from '@/features/dashboard/RevenueMarginChart'
import { RegionalBreakdownChart } from '@/features/dashboard/RegionalBreakdownChart'
import { DepartmentMatrix } from '@/features/dashboard/DepartmentMatrix'
import { ExecutiveAnomalyFeed } from '@/features/dashboard/ExecutiveAnomalyFeed'
import { ExecutiveScenarioWidget } from '@/features/dashboard/ExecutiveScenarioWidget'
import { Skeleton } from '@/shared/ui/Skeleton'
import { ErrorState } from '@/shared/ui/ErrorState'

export const DashboardPage: React.FC = () => {
  const [timeframe, setTimeframe] = useState('YTD 2026')
  const { data, isLoading, isError, refetch, isRefetching } = useDashboardData(timeframe)

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-72" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-32" />
            <Skeleton className="h-9 w-24" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="lg:col-span-2 h-96 rounded-xl" />
          <Skeleton className="h-96 rounded-xl" />
        </div>
        <Skeleton className="h-64 rounded-xl" />
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="max-w-xl mx-auto py-16">
        <ErrorState
          title="Executive Telemetry Failed to Load"
          message="Could not connect to the decision engine metrics service. Please check API connectivity."
          onRetry={() => refetch()}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Executive Header with Filters & Quick Action Launchers */}
      <ExecutiveHeader
        timeframe={timeframe}
        onTimeframeChange={setTimeframe}
        onRefresh={() => refetch()}
        isRefreshing={isRefetching}
      />

      {/* 6 Top-Tier KPI Stat Cards */}
      <ExecutiveKpiGrid kpis={data.kpis} />

      {/* Primary Analytics Section: Revenue & Margin Trends + Regional Contribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        <div className="lg:col-span-2">
          <RevenueMarginChart data={data.monthlyTrends} />
        </div>
        <div>
          <RegionalBreakdownChart data={data.regionalBreakdown} />
        </div>
      </div>

      {/* Interactive Scenario Simulation Sandbox */}
      <ExecutiveScenarioWidget />

      {/* Cross-Functional Operations & Risk Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <DepartmentMatrix departments={data.departmentMatrix} />
        <ExecutiveAnomalyFeed anomalies={data.criticalAnomalies} />
      </div>
    </div>
  )
}

export default DashboardPage
