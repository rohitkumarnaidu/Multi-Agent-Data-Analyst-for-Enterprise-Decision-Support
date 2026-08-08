import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/shared/ui/Card'
import { BaseChart } from '@/shared/charts/BaseChart'
import type { ExecutiveDashboardData } from '@/services/dashboardService'
import type { EChartsOption } from 'echarts'
import { Globe, TrendingUp } from 'lucide-react'

interface RegionalBreakdownChartProps {
  data: ExecutiveDashboardData['regionalBreakdown']
}

export const RegionalBreakdownChart: React.FC<RegionalBreakdownChartProps> = ({ data }) => {
  const chartOptions: EChartsOption = {
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(11, 15, 25, 0.92)',
      borderColor: '#334155',
      borderWidth: 1,
      textStyle: { color: '#E2E8F0', fontSize: 12 },
      formatter: (params: any) => {
        return `
          <div class="font-bold text-slate-100 mb-1">${params.name}</div>
          <div class="flex justify-between gap-4 text-xs">
            <span class="text-slate-400">Revenue:</span>
            <span class="font-mono font-semibold text-cyan-400">$${params.value}M</span>
          </div>
          <div class="flex justify-between gap-4 text-xs">
            <span class="text-slate-400">Global Share:</span>
            <span class="font-mono font-semibold text-slate-200">${params.percent}%</span>
          </div>
        `
      },
    },
    legend: {
      show: false,
    },
    series: [
      {
        name: 'Regional Revenue',
        type: 'pie',
        radius: ['55%', '80%'],
        center: ['50%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 6,
          borderColor: '#0F172A',
          borderWidth: 3,
        },
        label: {
          show: false,
          position: 'center',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 14,
            fontWeight: 'bold',
            color: '#E2E8F0',
            formatter: '{b}\n{d}%',
          },
          itemStyle: {
            shadowBlur: 15,
            shadowOffsetX: 0,
            shadowColor: 'rgba(6, 182, 212, 0.5)',
          },
        },
        data: data.map(item => ({
          name: item.region,
          value: item.revenue,
          itemStyle: {
            color:
              item.region.includes('North')
                ? '#06B6D4'
                : item.region.includes('Europe')
                ? '#6366F1'
                : item.region.includes('Asia')
                ? '#10B981'
                : '#F59E0B',
          },
        })),
      },
    ],
  }

  return (
    <Card glow="none" className="p-5">
      <CardHeader className="p-0 pb-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-cyan-400" />
              <CardTitle>Regional Contribution</CardTitle>
            </div>
            <CardDescription>Revenue distribution & territorial YoY growth rates</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 pt-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          {/* Donut Chart */}
          <div className="relative">
            <BaseChart options={chartOptions} height={220} />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Total</span>
              <span className="text-xl font-bold font-mono text-slate-100">$24.8M</span>
            </div>
          </div>

          {/* Regional Table & YoY Metrics */}
          <div className="space-y-2 text-xs">
            {data.map(item => (
              <div
                key={item.region}
                className="flex items-center justify-between p-2 rounded-lg bg-slate-800/40 border border-slate-800/80 hover:bg-slate-800/70 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{
                      backgroundColor: item.region.includes('North')
                        ? '#06B6D4'
                        : item.region.includes('Europe')
                        ? '#6366F1'
                        : item.region.includes('Asia')
                        ? '#10B981'
                        : '#F59E0B',
                    }}
                  />
                  <span className="font-medium text-slate-200 truncate max-w-[110px]">
                    {item.region.split(' ')[0]}
                  </span>
                </div>

                <div className="flex items-center gap-3 font-mono">
                  <span className="text-slate-100 font-semibold">${item.revenue}M</span>
                  <div className="flex items-center text-emerald-400 text-[11px]">
                    <TrendingUp className="h-3 w-3 mr-0.5" />
                    +{item.yoyGrowthPct}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
