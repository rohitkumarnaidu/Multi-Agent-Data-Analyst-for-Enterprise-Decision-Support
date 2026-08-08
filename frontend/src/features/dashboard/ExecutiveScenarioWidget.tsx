import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/shared/ui/Card'
import { Slider } from '@/shared/ui/Slider'
import { Button } from '@/shared/ui/Button'
import { useNavigate } from 'react-router-dom'
import { Calculator, Sparkles, TrendingUp, AlertTriangle, ArrowRight } from 'lucide-react'
import { useScenarioSimulation } from '@/hooks/useDashboardData'
import type { WhatIfScenarioResult } from '@/shared/types'

export const ExecutiveScenarioWidget: React.FC = () => {
  const navigate = useNavigate()
  const [priceChange, setPriceChange] = useState<number>(5)
  const [volumeChange, setVolumeChange] = useState<number>(8)
  const [costInflation, setCostInflation] = useState<number>(3)

  const [simResult, setSimResult] = useState<WhatIfScenarioResult | null>(null)
  const { mutate: runSim, isPending } = useScenarioSimulation()

  useEffect(() => {
    runSim(
      {
        priceChangePct: priceChange,
        volumeChangePct: volumeChange,
        costInflationPct: costInflation,
      },
      {
        onSuccess: data => setSimResult(data),
      }
    )
  }, [priceChange, volumeChange, costInflation, runSim])

  return (
    <Card glow="cyan" className="p-5">
      <CardHeader className="p-0 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Calculator className="h-4 w-4" />
            </div>
            <div>
              <CardTitle>Executive What-If Scenario Sandbox</CardTitle>
              <CardDescription>
                Tier 1 deterministic recalculation engine with instant confidence intervals
              </CardDescription>
            </div>
          </div>
          <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
            Closed-Form Math
          </span>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          {/* Sliders Area */}
          <div className="space-y-4 lg:border-r lg:border-slate-800 lg:pr-6">
            <Slider
              label="Price Adjustment (%)"
              value={priceChange}
              min={-15}
              max={25}
              step={1}
              unit="%"
              onChange={setPriceChange}
            />

            <Slider
              label="Sales Volume Growth (%)"
              value={volumeChange}
              min={-15}
              max={30}
              step={1}
              unit="%"
              onChange={setVolumeChange}
            />

            <Slider
              label="Cost Inflation / COGS (%)"
              value={costInflation}
              min={-5}
              max={20}
              step={1}
              unit="%"
              onChange={setCostInflation}
            />
          </div>

          {/* Real-time Projected Metric Cards */}
          <div className="lg:col-span-2 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
              {/* Projected Revenue */}
              <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/80 space-y-1">
                <span className="font-sans text-[11px] text-slate-400 font-medium uppercase">
                  Projected Revenue
                </span>
                <div className="text-xl font-bold text-slate-100">
                  ${simResult?.simulated_metrics.revenue ?? '28.18'}M
                </div>
                <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  {simResult ? `${simResult.delta_pct.revenue > 0 ? '+' : ''}${simResult.delta_pct.revenue}%` : '+13.4%'}
                </div>
              </div>

              {/* Projected Net Profit */}
              <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/40 space-y-1 shadow-glow-cyan">
                <span className="font-sans text-[11px] text-cyan-300 font-medium uppercase">
                  Projected Net Profit
                </span>
                <div className="text-xl font-bold text-cyan-300">
                  ${simResult?.simulated_metrics.net_profit ?? '9.82'}M
                </div>
                <div className="text-xs text-cyan-400 font-semibold flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  {simResult ? `${simResult.delta_pct.net_profit > 0 ? '+' : ''}${simResult.delta_pct.net_profit}%` : '+15.5%'}
                </div>
              </div>

              {/* Projected Margin */}
              <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/80 space-y-1">
                <span className="font-sans text-[11px] text-slate-400 font-medium uppercase">
                  Gross Margin
                </span>
                <div className="text-xl font-bold text-slate-100">
                  {simResult?.simulated_metrics.gross_margin_pct ?? '34.85'}%
                </div>
                <div className="text-xs text-slate-400">
                  95% CI: ${simResult?.confidence_intervals.lower_bound ?? '9.3'}M – $
                  {simResult?.confidence_intervals.upper_bound ?? '10.3'}M
                </div>
              </div>
            </div>

            {/* Risk Warnings (if triggered) */}
            {simResult?.risk_flags && simResult.risk_flags.length > 0 && (
              <div className="p-3 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400" />
                <span>{simResult.risk_flags[0]}</span>
              </div>
            )}

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-400">
                Formula: <code className="text-cyan-400">Net Profit = (R × (1+P)(1+V)) − (C × (1+I)(1+V))</code>
              </span>
              <Button
                size="sm"
                variant="cyber"
                leftIcon={<Sparkles className="h-3.5 w-3.5 text-cyan-200" />}
                rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
                onClick={() =>
                  navigate(
                    `/workspace/ai?prompt=Execute%20Tier-2%20XGBoost%20What-If%20Simulation%20with%20Price%20%2B${priceChange}%25%2C%20Volume%20%2B${volumeChange}%25%2C%20Cost%20%2B${costInflation}%25`
                  )
                }
              >
                Launch Tier-2 ML Simulation
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
