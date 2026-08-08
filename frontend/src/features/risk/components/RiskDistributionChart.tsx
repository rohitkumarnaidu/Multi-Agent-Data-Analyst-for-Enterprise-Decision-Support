import React, { useMemo } from 'react'
import ReactECharts from 'echarts-for-react'
import { Card } from '../../../shared/ui/Card'
import { RadarRiskFactor } from '../../../services/riskService'

interface RiskDistributionChartProps {
  factors: RadarRiskFactor[]
}

export const RiskDistributionChart: React.FC<RiskDistributionChartProps> = ({ factors }) => {
  const radarOption = useMemo(() => {
    const indicators = factors.map(f => ({
      name: f.factor,
      max: 100,
    }))
    const currentScores = factors.map(f => f.score)
    const benchmarkScores = factors.map(f => f.benchmark)

    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        backgroundColor: '#0f172a',
        borderColor: '#1e293b',
        textStyle: { color: '#f8fafc', fontSize: 12 },
      },
      legend: {
        top: 0,
        right: 10,
        textStyle: { color: '#94a3b8', fontSize: 11 },
        data: ['Current Risk Profile', 'Safety Baseline Benchmark'],
      },
      radar: {
        indicator: indicators,
        shape: 'polygon',
        splitNumber: 4,
        axisName: {
          color: '#94a3b8',
          fontSize: 11,
        },
        splitLine: {
          lineStyle: {
            color: '#1e293b',
          },
        },
        splitArea: {
          show: false,
        },
        axisLine: {
          lineStyle: {
            color: '#334155',
          },
        },
      },
      series: [
        {
          name: 'Risk Evaluation',
          type: 'radar',
          data: [
            {
              value: currentScores,
              name: 'Current Risk Profile',
              itemStyle: { color: '#f43f5e' },
              areaStyle: { color: 'rgba(244, 63, 94, 0.25)' },
            },
            {
              value: benchmarkScores,
              name: 'Safety Baseline Benchmark',
              itemStyle: { color: '#06b6d4' },
              areaStyle: { color: 'rgba(6, 182, 212, 0.15)' },
              lineStyle: { type: 'dashed' },
            },
          ],
        },
      ],
    }
  }, [factors])

  const barOption = useMemo(() => {
    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        backgroundColor: '#0f172a',
        borderColor: '#1e293b',
        textStyle: { color: '#f8fafc', fontSize: 12 },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '6%',
        top: '12%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: ['Midwest', 'West Coast', 'Southeast', 'Northeast', 'Central EMEA', 'LATAM'],
        axisLine: { lineStyle: { color: '#334155' } },
        axisLabel: { color: '#94a3b8', fontSize: 11 },
      },
      yAxis: {
        type: 'value',
        name: 'Exposure ($k)',
        nameTextStyle: { color: '#64748b', fontSize: 11 },
        axisLine: { lineStyle: { color: '#334155' } },
        axisLabel: { color: '#94a3b8', fontSize: 11, formatter: '${value}k' },
        splitLine: { lineStyle: { color: '#1e293b', type: 'dashed' } },
      },
      series: [
        {
          name: 'Financial Exposure',
          type: 'bar',
          data: [
            { value: 920, itemStyle: { color: '#f43f5e', borderRadius: [4, 4, 0, 0] } },
            { value: 580, itemStyle: { color: '#f43f5e', borderRadius: [4, 4, 0, 0] } },
            { value: 340, itemStyle: { color: '#fbbf24', borderRadius: [4, 4, 0, 0] } },
            { value: 280, itemStyle: { color: '#fbbf24', borderRadius: [4, 4, 0, 0] } },
            { value: 190, itemStyle: { color: '#06b6d4', borderRadius: [4, 4, 0, 0] } },
            { value: 110, itemStyle: { color: '#10b981', borderRadius: [4, 4, 0, 0] } },
          ],
          barWidth: 24,
        },
      ],
    }
  }, [])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card glow="none" className="p-4 bg-cyber-card/90 border-cyber-border">
        <h3 className="text-sm font-bold text-cyber-text mb-1">
          Operational Risk Factor Radar Profile
        </h3>
        <p className="text-xs text-cyber-muted mb-2">
          Multivariate vulnerability score against industry benchmarks.
        </p>
        <div className="h-64 w-full">
          <ReactECharts option={radarOption} style={{ height: '100%', width: '100%' }} />
        </div>
      </Card>

      <Card glow="none" className="p-4 bg-cyber-card/90 border-cyber-border">
        <h3 className="text-sm font-bold text-cyber-text mb-1">
          Regional Financial Exposure Breakdown
        </h3>
        <p className="text-xs text-cyber-muted mb-2">
          Identified dollar-value risk distributed by geographic operational corridor.
        </p>
        <div className="h-64 w-full">
          <ReactECharts option={barOption} style={{ height: '100%', width: '100%' }} />
        </div>
      </Card>
    </div>
  )
}
