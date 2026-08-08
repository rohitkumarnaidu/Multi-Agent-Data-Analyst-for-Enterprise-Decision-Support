import React from 'react'
import { Search, Filter, RefreshCw } from 'lucide-react'
import { Input } from '../../../shared/ui/Input'
import { ActivityFilterOptions } from '../../../services/activityService'

interface ActivityFiltersProps {
  filters: ActivityFilterOptions
  onChange: (newFilters: ActivityFilterOptions) => void
  onRefresh: () => void
  isRefreshing: boolean
}

export const ActivityFilters: React.FC<ActivityFiltersProps> = ({
  filters,
  onChange,
  onRefresh,
  isRefreshing,
}) => {
  const eventTypes = [
    { id: 'all', label: 'All Event Types' },
    { id: 'agent_execution', label: '🤖 Agent Runs' },
    { id: 'hitl_approval', label: '✍️ HITL Approvals' },
    { id: 'sql_query', label: '⚡ SQL Queries' },
    { id: 'model_retrain', label: '🧠 Model Retrains' },
    { id: 'guardrail_policy', label: '🛡️ Guardrail Rules' },
  ]

  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-cyber-card/60 border border-cyber-border/60 p-3 rounded-xl">
      {/* Search Bar */}
      <div className="w-full md:w-80">
        <Input
          type="text"
          placeholder="Search by action, actor, or hash..."
          value={filters.search || ''}
          onChange={e => onChange({ ...filters, search: e.target.value })}
          leftIcon={<Search className="w-4 h-4 text-cyber-muted" />}
          className="h-9 text-xs"
        />
      </div>

      {/* Event Type Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
        {eventTypes.map(t => {
          const isSelected = (filters.eventType || 'all') === t.id
          return (
            <button
              key={t.id}
              onClick={() => onChange({ ...filters, eventType: t.id })}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap border ${
                isSelected
                  ? 'bg-cyber-cyan/15 border-cyber-cyan text-cyber-cyan font-semibold'
                  : 'bg-slate-900/60 border-cyber-border/40 text-cyber-muted hover:text-cyber-text'
              }`}
            >
              {t.label}
            </button>
          )
        })}
      </div>

      {/* Refresh Trigger */}
      <button
        onClick={onRefresh}
        className="p-2 rounded-lg bg-slate-900/80 border border-cyber-border/60 text-cyber-muted hover:text-cyber-text hover:border-cyber-border transition-colors flex items-center justify-center shrink-0"
        title="Refresh Live Stream"
      >
        <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-cyber-cyan' : ''}`} />
      </button>
    </div>
  )
}
