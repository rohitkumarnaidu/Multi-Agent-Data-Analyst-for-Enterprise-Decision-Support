import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/shared/ui/Card'
import { Badge } from '@/shared/ui/Badge'
import { Button } from '@/shared/ui/Button'
import { useNavigate } from 'react-router-dom'
import { AlertOctagon, ShieldAlert, ArrowUpRight, Zap } from 'lucide-react'
import type { ExecutiveDashboardData } from '@/services/dashboardService'
import { useToast } from '@/shared/ui/Toast'

interface ExecutiveAnomalyFeedProps {
  anomalies: ExecutiveDashboardData['criticalAnomalies']
}

export const ExecutiveAnomalyFeed: React.FC<ExecutiveAnomalyFeedProps> = ({ anomalies }) => {
  const navigate = useNavigate()
  const { showToast } = useToast()

  const handleMitigate = (anom: ExecutiveDashboardData['criticalAnomalies'][0]) => {
    showToast({
      title: `Action Dispatched for ${anom.recordId}`,
      message: `Executed: "${anom.suggestedAction}" via Decision Governance Agent`,
      type: 'success',
    })
  }

  return (
    <Card glow="rose" className="p-5">
      <CardHeader className="p-0 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <AlertOctagon className="h-4 w-4" />
            </div>
            <div>
              <CardTitle>Executive Risk & Anomaly Alerts</CardTitle>
              <CardDescription>XGBoost Isolation & SHAP detected high-exposure financial outliers</CardDescription>
            </div>
          </div>
          <Button
            size="xs"
            variant="ghost"
            rightIcon={<ArrowUpRight className="h-3 w-3" />}
            onClick={() => navigate('/workspace/risk')}
          >
            All 142 Anomalies
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0 space-y-3">
        {anomalies.map(anom => (
          <div
            key={anom.id}
            className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60 hover:border-rose-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono font-bold text-xs text-slate-100">{anom.recordId}</span>
                <span className="text-slate-500">•</span>
                <span className="text-xs text-slate-300 font-medium">{anom.department}</span>
                <Badge
                  variant={anom.severity === 'CRITICAL' ? 'destructive' : 'warning'}
                  size="sm"
                  pulseDot={anom.severity === 'CRITICAL'}
                >
                  {anom.severity} ({anom.anomalyScore.toFixed(3)})
                </Badge>
                <span className="text-[10px] font-mono text-slate-400">
                  {anom.detectedAt}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                <span className="text-rose-400 font-semibold font-mono">
                  ${(anom.financialImpact / 1000).toFixed(1)}k Exposure:
                </span>{' '}
                {anom.suggestedAction}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                size="xs"
                variant="subtle"
                onClick={() =>
                  navigate(
                    `/workspace/ai?prompt=Investigate%20anomaly%20${anom.recordId}%20in%20${encodeURIComponent(
                      anom.department
                    )}`
                  )
                }
              >
                Inspect
              </Button>
              <Button
                size="xs"
                variant="destructive"
                leftIcon={<Zap className="h-3 w-3" />}
                onClick={() => handleMitigate(anom)}
              >
                Mitigate
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
