import React from 'react'
import {
  Search,
  Bell,
  Sun,
  Moon,
  ShieldAlert,
  ChevronDown,
  Menu,
  Sparkles,
} from 'lucide-react'
import { useTheme } from '@/shared/context/ThemeContext'
import { useWorkspace } from '@/shared/context/WorkspaceContext'
import { DropdownMenu } from '@/shared/ui/DropdownMenu'
import type { UserRole } from '@/shared/types'

interface TopNavigationProps {
  onToggleMobileSidebar: () => void
}

export const TopNavigation: React.FC<TopNavigationProps> = ({ onToggleMobileSidebar }) => {
  const { theme, toggleTheme } = useTheme()
  const {
    user,
    setUserRole,
    unreadNotificationsCount,
    pendingApprovalsCount,
    setIsCommandPaletteOpen,
    setIsNotificationsOpen,
    workspaceName,
  } = useWorkspace()

  const roles: UserRole[] = [
    'Lead Data Scientist',
    'Executive',
    'Compliance Officer',
    'Risk Manager',
    'Operations Lead',
  ]

  const userMenuItems = [
    {
      id: 'role-header',
      label: `Active Role: ${user.role}`,
      disabled: true,
    },
    { id: 'div-1', label: '', divider: true },
    ...roles.map(role => ({
      id: `role-${role}`,
      label: `Switch to ${role}`,
      onClick: () => setUserRole(role),
    })),
    { id: 'div-2', label: '', divider: true },
    {
      id: 'profile',
      label: 'Account & API Credentials',
      onClick: () => {
        window.location.href = '/workspace/settings'
      },
    },
  ]

  return (
    <header className="sticky top-0 z-20 flex h-14 w-full items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 px-4 md:px-6 backdrop-blur-xs select-none">
      {/* Left: Mobile Toggle & Workspace Breadcrumb */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        {/* Mobile Hamburger Trigger */}
        <button
          onClick={onToggleMobileSidebar}
          className="md:hidden rounded-md p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Open Navigation"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium shrink-0">
          <span className="font-semibold text-slate-900 dark:text-slate-100">{workspaceName}</span>
          <span className="text-slate-400 dark:text-slate-600">/</span>
        </div>

        {/* Global Command Palette Trigger */}
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="flex h-8 w-full max-w-md items-center justify-between rounded-md border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800/60 px-2.5 text-xs text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
        >
          <div className="flex items-center gap-2 truncate">
            <Search className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span className="truncate">Search features, data, metrics...</span>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-1.5 py-0.5 text-[10px] font-mono text-slate-500 dark:text-slate-400">
            <span>⌘K</span>
          </kbd>
        </button>
      </div>

      {/* Right: Telemetry pill, Approvals, Notifications, Theme, User */}
      <div className="flex items-center gap-2.5">
        {/* LLM Status Pill */}
        <div className="hidden lg:flex items-center gap-1.5 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 px-2 py-1 text-[11px] text-slate-600 dark:text-slate-400 font-mono">
          <Sparkles className="h-3 w-3 text-sky-600 dark:text-sky-400" />
          <span>LLaMA-3.3-70B</span>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <span className="text-emerald-600 dark:text-emerald-400">99.4% SLA</span>
        </div>

        {/* Pending Approvals Button */}
        {pendingApprovalsCount > 0 && (
          <button
            onClick={() => setIsNotificationsOpen(true)}
            className="flex items-center gap-1.5 rounded-md border border-amber-300 dark:border-amber-700/60 bg-amber-50 dark:bg-amber-950/40 px-2 py-1 text-xs font-semibold text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors"
          >
            <ShieldAlert className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
            <span className="hidden sm:inline">{pendingApprovalsCount} Action Required</span>
          </button>
        )}

        {/* Notifications Bell */}
        <button
          onClick={() => setIsNotificationsOpen(true)}
          className="relative rounded-md p-1.5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
          title="Notifications"
        >
          <Bell className="h-4 w-4" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-1.5 w-1.5 rounded-full bg-sky-500" />
          )}
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="rounded-md p-1.5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
        >
          {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-700" />}
        </button>

        <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 mx-0.5" />

        {/* User Profile / Role Dropdown */}
        <DropdownMenu
          trigger={
            <div className="flex items-center gap-2 rounded-md p-1 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-xs text-left cursor-pointer">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-sky-600 text-white font-semibold text-xs">
                {user.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="hidden md:flex flex-col">
                <span className="font-semibold text-slate-800 dark:text-slate-200 leading-none">{user.name}</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">{user.role}</span>
              </div>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </div>
          }
          items={userMenuItems}
        />
      </div>
    </header>
  )
}
