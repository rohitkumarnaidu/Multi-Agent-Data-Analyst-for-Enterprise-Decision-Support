import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/shared/utils/cn'

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium transition-colors border select-none',
  {
    variants: {
      variant: {
        default: 'border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200',
        primary: 'border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300',
        indigo: 'border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300',
        success: 'border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300',
        warning: 'border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300',
        destructive: 'border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300',
        purple: 'border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300',
        teal: 'border-teal-200 dark:border-teal-800 bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300',
        outline: 'border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 bg-transparent',
        cyber: 'border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300',
      },
      size: {
        sm: 'px-1.5 py-0.2 text-[10px]',
        md: 'px-2 py-0.5 text-xs',
        lg: 'px-2.5 py-1 text-xs font-semibold',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean
  pulseDot?: boolean
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant,
  size,
  dot,
  pulseDot,
  children,
  ...props
}) => {
  return (
    <span className={cn(badgeVariants({ variant, size, className }))} {...props}>
      {dot && (
        <span
          className={cn(
            'h-1.5 w-1.5 rounded-full bg-current shrink-0',
            pulseDot && 'animate-ping inline-flex'
          )}
        />
      )}
      {children}
    </span>
  )
}
