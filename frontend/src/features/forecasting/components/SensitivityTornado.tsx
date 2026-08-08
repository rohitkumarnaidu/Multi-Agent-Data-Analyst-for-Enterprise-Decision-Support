import React, { useMemo } from 'react'
import ReactECharts from 'echarts-for-react'
import { Card } from '../../../shared/ui/Card'
import { SensitivityDriver } from '../../../services/forecastingService'

interface SensitivityTornadoProps {
  drivers: SensitivityDriver[]
}

export const SensitivityTornado: React.FC<SensitivityTornadoProps> = ({ drivers }) => {
  const option = useMemo(() => {
    const sorted = [...drivers].sort((a, b) => Math.abs(a.elasticity) - Math.abs(b.elasticity))
    const names = sorted.map(d => d.feature)
    const values = sorted.map(d => d.elasticity)

    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        backgroundColor: '#0f172a',
        borderColor: '#1e293b',
        textStyle: { color: '#f8fafc', fontSize: 12 },
        formatter: (params: any[]) => {
          const p = params[0]
          return `<div class="font-bold mb-1">${p.name}</div>
                  <div class="text-xs text-slate-300">Margin Elasticity: <span class="font-mono font-bold ${p.value < 0 ? 'text-rose-400' : 'text-emerald-400'}">${p.value > 0 ? '+' : ''}${p.value}%</span> per 1% change</div>`
        },
      },
      grid: {
        left: '3%',
        right: '6%',
        bottom: '6%',
        top: '6%',
        containLabel: true,
      },
      xAxis: {
        type: 'value',
        name: 'Margin Elasticity (%)',
        nameLocation: 'middle',
        nameGap: 24,
        nameTextStyle: { color: '#64748b', fontSize: 11 },
        axisLine: { lineStyle: { color: '#334155' } },
        axisLabel: { color: '#94a3b8', fontSize: 11, formatter: '{value}%' },
        splitLine: { lineStyle: { color: '#1e293b', type: 'dashed' } },
      },
      yAxis: {
        type: 'category',
        data: names,
        axisLine: { lineStyle: { color: '#334155' } },
        axisLabel: { color: '#94a3b8', fontSize: 11 },
        splitLine: { show: false },
      },
      series: [
        {
          name: 'Elasticity',
          type: 'bar',
          data: values.map(val => ({
            value: val,
            itemStyle: {
              color: val >= 0 ? '#10b981' : '#f43f5e',
              borderRadius: val >= 0 ? [0, 4, 4, 0] : [4, 0, 0, 4],
            },
          })),
          barWidth: 16,
        },
      ],
    }
  }, [drivers])

  return (
    <Card glow="none" className="p-4 bg-cyber-card/90 border-cyber-border">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-bold text-cyber-text">
          Sensitivity Elasticity Matrix (Tornado Driver Ranking)
        </h3>
        <span className="text-[11px] text-cyber-muted font-mono">
          % Impact on Gross Margin
        </span>
      </div>
      <div className="h-56 w-full">
        <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
      </div>
    </Card>
  )
}
