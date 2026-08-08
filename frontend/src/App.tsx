import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'
import { ThemeProvider } from '@/shared/context/ThemeContext'
import { WorkspaceProvider } from '@/shared/context/WorkspaceContext'
import { ToastProvider } from '@/shared/ui/Toast'
import { router } from './routes'

import { queryClient } from '@/store/queryClient'
export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <WorkspaceProvider>
          <ToastProvider>
            <RouterProvider router={router} />
          </ToastProvider>
        </WorkspaceProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
