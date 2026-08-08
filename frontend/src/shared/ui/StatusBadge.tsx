import React from 'react'
import type { NodeExecutionStatus } from '@/shared/types'
import { Badge } from './Badge'
import { CheckCircle2, Clock, Loader2, AlertTriangle, XCircle, ShieldAlert } from 'lucide-react'

export interface StatusBadgeProps {
  status: NodeExecutionStatus
  size?: 'sm' | 'md'
  showIcon?: boolean
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showIcon = true,
}) => {
  switch (status) {
    case 'running':
      return (
        <Badge variant="primary" size={size} pulseDot={!showIcon}>
          {showIcon && <Loader2 className="h-3 w-3 animate-spin text-cyan-400" />}
          <span>Running</span>
        </Badge>
      )
    case 'completed':
      return (
        <Badge variant="success" size={size} dot={!showIcon}>
          {showIcon && <CheckCircle2 className="h-3 w-3 text-emerald-400" />}
          <span>Completed</span>
        </Badge>
      )
    case 'waiting':
      return (
        <Badge variant="default" size={size} dot={!showIcon}>
          {showIcon && <Clock className="h-3 w-3 text-slate-400" />}
          <span>Waiting</span>
        </Badge>
      )
    case 'retry':
      return (
        <Badge variant="warning" size={size} dot={!showIcon}>
          {showIcon && <AlertTriangle className="h-3 w-3 text-amber-400" />}
          <span>Retrying</span>
        </Badge>
      )
    case 'failed':
      return (
        <Badge variant="destructive" size={size} dot={!showIcon}>
          {showIcon && <XCircle className="h-3 w-3 text-rose-400" />}
          <span>Failed</span>
        </Badge>
      )
    case 'requires_approval':
      return (
        <Badge variant="warning" size={size} pulseDot={!showIcon} className="border-amber-500/60 bg-amber-500/20 text-amber-300">
          {showIcon && <ShieldAlert className="h-3 w-3 text-amber-400" />}
          <span>Approval Needed</span>
        </Badge>
      )
    case 'idle':
    default:
      return (
        <Badge variant="outline" size={size}>
          <span>Idle</span>
        </Badge>
      )
  }
}
