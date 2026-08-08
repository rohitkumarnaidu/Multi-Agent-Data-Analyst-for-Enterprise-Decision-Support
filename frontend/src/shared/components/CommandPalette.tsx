import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  Bot,
  LayoutDashboard,
  Database,
  BookOpen,
  Boxes,
  PieChart,
  Cpu,
  TrendingUp,
  AlertOctagon,
  FileText,
  Activity,
  Settings,
  Sparkles,
  Play,
  Download,
  Moon,
  Sun,
  X,
} from 'lucide-react'
import { useWorkspace } from '@/shared/context/WorkspaceContext'
import { useTheme } from '@/shared/context/ThemeContext'
import { cn } from '@/shared/utils/cn'

interface CommandItem {
  id: string
  title: string
  subtitle?: string
  category: 'Workspaces' | 'Actions' | 'Golden Prompts' | 'System'
  icon: React.ElementType
  action: () => void
}

export const CommandPalette: React.FC = () => {
  const { isCommandPaletteOpen, setIsCommandPaletteOpen } = useWorkspace()
  const { theme, toggleTheme } = useTheme()
  const [search, setSearch] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsCommandPaletteOpen(!isCommandPaletteOpen)
      }
      if (e.key === 'Escape' && isCommandPaletteOpen) {
        setIsCommandPaletteOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isCommandPaletteOpen, setIsCommandPaletteOpen])

  if (!isCommandPaletteOpen) return null

  const commands: CommandItem[] = [
    // Workspaces
    {
      id: 'ws-ai',
      title: 'AI Multi-Agent Workspace',
      subtitle: 'Open 3-panel LangGraph execution console',
      category: 'Workspaces',
      icon: Bot,
      action: () => navigate('/workspace/ai'),
    },
    {
      id: 'ws-dash',
      title: 'Executive Dashboard',
      subtitle: 'View executive KPIs, revenue, margin & SLA rates',
      category: 'Workspaces',
      icon: LayoutDashboard,
      action: () => navigate('/workspace/dashboard'),
    },
    {
      id: 'ws-datasets',
      title: 'Datasets & Schema Explorer',
      subtitle: 'Inspect 200k records, DuckDB parquet & schema',
      category: 'Workspaces',
      icon: Database,
      action: () => navigate('/workspace/datasets'),
    },
    {
      id: 'ws-knowledge',
      title: 'Knowledge Base (Semantic Layer)',
      subtitle: 'Inspect metrics.yaml and ChromaDB vector store',
      category: 'Workspaces',
      icon: BookOpen,
      action: () => navigate('/workspace/knowledge'),
    },
    {
      id: 'ws-features',
      title: 'Feature Store & Registry',
      subtitle: 'Explore 353 feature definitions and contracts',
      category: 'Workspaces',
      icon: Boxes,
      action: () => navigate('/workspace/feature-store'),
    },
    {
      id: 'ws-eda',
      title: 'EDA Studio',
      subtitle: 'Correlation heatmap, outliers, distributions',
      category: 'Workspaces',
      icon: PieChart,
      action: () => navigate('/workspace/eda'),
    },
    {
      id: 'ws-models',
      title: 'Model Registry & Leaderboard',
      subtitle: 'XGBoost 0.982 ROC-AUC evaluation curves',
      category: 'Workspaces',
      icon: Cpu,
      action: () => navigate('/workspace/models'),
    },
    {
      id: 'ws-forecasting',
      title: 'Forecasting & What-If Simulation',
      subtitle: 'Run Tier 1 deterministic & Tier 2 model predictions',
      category: 'Workspaces',
      icon: TrendingUp,
      action: () => navigate('/workspace/forecasting'),
    },
    {
      id: 'ws-risk',
      title: 'Risk & Anomaly Center',
      subtitle: 'Monitor 142 anomalies and SLA breach alerts',
      category: 'Workspaces',
      icon: AlertOctagon,
      action: () => navigate('/workspace/risk'),
    },
    {
      id: 'ws-reports',
      title: 'Executive Report Builder',
      subtitle: 'Generate and export boardroom PDF/Markdown reports',
      category: 'Workspaces',
      icon: FileText,
      action: () => navigate('/workspace/reports'),
    },
    {
      id: 'ws-activity',
      title: 'Activity & Audit Trail',
      subtitle: 'Trace all agent executions and human approvals',
      category: 'Workspaces',
      icon: Activity,
      action: () => navigate('/workspace/activity'),
    },
    {
      id: 'ws-settings',
      title: 'System Settings & LLM Config',
      subtitle: 'Manage Groq/Ollama keys, prompts, and guardrails',
      category: 'Workspaces',
      icon: Settings,
      action: () => navigate('/workspace/settings'),
    },

    // Golden Prompts
    {
      id: 'gt-01',
      title: 'GT-01: Revenue by Region & Department',
      subtitle: 'Run Orchestrator -> Data -> Analysis -> Narrative',
      category: 'Golden Prompts',
      icon: Sparkles,
      action: () => navigate('/workspace/ai?prompt=GT-01'),
    },
    {
      id: 'gt-19',
      title: 'GT-19: Anomaly & Risk Detection Scan',
      subtitle: 'Run XGBoost model-informed risk scoring',
      category: 'Golden Prompts',
      icon: Sparkles,
      action: () => navigate('/workspace/ai?prompt=GT-19'),
    },
    {
      id: 'gt-20',
      title: 'GT-20: What-If Simulation Recompute',
      subtitle: 'Closed-form mathematical scenario simulation',
      category: 'Golden Prompts',
      icon: Sparkles,
      action: () => navigate('/workspace/ai?prompt=GT-20'),
    },

    // Actions & System
    {
      id: 'act-export',
      title: 'Export Boardroom Executive Report (PDF)',
      subtitle: 'Generate formatted PDF summary of current metrics',
      category: 'Actions',
      icon: Download,
      action: () => navigate('/workspace/reports'),
    },
    {
      id: 'sys-theme',
      title: `Toggle Theme (Currently ${theme === 'dark' ? 'Obsidian Dark' : 'Light'})`,
      subtitle: 'Switch between cyber dark and clean light modes',
      category: 'System',
      icon: theme === 'dark' ? Sun : Moon,
      action: () => toggleTheme(),
    },
  ]

  const filteredCommands = commands.filter(
    cmd =>
      cmd.title.toLowerCase().includes(search.toLowerCase()) ||
      cmd.subtitle?.toLowerCase().includes(search.toLowerCase()) ||
      cmd.category.toLowerCase().includes(search.toLowerCase())
  )

  const handleSelect = (cmd: CommandItem) => {
    cmd.action()
    setIsCommandPaletteOpen(false)
    setSearch('')
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:pt-20">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
        onClick={() => setIsCommandPaletteOpen(false)}
      />

      {/* Command Palette Card */}
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-700/80 bg-slate-900/98 text-slate-100 shadow-2xl shadow-cyan-950/30 overflow-hidden z-10 animate-in zoom-in-95">
        {/* Search Header */}
        <div className="flex items-center gap-3 border-b border-slate-800 px-4 py-3.5">
          <Search className="h-4 w-4 text-cyan-400 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={e => {
              setSearch(e.target.value)
              setSelectedIndex(0)
            }}
            placeholder="Type a command, search workspace, or run golden prompt..."
            className="flex-1 bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
            autoFocus
          />
          <button
            onClick={() => setIsCommandPaletteOpen(false)}
            className="rounded p-1 text-slate-500 hover:text-slate-300"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Command Results */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-1">
          {filteredCommands.length === 0 ? (
            <p className="py-8 text-center text-xs text-slate-500">No matching commands found.</p>
          ) : (
            filteredCommands.map((cmd, idx) => {
              const Icon = cmd.icon
              const isSelected = idx === selectedIndex

              return (
                <div
                  key={cmd.id}
                  onClick={() => handleSelect(cmd)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={cn(
                    'flex items-center justify-between rounded-xl px-3 py-2.5 cursor-pointer transition-all',
                    isSelected
                      ? 'bg-cyan-500/15 border border-cyan-500/30 text-slate-100'
                      : 'hover:bg-slate-800/60 text-slate-300'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'flex h-8 w-8 items-center justify-center rounded-lg border',
                        isSelected
                          ? 'border-cyan-500/40 bg-cyan-500/20 text-cyan-300'
                          : 'border-slate-800 bg-slate-800/80 text-slate-400'
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-100">{cmd.title}</p>
                      {cmd.subtitle && (
                        <p className="text-[11px] text-slate-400">{cmd.subtitle}</p>
                      )}
                    </div>
                  </div>
                  <span className="rounded-full bg-slate-800/80 border border-slate-700/60 px-2 py-0.5 text-[10px] font-mono text-slate-400">
                    {cmd.category}
                  </span>
                </div>
              )
            })
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-800 px-4 py-2 text-[11px] text-slate-500 font-mono">
          <div className="flex items-center gap-3">
            <span>Use ↑↓ to navigate</span>
            <span>↵ to select</span>
            <span>ESC to close</span>
          </div>
          <span className="text-cyan-400">Datasphere Command Hub</span>
        </div>
      </div>
    </div>,
    document.body
  )
}
