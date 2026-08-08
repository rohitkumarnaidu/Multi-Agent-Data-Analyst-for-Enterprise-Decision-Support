import React, { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { EnterpriseLayout } from './layouts/EnterpriseLayout'
import { Skeleton } from './shared/ui/Skeleton'

const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const AIWorkspacePage = lazy(() => import('./pages/AIWorkspacePage'))
const KnowledgePage = lazy(() => import('./pages/KnowledgePage'))
const ReportsPage = lazy(() => import('./pages/ReportsPage'))

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
      {
        path: 'dashboard',
        element: (
          <Suspense fallback={<PageLoader />}>
            <DashboardPage />
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
      {
        path: 'knowledge',
        element: (
          <Suspense fallback={<PageLoader />}>
            <KnowledgePage />
          </Suspense>
        ),
      },
      {
        path: 'reports',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ReportsPage />
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
