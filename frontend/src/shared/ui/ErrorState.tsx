import React from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from './Button'
import { cn } from '@/shared/utils/cn'

export interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
  className?: string
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Failed to load data',
  message = 'An unexpected error occurred while communicating with the decision engine.',
  onRetry,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 text-center rounded-xl border border-rose-500/30 bg-rose-950/20 my-4',
        className
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-900/40 border border-rose-500/40 text-rose-400 mb-3 shadow-glow-rose">
        <AlertCircle className="h-6 w-6" />
      </div>
      <h3 className="text-sm font-semibold text-rose-200">{title}</h3>
      <p className="mt-1 text-xs text-rose-300/80 max-w-sm">{message}</p>
      {onRetry && (
        <Button
          size="sm"
          variant="secondary"
          onClick={onRetry}
          leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
          className="mt-4 border-rose-700/60 hover:border-rose-500"
        >
          Retry Request
        </Button>
      )}
    </div>
  )
}
