import React, { useState } from 'react'
import { Card } from '@/shared/ui/Card'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { Sparkles, X, FileText } from 'lucide-react'
import type { ReportType } from '@/shared/types'

interface GenerateReportModalProps {
  isOpen: boolean
  onClose: () => void
  onGenerate: (payload: {
    title: string
    type: ReportType
    targetScope: string
    depth: 'executive' | 'technical'
  }) => void
  isGenerating: boolean
}

export const GenerateReportModal: React.FC<GenerateReportModalProps> = ({
  isOpen,
  onClose,
  onGenerate,
  isGenerating,
}) => {
  const [title, setTitle] = useState('')
  const [type, setType] = useState<ReportType>('executive_brief')
  const [targetScope, setTargetScope] = useState('West Coast Fulfillment Hubs (Q3 2026)')
  const [depth, setDepth] = useState<'executive' | 'technical'>('executive')

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    onGenerate({
      title,
      type,
      targetScope,
      depth,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
              Generate AI Executive Report
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold">Report Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Q3 Logistics Margin & SLA Impact Analysis"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold">Report Type</label>
            <select
              value={type}
              onChange={e => setType(e.target.value as ReportType)}
              className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-slate-100 focus:border-cyan-500 focus:outline-none"
            >
              <option value="executive_brief">Executive Briefing (Board Ready)</option>
              <option value="sla_compliance">SLA Compliance & Margin Leakage</option>
              <option value="risk_assessment">Risk Assessment & Monte Carlo</option>
              <option value="operational_audit">Operational Audit & Root Cause</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold">Target Scope / Segment</label>
            <input
              type="text"
              value={targetScope}
              onChange={e => setTargetScope(e.target.value)}
              className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-slate-100 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold">Analytical Depth</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDepth('executive')}
                className={`p-2.5 rounded-lg border text-center transition-all ${
                  depth === 'executive'
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 font-bold'
                    : 'bg-slate-950 text-slate-400 border-slate-800'
                }`}
              >
                Executive (4 min read)
              </button>
              <button
                type="button"
                onClick={() => setDepth('technical')}
                className={`p-2.5 rounded-lg border text-center transition-all ${
                  depth === 'technical'
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 font-bold'
                    : 'bg-slate-950 text-slate-400 border-slate-800'
                }`}
              >
                Deep-Dive (9 min read)
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
            <Button size="sm" variant="ghost" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button
              size="sm"
              variant="primary"
              type="submit"
              isLoading={isGenerating}
              leftIcon={<Sparkles className="h-3.5 w-3.5" />}
            >
              Compile Report with Agent
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default GenerateReportModal
