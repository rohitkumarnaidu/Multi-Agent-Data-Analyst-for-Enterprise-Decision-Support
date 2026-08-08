import React, { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { EnterpriseLayout } from './layouts/EnterpriseLayout'
import { Skeleton } from './shared/ui/Skeleton'

// Lazy-loaded pages
const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const DataExplorerPage = lazy(() => import('./pages/DataExplorerPage'))
const AIWorkspacePage = lazy(() => import('./pages/AIWorkspacePage'))
const AgentMonitorPage = lazy(() => import('./pages/AgentMonitorPage'))
const ModelCenterPage = lazy(() => import('./pages/ModelCenterPage'))
const ExecutionMonitorPage = lazy(() => import('./pages/ExecutionMonitorPage'))
const KnowledgePage = lazy(() => import('./pages/KnowledgePage'))
const MemoryCenterPage = lazy(() => import('./pages/MemoryCenterPage'))
const ReportsPage = lazy(() => import('./pages/ReportsPage'))
const SystemMonitorPage = lazy(() => import('./pages/SystemMonitorPage'))
const DynamicDashboardPage = lazy(() => import('./pages/DynamicDashboardPage'))

const PageLoader = () => (
  <div className="p-6 space-y-6 max-w-6xl mx-auto">
    <div className="flex items-center justify-between">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>
      <Skeleton className="h-9 w-32" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Skeleton className="h-28 rounded-xl" />
      <Skeleton className="h-28 rounded-xl" />
      <Skeleton className="h-28 rounded-xl" />
      <Skeleton className="h-28 rounded-xl" />
    </div>
    <Skeleton className="h-96 rounded-xl" />
  </div>
)

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/workspace/dashboard" replace />,
  },
  {
    path: '/workspace',
    element: <EnterpriseLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/workspace/dashboard" replace />,
      },
      // ── Business Intelligence ──
      {
        path: 'dashboard',
        element: (
          <Suspense fallback={<PageLoader />}>
            <DashboardPage />
          </Suspense>
        ),
      },
      {
        path: 'data-explorer',
        element: (
          <Suspense fallback={<PageLoader />}>
            <DataExplorerPage />
          </Suspense>
        ),
      },
      {
        path: 'ai',
        element: (
          <Suspense fallback={<PageLoader />}>
            <AIWorkspacePage />
          </Suspense>
        ),
      },
      // ── AI Operations ──
      {
        path: 'agents',
        element: (
          <Suspense fallback={<PageLoader />}>
            <AgentMonitorPage />
          </Suspense>
        ),
      },
      {
        path: 'models',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ModelCenterPage />
          </Suspense>
        ),
      },
      {
        path: 'execution',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ExecutionMonitorPage />
          </Suspense>
        ),
      },
      // ── Knowledge & Memory ──
      {
        path: 'knowledge',
        element: (
          <Suspense fallback={<PageLoader />}>
            <KnowledgePage />
          </Suspense>
        ),
      },
      {
        path: 'memory',
        element: (
          <Suspense fallback={<PageLoader />}>
            <MemoryCenterPage />
          </Suspense>
        ),
      },
      // ── Administration ──
      {
        path: 'reports',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ReportsPage />
          </Suspense>
        ),
      },
      {
        path: 'system',
        element: (
          <Suspense fallback={<PageLoader />}>
            <SystemMonitorPage />
          </Suspense>
        ),
      },
      // ── Dynamic Domain Dashboards ──
      {
        path: 'domain/:domainId',
        element: (
          <Suspense fallback={<PageLoader />}>
            <DynamicDashboardPage />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/workspace/dashboard" replace />,
  },
])

