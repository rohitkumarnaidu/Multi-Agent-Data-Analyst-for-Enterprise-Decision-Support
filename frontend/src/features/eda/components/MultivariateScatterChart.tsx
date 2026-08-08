import React, { useMemo } from 'react'
import { BaseChart } from '@/shared/charts/BaseChart'
import type { EChartsOption } from 'echarts'

interface MultivariateScatterChartProps {
  data: Array<{
    x: number
    y: number
    size: number
    department: string
    risk: number
    id: string
  }>
}

const deptColors: Record<string, string> = {
  Logistics: '#38BDF8',
  'Enterprise Sales': '#10B981',
  'Cloud SaaS': '#A855F7',
  Support: '#F59E0B',
  Billing: '#EC4899',
}

export const MultivariateScatterChart: React.FC<MultivariateScatterChartProps> = ({ data }) => {
  const chartOption: EChartsOption = useMemo(() => {
    const seriesByDept = Object.keys(deptColors).map(dept => {
      const deptPoints = data
        .filter(d => d.department === dept)
        .map(d => [d.x, d.y, d.size, d.risk, d.id])

      return {
        name: dept,
        type: 'scatter',
        data: deptPoints,
        symbolSize: (val: any) => {
          // Normalize size between 8px and 28px
          const gross = val[2] || 5000
          return Math.max(8, Math.min(28, (gross / 25000) * 24 + 6))
        },
        itemStyle: {
          color: deptColors[dept],
          opacity: 0.8,
          borderColor: '#0F172A',
          borderWidth: 1,
        },
        emphasis: {
          itemStyle: {
            borderColor: '#F8FAFC',
            borderWidth: 2,
            shadowBlur: 10,
            shadowColor: deptColors[dept],
          },
        },
      }
    })

    return {
      tooltip: {
        backgroundColor: '#0F172A',
        borderColor: '#334155',
        textStyle: { color: '#F8FAFC', fontFamily: 'monospace', fontSize: 11 },
        formatter: (params: any) => {
          const [latency, margin, gross, risk, id] = params.data
          return `
            <b>${id}</b> (${params.seriesName})<br/>
            Latency: <b>${latency} days</b><br/>
            Gross Margin: <b>${margin}%</b><br/>
            Order Value: <b>$${gross?.toLocaleString()}</b><br/>
            Anomaly Risk: <b style="color: ${risk > 0.8 ? '#F43F5E' : '#34D399'}">${(risk * 100).toFixed(1)}%</b>
          `
        },
      },
      legend: {
        data: Object.keys(deptColors),
        textStyle: { color: '#94A3B8', fontSize: 10 },
        top: '2%',
        right: '4%',
      },
      grid: {
        left: '6%',
        right: '6%',
        top: '16%',
        bottom: '12%',
      },
      xAxis: {
        type: 'value',
        name: 'Transit Latency (Days)',
        nameTextStyle: { color: '#64748B', fontSize: 10 },
        axisLabel: { color: '#94A3B8', fontSize: 10 },
        splitLine: { lineStyle: { color: '#1E293B' } },
      },
      yAxis: {
        type: 'value',
        name: 'Gross Margin (%)',
        nameTextStyle: { color: '#64748B', fontSize: 10 },
        axisLabel: { color: '#94A3B8', fontSize: 10, formatter: '{value}%' },
        splitLine: { lineStyle: { color: '#1E293B' } },
      },
      series: seriesByDept as any,
    }
  }, [data])

  return (
    <div className="h-[340px] w-full">
      <BaseChart options={chartOption} height="340px" />
    </div>
  )
}

export default MultivariateScatterChart
