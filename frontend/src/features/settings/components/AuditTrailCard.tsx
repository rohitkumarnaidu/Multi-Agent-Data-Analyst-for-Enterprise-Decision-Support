import React, { useState } from 'react'
import { Card } from '@/shared/ui/Card'
import { Badge } from '@/shared/ui/Badge'
import { History, Search, ShieldCheck, Lock, AlertCircle } from 'lucide-react'
import type { AuditLogEntry } from '@/shared/types'

interface AuditTrailCardProps {
  logs: AuditLogEntry[]
}

const statusBadges: Record<string, 'success' | 'destructive' | 'warning'> = {
  success: 'success',
  blocked: 'destructive',
  escalated: 'warning',
}

export const AuditTrailCard: React.FC<AuditTrailCardProps> = ({ logs }) => {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredLogs = logs.filter(l =>
    searchTerm === ''
      ? true
      : l.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.resource.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
        <div>
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <History className="h-3.5 w-3.5 text-cyan-400" />
            Cryptographic Audit Trail & Governance Ledger
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Immutable log of agent tool executions, human approvals, guardrail interventions, and parameter modifications.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search audit logs..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full rounded-lg bg-slate-950 border border-slate-800 pl-8 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:outline-none font-mono"
          />
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
            <tr>
              <th className="p-3">Timestamp</th>
              <th className="p-3">Actor / Agent</th>
              <th className="p-3">Action</th>
              <th className="p-3">Resource Target</th>
              <th className="p-3">Status</th>
              <th className="p-3">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-200">
            {filteredLogs.map(log => (
              <tr key={log.id} className="hover:bg-slate-800/30">
                <td className="p-3 text-slate-400 whitespace-nowrap">{log.timestamp}</td>
                <td className="p-3 font-semibold text-slate-100">{log.actor}</td>
                <td className="p-3 text-cyan-300 font-bold">{log.action}</td>
                <td className="p-3 text-slate-300 max-w-xs truncate">{log.resource}</td>
                <td className="p-3">
                  <Badge variant={statusBadges[log.status] || 'outline'} size="sm">
                    {log.status.toUpperCase()}
                  </Badge>
                </td>
                <td className="p-3 text-slate-400 max-w-sm truncate">{log.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AuditTrailCard
