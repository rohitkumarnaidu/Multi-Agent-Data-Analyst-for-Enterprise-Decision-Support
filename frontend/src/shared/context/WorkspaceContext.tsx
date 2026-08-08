import React, { createContext, useContext, useState } from 'react'
import type { UserProfile, UserRole, SystemNotification } from '@/shared/types'

interface WorkspaceContextType {
  workspaceName: string
  setWorkspaceName: (name: string) => void
  user: UserProfile
  setUserRole: (role: UserRole) => void
  notifications: SystemNotification[]
  unreadNotificationsCount: number
  markNotificationAsRead: (id: string) => void
  markAllNotificationsAsRead: () => void
  pendingApprovalsCount: number
  isCommandPaletteOpen: boolean
  setIsCommandPaletteOpen: (open: boolean) => void
  isNotificationsOpen: boolean
  setIsNotificationsOpen: (open: boolean) => void
  activeSessionId: string
  setActiveSessionId: (id: string) => void
}

const initialUser: UserProfile = {
  id: 'usr_enterprise_01',
  name: 'Elena Rostova',
  email: 'e.rostova@enterprise.datasphere.ai',
  role: 'Lead Data Scientist',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
}

const initialNotifications: SystemNotification[] = [
  {
    id: 'notif_01',
    title: 'High-Impact Recommendation Requires Approval',
    message: 'Validator flagged recommendation to re-allocate $145,000 budget for West region SLA mitigation.',
    type: 'approval_required',
    timestamp: 'Just now',
    isRead: false,
    actionUrl: '/workspace/ai',
  },
  {
    id: 'notif_02',
    title: 'XGBoost Risk Model Re-calibrated',
    message: 'Model registry updated to v1.4 with 0.982 ROC-AUC on latest validation split.',
    type: 'success',
    timestamp: '12 min ago',
    isRead: false,
    actionUrl: '/workspace/models',
  },
  {
    id: 'notif_03',
    title: 'SLA Breach Anomaly Spike Detected',
    message: 'Finance_Agent detected 4.2% anomalous delay in Order Processing stream.',
    type: 'warning',
    timestamp: '45 min ago',
    isRead: false,
    actionUrl: '/workspace/risk',
  },
  {
    id: 'notif_04',
    title: 'DuckDB In-Memory Sync Completed',
    message: 'Master cleaned dataset (200,000 rows, 353 features) synchronized into local vector catalog.',
    type: 'info',
    timestamp: '2 hours ago',
    isRead: true,
    actionUrl: '/workspace/datasets',
  }
]

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined)

export const WorkspaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [workspaceName, setWorkspaceName] = useState('Datasphere Enterprise Global')
  const [user, setUser] = useState<UserProfile>(initialUser)
  const [notifications, setNotifications] = useState<SystemNotification[]>(initialNotifications)
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [activeSessionId, setActiveSessionId] = useState('session_master_01')

  const setUserRole = (role: UserRole) => {
    setUser(prev => ({ ...prev, role }))
  }

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
    )
  }

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
  }

  const unreadNotificationsCount = notifications.filter(n => !n.isRead).length
  const pendingApprovalsCount = notifications.filter(
    n => n.type === 'approval_required' && !n.isRead
  ).length

  return (
    <WorkspaceContext.Provider
      value={{
        workspaceName,
        setWorkspaceName,
        user,
        setUserRole,
        notifications,
        unreadNotificationsCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        pendingApprovalsCount,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        isNotificationsOpen,
        setIsNotificationsOpen,
        activeSessionId,
        setActiveSessionId,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  )
}

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext)
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider')
  }
  return context
}
