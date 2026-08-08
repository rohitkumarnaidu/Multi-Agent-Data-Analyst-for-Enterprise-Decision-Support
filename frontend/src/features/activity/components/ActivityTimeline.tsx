import React from 'react'
import { Bot, User, ShieldAlert, Terminal, Cpu, ArrowUpRight, Clock, CheckCircle2, AlertCircle } from 'lucide-react'
import { ActivityEvent } from '../../../services/activityService'
import { Badge } from '../../../shared/ui/Badge'
import { Card } from '../../../shared/ui/Card'

interface ActivityTimelineProps {
  events: ActivityEvent[]
  onSelectEvent: (event: ActivityEvent) => void
}

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ events, onSelectEvent }) => {
  if (events.length === 0) {
    return (
      <Card glow="none" className="p-8 text-center bg-cyber-card/60 border-cyber-border">
        <p className="text-sm text-cyber-muted">No activity events match the selected filters.</p>
      </Card>
    )
  }

  const getActorIcon = (type: string) => {
    switch (type) {
      case 'agent':
        return <Bot className="w-4 h-4 text-cyan-400" />
      case 'user':
        return <User className="w-4 h-4 text-emerald-400" />
      default:
        return <ShieldAlert className="w-4 h-4 text-amber-400" />
    }
  }

  return (
    <Card glow="none" className="p-4 bg-cyber-card/90 border-cyber-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-cyber-text">
          Chronological Event Ledger Stream
        </h3>
        <span className="text-xs text-cyber-muted font-mono">
          Showing {events.length} verified records
        </span>
      </div>

      <div className="space-y-3">
        {events.map(e => {
          return (
            <div
              key={e.id}
              onClick={() => onSelectEvent(e)}
              className="p-3.5 rounded-xl bg-slate-900/60 border border-cyber-border/40 hover:border-cyber-cyan/50 hover:bg-slate-900/90 transition-all cursor-pointer group flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              {/* Left Side: Avatar & Event Info */}
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 shrink-0 mt-0.5 group-hover:border-cyber-cyan/40 transition-colors">
                  {getActorIcon(e.actor.avatarType)}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs text-cyber-cyan font-bold">{e.id}</span>
                    <span className="text-xs font-semibold text-cyber-text">{e.actionTitle}</span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        e.status === 'success'
                          ? 'bg-cyber-emerald/10 text-cyber-emerald border border-cyber-emerald/20'
                          : e.status === 'escalated'
                          ? 'bg-cyber-amber/10 text-cyber-amber border border-cyber-amber/20'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {e.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-cyber-muted line-clamp-1">{e.description}</p>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 font-mono">
                    <span>By: <strong className="text-slate-300">{e.actor.name}</strong> ({e.actor.role})</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-cyber-cyan" />
                      {e.durationMs} ms
                    </span>
                    <span>•</span>
                    <span>{e.relativeTime}</span>
                  </div>
                </div>
              </div>

              {/* Right Side: Quick Inspect Link */}
              <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                <div className="hidden sm:block text-right font-mono text-[10px] text-slate-500 max-w-[120px] truncate">
                  {e.details.hash.substring(0, 16)}...
                </div>
                <button className="px-3 py-1.5 rounded-lg bg-slate-800/80 text-xs font-semibold text-slate-300 group-hover:bg-cyber-cyan/20 group-hover:text-cyber-cyan transition-colors flex items-center gap-1.5">
                  <span>Inspect</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
