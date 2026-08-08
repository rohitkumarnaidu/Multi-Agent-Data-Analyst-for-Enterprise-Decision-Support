import React from 'react'
import { Check } from 'lucide-react'

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  description?: string
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className = '', label, description, checked, disabled, onChange, ...props }, ref) => {
    return (
      <label className={`inline-flex items-center gap-2.5 cursor-pointer select-none ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>
        <div className="relative flex items-center justify-center">
          <input
            type="checkbox"
            ref={ref}
            checked={checked}
            disabled={disabled}
            onChange={onChange}
            className="peer sr-only"
            {...props}
          />
          <div className="h-4 w-4 rounded border border-slate-700 bg-slate-950 transition-all peer-checked:bg-cyan-500 peer-checked:border-cyan-400 peer-focus-visible:ring-2 peer-focus-visible:ring-cyan-500/50 flex items-center justify-center">
            {checked && <Check className="h-3 w-3 text-slate-950 stroke-[3]" />}
          </div>
        </div>
        {(label || description) && (
          <div className="flex flex-col">
            {label && <span className="text-xs text-slate-200 font-medium">{label}</span>}
            {description && <span className="text-[10px] text-slate-400">{description}</span>}
          </div>
        )}
      </label>
    )
  }
)

Checkbox.displayName = 'Checkbox'
