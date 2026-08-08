import React, { useState } from 'react'
import { Card } from '@/shared/ui/Card'
import { Badge } from '@/shared/ui/Badge'
import { Button } from '@/shared/ui/Button'
import { useReports, useGenerateReport } from '@/hooks/useReports'
import { ReportListCard } from '@/features/reports/components/ReportListCard'
import { ReportViewer } from '@/features/reports/components/ReportViewer'
import { GenerateReportModal } from '@/features/reports/components/GenerateReportModal'
import {
  FileText,
  Sparkles,
  Printer,
  CheckCircle2,
  Share2,
  Calendar,
} from 'lucide-react'
import type { ReportArtifact, ReportType } from '@/shared/types'

export const ReportsPage: React.FC = () => {
  const { data: reports, isLoading } = useReports()
  const [selectedReportId, setSelectedReportId] = useState<string>('rep-q3-sla-breach-audit')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [successToast, setSuccessToast] = useState<string | null>(null)

  const { mutate: generateReport, isPending: isGenerating } = useGenerateReport()

  const selectedReport = (reports || []).find(r => r.id === selectedReportId) || reports?.[0]

  const handleGenerate = (payload: {
    title: string
    type: ReportType
    targetScope: string
    depth: 'executive' | 'technical'
  }) => {
    generateReport(payload, {
      onSuccess: newRep => {
        setIsModalOpen(false)
        setSelectedReportId(newRep.id)
        setSuccessToast(`Report "${newRep.title}" generated successfully!`)
        setTimeout(() => setSuccessToast(null), 4000)
      },
    })
  }

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-100">
              Enterprise Reports & Executive Briefings
            </h1>
            <Badge variant="cyber" size="sm">
              Board Ready
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Automated multi-agent synthesis, board-ready executive summaries, risk matrices, and multi-format exports (PDF, Markdown, HTML).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="primary"
            onClick={() => setIsModalOpen(true)}
            leftIcon={<Sparkles className="h-3.5 w-3.5" />}
          >
            Generate AI Report
          </Button>
        </div>
      </div>

      {/* Success Toast */}
      {successToast && (
        <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-xs font-mono text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* 2. Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Archive Column (4 cols) */}
        <div className="lg:col-span-4">
          <Card glow="none" className="p-5 bg-slate-900/90 border-slate-800 space-y-4">
            <ReportListCard
              reports={reports || []}
              selectedReportId={selectedReportId}
              onSelectReport={r => setSelectedReportId(r.id)}
              onOpenGenerateModal={() => setIsModalOpen(true)}
            />
          </Card>
        </div>

        {/* Right Preview Column (8 cols) */}
        <div className="lg:col-span-8">
          <Card glow="cyan" className="p-6 bg-slate-900/90 border-slate-800">
            {selectedReport ? (
              <ReportViewer report={selectedReport} />
            ) : (
              <div className="py-12 text-center text-slate-500 font-mono text-xs">
                Select a report from the archive to view its contents.
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* 3. Generate Modal */}
      <GenerateReportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onGenerate={handleGenerate}
        isGenerating={isGenerating}
      />
    </div>
  )
}

export default ReportsPage
