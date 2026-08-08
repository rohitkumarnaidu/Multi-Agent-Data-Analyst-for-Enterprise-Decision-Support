import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CircularGaugeProps {
  value: number; // 0 to 100
  label: string;
  size?: number;
  strokeWidth?: number;
  className?: string;
  colorClass?: string;
}

export const CircularGauge: React.FC<CircularGaugeProps> = ({ 
  value, 
  label, 
  size = 64, 
  strokeWidth = 6,
  className,
  colorClass = 'text-blue-500'
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className={cn("flex flex-col items-center justify-center gap-2", className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-slate-100 dark:text-gray-800"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={cn("transition-all duration-1000 ease-out", colorClass)}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            {value}%
          </span>
        </div>
      </div>
      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium text-center">
        {label}
      </span>
    </div>
  );
};
