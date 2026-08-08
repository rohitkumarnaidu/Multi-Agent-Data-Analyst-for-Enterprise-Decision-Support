import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/shared/utils/cn'
import { Loader2 } from 'lucide-react'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none active:scale-[0.99] cursor-pointer',
  {
    variants: {
      variant: {
        primary:
          'bg-sky-600 dark:bg-sky-500 text-white hover:bg-sky-700 dark:hover:bg-sky-400 font-semibold shadow-xs',
        secondary:
          'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700',
        outline:
          'border border-slate-300 dark:border-slate-700 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200',
        ghost:
          'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white',
        destructive:
          'bg-rose-600 text-white hover:bg-rose-700 dark:hover:bg-rose-500 shadow-xs',
        success:
          'bg-emerald-600 text-white hover:bg-emerald-700 dark:hover:bg-emerald-500 shadow-xs',
        subtle:
          'bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 hover:bg-sky-100 dark:hover:bg-sky-900/60 border border-sky-200 dark:border-sky-800',
        cyber:
          'bg-sky-600 dark:bg-sky-500 text-white hover:bg-sky-700 dark:hover:bg-sky-400 font-semibold shadow-xs',
      },
      size: {
        xs: 'h-7 px-2.5 text-xs',
        sm: 'h-8 px-3 text-xs',
        md: 'h-9 px-4 text-sm',
        lg: 'h-10 px-5 text-sm font-semibold',
        icon: 'h-9 w-9 p-0',
        'icon-sm': 'h-7 w-7 p-0',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          leftIcon && <span className="mr-1.5 inline-flex items-center">{leftIcon}</span>
        )}
        {children}
        {!isLoading && rightIcon && (
          <span className="ml-1.5 inline-flex items-center">{rightIcon}</span>
        )}
      </button>
    )
  }
)
Button.displayName = 'Button'
