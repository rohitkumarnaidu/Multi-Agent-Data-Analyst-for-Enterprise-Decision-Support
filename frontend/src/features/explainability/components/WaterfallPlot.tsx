import React, { useMemo } from 'react'
import { BaseChart } from '@/shared/charts/BaseChart'
import type { EChartsOption } from 'echarts'
import type { LocalWaterfallItem } from '@/shared/types'

interface WaterfallPlotProps {
  waterfall: LocalWaterfallItem[]
  baseValue: number
  predictedValue: number
}

export const WaterfallPlot: React.FC<WaterfallPlotProps> = ({
  waterfall,
  baseValue,
  predictedValue,
}) => {
  const chartOption: EChartsOption = useMemo(() => {
    const categories = waterfall.map(w => w.featureName)
    const basePlaceholders: number[] = []
    const positiveBars: number[] = []
    const negativeBars: number[] = []

    let running = 0
    waterfall.forEach((w, idx) => {
      if (idx === 0) {
        // Base value bar
        basePlaceholders.push(0)
        positiveBars.push(w.shapValue)
        negativeBars.push(0)
        running = w.shapValue
      } else {
        if (w.shapValue >= 0) {
          basePlaceholders.push(running)
          positiveBars.push(w.shapValue)
          negativeBars.push(0)
          running += w.shapValue
        } else {
          running += w.shapValue
          basePlaceholders.push(running)
          positiveBars.push(0)
          negativeBars.push(Math.abs(w.shapValue))
        }
      }
    })

    return {
      title: {
        text: `SHAP Waterfall Decomposition: Base E[f(x)] = ${baseValue}% ➔ Prediction f(x) = ${predictedValue}%`,
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
          const idx = params[0].dataIndex
          const item = waterfall[idx]
          return `
            <b>${item.featureName}</b> (${item.actualValue})<br/>
            SHAP Contribution: <b style="color: ${item.shapValue >= 0 ? '#34D399' : '#F43F5E'}">
              ${item.shapValue >= 0 ? '+' : ''}${item.shapValue}%
            </b><br/>
            Cumulative Total: <b>${item.runningTotal.toFixed(1)}%</b>
          `
        },
      },
      grid: { left: '26%', right: '8%', top: '18%', bottom: '8%' },
      xAxis: {
        type: 'value',
        name: '% Margin Contribution',
        nameTextStyle: { color: '#64748B', fontSize: 10 },
        axisLabel: { color: '#94A3B8', fontSize: 10, formatter: '{value}%' },
        splitLine: { lineStyle: { color: '#1E293B' } },
      },
      yAxis: {
        type: 'category',
        data: [...categories].reverse(),
        axisLabel: { color: '#94A3B8', fontSize: 10, fontFamily: 'monospace' },
        axisLine: { lineStyle: { color: '#334155' } },
      },
      series: [
        {
          name: 'Placeholder',
          type: 'bar',
          stack: 'Total',
          itemStyle: { borderColor: 'transparent', color: 'transparent' },
          emphasis: { itemStyle: { borderColor: 'transparent', color: 'transparent' } },
          data: [...basePlaceholders].reverse(),
        },
        {
          name: 'Positive Contribution',
          type: 'bar',
          stack: 'Total',
          itemStyle: { color: '#10B981', borderRadius: 4 },
          data: [...positiveBars].reverse(),
        },
        {
          name: 'Negative Contribution',
          type: 'bar',
          stack: 'Total',
          itemStyle: { color: '#F43F5E', borderRadius: 4 },
          data: [...negativeBars].reverse(),
        },
      ],
    }
  }, [waterfall, baseValue, predictedValue])

  return (
    <div className="h-[360px] w-full">
      <BaseChart options={chartOption} height="360px" />
    </div>
  )
}

export default WaterfallPlot
