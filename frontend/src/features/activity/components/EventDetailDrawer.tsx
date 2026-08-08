import React from 'react'
import { X, ShieldCheck, Clock, Terminal, KeyRound, CheckCircle2, AlertTriangle } from 'lucide-react'
import { ActivityEvent } from '../../../services/activityService'
import { Badge } from '../../../shared/ui/Badge'
import { Button } from '../../../shared/ui/Button'

interface EventDetailDrawerProps {
  event: ActivityEvent | null
  onClose: () => void
}

export const EventDetailDrawer: React.FC<EventDetailDrawerProps> = ({ event, onClose }) => {
  if (!event) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm transition-all">
      <div className="w-full max-w-xl h-full bg-slate-950 border-l border-cyber-border p-6 overflow-y-auto shadow-2xl flex flex-col justify-between">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between pb-4 border-b border-cyber-border/60">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-xs text-cyber-cyan font-bold">{event.id}</span>
                <Badge
                  variant={
                    event.status === 'success'
                      ? 'success'
                      : event.status === 'escalated'
                      ? 'warning'
                      : 'default'
                  }
                  className="text-[10px]"
                >
                  {event.status.toUpperCase()}
                </Badge>
              </div>
              <h2 className="text-lg font-bold text-cyber-text leading-snug">
                {event.actionTitle}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Actor & Metadata Pill Bar */}
          <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-cyber-card/60 border border-cyber-border/40 text-xs">
            <div>
              <span className="text-cyber-muted block text-[10px] uppercase font-semibold">Initiated By</span>
              <span className="font-semibold text-cyber-text">{event.actor.name}</span>
              <span className="text-slate-400 block text-[11px]">{event.actor.role}</span>
            </div>
            <div>
              <span className="text-cyber-muted block text-[10px] uppercase font-semibold">Execution Timing</span>
              <span className="font-semibold text-cyber-text flex items-center gap-1">
                <Clock className="w-3 h-3 text-cyber-cyan" />
                {event.durationMs} ms runtime
              </span>
              <span className="text-slate-400 block text-[11px]">{event.timestamp}</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <span className="text-xs font-bold text-cyber-muted uppercase tracking-wider block mb-1.5">
              Event Description
            </span>
            <p className="text-sm text-cyber-text bg-slate-900/50 p-3 rounded-lg border border-slate-800/80">
              {event.description}
            </p>
          </div>

          {/* Generated Code or SQL Payload */}
          {event.details.sqlOrCode && (
            <div>
              <span className="text-xs font-bold text-cyber-muted uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                <Terminal className="w-3.5 h-3.5 text-cyber-cyan" />
                Executed Query / Script Payload
              </span>
              <pre className="p-3 bg-slate-950 border border-cyber-border/60 rounded-lg text-xs font-mono text-cyan-300 overflow-x-auto">
                {event.details.sqlOrCode}
              </pre>
            </div>
          )}

          {/* Tool Calls Breakdown */}
          {event.details.toolCalls && (
            <div>
              <span className="text-xs font-bold text-cyber-muted uppercase tracking-wider block mb-1.5">
                Sub-Millisecond Tool Call Breakdown
              </span>
              <div className="space-y-2">
                {event.details.toolCalls.map((t, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-xs font-mono"
                  >
                    <span className="text-cyber-text font-medium">{t.toolName}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-cyber-cyan font-bold">{t.durationMs} ms</span>
                      <span className="text-[10px] text-cyber-emerald bg-cyber-emerald/10 px-1.5 py-0.5 rounded">
                        {t.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Guardrail Policy Checks */}
          {event.details.guardrailChecks && (
            <div>
              <span className="text-xs font-bold text-cyber-muted uppercase tracking-wider block mb-1.5">
                Guardrail Safety Evaluation
              </span>
              <div className="space-y-2">
                {event.details.guardrailChecks.map((g, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-2.5 rounded-lg border text-xs ${
                      g.passed
                        ? 'bg-cyber-emerald/5 border-cyber-emerald/20 text-slate-300'
                        : 'bg-cyber-rose/5 border-cyber-rose/20 text-rose-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {g.passed ? (
                        <CheckCircle2 className="w-4 h-4 text-cyber-emerald shrink-0" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-cyber-rose shrink-0" />
                      )}
                      <span>{g.rule}</span>
                    </div>
                    <span className="font-mono font-bold">{g.score}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cryptographic SHA-256 Signature Stamp */}
          <div className="p-3 bg-slate-900 border border-cyber-border/40 rounded-lg space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-cyber-cyan">
              <KeyRound className="w-3.5 h-3.5" />
              <span>Tamper-Proof Cryptographic Hash (HMAC-SHA256)</span>
            </div>
            <p className="font-mono text-[10px] text-slate-400 break-all">
              {event.details.hash}
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-cyber-border/60 flex items-center justify-end gap-3 mt-6">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close Inspector
          </Button>
          <Button
            variant="cyber"
            size="sm"
            onClick={() => {
              navigator.clipboard.writeText(JSON.stringify(event, null, 2))
            }}
          >
            Copy Event JSON
          </Button>
        </div>
      </div>
    </div>
  )
}
