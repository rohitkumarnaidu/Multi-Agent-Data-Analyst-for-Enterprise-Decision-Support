import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cn } from '@/shared/utils/cn'

export interface DrawerProps {
  isOpen: boolean
  onClose: () => void
  title?: React.ReactNode
  description?: string
  children: React.ReactNode
  footer?: React.ReactNode
  position?: 'right' | 'left'
  width?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  className?: string
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  position = 'right',
  width = 'md',
  className,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const widthClass = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  }[width]

  return createPortal(
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div
        className={cn(
          'fixed inset-y-0 flex max-w-full',
          position === 'right' ? 'right-0' : 'left-0'
        )}
      >
        <div
          className={cn(
            'w-screen border-slate-800 bg-slate-900/98 p-6 text-slate-100 shadow-2xl flex flex-col',
            position === 'right' ? 'border-l' : 'border-r',
            widthClass,
            className
          )}
        >
          {/* Header */}
          <div className="flex items-start justify-between pb-4 border-b border-slate-800">
            <div>
              {title && <h2 className="text-lg font-semibold text-slate-100">{title}</h2>}
              {description && <p className="text-xs text-slate-400 mt-1">{description}</p>}
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto py-4">{children}</div>

          {/* Footer */}
          {footer && <div className="pt-4 border-t border-slate-800 flex justify-end gap-2">{footer}</div>}
        </div>
      </div>
    </div>,
    document.body
  )
}
