import React from 'react'
import { Sliders, RotateCcw } from 'lucide-react'
import { Card } from '../../../shared/ui/Card'
import { Button } from '../../../shared/ui/Button'
import { SimulationParameters } from '../../../services/forecastingService'

interface SimulationSlidersProps {
  params: SimulationParameters
  onChange: (newParams: SimulationParameters) => void
  onReset: () => void
}

export const SimulationSliders: React.FC<SimulationSlidersProps> = ({
  params,
  onChange,
  onReset,
}) => {
  const updateParam = (key: keyof SimulationParameters, value: number) => {
    onChange({
      ...params,
      [key]: value,
    })
  }

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-sky-600 dark:text-sky-400" />
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Multi-Variable Simulation Dials
          </h3>
        </div>
        <Button
          variant="ghost"
          size="xs"
          onClick={onReset}
          leftIcon={<RotateCcw className="w-3 h-3" />}
        >
          Reset Baseline
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-4">
        {/* 1. Carrier Rate Delta */}
        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-slate-600 dark:text-slate-400 font-medium">Carrier Base Rate Delta</span>
            <span
              className={`font-mono font-bold ${
                params.carrierRateDelta < 0
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : params.carrierRateDelta > 0
                  ? 'text-rose-600 dark:text-rose-400'
                  : 'text-slate-900 dark:text-slate-100'
              }`}
            >
              {params.carrierRateDelta > 0 ? '+' : ''}
              {params.carrierRateDelta.toFixed(2)} $/km
            </span>
          </div>
          <input
            type="range"
            min="-0.20"
            max="0.30"
            step="0.01"
            value={params.carrierRateDelta}
            onChange={e => updateParam('carrierRateDelta', parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1">
            <span>-0.20 (Negotiation)</span>
            <span>+0.30 (Inflation)</span>
          </div>
        </div>

        {/* 2. Expedited Ratio */}
        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-slate-600 dark:text-slate-400 font-medium">Expedited Ratio</span>
            <span className="font-mono font-bold text-sky-600 dark:text-sky-400">
              {params.expeditedRatio}%
            </span>
          </div>
          <input
            type="range"
            min="5"
            max="40"
            step="1"
            value={params.expeditedRatio}
            onChange={e => updateParam('expeditedRatio', parseInt(e.target.value))}
            className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1">
            <span>5% (Cost Saving)</span>
            <span>40% (Speed Priority)</span>
          </div>
        </div>

        {/* 3. Fuel Surcharge Delta */}
        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-slate-600 dark:text-slate-400 font-medium">Fuel Surcharge Delta</span>
            <span
              className={`font-mono font-bold ${
                params.fuelSurchargeDelta > 0
                  ? 'text-rose-600 dark:text-rose-400'
                  : params.fuelSurchargeDelta < 0
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-slate-900 dark:text-slate-100'
              }`}
            >
              {params.fuelSurchargeDelta > 0 ? '+' : ''}
              {params.fuelSurchargeDelta}%
            </span>
          </div>
          <input
            type="range"
            min="-15"
            max="25"
            step="1"
            value={params.fuelSurchargeDelta}
            onChange={e => updateParam('fuelSurchargeDelta', parseInt(e.target.value))}
            className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1">
            <span>-15% (Hedge)</span>
            <span>+25% (Spike)</span>
          </div>
        </div>

        {/* 4. Headcount Delta */}
        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-slate-600 dark:text-slate-400 font-medium">Headcount Delta</span>
            <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
              {params.headcountDelta > 0 ? '+' : ''}
              {params.headcountDelta}%
            </span>
          </div>
          <input
            type="range"
            min="-20"
            max="50"
            step="5"
            value={params.headcountDelta}
            onChange={e => updateParam('headcountDelta', parseInt(e.target.value))}
            className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1">
            <span>-20%</span>
            <span>+50% (Expansion)</span>
          </div>
        </div>

        {/* 5. Avg Distance (km) */}
        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-slate-600 dark:text-slate-400 font-medium">Avg Shipment Distance</span>
            <span className="font-mono font-bold text-sky-600 dark:text-sky-400">
              {params.avgDistanceKm} km
            </span>
          </div>
          <input
            type="range"
            min="300"
            max="1200"
            step="50"
            value={params.avgDistanceKm}
            onChange={e => updateParam('avgDistanceKm', parseInt(e.target.value))}
            className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1">
            <span>300 km (Regional)</span>
            <span>1200 km (Long Haul)</span>
          </div>
        </div>

        {/* 6. Target SLA Hours */}
        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-slate-600 dark:text-slate-400 font-medium">Target SLA Window</span>
            <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
              {params.targetSlaHours} hrs
            </span>
          </div>
          <input
            type="range"
            min="24"
            max="72"
            step="4"
            value={params.targetSlaHours}
            onChange={e => updateParam('targetSlaHours', parseInt(e.target.value))}
            className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1">
            <span>24 hrs (Strict)</span>
            <span>72 hrs (Flexible)</span>
          </div>
        </div>
      </div>
    </Card>
  )
}
