import React, { useState, useRef, useEffect } from 'react'
import { cn } from '@/shared/utils/cn'

export interface DropdownMenuItem {
  id: string
  label: string
  icon?: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  destructive?: boolean
  divider?: boolean
}

export interface DropdownMenuProps {
  trigger: React.ReactNode
  items: DropdownMenuItem[]
  align?: 'left' | 'right'
  className?: string
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  trigger,
  items,
  align = 'right',
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer inline-flex items-center">
        {trigger}
      </div>

      {isOpen && (
        <div
          className={cn(
            'absolute z-50 mt-1.5 w-52 rounded-xl border border-slate-700/80 bg-slate-900/95 p-1 text-slate-200 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95',
            align === 'right' ? 'right-0' : 'left-0',
            className
          )}
        >
          {items.map(item => {
            if (item.divider) {
              return <div key={item.id} className="my-1 border-t border-slate-800" />
            }
            return (
              <button
                key={item.id}
                disabled={item.disabled}
                onMouseDown={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  if (!item.disabled && item.onClick) {
                    item.onClick()
                    setIsOpen(false)
                  }
                }}
                className={cn(
                  'flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors text-left select-none',
                  item.destructive
                    ? 'text-rose-400 hover:bg-rose-500/15 hover:text-rose-300'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-slate-100',
                  item.disabled && 'opacity-40 cursor-not-allowed'
                )}
              >
                {item.icon && <span className="h-4 w-4 shrink-0">{item.icon}</span>}
                <span className="flex-1">{item.label}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
