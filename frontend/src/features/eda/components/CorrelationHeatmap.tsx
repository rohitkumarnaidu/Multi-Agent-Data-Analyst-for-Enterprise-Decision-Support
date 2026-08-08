import React, { useMemo } from 'react'
import { BaseChart } from '@/shared/charts/BaseChart'
import type { EChartsOption } from 'echarts'
import type { CorrelationMatrixResponse } from '@/shared/types'

interface CorrelationHeatmapProps {
  data: CorrelationMatrixResponse
  method: 'pearson' | 'spearman'
  onMethodChange: (method: 'pearson' | 'spearman') => void
}

export const CorrelationHeatmap: React.FC<CorrelationHeatmapProps> = ({
  data,
  method,
  onMethodChange,
}) => {
  const chartOption: EChartsOption = useMemo(() => {
    const { features, matrix } = data

    // ECharts heatmap expects data in [xIndex, yIndex, value] format
    const heatmapData: [number, number, number][] = []
    for (let i = 0; i < features.length; i++) {
      for (let j = 0; j < features.length; j++) {
        heatmapData.push([j, i, parseFloat(matrix[i][j].toFixed(2))])
      }
    }

    return {
      tooltip: {
        position: 'top',
        backgroundColor: '#0F172A',
        borderColor: '#334155',
        textStyle: { color: '#F8FAFC', fontFamily: 'monospace', fontSize: 11 },
        formatter: (params: any) => {
          const val = params.data[2]
          const f1 = features[params.data[1]]
          const f2 = features[params.data[0]]
          return `<b>${f1}</b> ↔ <b>${f2}</b><br/>${method.toUpperCase()} r = <b>${val}</b>`
        },
      },
      grid: {
        top: '8%',
        bottom: '18%',
        left: '20%',
        right: '6%',
      },
      xAxis: {
        type: 'category',
        data: features,
        splitArea: { show: true },
        axisLabel: {
          color: '#94A3B8',
          fontSize: 10,
          fontFamily: 'monospace',
          rotate: 35,
        },
        axisLine: { lineStyle: { color: '#334155' } },
      },
      yAxis: {
        type: 'category',
        data: features,
        splitArea: { show: true },
        axisLabel: {
          color: '#94A3B8',
          fontSize: 10,
          fontFamily: 'monospace',
        },
        axisLine: { lineStyle: { color: '#334155' } },
      },
      visualMap: {
        min: -1,
        max: 1,
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        bottom: '0%',
        textStyle: { color: '#94A3B8', fontSize: 10 },
        inRange: {
          color: ['#F43F5E', '#1E293B', '#06B6D4'], // Rose (-1) -> Dark (0) -> Cyan (+1)
        },
      },
      series: [
        {
          name: 'Correlation',
          type: 'heatmap',
          data: heatmapData,
          label: {
            show: true,
            color: '#F8FAFC',
            fontSize: 10,
            fontFamily: 'monospace',
            formatter: (p: any) => (p.data[2] === 1 ? '1.0' : p.data[2].toString()),
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(6, 182, 212, 0.5)',
            },
          },
        },
      ],
    }
  }, [data, method])

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="text-xs text-slate-400 font-mono">
          Correlation Method: <span className="text-cyan-400 font-bold uppercase">{method}</span>
        </div>
        <div className="flex gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => onMethodChange('pearson')}
            className={`px-2.5 py-0.5 rounded text-[11px] font-mono transition-all ${
              method === 'pearson'
                ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Pearson (Linear)
          </button>
          <button
            onClick={() => onMethodChange('spearman')}
            className={`px-2.5 py-0.5 rounded text-[11px] font-mono transition-all ${
              method === 'spearman'
                ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Spearman (Rank)
          </button>
        </div>
      </div>

      <div className="h-[380px] w-full">
        <BaseChart options={chartOption} height="380px" />
      </div>
    </div>
  )
}

export default CorrelationHeatmap
