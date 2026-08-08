import React from 'react'
import { cn } from '@/shared/utils/cn'

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'card' | 'circle' | 'text'
}

export const Skeleton: React.FC<SkeletonProps> = ({ className, variant = 'default', ...props }) => {
  return (
    <div
      className={cn(
        'animate-pulse bg-slate-800/60 rounded-md',
        variant === 'circle' && 'rounded-full',
        variant === 'text' && 'h-4 w-3/4',
        variant === 'card' && 'h-32 w-full rounded-xl',
        className
      )}
      {...props}
    />
  )
}
