import React from 'react'
import { Card } from './Card'
import { cn } from '@/shared/utils/cn'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

export interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  trend?: {
    value: number
    label: string
    isPositive?: boolean
  }
  icon?: React.ReactNode
  telemetryBar?: {
    pct: number
    color?: string
  }
  className?: string
  glow?: string
  statusBadge?: React.ReactNode
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  icon,
  telemetryBar,
  className,
  statusBadge,
}) => {
  return (
    <Card className={cn('p-4 transition-all duration-200 relative overflow-hidden', className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1 min-w-0">
          <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">
            {title}
          </p>
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">
              {value}
            </span>
            {statusBadge}
          </div>
        </div>
        {icon && (
          <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 shrink-0">
            {icon}
          </div>
        )}
      </div>

      {(trend || subtitle) && (
        <div className="mt-3 flex items-center justify-between text-xs pt-1 border-t border-slate-100 dark:border-slate-800/60">
          {trend ? (
            <div
              className={cn(
                'flex items-center gap-1 font-medium',
                trend.isPositive === undefined
                  ? trend.value >= 0
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-rose-600 dark:text-rose-400'
                  : trend.isPositive
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-rose-600 dark:text-rose-400'
              )}
            >
              {trend.value > 0 ? (
                <TrendingUp className="h-3.5 w-3.5 shrink-0" />
              ) : trend.value < 0 ? (
                <TrendingDown className="h-3.5 w-3.5 shrink-0" />
              ) : (
                <Minus className="h-3.5 w-3.5 shrink-0" />
              )}
              <span>{trend.value > 0 ? `+${trend.value}%` : `${trend.value}%`}</span>
              <span className="text-slate-500 dark:text-slate-400 font-normal truncate">{trend.label}</span>
            </div>
          ) : (
            <span className="text-slate-500 dark:text-slate-400 text-[11px] truncate">{subtitle}</span>
          )}
        </div>
      )}

      {telemetryBar && (
        <div className="mt-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1 overflow-hidden">
          <div
            className={cn('h-full rounded-full transition-all duration-300', telemetryBar.color || 'bg-sky-600 dark:bg-sky-500')}
            style={{ width: `${Math.min(100, Math.max(0, telemetryBar.pct))}%` }}
          />
        </div>
      )}
    </Card>
  )
}
