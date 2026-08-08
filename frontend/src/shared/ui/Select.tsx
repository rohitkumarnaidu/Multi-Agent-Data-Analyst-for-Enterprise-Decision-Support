import React from 'react'
import { cn } from '@/shared/utils/cn'

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options: SelectOption[]
  error?: string
  helperText?: string
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, options, error, helperText, disabled, id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={selectId} className="block text-xs font-medium text-slate-300">
            {label}
          </label>
        )}
        <select
          id={selectId}
          ref={ref}
          disabled={disabled}
          className={cn(
            'flex h-9 w-full rounded-lg border border-slate-700/80 bg-slate-900/90 px-3 py-1 text-sm text-slate-100 transition-all focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-rose-500 focus:ring-rose-500 focus:border-rose-500',
            className
          )}
          {...props}
        >
          {options.map(option => (
            <option key={option.value} value={option.value} disabled={option.disabled} className="bg-slate-900 text-slate-100">
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="text-xs text-rose-400 font-medium">{error}</p>}
        {!error && helperText && <p className="text-xs text-slate-500">{helperText}</p>}
      </div>
    )
  }
)
Select.displayName = 'Select'
