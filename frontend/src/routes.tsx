import React, { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { EnterpriseLayout } from './layouts/EnterpriseLayout'
import { Skeleton } from './shared/ui/Skeleton'

// Lazy loaded page components for optimal code-splitting and bundle performance
const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const AIWorkspacePage = lazy(() => import('./pages/AIWorkspacePage'))
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'))
const DatasetsPage = lazy(() => import('./pages/DatasetsPage'))
const KnowledgePage = lazy(() => import('./pages/KnowledgePage'))
const FeatureStorePage = lazy(() => import('./pages/FeatureStorePage'))
const EDAPage = lazy(() => import('./pages/EDAPage'))
const FeatureSelectionPage = lazy(() => import('./pages/FeatureSelectionPage'))
const ExplainabilityPage = lazy(() => import('./pages/ExplainabilityPage'))
const ModelsPage = lazy(() => import('./pages/ModelsPage'))
const ForecastingPage = lazy(() => import('./pages/ForecastingPage'))
const RiskCenterPage = lazy(() => import('./pages/RiskCenterPage'))
const ReportsPage = lazy(() => import('./pages/ReportsPage'))
const ActivityPage = lazy(() => import('./pages/ActivityPage'))
const SettingsPage = lazy(() => import('./pages/SettingsPage'))

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
        path: 'analytics',
        element: (
          <Suspense fallback={<PageLoader />}>
            <AnalyticsPage />
          </Suspense>
        ),
      },
      {
        path: 'datasets',
        element: (
          <Suspense fallback={<PageLoader />}>
            <DatasetsPage />
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
        path: 'feature-store',
        element: (
          <Suspense fallback={<PageLoader />}>
            <FeatureStorePage />
          </Suspense>
        ),
      },
      {
        path: 'eda',
        element: (
          <Suspense fallback={<PageLoader />}>
            <EDAPage />
          </Suspense>
        ),
      },
      {
        path: 'feature-selection',
        element: (
          <Suspense fallback={<PageLoader />}>
            <FeatureSelectionPage />
          </Suspense>
        ),
      },
      {
        path: 'explainability',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ExplainabilityPage />
          </Suspense>
        ),
      },
      {
        path: 'models',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ModelsPage />
          </Suspense>
        ),
      },
      {
        path: 'forecasting',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ForecastingPage />
          </Suspense>
        ),
      },
      {
        path: 'risk',
        element: (
          <Suspense fallback={<PageLoader />}>
            <RiskCenterPage />
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
      {
        path: 'activity',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ActivityPage />
          </Suspense>
        ),
      },
      {
        path: 'settings',
        element: (
          <Suspense fallback={<PageLoader />}>
            <SettingsPage />
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
