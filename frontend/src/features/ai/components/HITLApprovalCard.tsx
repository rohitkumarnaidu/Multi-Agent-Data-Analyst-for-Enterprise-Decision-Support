import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/shared/ui/Card'
import { Badge } from '@/shared/ui/Badge'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { ShieldAlert, CheckCircle2, XCircle, Edit3, UserCheck } from 'lucide-react'
import type { RecommendedAction } from '@/shared/types'
import { useToast } from '@/shared/ui/Toast'

interface HITLApprovalCardProps {
  action: RecommendedAction
  onApprove: () => void
  onReject: (reason?: string) => void
  onModify: (modifiedText: string) => void
}

export const HITLApprovalCard: React.FC<HITLApprovalCardProps> = ({
  action,
  onApprove,
  onReject,
  onModify,
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [modifiedText, setModifiedText] = useState(action.action)
  const [status, setStatus] = useState<'pending' | 'approved' | 'rejected'>('pending')
  const { showToast } = useToast()

  const handleApprove = () => {
    setStatus('approved')
    onApprove()
    showToast({
      title: 'Action Approved by Human Operator',
      message: 'Decision signed and logged to governance audit log.',
      type: 'success',
    })
  }

  const handleReject = () => {
    setStatus('rejected')
    onReject('Rejected by human operator during execution review')
    showToast({
      title: 'Action Rejected',
      message: 'Action was declined. Agent workflow state updated.',
      type: 'info',
    })
  }

  const handleSaveModification = () => {
    setIsEditing(false)
    onModify(modifiedText)
    showToast({
      title: 'Action Parameters Modified',
      message: 'Updated action parameters submitted to supervisor.',
      type: 'info',
    })
  }

  if (status === 'approved') {
    return (
      <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between shadow-glow-emerald">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span className="font-semibold">Action Approved & Dispatched</span>
        </div>
        <span className="font-mono text-[10px] text-emerald-400">Status: Signed</span>
      </div>
    )
  }

  if (status === 'rejected') {
    return (
      <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <XCircle className="h-4 w-4 text-rose-400" />
          <span className="font-semibold">Action Declined</span>
        </div>
        <span className="font-mono text-[10px] text-rose-400">Status: Rejected</span>
      </div>
    )
  }

  return (
    <Card glow="amber" className="p-4 border-amber-500/50 bg-amber-950/20">
      <CardHeader className="p-0 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/40">
              <UserCheck className="h-4 w-4" />
            </div>
            <CardTitle className="text-amber-300 text-sm">Human Approval Required</CardTitle>
          </div>
          <Badge variant="destructive" size="sm" pulseDot>
            {action.priority.toUpperCase()}
          </Badge>
        </div>
        <CardDescription className="text-amber-200/70 text-xs">
          Executive decision barrier triggered: High financial exposure or critical operational modification.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0 space-y-3 pt-1">
        {/* Action Description */}
        <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="text-xs text-slate-200">
            {isEditing ? (
              <div className="space-y-2">
                <textarea
                  value={modifiedText}
                  onChange={e => setModifiedText(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                  rows={3}
                />
                <div className="flex justify-end gap-2">
                  <Button size="xs" variant="ghost" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button size="xs" variant="primary" onClick={handleSaveModification}>
                    Save Changes
                  </Button>
                </div>
              </div>
            ) : (
              <p className="font-medium text-slate-100">{action.action}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-400 border-t border-slate-800/80 pt-2">
            <div>
              <span className="text-slate-500">Owner:</span>{' '}
              <span className="text-slate-300 font-semibold">{action.owner}</span>
            </div>
            <div>
              <span className="text-slate-500">Impact:</span>{' '}
              <span className="text-amber-300 font-semibold">{action.expected_impact}</span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-2">
          <Button
            size="xs"
            variant="ghost"
            leftIcon={<Edit3 className="h-3 w-3" />}
            onClick={() => setIsEditing(true)}
          >
            Modify
          </Button>

          <Button
            size="xs"
            variant="destructive"
            leftIcon={<XCircle className="h-3 w-3" />}
            onClick={handleReject}
          >
            Reject
          </Button>

          <Button
            size="xs"
            variant="success"
            leftIcon={<CheckCircle2 className="h-3.5 w-3.5" />}
            onClick={handleApprove}
          >
            Approve Action
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default HITLApprovalCard
