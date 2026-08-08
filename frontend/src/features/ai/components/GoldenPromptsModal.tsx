import React, { useState } from 'react'
import { Dialog } from '@/shared/ui/Dialog'
import { Badge } from '@/shared/ui/Badge'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { Sparkles, Search, ArrowRight, Check } from 'lucide-react'
import { GOLDEN_QUESTIONS } from '../goldenQuestions'
import type { GoldenQuestion } from '@/shared/types'

interface GoldenPromptsModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectPrompt: (prompt: string, autoRun?: boolean) => void
}

export const GoldenPromptsModal: React.FC<GoldenPromptsModalProps> = ({
  isOpen,
  onClose,
  onSelectPrompt,
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')

  const categories = ['All', 'Revenue & Margin', 'Operations & SLA', 'Risk & Anomalies', 'Simulation', 'Machine Learning', 'Explainability', 'EDA & Correlation', 'Data Governance']

  const filteredQuestions = GOLDEN_QUESTIONS.filter(q => {
    const matchesSearch =
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || q.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleChoose = (question: GoldenQuestion, autoRun = false) => {
    onSelectPrompt(question.prompt, autoRun)
    onClose()
  }

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Enterprise Golden Questions Library (GT-01 to GT-20)"
      description="Pre-validated golden queries covering cross-functional analytics, XGBoost ML, and LangGraph multi-agent execution."
      maxWidth="xl"
    >
      <div className="space-y-4 pt-2">
        {/* Search Input */}
        <Input
          placeholder="Search by test ID (e.g. GT-01), keyword, or metric..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          leftIcon={<Search className="h-4 w-4" />}
        />

        {/* Category Filters */}
        <div className="flex gap-1.5 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                selectedCategory === cat
                  ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 font-semibold'
                  : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Questions Grid */}
        <div className="max-h-[420px] overflow-y-auto space-y-2.5 pr-1 divide-y divide-slate-800/60">
          {filteredQuestions.map(q => (
            <div
              key={q.id}
              className="pt-2.5 first:pt-0 p-3 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
            >
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
                    {q.id}
                  </span>
                  <Badge variant="outline" size="sm">
                    {q.category}
                  </Badge>
                  <span className="font-semibold text-xs text-slate-100">{q.title}</span>
                </div>
                <p className="text-xs text-slate-300 italic font-sans">"{q.prompt}"</p>
                <p className="text-[11px] text-slate-400">{q.description}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Button
                  size="xs"
                  variant="subtle"
                  onClick={() => handleChoose(q, false)}
                >
                  Load
                </Button>
                <Button
                  size="xs"
                  variant="cyber"
                  leftIcon={<Sparkles className="h-3 w-3 text-cyan-200" />}
                  onClick={() => handleChoose(q, true)}
                >
                  Run Now
                </Button>
              </div>
            </div>
          ))}

          {filteredQuestions.length === 0 && (
            <div className="text-center py-8 text-slate-400 text-xs">
              No golden prompts match your search filter.
            </div>
          )}
        </div>
      </div>
    </Dialog>
  )
}

export default GoldenPromptsModal
