import React from 'react'
import { cn } from '@/shared/utils/cn'

export interface SwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  label?: string
  description?: string
  className?: string
}

export const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  disabled = false,
  label,
  description,
  className,
}) => {
  return (
    <label
      className={cn(
        'flex items-center justify-between cursor-pointer gap-3 select-none',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {(label || description) && (
        <div className="flex flex-col">
          {label && <span className="text-xs font-medium text-slate-200">{label}</span>}
          {description && <span className="text-[11px] text-slate-400">{description}</span>}
        </div>
      )}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={cn(
          'relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500',
          checked ? 'bg-cyan-500 shadow-glow-cyan' : 'bg-slate-700'
        )}
      >
        <span
          className={cn(
            'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out',
            checked ? 'translate-x-4 bg-slate-950' : 'translate-x-0'
          )}
        />
      </button>
    </label>
  )
}
