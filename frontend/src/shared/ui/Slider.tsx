import React from 'react'
import { cn } from '@/shared/utils/cn'

export interface SliderProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  label?: string
  unit?: string
  disabled?: boolean
  className?: string
}

export const Slider: React.FC<SliderProps> = ({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  unit = '',
  disabled = false,
  className,
}) => {
  const percentage = ((value - min) / (max - min)) * 100

  return (
    <div className={cn('w-full space-y-2 select-none', className)}>
      <div className="flex items-center justify-between text-xs">
        {label && <span className="font-medium text-slate-300">{label}</span>}
        <span className="font-mono text-cyan-400 font-semibold">
          {value}
          {unit}
        </span>
      </div>
      <div className="relative flex items-center">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          onChange={e => onChange(Number(e.target.value))}
          className={cn(
            'w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed',
            'range-sm'
          )}
          style={{
            background: `linear-gradient(to right, #06B6D4 0%, #06B6D4 ${percentage}%, #1E293B ${percentage}%, #1E293B 100%)`,
          }}
        />
      </div>
    </div>
  )
}
