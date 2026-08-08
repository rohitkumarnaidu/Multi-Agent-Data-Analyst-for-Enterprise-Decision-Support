import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Badge } from '@/shared/ui/Badge'
import { Button } from '@/shared/ui/Button'
import { BaseChart } from '@/shared/charts/BaseChart'
import {
  Bot,
  User,
  Copy,
  Check,
  Code2,
  Database,
  Clock,
  Sparkles,
  Layers,
  AlertTriangle,
} from 'lucide-react'
import type { AskResponse, ChartSpec } from '@/shared/types'
import type { EChartsOption } from 'echarts'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  responsePayload?: AskResponse
  timestamp: string
}

interface ChatMessageItemProps {
  message: ChatMessage
}

export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({ message }) => {
  const [copiedSql, setCopiedSql] = useState(false)
  const [showSql, setShowSql] = useState(false)

  const isUser = message.role === 'user'

  const handleCopySql = (sql: string) => {
    navigator.clipboard.writeText(sql)
    setCopiedSql(true)
    setTimeout(() => setCopiedSql(false), 1500)
  }

  // Convert chart_spec into EChartsOption if present
  const renderChart = (spec: ChartSpec) => {
    const isBar = spec.chart_type === 'bar'
    const isLine = spec.chart_type === 'line'
    const data = spec.data as any

    const chartOptions: EChartsOption = {
      title: {
        text: spec.title,
        textStyle: { color: '#E2E8F0', fontSize: 13, fontWeight: 'bold' },
        left: 0,
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(11, 15, 25, 0.92)',
        borderColor: '#334155',
        textStyle: { color: '#E2E8F0' },
      },
      grid: { left: '3%', right: '3%', bottom: '8%', top: '22%', containLabel: true },
      xAxis: {
        type: 'category',
        data: data.categories || [],
        axisLine: { lineStyle: { color: '#334155' } },
        axisLabel: { color: '#94A3B8', fontSize: 11 },
      },
      yAxis: {
        type: 'value',
        splitLine: { lineStyle: { color: 'rgba(51, 65, 85, 0.3)', type: 'dashed' } },
        axisLabel: { color: '#94A3B8', fontSize: 11 },
      },
      series: (data.series || []).map((s: any, idx: number) => ({
        name: s.name,
        type: isLine ? 'line' : 'bar',
        data: s.data,
        smooth: true,
        itemStyle: {
          color: idx === 0 ? '#06B6D4' : '#10B981',
          borderRadius: isBar ? [4, 4, 0, 0] : undefined,
        },
      })),
    }

    return (
      <div className="mt-4 p-4 rounded-xl bg-slate-950/80 border border-slate-800">
        <BaseChart options={chartOptions} height={260} />
      </div>
    )
  }

  if (isUser) {
    return (
      <div className="flex items-start gap-3 justify-end">
        <div className="max-w-2xl bg-cyan-600 text-slate-100 rounded-2xl rounded-tr-none px-4 py-3 text-sm shadow-md">
          <p className="font-medium">{message.content}</p>
          <span className="text-[10px] text-cyan-200 block text-right mt-1 font-mono">
            {message.timestamp}
          </span>
        </div>
        <div className="h-8 w-8 rounded-full bg-cyan-700 border border-cyan-400 flex items-center justify-center text-slate-100 shrink-0">
          <User className="h-4 w-4" />
        </div>
      </div>
    )
  }

  const payload = message.responsePayload

  return (
    <div className="flex items-start gap-3 justify-start">
      <div className="h-8 w-8 rounded-full bg-slate-900 border border-cyan-500/50 flex items-center justify-center text-cyan-400 shrink-0 shadow-glow-cyan">
        <Bot className="h-4 w-4" />
      </div>

      <div className="max-w-3xl flex-1 bg-slate-900/90 border border-slate-800 rounded-2xl rounded-tl-none p-5 text-sm space-y-4 shadow-lg">
        {/* Header Badges */}
        {payload && (
          <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-xs text-slate-200 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                Multi-Agent Synthesis
              </span>
              <Badge
                variant={
                  payload.confidence_label === 'High'
                    ? 'success'
                    : payload.confidence_label === 'Medium'
                    ? 'warning'
                    : 'destructive'
                }
                size="sm"
              >
                {payload.confidence_label} Confidence ({(payload.confidence * 100).toFixed(0)}%)
              </Badge>
            </div>

            <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {payload.metadata.processing_time_sec}s
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Database className="h-3 w-3" />
                {payload.metadata.records_analyzed.toLocaleString()} rows
              </span>
            </div>
          </div>
        )}

        {/* Degraded mode warnings if applicable */}
        {payload?.is_degraded && (
          <div className="p-2.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>Degraded mode active: Secondary fallback LLM model engaged.</span>
          </div>
        )}

        {/* Main Markdown Body */}
        <div className="prose prose-invert prose-sm max-w-none text-slate-200 leading-relaxed">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
        </div>

        {/* Embedded Chart if present */}
        {payload?.chart_spec && renderChart(payload.chart_spec)}

        {/* SQL & Code Snippet Box */}
        {payload?.metadata.query_used && (
          <div className="pt-2">
            <div className="flex items-center justify-between text-xs text-slate-400 pb-1.5">
              <button
                type="button"
                onClick={() => setShowSql(!showSql)}
                className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-mono text-[11px] font-medium"
              >
                <Code2 className="h-3.5 w-3.5" />
                {showSql ? 'Hide DuckDB SQL' : 'View Generated DuckDB SQL'}
              </button>

              {showSql && (
                <button
                  type="button"
                  onClick={() => handleCopySql(payload.metadata.query_used!)}
                  className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200"
                >
                  {copiedSql ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                  {copiedSql ? 'Copied' : 'Copy SQL'}
                </button>
              )}
            </div>

            {showSql && (
              <pre className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-cyan-300 overflow-x-auto">
                {payload.metadata.query_used}
              </pre>
            )}
          </div>
        )}

        {/* Footer Meta Chips */}
        {payload && (
          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-800/80 font-mono">
            <div className="flex items-center gap-1.5">
              <Layers className="h-3 w-3 text-slate-400" />
              <span>Agents: {payload.metadata.agents_invoked.join(' → ')}</span>
            </div>
            <span>Model: {payload.metadata.model_used}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatMessageItem
