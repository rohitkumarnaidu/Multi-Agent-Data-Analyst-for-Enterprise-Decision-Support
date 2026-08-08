import React from 'react'
import { cn } from '@/shared/utils/cn'

export interface TimelineItem {
  id: string
  title: string
  subtitle?: string
  timestamp?: string
  status?: 'completed' | 'running' | 'failed' | 'waiting'
  icon?: React.ReactNode
  content?: React.ReactNode
  badge?: React.ReactNode
}

export interface TimelineProps {
  items: TimelineItem[]
  className?: string
}

export const Timeline: React.FC<TimelineProps> = ({ items, className }) => {
  return (
    <div className={cn('relative pl-6 space-y-6', className)}>
      {/* Vertical timeline line */}
      <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-slate-800" />

      {items.map(item => {
        const dotColor = {
          completed: 'bg-emerald-500 border-emerald-400/40 shadow-glow-emerald',
          running: 'bg-cyan-500 border-cyan-400/40 shadow-glow-cyan animate-pulse',
          failed: 'bg-rose-500 border-rose-400/40 shadow-glow-rose',
          waiting: 'bg-slate-700 border-slate-600',
        }[item.status || 'completed']

        return (
          <div key={item.id} className="relative group">
            {/* Timeline node marker */}
            <div
              className={cn(
                'absolute -left-6 top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 bg-slate-950 text-slate-100 z-10 transition-transform group-hover:scale-110',
                dotColor
              )}
            >
              {item.icon ? (
                <span className="scale-75">{item.icon}</span>
              ) : (
                <div className="h-1.5 w-1.5 rounded-full bg-white" />
              )}
            </div>

            {/* Item Content */}
            <div className="rounded-lg border border-slate-800/80 bg-slate-900/60 p-3.5 backdrop-blur-sm transition-all group-hover:border-slate-700">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-xs font-semibold text-slate-200">{item.title}</h4>
                  {item.subtitle && <p className="text-[11px] text-slate-400 mt-0.5">{item.subtitle}</p>}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {item.badge}
                  {item.timestamp && <span className="font-mono text-[10px] text-slate-500">{item.timestamp}</span>}
                </div>
              </div>
              {item.content && <div className="mt-2.5 pt-2 border-t border-slate-800/60">{item.content}</div>}
            </div>
          </div>
        )
      })}
    </div>
  )
}
