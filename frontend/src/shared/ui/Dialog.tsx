import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cn } from '@/shared/utils/cn'

export interface DialogProps {
  isOpen: boolean
  onClose: () => void
  title?: React.ReactNode
  description?: string
  children: React.ReactNode
  footer?: React.ReactNode
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | 'full'
  className?: string
}

export const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  maxWidth = 'lg',
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

  const maxWidthClass = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl',
    full: 'max-w-[95vw]',
  }[maxWidth]

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div
        className={cn(
          'relative w-full rounded-xl border border-slate-700/80 bg-slate-900/95 p-6 text-slate-100 shadow-2xl shadow-cyan-950/20 z-10 transition-all animate-in zoom-in-95',
          maxWidthClass,
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
        <div className="py-4 max-h-[75vh] overflow-y-auto">{children}</div>

        {/* Footer */}
        {footer && <div className="pt-4 border-t border-slate-800 flex justify-end gap-2">{footer}</div>}
      </div>
    </div>,
    document.body
  )
}
