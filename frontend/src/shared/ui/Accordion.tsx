import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/shared/utils/cn'

export interface AccordionItem {
  id: string
  title: React.ReactNode
  content: React.ReactNode
  icon?: React.ReactNode
  badge?: React.ReactNode
}

export interface AccordionProps {
  items: AccordionItem[]
  defaultOpenId?: string
  allowMultiple?: boolean
  className?: string
}

export const Accordion: React.FC<AccordionProps> = ({
  items,
  defaultOpenId,
  allowMultiple = false,
  className,
}) => {
  const [openIds, setOpenIds] = useState<string[]>(defaultOpenId ? [defaultOpenId] : [])

  const toggleItem = (id: string) => {
    if (allowMultiple) {
      setOpenIds(prev => (prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]))
    } else {
      setOpenIds(prev => (prev.includes(id) ? [] : [id]))
    }
  }

  return (
    <div className={cn('space-y-2', className)}>
      {items.map(item => {
        const isOpen = openIds.includes(item.id)
        return (
          <div
            key={item.id}
            className="rounded-xl border border-slate-800/80 bg-slate-900/70 overflow-hidden transition-colors"
          >
            <button
              onClick={() => toggleItem(item.id)}
              className="flex w-full items-center justify-between p-3.5 text-left text-xs font-semibold text-slate-200 hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                {item.icon && <span className="text-cyan-400">{item.icon}</span>}
                <span>{item.title}</span>
                {item.badge}
              </div>
              <ChevronDown
                className={cn(
                  'h-4 w-4 text-slate-400 transition-transform duration-200',
                  isOpen && 'transform rotate-180 text-cyan-400'
                )}
              />
            </button>
            {isOpen && (
              <div className="p-3.5 pt-0 text-xs text-slate-300 border-t border-slate-800/40">
                {item.content}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
