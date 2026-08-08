import React, { useState } from 'react'
import { Card } from '@/shared/ui/Card'
import { Badge } from '@/shared/ui/Badge'
import { Button } from '@/shared/ui/Button'
import {
  Download,
  Printer,
  Copy,
  CheckCircle2,
  FileText,
  Clock,
  User,
  Share2,
} from 'lucide-react'
import type { ReportArtifact } from '@/shared/types'

interface ReportViewerProps {
  report: ReportArtifact
}

export const ReportViewer: React.FC<ReportViewerProps> = ({ report }) => {
  const [copied, setCopied] = useState(false)

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(report.markdownContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const handleDownloadMarkdown = () => {
    const element = document.createElement('a')
    const file = new Blob([report.markdownContent], { type: 'text/markdown' })
    element.href = URL.createObjectURL(file)
    element.download = `${report.id}.md`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const handlePrintPdf = () => {
    window.print()
  }

  return (
    <div className="space-y-6">
      {/* 1. Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-100">{report.title}</h2>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1 flex items-center gap-2">
            <span>Author: <b className="text-cyan-300">{report.author}</b></span>
            <span>•</span>
            <span>{report.generatedAt}</span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            size="xs"
            variant="outline"
            onClick={handleCopyMarkdown}
            leftIcon={
              copied ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )
            }
          >
            {copied ? 'Copied' : 'Copy'}
          </Button>

          <Button
            size="xs"
            variant="outline"
            onClick={handleDownloadMarkdown}
            leftIcon={<Download className="h-3.5 w-3.5" />}
          >
            Markdown
          </Button>

          <Button
            size="xs"
            variant="primary"
            onClick={handlePrintPdf}
            leftIcon={<Printer className="h-3.5 w-3.5" />}
          >
            Export PDF
          </Button>
        </div>
      </div>

      {/* 2. Key Metrics Summary Grid */}
      {report.keyMetrics && report.keyMetrics.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {report.keyMetrics.map(m => (
            <div
              key={m.label}
              className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1 font-mono"
            >
              <div className="text-[10px] text-slate-400">{m.label}</div>
              <div className="text-lg font-bold text-slate-100">{m.value}</div>
              {m.delta && (
                <div
                  className={`text-[10px] ${
                    m.status === 'positive'
                      ? 'text-emerald-400'
                      : m.status === 'negative'
                      ? 'text-rose-400'
                      : 'text-slate-400'
                  }`}
                >
                  {m.delta}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 3. Rendered Markdown Document */}
      <div className="p-6 rounded-xl bg-slate-950/90 border border-slate-800 text-slate-200 prose prose-invert prose-sm max-w-none space-y-4 font-sans leading-relaxed">
        {/* Simple structured renderer for sections */}
        {report.markdownContent.split('\n\n').map((block, idx) => {
          const trimmed = block.trim()
          if (!trimmed) return null

          if (trimmed.startsWith('# ')) {
            return (
              <h1 key={idx} className="text-xl font-bold text-cyan-300 border-b border-slate-800 pb-2">
                {trimmed.replace('# ', '')}
              </h1>
            )
          }

          if (trimmed.startsWith('### ')) {
            return (
              <h3 key={idx} className="text-sm font-bold text-slate-100 mt-4 mb-2">
                {trimmed.replace('### ', '')}
              </h3>
            )
          }

          if (trimmed.startsWith('---')) {
            return <hr key={idx} className="border-slate-800 my-4" />
          }

          if (trimmed.startsWith('|')) {
            // Table block
            const rows = trimmed.split('\n').filter(r => !r.includes('---'))
            return (
              <div key={idx} className="overflow-x-auto my-3 rounded-lg border border-slate-800">
                <table className="w-full text-xs font-mono text-left">
                  <tbody>
                    {rows.map((row, rIdx) => {
                      const cols = row.split('|').filter(c => c.trim() !== '')
                      return (
                        <tr
                          key={rIdx}
                          className={
                            rIdx === 0
                              ? 'bg-slate-900 font-bold text-slate-300 border-b border-slate-800'
                              : 'hover:bg-slate-900/50 border-b border-slate-800/60'
                          }
                        >
                          {cols.map((col, cIdx) => (
                            <td key={cIdx} className="p-2.5">
                              {col.trim().replace(/\*\*/g, '')}
                            </td>
                          ))}
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )
          }

          if (trimmed.startsWith('- ')) {
            const items = trimmed.split('\n')
            return (
              <ul key={idx} className="list-disc list-inside space-y-1.5 text-xs text-slate-300">
                {items.map((it, itIdx) => (
                  <li key={itIdx}>{it.replace('- ', '')}</li>
                ))}
              </ul>
            )
          }

          return (
            <p key={idx} className="text-xs text-slate-300 leading-relaxed">
              {trimmed}
            </p>
          )
        })}
      </div>
    </div>
  )
}

export default ReportViewer
