import React from 'react'
import { cn } from '@/shared/utils/cn'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'muted' | 'outline' | 'elevated'
  glow?: string
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', glow: _glow, children, ...props }, ref) => {
    const variantClasses = {
      default: 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 shadow-xs',
      muted: 'bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 text-slate-800 dark:text-slate-200',
      outline: 'bg-transparent border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100',
      elevated: 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-colors',
    }[variant]

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-lg transition-colors',
          variantClasses,
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Card.displayName = 'Card'

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col space-y-1 p-5 pb-3', className)} {...props} />
  )
)
CardHeader.displayName = 'CardHeader'

export const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn('font-semibold leading-tight tracking-tight text-slate-900 dark:text-slate-100 text-sm', className)} {...props} />
  )
)
CardTitle.displayName = 'CardTitle'

export const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn('text-xs text-slate-500 dark:text-slate-400 mt-0.5', className)} {...props} />
  )
)
CardDescription.displayName = 'CardDescription'

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-5 pt-0', className)} {...props} />
  )
)
CardContent.displayName = 'CardContent'

export const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center p-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 mt-2 text-xs text-slate-500', className)} {...props} />
  )
)
CardFooter.displayName = 'CardFooter'
