import React, { useEffect, useRef } from 'react'
import * as echarts from 'echarts'
import { useTheme } from '@/shared/context/ThemeContext'
import { cn } from '@/shared/utils/cn'

export interface BaseChartProps {
  options: echarts.EChartsOption
  height?: string | number
  className?: string
  loading?: boolean
  onEvents?: Record<string, (params: unknown) => void>
}

export const BaseChart: React.FC<BaseChartProps> = ({
  options,
  height = 320,
  className,
  loading = false,
  onEvents,
}) => {
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstance = useRef<echarts.ECharts | null>(null)
  const { theme } = useTheme()

  useEffect(() => {
    if (!chartRef.current) return

    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current, theme === 'dark' ? 'dark' : undefined, {
        renderer: 'canvas',
      })
    }

    if (onEvents) {
      Object.entries(onEvents).forEach(([eventName, handler]) => {
        chartInstance.current?.on(eventName, handler)
      })
    }

    const handleResize = () => {
      chartInstance.current?.resize()
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      chartInstance.current?.dispose()
      chartInstance.current = null
    }
  }, [])

  // Update theme dynamically
  useEffect(() => {
    if (chartRef.current) {
      chartInstance.current?.dispose()
      chartInstance.current = echarts.init(chartRef.current, theme === 'dark' ? 'dark' : undefined, {
        renderer: 'canvas',
      })
      if (options) {
        chartInstance.current.setOption(options, true)
      }
    }
  }, [theme])

  // Update chart options
  useEffect(() => {
    if (chartInstance.current && options) {
      chartInstance.current.setOption(options, { notMerge: true })
    }
  }, [options])

  // Handle loading state
  useEffect(() => {
    if (chartInstance.current) {
      if (loading) {
        chartInstance.current.showLoading({
          text: 'Computing telemetry...',
          color: '#06B6D4',
          textColor: theme === 'dark' ? '#E2E8F0' : '#1E293B',
          maskColor: theme === 'dark' ? 'rgba(11, 15, 25, 0.7)' : 'rgba(255, 255, 255, 0.7)',
        })
      } else {
        chartInstance.current.hideLoading()
      }
    }
  }, [loading, theme])

  return (
    <div
      ref={chartRef}
      className={cn('w-full', className)}
      style={{ height: typeof height === 'number' ? `${height}px` : height }}
    />
  )
}
export default BaseChart
