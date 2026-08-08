import React from 'react'
import { FileText, Sparkles, MessageSquare, CheckCircle2, ShieldCheck, X } from 'lucide-react'
import { Card } from '../../../shared/ui/Card'
import { Badge } from '../../../shared/ui/Badge'

interface SpeakerNotesDrawerProps {
  slideIndex: number
  notes: {
    keyPoints: string[]
    talkingScript: string
    anticipatedJudgeQuestions: { q: string; a: string }[]
  }
  onClose: () => void
}

export const SpeakerNotesDrawer: React.FC<SpeakerNotesDrawerProps> = ({
  slideIndex,
  notes,
  onClose,
}) => {
  return (
    <div className="w-full lg:w-96 bg-slate-950 border border-cyber-border rounded-xl p-5 shadow-2xl flex flex-col justify-between space-y-4">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-cyber-border/60">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-cyber-cyan" />
            <h3 className="text-sm font-bold text-cyber-text">Speaker Notes & Judge Q&A</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* High-Conviction Talking Points */}
        <div>
          <span className="text-[10px] font-bold text-cyber-cyan uppercase tracking-wider block mb-2">
            Key Boardroom Talking Points
          </span>
          <ul className="space-y-1.5">
            {notes.keyPoints.map((pt, idx) => (
              <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyber-emerald shrink-0 mt-0.5" />
                <span>{pt}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Suggested Verbal Script */}
        <div>
          <span className="text-[10px] font-bold text-cyber-muted uppercase tracking-wider block mb-1.5">
            Suggested Verbal Script (2-Minute Pitch)
          </span>
          <p className="text-xs text-cyber-text bg-slate-900/60 p-3 rounded-lg border border-slate-800 leading-relaxed italic">
            "{notes.talkingScript}"
          </p>
        </div>

        {/* Judge Q&A Defense */}
        <div>
          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5" />
            Anticipated Judge Questions
          </span>
          <div className="space-y-2">
            {notes.anticipatedJudgeQuestions.map((qa, idx) => (
              <div key={idx} className="p-2.5 rounded-lg bg-indigo-950/20 border border-indigo-500/30 space-y-1 text-xs">
                <span className="font-bold text-indigo-300 block">Q: {qa.q}</span>
                <span className="text-slate-300 block text-[11px] leading-relaxed">A: {qa.a}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-800 text-[10px] text-cyber-muted flex items-center justify-between">
        <span>Slide {slideIndex + 1} Defense Deck</span>
        <Badge variant="outline" className="text-[9px]">Confidential</Badge>
      </div>
    </div>
  )
}
