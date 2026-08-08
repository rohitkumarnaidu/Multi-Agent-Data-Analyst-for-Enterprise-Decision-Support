import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ConfidenceMeterProps {
  score: number; // 0.0 to 1.0
  label?: string;
  className?: string;
}

export const ConfidenceMeter: React.FC<ConfidenceMeterProps> = ({ score, label, className }) => {
  const percentage = Math.round(score * 100);
  
  const getColor = () => {
    if (score >= 0.9) return 'bg-emerald-500';
    if (score >= 0.7) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const getTextColor = () => {
    if (score >= 0.9) return 'text-emerald-500';
    if (score >= 0.7) return 'text-amber-500';
    return 'text-red-500';
  };

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <div className="flex justify-between items-center text-xs">
        <span className="text-slate-500 dark:text-slate-400 font-medium">{label || 'Confidence'}</span>
        <span className={cn('font-bold', getTextColor())}>{percentage}%</span>
      </div>
      <div className="h-1.5 w-full bg-slate-100 dark:bg-gray-800 rounded-full overflow-hidden">
        <div 
          className={cn('h-full rounded-full transition-all duration-1000 ease-out', getColor())} 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
