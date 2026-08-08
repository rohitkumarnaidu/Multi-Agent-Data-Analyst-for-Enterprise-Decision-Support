import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/shared/ui/Card'
import { BaseChart } from '@/shared/charts/BaseChart'
import type { ExecutiveDashboardData } from '@/services/dashboardService'
import type { EChartsOption } from 'echarts'

interface RevenueMarginChartProps {
  data: ExecutiveDashboardData['monthlyTrends']
}

export const RevenueMarginChart: React.FC<RevenueMarginChartProps> = ({ data }) => {
  const chartOptions: EChartsOption = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(11, 15, 25, 0.92)',
      borderColor: '#334155',
      borderWidth: 1,
      textStyle: {
        color: '#E2E8F0',
        fontSize: 12,
      },
      padding: [10, 14],
      formatter: (params: any) => {
        if (!Array.isArray(params)) return ''
        let result = `<div class="font-bold text-slate-100 mb-1">${params[0].axisValue} 2026</div>`
        params.forEach(item => {
          const val =
            item.seriesName === 'Gross Margin'
              ? `${item.value}%`
              : `$${item.value}M`
          result += `
            <div class="flex items-center justify-between gap-4 text-xs py-0.5">
              <span class="flex items-center gap-1.5" style="color: ${item.color}">
                <span class="inline-block w-2 h-2 rounded-full" style="background: ${item.color}"></span>
                ${item.seriesName}
              </span>
              <span class="font-mono font-semibold text-slate-100">${val}</span>
            </div>
          `
        })
        return result
      },
    },
    legend: {
      data: ['Actual Revenue', 'Target Revenue', 'Gross Margin'],
      top: 0,
      right: 0,
      textStyle: {
        color: '#94A3B8',
        fontSize: 11,
      },
      itemWidth: 12,
      itemHeight: 8,
    },
    grid: {
      left: '3%',
      right: '3%',
      bottom: '5%',
      top: '15%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: data.months,
      axisLine: { lineStyle: { color: '#334155' } },
      axisLabel: { color: '#94A3B8', fontSize: 11 },
    },
    yAxis: [
      {
        type: 'value',
        name: 'Revenue ($M)',
        nameTextStyle: { color: '#94A3B8', fontSize: 10 },
        axisLabel: {
          color: '#94A3B8',
          fontSize: 10,
          formatter: '${value}M',
        },
        splitLine: { lineStyle: { color: 'rgba(51, 65, 85, 0.3)', type: 'dashed' } },
      },
      {
        type: 'value',
        name: 'Margin (%)',
        min: 25,
        max: 45,
        nameTextStyle: { color: '#10B981', fontSize: 10 },
        axisLabel: {
          color: '#10B981',
          fontSize: 10,
          formatter: '{value}%',
        },
        splitLine: { show: false },
      },
    ],
    series: [
      {
        name: 'Actual Revenue',
        type: 'bar',
        barWidth: '28%',
        data: data.revenue,
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: '#06B6D4' },
              { offset: 1, color: '#0E7490' },
            ],
          },
          borderRadius: [4, 4, 0, 0],
        },
      },
      {
        name: 'Target Revenue',
        type: 'bar',
        barWidth: '28%',
        data: data.targetRevenue,
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(99, 102, 241, 0.7)' },
              { offset: 1, color: 'rgba(79, 70, 229, 0.3)' },
            ],
          },
          borderRadius: [4, 4, 0, 0],
        },
      },
      {
        name: 'Gross Margin',
        type: 'line',
        yAxisIndex: 1,
        smooth: true,
        data: data.grossMarginPct,
        lineStyle: {
          width: 3,
          color: '#10B981',
          shadowColor: 'rgba(16, 185, 129, 0.4)',
          shadowBlur: 10,
        },
        itemStyle: {
          color: '#10B981',
          borderWidth: 2,
          borderColor: '#064E3B',
        },
        symbolSize: 6,
      },
    ],
  }

  return (
    <Card glow="none" className="p-5">
      <CardHeader className="p-0 pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Revenue & Gross Margin Performance</CardTitle>
            <CardDescription>Monthly actuals vs projected baseline and margin trajectories</CardDescription>
          </div>
          <span className="text-xs font-mono font-semibold text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-md border border-cyan-500/20">
            Avg Margin: 34.2%
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-0 pt-2">
        <BaseChart options={chartOptions} height={340} />
      </CardContent>
    </Card>
  )
}
