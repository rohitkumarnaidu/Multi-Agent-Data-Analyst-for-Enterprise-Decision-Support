import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { EnterpriseSidebar } from './EnterpriseSidebar'
import { TopNavigation } from './TopNavigation'
import { CommandPalette } from '@/shared/components/CommandPalette'
import { NotificationsDrawer } from './NotificationsDrawer'

export const EnterpriseLayout: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100">
      {/* Enterprise Sidebar (Desktop Persistent & Mobile Drawer) */}
      <EnterpriseSidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(prev => !prev)}
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <TopNavigation onToggleMobileSidebar={() => setIsMobileSidebarOpen(prev => !prev)} />

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8 relative">
          <Outlet />
        </main>
      </div>

      {/* Global Interactive Overlays */}
      <CommandPalette />
      <NotificationsDrawer />
    </div>
  )
}
