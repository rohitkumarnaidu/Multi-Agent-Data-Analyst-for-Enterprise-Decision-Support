import React from 'react'
import { Plus, Sparkles, MessageSquare, Pin, Trash2 } from 'lucide-react'
import { Button } from '@/shared/ui/Button'
import type { ChatSession } from '@/shared/types'
import { cn } from '@/shared/utils/cn'

interface SessionSidebarProps {
  sessions: ChatSession[]
  activeSessionId: string
  onSelectSession: (id: string) => void
  onNewSession: () => void
  onOpenGoldenPrompts: () => void
}

export const SessionSidebar: React.FC<SessionSidebarProps> = ({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewSession,
  onOpenGoldenPrompts,
}) => {
  return (
    <div className="w-64 border-r border-slate-800/80 bg-slate-950/60 p-3 flex flex-col h-full overflow-hidden">
      {/* Action Buttons */}
      <div className="space-y-2 pb-3 border-b border-slate-800/80">
        <Button
          size="sm"
          variant="primary"
          className="w-full justify-start text-xs font-semibold"
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={onNewSession}
        >
          New Analysis
        </Button>

        <Button
          size="sm"
          variant="cyber"
          className="w-full justify-start text-xs font-semibold"
          leftIcon={<Sparkles className="h-3.5 w-3.5 text-cyan-200" />}
          onClick={onOpenGoldenPrompts}
        >
          Golden Prompts (GT-01..20)
        </Button>
      </div>

      {/* Sessions List */}
      <div className="flex-1 overflow-y-auto pt-3 space-y-1 pr-1">
        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2 pb-1">
          Recent Sessions
        </div>

        {sessions.map(s => {
          const isActive = s.id === activeSessionId
          return (
            <button
              key={s.id}
              onClick={() => onSelectSession(s.id)}
              className={cn(
                'w-full text-left p-2.5 rounded-lg text-xs transition-all flex items-start justify-between gap-2 group',
                isActive
                  ? 'bg-cyan-500/15 border border-cyan-500/40 text-cyan-200 font-semibold shadow-glow-cyan'
                  : 'text-slate-300 hover:bg-slate-800/60 border border-transparent'
              )}
            >
              <div className="flex items-start gap-2 truncate">
                <MessageSquare className="h-3.5 w-3.5 mt-0.5 shrink-0 text-slate-400 group-hover:text-cyan-400" />
                <div className="truncate">
                  <div className="truncate font-medium">{s.title}</div>
                  <div className="text-[10px] text-slate-400 truncate">{s.updatedAt}</div>
                </div>
              </div>

              {s.isPinned && <Pin className="h-3 w-3 text-cyan-400 shrink-0 mt-0.5" />}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default SessionSidebar
