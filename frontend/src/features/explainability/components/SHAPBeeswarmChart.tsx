import React, { useMemo } from 'react'
import { BaseChart } from '@/shared/charts/BaseChart'
import type { EChartsOption } from 'echarts'
import type { GlobalSHAPFeature } from '@/shared/types'

interface SHAPBeeswarmChartProps {
  data: GlobalSHAPFeature[]
}

export const SHAPBeeswarmChart: React.FC<SHAPBeeswarmChartProps> = ({ data }) => {
  const chartOption: EChartsOption = useMemo(() => {
    const features = [...data].reverse().map(d => d.featureName)
    const meanShap = [...data].reverse().map(d => d.meanAbsoluteShap)

    return {
      title: {
        text: 'Global TreeSHAP Feature Importance (Mean |SHAP Value|)',
        textStyle: { color: '#F8FAFC', fontSize: 12 },
        top: '2%',
        left: '2%',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        backgroundColor: '#0F172A',
        borderColor: '#334155',
        textStyle: { color: '#F8FAFC', fontFamily: 'monospace', fontSize: 11 },
        formatter: (params: any) => {
          const item = params[0]
          return `<b>${item.name}</b><br/>Mean |SHAP Impact|: <b>${item.value} % margin</b>`
        },
      },
      grid: { left: '26%', right: '8%', top: '16%', bottom: '8%' },
      xAxis: {
        type: 'value',
        name: 'Mean |SHAP Value| (% Margin)',
        nameTextStyle: { color: '#64748B', fontSize: 10 },
        axisLabel: { color: '#94A3B8', fontSize: 10 },
        splitLine: { lineStyle: { color: '#1E293B' } },
      },
      yAxis: {
        type: 'category',
        data: features,
        axisLabel: { color: '#94A3B8', fontSize: 10, fontFamily: 'monospace' },
        axisLine: { lineStyle: { color: '#334155' } },
      },
      series: [
        {
          name: 'Mean |SHAP|',
          type: 'bar',
          data: meanShap,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 1,
              y2: 0,
              colorStops: [
                { offset: 0, color: '#0284C7' },
                { offset: 1, color: '#38BDF8' },
              ],
            },
            borderRadius: [0, 4, 4, 0],
          },
          label: {
            show: true,
            position: 'right',
            color: '#38BDF8',
            fontFamily: 'monospace',
            fontSize: 10,
            formatter: '{c}',
          },
        },
      ],
    }
  }, [data])

  return (
    <div className="h-[360px] w-full">
      <BaseChart options={chartOption} height="360px" />
    </div>
  )
}

export default SHAPBeeswarmChart
