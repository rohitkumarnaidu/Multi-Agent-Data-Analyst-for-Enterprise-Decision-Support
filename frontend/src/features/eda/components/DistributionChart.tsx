import React, { useMemo } from 'react'
import { BaseChart } from '@/shared/charts/BaseChart'
import type { EChartsOption } from 'echarts'
import type { DistributionBin } from '@/shared/types'

interface DistributionChartProps {
  data: DistributionBin[]
  variableName: string
}

export const DistributionChart: React.FC<DistributionChartProps> = ({ data, variableName }) => {
  const chartOption: EChartsOption = useMemo(() => {
    const bins = data.map(d => d.bin)
    const counts = data.map(d => d.count)
    const kdeScores = data.map(d => d.kde * 100) // Scaled for secondary axis

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'cross', label: { backgroundColor: '#0F172A' } },
        backgroundColor: '#0F172A',
        borderColor: '#334155',
        textStyle: { color: '#F8FAFC', fontFamily: 'monospace', fontSize: 11 },
      },
      legend: {
        data: ['Frequency Count', 'Kernel Density (KDE)'],
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
        type: 'category',
        data: bins,
        axisLabel: { color: '#94A3B8', fontSize: 10, fontFamily: 'monospace' },
        axisLine: { lineStyle: { color: '#334155' } },
      },
      yAxis: [
        {
          type: 'value',
          name: 'Records',
          nameTextStyle: { color: '#64748B', fontSize: 10 },
          axisLabel: {
            color: '#94A3B8',
            fontSize: 10,
            formatter: (v: number) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : `${v}`),
          },
          splitLine: { lineStyle: { color: '#1E293B' } },
        },
        {
          type: 'value',
          name: 'Density (%)',
          nameTextStyle: { color: '#06B6D4', fontSize: 10 },
          axisLabel: { color: '#06B6D4', fontSize: 10, formatter: '{value}%' },
          splitLine: { show: false },
        },
      ],
      series: [
        {
          name: 'Frequency Count',
          type: 'bar',
          data: counts,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: '#38BDF8' },
                { offset: 1, color: '#0284C7' },
              ],
            },
            borderRadius: [4, 4, 0, 0],
          },
        },
        {
          name: 'Kernel Density (KDE)',
          type: 'line',
          yAxisIndex: 1,
          smooth: true,
          data: kdeScores,
          lineStyle: { color: '#10B981', width: 3 },
          symbol: 'circle',
          symbolSize: 6,
          itemStyle: { color: '#10B981' },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(16, 185, 129, 0.25)' },
                { offset: 1, color: 'rgba(16, 185, 129, 0.0)' },
              ],
            },
          },
        },
      ],
    }
  }, [data])

  return (
    <div className="h-[340px] w-full">
      <BaseChart options={chartOption} height="340px" />
    </div>
  )
}

export default DistributionChart
