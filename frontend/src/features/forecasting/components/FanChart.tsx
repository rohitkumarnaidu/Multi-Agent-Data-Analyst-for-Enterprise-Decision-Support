import React, { useMemo } from 'react'
import ReactECharts from 'echarts-for-react'
import { Card } from '../../../shared/ui/Card'
import { ForecastPoint } from '../../../services/forecastingService'

interface FanChartProps {
  data: ForecastPoint[]
  scenarioName: string
}

export const FanChart: React.FC<FanChartProps> = ({ data, scenarioName }) => {
  const option = useMemo(() => {
    const months = data.map(d => d.month)
    const historical = data.map(d => d.historical ?? null)
    const forecast = data.map(d => d.forecast ?? null)
    const lower80 = data.map(d => d.lower80 ?? null)
    const upper80 = data.map(d => (d.upper80 && d.lower80 ? d.upper80 - d.lower80 : null))
    const lower95 = data.map(d => d.lower95 ?? null)
    const upper95 = data.map(d => (d.upper95 && d.lower95 ? d.upper95 - d.lower95 : null))

    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#0f172a',
        borderColor: '#1e293b',
        textStyle: { color: '#f8fafc', fontSize: 12 },
        formatter: (params: any[]) => {
          let str = `<div class="font-bold mb-1 border-b border-slate-700 pb-1">${params[0]?.axisValue}</div>`
          params.forEach(p => {
            if (p.seriesName === 'Historical Actuals' && p.value != null) {
              str += `<div class="flex items-center justify-between gap-4 text-xs"><span class="text-slate-400">● Historical Actuals:</span><span class="font-bold text-white">$${p.value}M</span></div>`
            }
            if (p.seriesName === 'Forecast Mean' && p.value != null) {
              str += `<div class="flex items-center justify-between gap-4 text-xs"><span class="text-cyan-400">● Forecast Mean:</span><span class="font-bold text-cyan-300">$${p.value}M</span></div>`
            }
          })
          const item = data.find(d => d.month === params[0]?.axisValue)
          if (item?.lower80 && item?.upper80) {
            str += `<div class="text-[11px] text-slate-400 mt-1">80% CI: $${item.lower80}M – $${item.upper80}M</div>`
          }
          if (item?.lower95 && item?.upper95) {
            str += `<div class="text-[11px] text-indigo-400">95% CI: $${item.lower95}M – $${item.upper95}M</div>`
          }
          return str
        },
      },
      legend: {
        top: 0,
        right: 10,
        textStyle: { color: '#94a3b8', fontSize: 11 },
        data: ['Historical Actuals', 'Forecast Mean', '80% Confidence Band', '95% Confidence Band'],
      },
      grid: {
        left: '2%',
        right: '3%',
        bottom: '8%',
        top: '14%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: months,
        axisLine: { lineStyle: { color: '#334155' } },
        axisLabel: { color: '#94a3b8', fontSize: 11 },
        splitLine: { show: false },
      },
      yAxis: {
        type: 'value',
        name: 'Revenue ($M)',
        nameTextStyle: { color: '#64748b', fontSize: 11 },
        axisLine: { lineStyle: { color: '#334155' } },
        axisLabel: { color: '#94a3b8', formatter: '${value}M', fontSize: 11 },
        splitLine: { lineStyle: { color: '#1e293b', type: 'dashed' } },
      },
      series: [
        // 95% Lower base (invisible)
        {
          name: '95% Lower Base',
          type: 'line',
          data: lower95,
          lineStyle: { opacity: 0 },
          stack: 'confidence-95',
          symbol: 'none',
        },
        // 95% Area
        {
          name: '95% Confidence Band',
          type: 'line',
          data: upper95,
          lineStyle: { opacity: 0 },
          areaStyle: { color: 'rgba(99, 102, 241, 0.12)' },
          stack: 'confidence-95',
          symbol: 'none',
        },
        // 80% Lower base (invisible)
        {
          name: '80% Lower Base',
          type: 'line',
          data: lower80,
          lineStyle: { opacity: 0 },
          stack: 'confidence-80',
          symbol: 'none',
        },
        // 80% Area
        {
          name: '80% Confidence Band',
          type: 'line',
          data: upper80,
          lineStyle: { opacity: 0 },
          areaStyle: { color: 'rgba(6, 182, 212, 0.22)' },
          stack: 'confidence-80',
          symbol: 'none',
        },
        // Historical Actuals Line
        {
          name: 'Historical Actuals',
          type: 'line',
          data: historical,
          smooth: true,
          lineStyle: { width: 3, color: '#0ea5e9' },
          itemStyle: { color: '#0ea5e9' },
          symbolSize: 6,
        },
        // Forecast Mean Line
        {
          name: 'Forecast Mean',
          type: 'line',
          data: forecast,
          smooth: true,
          lineStyle: { width: 3, type: 'dashed', color: '#06b6d4' },
          itemStyle: { color: '#06b6d4' },
          symbolSize: 6,
        },
      ],
    }
  }, [data])

  return (
    <Card glow="none" className="p-4 bg-cyber-card/90 border-cyber-border">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-sm font-bold text-cyber-text flex items-center gap-2">
            12-Month Predictive Fan Chart & Confidence Envelopes
          </h3>
          <p className="text-xs text-cyber-muted">
            Probabilistic trajectory modeled for <span className="text-cyber-cyan font-medium">{scenarioName}</span>.
          </p>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-cyber-muted">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-cyan-400"></span> Mean Forecast
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-cyan-400/40 ml-2"></span> 80% Band
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-indigo-500/30 ml-2"></span> 95% Band
        </div>
      </div>
      <div className="h-72 w-full">
        <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
      </div>
    </Card>
  )
}
