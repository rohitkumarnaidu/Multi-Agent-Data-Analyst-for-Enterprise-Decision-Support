import React, { createContext, useContext, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react'
import { cn } from '@/shared/utils/cn'

export type ToastType = 'success' | 'warning' | 'error' | 'info'

export interface ToastItem {
  id: string
  title: string
  message?: string
  type: ToastType
  duration?: number
}

interface ToastContextType {
  showToast: (toast: Omit<ToastItem, 'id'>) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const showToast = useCallback(
    ({ title, message, type = 'info', duration = 4000 }: Omit<ToastItem, 'id'>) => {
      const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`
      setToasts(prev => [...prev, { id, title, message, type, duration }])

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id)
        }, duration)
      }
    },
    [removeToast]
  )

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      {createPortal(
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
          {toasts.map(toast => {
            const iconMap = {
              success: <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />,
              warning: <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0" />,
              error: <AlertCircle className="h-5 w-5 text-rose-400 shrink-0" />,
              info: <Info className="h-5 w-5 text-cyan-400 shrink-0" />,
            }

            const borderMap = {
              success: 'border-emerald-500/40 bg-slate-900/95 shadow-glow-emerald',
              warning: 'border-amber-500/40 bg-slate-900/95 shadow-glow-amber',
              error: 'border-rose-500/40 bg-slate-900/95 shadow-glow-rose',
              info: 'border-cyan-500/40 bg-slate-900/95 shadow-glow-cyan',
            }

            return (
              <div
                key={toast.id}
                className={cn(
                  'pointer-events-auto flex items-start gap-3 rounded-xl border p-4 text-slate-100 shadow-xl backdrop-blur-md transition-all animate-in slide-in-from-bottom-2 duration-200',
                  borderMap[toast.type]
                )}
              >
                {iconMap[toast.type]}
                <div className="flex-1 space-y-0.5">
                  <p className="text-xs font-semibold text-slate-100">{toast.title}</p>
                  {toast.message && <p className="text-[11px] text-slate-400">{toast.message}</p>}
                </div>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="text-slate-400 hover:text-slate-200 transition-colors p-1"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )
          })}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
