import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Bot,
  BarChart3,
  Database,
  BookOpen,
  Boxes,
  PieChart,
  Target,
  BrainCircuit,
  Cpu,
  TrendingUp,
  AlertOctagon,
  FileText,
  Activity,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Server,
  Layers,
  Presentation,
  ShieldAlert,
  X,
} from 'lucide-react'
import { cn } from '@/shared/utils/cn'
import { useWorkspace } from '@/shared/context/WorkspaceContext'

interface NavItem {
  name: string
  to: string
  icon: React.ElementType
  badge?: string | number
  badgeVariant?: 'default' | 'primary' | 'success' | 'warning' | 'destructive'
}

interface NavSection {
  title?: string
  items: NavItem[]
}

const navSections: NavSection[] = [
  {
    title: 'Overview & Intelligence',
    items: [
      { name: 'Executive Dashboard', to: '/workspace/dashboard', icon: LayoutDashboard },
      { name: 'AI Workspace', to: '/workspace/ai', icon: Bot, badge: 'ACTIVE', badgeVariant: 'primary' },
    ],
  },
  {
    title: 'Enterprise Data',
    items: [
      { name: 'Knowledge Base', to: '/workspace/knowledge', icon: BookOpen },
    ],
  },
  {
    title: 'Administration',
    items: [
      { name: 'Enterprise Reports', to: '/workspace/reports', icon: FileText },
    ],
  },
]

interface EnterpriseSidebarProps {
  isCollapsed: boolean
  onToggleCollapse: () => void
  isMobileOpen?: boolean
  onMobileClose?: () => void
}

export const EnterpriseSidebar: React.FC<EnterpriseSidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
  isMobileOpen = false,
  onMobileClose,
}) => {
  const { pendingApprovalsCount } = useWorkspace()

  const sidebarContent = (
    <div className="flex h-full flex-col bg-slate-900 dark:bg-slate-950 text-slate-300 border-r border-slate-800">
      {/* Brand Header */}
      <div className="flex h-14 items-center justify-between px-4 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-sky-600 text-white font-bold text-xs shadow-xs">
            <Layers className="h-4 w-4" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xs text-slate-100 tracking-tight">DATASPHÈRE</span>
                <span className="text-[9px] font-semibold px-1 py-0.2 rounded bg-slate-800 text-sky-400 border border-slate-700">
                  ENTERPRISE
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Desktop Collapse Toggle */}
        <button
          onClick={onToggleCollapse}
          className="hidden md:flex rounded-md p-1 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>

        {/* Mobile Close Button */}
        {onMobileClose && (
          <button
            onClick={onMobileClose}
            className="md:hidden rounded-md p-1 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
        {navSections.map((section, idx) => (
          <div key={idx} className="space-y-0.5">
            {section.title && !isCollapsed && (
              <p className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                {section.title}
              </p>
            )}
            {section.items.map(item => {
              const Icon = item.icon
              const hasApprovalBadge = item.name === 'AI Workspace' && pendingApprovalsCount > 0

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => {
                    if (onMobileClose) onMobileClose()
                  }}
                  className={({ isActive }) =>
                    cn(
                      'group flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors relative',
                      isActive
                        ? 'bg-sky-500/10 text-sky-400 font-semibold'
                        : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200',
                      isCollapsed && 'justify-center px-2'
                    )
                  }
                  title={isCollapsed ? item.name : undefined}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {!isCollapsed && <span className="flex-1 truncate">{item.name}</span>}

                  {!isCollapsed && item.badge && (
                    <span
                      className={cn(
                        'rounded px-1.5 py-0.2 text-[9px] font-bold uppercase tracking-wider',
                        item.badgeVariant === 'primary' &&
                          'bg-sky-500/15 text-sky-400 border border-sky-500/30',
                        item.badgeVariant === 'destructive' &&
                          'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                      )}
                    >
                      {item.badge}
                    </span>
                  )}

                  {!isCollapsed && hasApprovalBadge && (
                    <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                  )}
                </NavLink>
              )
            })}
          </div>
        ))}
      </div>

      {/* System Status Footer */}
      <div className="p-2.5 border-t border-slate-800 bg-slate-950/60 shrink-0">
        {!isCollapsed ? (
          <div className="rounded-md bg-slate-900/90 p-2 border border-slate-800/80 text-[11px] space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span className="font-semibold text-slate-300 text-[10px]">Engine Status</span>
              </div>
              <span className="text-[9px] font-mono text-emerald-400">HEALTHY</span>
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span>DuckDB 1.1</span>
              <span>LlamaGuard 3</span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center py-1" title="Engine Status: Healthy">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
          </div>
        )}
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside
        className={cn(
          'hidden md:block transition-all duration-200 shrink-0 select-none z-30',
          isCollapsed ? 'w-14' : 'w-56'
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop & Sidebar */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
            onClick={onMobileClose}
          />
          <div className="relative flex w-64 flex-1 flex-col z-50">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  )
}
