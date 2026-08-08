import React from 'react'
import { Drawer } from '@/shared/ui/Drawer'
import { useWorkspace } from '@/shared/context/WorkspaceContext'
import { Button } from '@/shared/ui/Button'
import { CheckCircle, AlertTriangle, Info, ShieldAlert, CheckCheck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/shared/utils/cn'

export const NotificationsDrawer: React.FC = () => {
  const {
    isNotificationsOpen,
    setIsNotificationsOpen,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
  } = useWorkspace()
  const navigate = useNavigate()

  const iconMap = {
    approval_required: <ShieldAlert className="h-5 w-5 text-amber-400 shrink-0" />,
    warning: <AlertTriangle className="h-5 w-5 text-rose-400 shrink-0" />,
    success: <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0" />,
    info: <Info className="h-5 w-5 text-cyan-400 shrink-0" />,
    error: <AlertTriangle className="h-5 w-5 text-rose-400 shrink-0" />,
  }

  return (
    <Drawer
      isOpen={isNotificationsOpen}
      onClose={() => setIsNotificationsOpen(false)}
      title="System Notifications & Alerts"
      description="Live multi-agent execution events, model updates, and human approval requests."
      width="md"
      footer={
        <div className="flex w-full items-center justify-between">
          <Button
            size="xs"
            variant="ghost"
            leftIcon={<CheckCheck className="h-3.5 w-3.5" />}
            onClick={markAllNotificationsAsRead}
          >
            Mark all as read
          </Button>
          <Button size="xs" variant="secondary" onClick={() => setIsNotificationsOpen(false)}>
            Close
          </Button>
        </div>
      }
    >
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-8">No notifications</p>
        ) : (
          notifications.map(item => (
            <div
              key={item.id}
              onClick={() => markNotificationAsRead(item.id)}
              className={cn(
                'flex items-start gap-3 rounded-xl border p-3.5 transition-all cursor-pointer',
                item.isRead
                  ? 'border-slate-800/80 bg-slate-900/40 opacity-75'
                  : 'border-slate-700 bg-slate-900/90 shadow-md',
                item.type === 'approval_required' &&
                  !item.isRead &&
                  'border-amber-500/50 bg-amber-950/20 shadow-glow-amber'
              )}
            >
              {iconMap[item.type]}
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-slate-200">{item.title}</h4>
                  <span className="font-mono text-[10px] text-slate-500">{item.timestamp}</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">{item.message}</p>
                {item.actionUrl && (
                  <button
                    onClick={e => {
                      e.stopPropagation()
                      markNotificationAsRead(item.id)
                      setIsNotificationsOpen(false)
                      navigate(item.actionUrl!)
                    }}
                    className="inline-flex items-center text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 mt-1"
                  >
                    View in Workspace →
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </Drawer>
  )
}
