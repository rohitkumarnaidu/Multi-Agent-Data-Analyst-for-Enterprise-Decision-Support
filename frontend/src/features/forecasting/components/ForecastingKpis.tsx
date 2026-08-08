import React from 'react'
import { DollarSign, Percent, ShieldCheck, TrendingUp, Sparkles } from 'lucide-react'
import { Card } from '../../../shared/ui/Card'
import { SimulationResult } from '../../../services/forecastingService'

interface ForecastingKpisProps {
  result: SimulationResult
}

export const ForecastingKpis: React.FC<ForecastingKpisProps> = ({ result }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
      {/* 1. Projected GMV */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Projected GMV
          </span>
          <div className="p-1.5 rounded-md bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400">
            <DollarSign className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            ${result.projectedGmv}M
          </span>
          <span
            className={`text-xs font-semibold px-1.5 py-0.2 rounded border ${
              result.gmvDeltaPct >= 0
                ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800'
                : 'text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800'
            }`}
          >
            {result.gmvDeltaPct >= 0 ? '+' : ''}
            {result.gmvDeltaPct}%
          </span>
        </div>
        <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
          Baseline: $148.2M annualized
        </span>
      </Card>

      {/* 2. Projected Gross Margin */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Simulated Margin
          </span>
          <div className="p-1.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
            <Percent className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            {result.projectedMarginPct}%
          </span>
          <span
            className={`text-xs font-semibold px-1.5 py-0.2 rounded border ${
              result.marginDeltaPct >= 0
                ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800'
                : 'text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800'
            }`}
          >
            {result.marginDeltaPct >= 0 ? '+' : ''}
            {result.marginDeltaPct}% pt
          </span>
        </div>
        <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
          Target: &gt; 35.0% operating margin
        </span>
      </Card>

      {/* 3. Forecasted SLA Breach Rate */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Forecasted SLA Breach
          </span>
          <div className="p-1.5 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            {result.forecastedSlaBreachRate}%
          </span>
          <span
            className={`text-xs font-semibold px-1.5 py-0.2 rounded border ${
              result.slaBreachDeltaPct <= 0
                ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800'
                : 'text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800'
            }`}
          >
            {result.slaBreachDeltaPct <= 0 ? '' : '+'}
            {result.slaBreachDeltaPct}%
          </span>
        </div>
        <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
          Current actuals: 7.8%
        </span>
      </Card>

      {/* 4. Recoverable Net Margin */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Recoverable Margin
          </span>
          <div className="p-1.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            <TrendingUp className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            ${result.projectedRecoveredMargin}M
          </span>
          <span className="text-[10px] font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 px-1.5 py-0.2 rounded">
            Estimated
          </span>
        </div>
        <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
          Via carrier tier optimization
        </span>
      </Card>

      {/* 5. Model Prediction Certainty */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Prediction Certainty
          </span>
          <div className="p-1.5 rounded-md bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            {result.confidenceScore}%
          </span>
          <span className="text-[10px] font-mono text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 px-1.5 py-0.2 rounded">
            R² = 0.94
          </span>
        </div>
        <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
          Monte Carlo (5k runs)
        </span>
      </Card>
    </div>
  )
}
