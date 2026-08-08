import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/shared/ui/Card'
import { Badge } from '@/shared/ui/Badge'
import { Button } from '@/shared/ui/Button'
import { useNavigate } from 'react-router-dom'
import { Building2, ArrowRight, AlertTriangle, CheckCircle2 } from 'lucide-react'
import type { ExecutiveDashboardData } from '@/services/dashboardService'
import { cn } from '@/shared/utils/cn'

interface DepartmentMatrixProps {
  departments: ExecutiveDashboardData['departmentMatrix']
}

export const DepartmentMatrix: React.FC<DepartmentMatrixProps> = ({ departments }) => {
  const navigate = useNavigate()

  return (
    <Card glow="none" className="p-5">
      <CardHeader className="p-0 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-cyan-400" />
            <div>
              <CardTitle>Department Performance & Risk Matrix</CardTitle>
              <CardDescription>Cross-functional margin health, SLA adherence, and anomaly concentrations</CardDescription>
            </div>
          </div>
          <Button
            size="xs"
            variant="ghost"
            rightIcon={<ArrowRight className="h-3 w-3" />}
            onClick={() => navigate('/workspace/analytics')}
          >
            Deep Dive
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-medium pb-2">
                <th className="py-2.5 px-3">Department</th>
                <th className="py-2.5 px-3">Revenue ($M)</th>
                <th className="py-2.5 px-3">Gross Margin</th>
                <th className="py-2.5 px-3">SLA Adherence</th>
                <th className="py-2.5 px-3">Anomalies</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {departments.map(dept => {
                const statusBadge = {
                  optimal: (
                    <Badge variant="success" size="sm">
                      <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                      Optimal
                    </Badge>
                  ),
                  warning: (
                    <Badge variant="warning" size="sm">
                      <AlertTriangle className="h-3 w-3 text-amber-400" />
                      Elevated
                    </Badge>
                  ),
                  critical: (
                    <Badge variant="destructive" size="sm" pulseDot>
                      Critical SLA
                    </Badge>
                  ),
                }[dept.status]

                return (
                  <tr
                    key={dept.id}
                    className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                    onClick={() => navigate(`/workspace/analytics?department=${encodeURIComponent(dept.name)}`)}
                  >
                    <td className="py-3 px-3 font-sans font-semibold text-slate-100 flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                      {dept.name}
                    </td>
                    <td className="py-3 px-3 text-slate-200 font-medium">${dept.revenue}M</td>
                    <td className="py-3 px-3">
                      <span
                        className={cn(
                          'font-semibold',
                          dept.marginPct >= 35
                            ? 'text-emerald-400'
                            : dept.marginPct >= 28
                            ? 'text-cyan-400'
                            : 'text-amber-400'
                        )}
                      >
                        {dept.marginPct}%
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={cn(
                              'h-full rounded-full',
                              dept.slaPct >= 98 ? 'bg-emerald-400' : 'bg-amber-400'
                            )}
                            style={{ width: `${dept.slaPct}%` }}
                          />
                        </div>
                        <span className="text-slate-300 text-[11px]">{dept.slaPct}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={cn(
                          'px-2 py-0.5 rounded text-[11px] font-bold',
                          dept.anomalyCount > 40
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : dept.anomalyCount > 15
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-slate-800 text-slate-400'
                        )}
                      >
                        {dept.anomalyCount}
                      </span>
                    </td>
                    <td className="py-3 px-3">{statusBadge}</td>
                    <td className="py-3 px-3 text-right">
                      <Button
                        size="xs"
                        variant="subtle"
                        onClick={e => {
                          e.stopPropagation()
                          navigate(`/workspace/ai?prompt=Analyze%20${encodeURIComponent(dept.name)}%20performance%20and%20anomalies`)
                        }}
                      >
                        Audit AI
                      </Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
