import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Bot,
  BarChart3,
  Database,
  BookOpen,
  Layers,
  BrainCircuit,
  Cpu,
  TrendingUp,
  FileText,
  Activity,
  Server,
  ChevronLeft,
  ChevronRight,
  X,
  Users,
  DollarSign,
  ShieldAlert,
  UserCheck,
  Headphones,
  Shield,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/shared/utils/cn'
import { useWorkspace } from '@/shared/context/WorkspaceContext'
import { useDatasetDiscovery } from '@/api/enterpriseApi'
import { DropdownMenu } from '@/shared/ui/DropdownMenu'
import type { UserRole } from '@/shared/types'

interface NavItem {
  name: string
  to: string
  icon: React.ElementType
  badge?: string | number
  badgeVariant?: 'default' | 'primary' | 'success' | 'warning' | 'destructive'
  color?: string
}

interface NavSection {
  title?: string
  items: NavItem[]
}

/* ─── Icon Map for dynamic domains ─── */
const ICON_MAP: Record<string, React.ElementType> = {
  Users,
  TrendingUp,
  DollarSign,
  Activity,
  ShieldAlert,
  UserCheck,
  BrainCircuit,
  Headphones,
  Shield,
  BarChart3,
}

/* ─── Static Nav Sections ─── */
const staticSections: NavSection[] = [
  {
    title: 'Business Intelligence',
    items: [
      { name: 'Command Center', to: '/workspace/dashboard', icon: LayoutDashboard },
      { name: 'Data Explorer', to: '/workspace/data-explorer', icon: Database },
      { name: 'AI Analysis', to: '/workspace/ai', icon: Bot, badge: 'ACTIVE', badgeVariant: 'primary' },
    ],
  },
]

const operationsSections: NavSection[] = [
  {
    title: 'AI Operations',
    items: [
      { name: 'Agent Monitor', to: '/workspace/agents', icon: Cpu },
      { name: 'Model Center', to: '/workspace/models', icon: BrainCircuit },
      { name: 'Execution Monitor', to: '/workspace/execution', icon: Activity },
    ],
  },
  {
    title: 'Knowledge & Memory',
    items: [
      { name: 'Knowledge Center', to: '/workspace/knowledge', icon: BookOpen },
      { name: 'Memory Center', to: '/workspace/memory', icon: Layers },
    ],
  },
  {
    title: 'Administration',
    items: [
      { name: 'Enterprise Reports', to: '/workspace/reports', icon: FileText },
      { name: 'System Monitor', to: '/workspace/system', icon: Server, badge: 'DEV', badgeVariant: 'destructive' },
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
  const { pendingApprovalsCount, user, setUserRole } = useWorkspace()
  const { data: discovery } = useDatasetDiscovery()
  const navigate = useNavigate()

  const roles: UserRole[] = [
    'Lead Data Scientist',
    'Executive',
    'Compliance Officer',
    'Risk Manager',
    'Operations Lead',
  ]

  const handleRoleSwitch = (role: UserRole) => {
    setUserRole(role)
    switch (role) {
      case 'Executive':
        navigate('/workspace/dashboard')
        break
      case 'Risk Manager':
        navigate('/workspace/domain/risk')
        break
      case 'Operations Lead':
        navigate('/workspace/domain/operations')
        break
      case 'Compliance Officer':
        navigate('/workspace/reports')
        break
      case 'Lead Data Scientist':
        navigate('/workspace/ai')
        break
      default:
        navigate('/workspace/dashboard')
    }
    if (onMobileClose) onMobileClose()
  }

  const roleMenuItems = [
    {
      id: 'role-header',
      label: `Active Role: ${user.role}`,
      disabled: true,
    },
    { id: 'div-1', label: '', divider: true },
    ...roles.map(role => ({
      id: `role-${role}`,
      label: `Switch to ${role}`,
      onClick: () => handleRoleSwitch(role),
    })),
  ]

  // Build dynamic domain section from discovered domains
  const domainSection: NavSection | null =
    discovery?.detected_domains && discovery.detected_domains.length > 0
      ? {
          title: 'Detected Domains',
          items: discovery.detected_domains.map(domain => ({
            name: domain.label,
            to: `/workspace/domain/${domain.domain_id}`,
            icon: ICON_MAP[domain.icon] || BarChart3,
            badge: `${domain.confidence.toFixed(0)}%`,
            badgeVariant: 'success' as const,
            color: domain.color,
          })),
        }
      : null

  // Assemble full nav: static → dynamic domains → operations
  const navSections: NavSection[] = [
    ...staticSections,
    ...(domainSection ? [domainSection] : []),
    ...operationsSections,
  ]

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
                  <Icon className="h-4 w-4 shrink-0" style={item.color ? { color: item.color } : undefined} />
                  {!isCollapsed && <span className="flex-1 truncate">{item.name}</span>}

                  {!isCollapsed && item.badge && (
                    <span
                      className={cn(
                        'rounded px-1.5 py-0.2 text-[9px] font-bold uppercase tracking-wider',
                        item.badgeVariant === 'primary' &&
                          'bg-sky-500/15 text-sky-400 border border-sky-500/30',
                        item.badgeVariant === 'destructive' &&
                          'bg-rose-500/15 text-rose-400 border border-rose-500/30',
                        item.badgeVariant === 'success' &&
                          'bg-emerald-500/10 text-emerald-400/70 border border-emerald-500/20'
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

      {/* Role Switcher */}
      <div className="px-2 py-2 border-t border-slate-800 shrink-0">
        {!isCollapsed ? (
          <DropdownMenu
            trigger={
              <div className="flex items-center justify-between rounded-md p-2 hover:bg-slate-800 transition-colors cursor-pointer text-xs">
                <div className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-slate-400" />
                  <div className="flex flex-col">
                    <span className="font-medium text-slate-300">Active Role</span>
                    <span className="text-[10px] text-sky-400">{user.role}</span>
                  </div>
                </div>
                <ChevronRight className="h-3 w-3 text-slate-500" />
              </div>
            }
            items={roleMenuItems}
            align="left"
            side="top"
          />
        ) : (
          <div className="flex justify-center py-2" title={`Role: ${user.role}`}>
             <UserCheck className="h-4 w-4 text-slate-400" />
          </div>
        )}
      </div>

      {/* System Status Footer */}
      <div className="p-2.5 border-t border-slate-800 bg-slate-950/60 shrink-0">
        {!isCollapsed ? (
          <div className="rounded-md bg-slate-900/90 p-2 border border-slate-800/80 text-[11px] space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span className="font-semibold text-slate-300 text-[10px]">AI Engine</span>
              </div>
              <span className="text-[9px] font-mono text-emerald-400">OPERATIONAL</span>
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span>{discovery?.total_rows ? `${(discovery.total_rows / 1000).toFixed(0)}K records` : '...'}</span>
              <span>{discovery?.detected_domains?.length ?? '—'} domains</span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center py-1" title="AI Engine: Operational">
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
