import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Loader2, CheckCircle2, XCircle, AlertCircle, Clock } from 'lucide-react';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type StatusType = 'idle' | 'running' | 'completed' | 'failed' | 'warning' | 'active' | 'inactive';

interface StatusChipProps {
  status: StatusType;
  label?: string;
  className?: string;
  pulse?: boolean;
}

export const StatusChip: React.FC<StatusChipProps> = ({ status, label, className, pulse }) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'completed':
      case 'active':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'failed':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'running':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'warning':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'idle':
      case 'inactive':
      default:
        return 'bg-slate-500/10 text-slate-500 dark:text-slate-400 border-slate-500/20';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'completed':
      case 'active':
        return <CheckCircle2 className="w-3.5 h-3.5" />;
      case 'failed':
        return <XCircle className="w-3.5 h-3.5" />;
      case 'running':
        return <Loader2 className="w-3.5 h-3.5 animate-spin" />;
      case 'warning':
        return <AlertCircle className="w-3.5 h-3.5" />;
      case 'idle':
      case 'inactive':
      default:
        return <Clock className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border relative',
        getStatusStyles(),
        className
      )}
    >
      {pulse && (status === 'running' || status === 'active') && (
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-40"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-current opacity-70"></span>
        </span>
      )}
      {getStatusIcon()}
      <span className="capitalize">{label || status}</span>
    </div>
  );
};
