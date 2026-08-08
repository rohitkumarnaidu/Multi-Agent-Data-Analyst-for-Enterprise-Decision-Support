import React from 'react'
import { cn } from '@/shared/utils/cn'

export interface TabItem {
  id: string
  label: string
  icon?: React.ReactNode
  badge?: string | number
  disabled?: boolean
}

export interface TabsProps {
  tabs: TabItem[]
  activeTab: string
  onChange: (tabId: string) => void
  variant?: 'underline' | 'pills' | 'segmented'
  size?: 'sm' | 'md'
  className?: string
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  variant = 'segmented',
  size = 'md',
  className,
}) => {
  if (variant === 'segmented') {
    return (
      <div
        className={cn(
          'inline-flex items-center rounded-lg bg-slate-100 dark:bg-slate-800/80 p-1 border border-slate-200 dark:border-slate-700/60 text-slate-600 dark:text-slate-400',
          size === 'sm' ? 'text-xs' : 'text-xs font-medium',
          className
        )}
      >
        {tabs.map(tab => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => !tab.disabled && onChange(tab.id)}
              disabled={tab.disabled}
              className={cn(
                'flex items-center gap-1.5 rounded-md px-3 py-1.5 transition-all duration-150 select-none cursor-pointer',
                isActive
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 shadow-xs font-semibold'
                  : 'hover:text-slate-900 dark:hover:text-slate-200',
                tab.disabled && 'opacity-40 cursor-not-allowed'
              )}
            >
              {tab.icon && <span className="h-3.5 w-3.5 shrink-0">{tab.icon}</span>}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={cn(
                    'rounded-full px-1.5 py-0.2 text-[10px] font-bold',
                    isActive
                      ? 'bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                  )}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          )
        })}
      </div>
    )
  }

  if (variant === 'pills') {
    return (
      <div className={cn('flex items-center gap-1.5 flex-wrap', className)}>
        {tabs.map(tab => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => !tab.disabled && onChange(tab.id)}
              disabled={tab.disabled}
              className={cn(
                'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-150 border select-none cursor-pointer',
                isActive
                  ? 'bg-sky-600 text-white border-sky-600 font-semibold shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800',
                tab.disabled && 'opacity-40 cursor-not-allowed'
              )}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-1.5 py-0.2 text-[10px]">
                  {tab.badge}
                </span>
              )}
            </button>
          )
        })}
      </div>
    )
  }

  // Underline variant
  return (
    <div className={cn('flex border-b border-slate-200 dark:border-slate-800 gap-4', className)}>
      {tabs.map(tab => {
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => !tab.disabled && onChange(tab.id)}
            disabled={tab.disabled}
            className={cn(
              'flex items-center gap-2 pb-2.5 text-xs font-medium transition-all border-b-2 select-none -mb-px cursor-pointer',
              isActive
                ? 'border-sky-600 dark:border-sky-400 text-sky-600 dark:text-sky-400 font-semibold'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700',
              tab.disabled && 'opacity-40 cursor-not-allowed'
            )}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-1.5 py-0.2 text-[10px] text-slate-600 dark:text-slate-400">
                {tab.badge}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
