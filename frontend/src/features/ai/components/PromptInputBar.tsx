import React, { useState } from 'react'
import { Send, Sparkles, Cpu, Mic, CornerDownLeft } from 'lucide-react'
import { Button } from '@/shared/ui/Button'
import { Switch } from '@/shared/ui/Switch'

interface PromptInputBarProps {
  onSend: (prompt: string, includeSimulation: boolean, simTier: 1 | 2) => void
  isLoading?: boolean
  initialPrompt?: string
}

export const PromptInputBar: React.FC<PromptInputBarProps> = ({
  onSend,
  isLoading,
  initialPrompt = '',
}) => {
  const [prompt, setPrompt] = useState(initialPrompt)
  const [includeSimulation, setIncludeSimulation] = useState(false)
  const [simTier, setSimTier] = useState<1 | 2>(1)

  // Update prompt when external preset changes
  React.useEffect(() => {
    if (initialPrompt) {
      setPrompt(initialPrompt)
    }
  }, [initialPrompt])

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!prompt.trim() || isLoading) return
    onSend(prompt.trim(), includeSimulation, simTier)
    setPrompt('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="p-3 border-t border-slate-800/80 bg-slate-900/90 backdrop-blur-md rounded-b-xl space-y-2.5"
    >
      {/* Simulation Controls Bar */}
      <div className="flex items-center justify-between text-xs px-1 text-slate-400">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch
              checked={includeSimulation}
              onChange={setIncludeSimulation}
            />
            <span className={includeSimulation ? 'text-cyan-300 font-medium' : 'text-slate-400'}>
              What-If Simulation Engine
            </span>
          </div>

          {includeSimulation && (
            <div className="flex items-center gap-1.5 bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-700">
              <button
                type="button"
                onClick={() => setSimTier(1)}
                className={`px-2 py-0.5 rounded text-[11px] font-mono ${
                  simTier === 1
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Tier 1 (Math)
              </button>
              <button
                type="button"
                onClick={() => setSimTier(2)}
                className={`px-2 py-0.5 rounded text-[11px] font-mono ${
                  simTier === 2
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Tier 2 (ML Monte Carlo)
              </button>
            </div>
          )}
        </div>

        <div className="hidden sm:flex items-center gap-1 text-[11px] text-slate-400">
          <span>Press</span>
          <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[10px] text-slate-300">
            Enter ↵
          </kbd>
          <span>to ask</span>
        </div>
      </div>

      {/* Textarea & Actions */}
      <div className="relative flex items-end gap-2 bg-slate-950 border border-slate-700/80 rounded-xl p-2 focus-within:border-cyan-500/80 focus-within:ring-1 focus-within:ring-cyan-500/30 transition-all">
        <textarea
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything across 200,000 transaction records, run simulations, or trigger anomalies..."
          rows={2}
          className="flex-1 bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none resize-none px-2 py-1"
        />

        <div className="flex items-center gap-1.5 shrink-0">
          <Button
            type="submit"
            size="sm"
            variant="cyber"
            disabled={!prompt.trim() || isLoading}
            isLoading={isLoading}
            leftIcon={<Sparkles className="h-3.5 w-3.5 text-cyan-200" />}
          >
            Synthesize
          </Button>
        </div>
      </div>
    </form>
  )
}

export default PromptInputBar
