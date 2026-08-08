import React from 'react'
import { cn } from '@/shared/utils/cn'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  error?: string
  label?: string
  helperText?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', leftIcon, rightIcon, error, label, helperText, disabled, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-medium text-slate-300">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 flex items-center pointer-events-none text-slate-400">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            type={type}
            ref={ref}
            disabled={disabled}
            className={cn(
              'flex h-9 w-full rounded-lg border border-slate-700/80 bg-slate-900/90 px-3 py-1 text-sm text-slate-100 placeholder:text-slate-500 transition-all focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 disabled:cursor-not-allowed disabled:opacity-50',
              leftIcon && 'pl-9',
              rightIcon && 'pr-9',
              error && 'border-rose-500 focus:ring-rose-500 focus:border-rose-500',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 flex items-center text-slate-400">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="text-xs text-rose-400 font-medium">{error}</p>}
        {!error && helperText && <p className="text-xs text-slate-500">{helperText}</p>}
      </div>
    )
  }
)
Input.displayName = 'Input'
