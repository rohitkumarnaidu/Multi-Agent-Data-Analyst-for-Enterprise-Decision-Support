import React from 'react'
import { FolderSearch } from 'lucide-react'
import { cn } from '@/shared/utils/cn'
import { Button } from './Button'

export interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  className?: string
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 text-center rounded-xl border border-dashed border-slate-800 bg-slate-900/40 my-4',
        className
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800/80 border border-slate-700/60 text-cyan-400 mb-3 shadow-inner">
        {icon || <FolderSearch className="h-6 w-6" />}
      </div>
      <h3 className="text-sm font-semibold text-slate-200">{title}</h3>
      {description && <p className="mt-1 text-xs text-slate-400 max-w-sm">{description}</p>}
      {actionLabel && onAction && (
        <Button size="sm" variant="subtle" onClick={onAction} className="mt-4">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
