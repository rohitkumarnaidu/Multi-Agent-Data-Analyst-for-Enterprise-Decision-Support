import React, { useState } from 'react'
import { Card } from '@/shared/ui/Card'
import { Badge } from '@/shared/ui/Badge'
import { Button } from '@/shared/ui/Button'
import { FileText, Clock, User, Tag, ChevronRight, Filter } from 'lucide-react'
import type { ReportArtifact, ReportType } from '@/shared/types'

interface ReportListCardProps {
  reports: ReportArtifact[]
  selectedReportId: string
  onSelectReport: (report: ReportArtifact) => void
  onOpenGenerateModal: () => void
}

const typeLabels: Record<ReportType, string> = {
  executive_brief: 'Executive Brief',
  operational_audit: 'Operational Audit',
  risk_assessment: 'Risk Assessment',
  sla_compliance: 'SLA Compliance',
}

const typeBadges: Record<ReportType, 'cyber' | 'success' | 'warning' | 'destructive' | 'outline'> = {
  executive_brief: 'cyber',
  operational_audit: 'outline',
  risk_assessment: 'warning',
  sla_compliance: 'destructive',
}

export const ReportListCard: React.FC<ReportListCardProps> = ({
  reports,
  selectedReportId,
  onSelectReport,
  onOpenGenerateModal,
}) => {
  const [filterType, setFilterType] = useState<string>('all')

  const filteredReports = reports.filter(r =>
    filterType === 'all' ? true : r.type === filterType
  )

  return (
    <div className="space-y-4">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="h-3.5 w-3.5 text-slate-400" />
          <button
            onClick={() => setFilterType('all')}
            className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
              filterType === 'all'
                ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All ({reports.length})
          </button>
          <button
            onClick={() => setFilterType('executive_brief')}
            className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
              filterType === 'executive_brief'
                ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Executive
          </button>
          <button
            onClick={() => setFilterType('sla_compliance')}
            className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
              filterType === 'sla_compliance'
                ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            SLA & Margins
          </button>
          <button
            onClick={() => setFilterType('risk_assessment')}
            className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
              filterType === 'risk_assessment'
                ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Risk
          </button>
        </div>

        <Button size="xs" variant="primary" onClick={onOpenGenerateModal}>
          + New AI Report
        </Button>
      </div>

      {/* Reports List */}
      <div className="space-y-2.5">
        {filteredReports.map(report => {
          const isSelected = report.id === selectedReportId
          return (
            <div
              key={report.id}
              onClick={() => onSelectReport(report)}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-cyan-500/10 border-cyan-500/40 shadow-glow-cyan'
                  : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant={typeBadges[report.type]} size="sm">
                      {typeLabels[report.type]}
                    </Badge>
                    <Badge variant="outline" size="sm">
                      <Clock className="h-3 w-3 mr-1" />
                      {report.readTimeMinutes} min read
                    </Badge>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {report.generatedAt}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-100 line-clamp-1">
                    {report.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {report.summary}
                  </p>

                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    {report.tags.map(t => (
                      <span
                        key={t}
                        className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-400 font-mono"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                <ChevronRight
                  className={`h-5 w-5 shrink-0 transition-transform ${
                    isSelected ? 'text-cyan-400 translate-x-1' : 'text-slate-600'
                  }`}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ReportListCard
