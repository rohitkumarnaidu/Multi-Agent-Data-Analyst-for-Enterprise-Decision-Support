import React, { useState, useEffect } from 'react'
import { Card } from '@/shared/ui/Card'
import { Badge } from '@/shared/ui/Badge'
import { Button } from '@/shared/ui/Button'
import { Slider } from '@/shared/ui/Slider'
import { Cpu, ShieldCheck, Save, CheckCircle2, Key } from 'lucide-react'
import type { LLMConfig } from '@/shared/types'

interface LLMConfigCardProps {
  config: LLMConfig
  onSave: (updated: Partial<LLMConfig>) => void
  isSaving: boolean
}

export const LLMConfigCard: React.FC<LLMConfigCardProps> = ({ config, onSave, isSaving }) => {
  const [primaryModel, setPrimaryModel] = useState(config.primaryModel)
  const [fastModel, setFastModel] = useState(config.fastModel)
  const [temperature, setTemperature] = useState(config.temperature)
  const [maxTokens, setMaxTokens] = useState(config.maxTokens)
  const [enableStreaming, setEnableStreaming] = useState(config.enableStreaming)
  const [savedSuccess, setSavedSuccess] = useState(false)

  useEffect(() => {
    setPrimaryModel(config.primaryModel)
    setFastModel(config.fastModel)
    setTemperature(config.temperature)
    setMaxTokens(config.maxTokens)
    setEnableStreaming(config.enableStreaming)
  }, [config])

  const handleSave = () => {
    onSave({
      primaryModel,
      fastModel,
      temperature,
      maxTokens,
      enableStreaming,
    })
    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 3000)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
        <div>
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Cpu className="h-3.5 w-3.5 text-cyan-400" />
            LLM Model Routing & Generation Parameters
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Configure multi-agent foundation model routers, generation sampling temperature, and token budgets.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="success" size="sm">
            <Key className="h-3 w-3 mr-1" />
            HashiCorp Vault Active
          </Badge>
          <Button
            size="xs"
            variant="primary"
            onClick={handleSave}
            isLoading={isSaving}
            leftIcon={
              savedSuccess ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              ) : (
                <Save className="h-3.5 w-3.5" />
              )
            }
          >
            {savedSuccess ? 'Saved' : 'Save Config'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
        {/* Primary Orchestrator Model */}
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
          <label className="text-slate-300 font-semibold flex items-center justify-between">
            <span>Primary Orchestrator & Reasoning Model</span>
            <span className="text-[10px] text-cyan-400">Complex Graph</span>
          </label>
          <select
            value={primaryModel}
            onChange={e => setPrimaryModel(e.target.value)}
            className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-slate-100 focus:border-cyan-500 focus:outline-none"
          >
            <option value="claude-3-7-sonnet-20250219">Anthropic Claude 3.7 Sonnet (Hybrid Reasoning)</option>
            <option value="gpt-4.5-preview-2025-02-27">OpenAI GPT-4.5 Preview</option>
            <option value="gemini-2.5-pro">Google Gemini 2.5 Pro (2M Context)</option>
            <option value="meta-llama/llama-3.3-70b-instruct">Meta Llama 3.3 70B (Self-Hosted vLLM)</option>
          </select>
        </div>

        {/* Fast Routing Model */}
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
          <label className="text-slate-300 font-semibold flex items-center justify-between">
            <span>Fast Subagent Model</span>
            <span className="text-[10px] text-emerald-400">High Throughput</span>
          </label>
          <select
            value={fastModel}
            onChange={e => setFastModel(e.target.value)}
            className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-slate-100 focus:border-cyan-500 focus:outline-none"
          >
            <option value="claude-3-5-haiku-20241022">Anthropic Claude 3.5 Haiku</option>
            <option value="gpt-4o-mini">OpenAI GPT-4o Mini</option>
            <option value="gemini-2.0-flash">Google Gemini 2.0 Flash</option>
          </select>
        </div>

        {/* Temperature Slider */}
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-300 font-semibold">Sampling Temperature:</span>
            <span className="font-bold text-cyan-300">{temperature.toFixed(2)}</span>
          </div>
          <Slider
            min={0.0}
            max={1.0}
            step={0.05}
            value={temperature}
            onChange={v => setTemperature(Number(v))}
          />
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>0.0 (Deterministic)</span>
            <span>1.0 (Creative)</span>
          </div>
        </div>

        {/* Max Tokens Slider */}
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-300 font-semibold">Max Output Tokens:</span>
            <span className="font-bold text-cyan-300">{maxTokens} tokens</span>
          </div>
          <Slider
            min={1024}
            max={8192}
            step={512}
            value={maxTokens}
            onChange={v => setMaxTokens(Number(v))}
          />
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>1,024</span>
            <span>8,192</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LLMConfigCard
