import React, { useState, useEffect } from 'react'
import { forecastingService, ScenarioPreset, SimulationParameters, SimulationResult, PRESET_SCENARIOS } from '../services/forecastingService'
import { ForecastingHeader } from '../features/forecasting/components/ForecastingHeader'
import { ForecastingKpis } from '../features/forecasting/components/ForecastingKpis'
import { FanChart } from '../features/forecasting/components/FanChart'
import { SimulationSliders } from '../features/forecasting/components/SimulationSliders'
import { SensitivityTornado } from '../features/forecasting/components/SensitivityTornado'
import { ScenarioComparisonTable } from '../features/forecasting/components/ScenarioComparisonTable'

export const ForecastingPage: React.FC = () => {
  const [presets] = useState<ScenarioPreset[]>(PRESET_SCENARIOS)
  const [selectedPreset, setSelectedPreset] = useState<ScenarioPreset>(PRESET_SCENARIOS[0])
  const [params, setParams] = useState<SimulationParameters>(PRESET_SCENARIOS[0].params)
  const [result, setResult] = useState<SimulationResult | null>(null)
  const [isSimulating, setIsSimulating] = useState<boolean>(false)

  const executeSimulation = async (parameters: SimulationParameters, name: string) => {
    setIsSimulating(true)
    try {
      const res = await forecastingService.runSimulation(parameters, name)
      setResult(res)
    } finally {
      setIsSimulating(false)
    }
  }

  useEffect(() => {
    executeSimulation(params, selectedPreset.name)
  }, [])

  const handleSelectPreset = (preset: ScenarioPreset) => {
    setSelectedPreset(preset)
    setParams(preset.params)
    executeSimulation(preset.params, preset.name)
  }

  const handleParamsChange = (newParams: SimulationParameters) => {
    setParams(newParams)
    executeSimulation(newParams, 'Custom Simulation Scenario')
  }

  const handleReset = () => {
    const base = PRESET_SCENARIOS[0]
    setSelectedPreset(base)
    setParams(base.params)
    executeSimulation(base.params, base.name)
  }

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto p-2">
      {/* Header with Presets and Recalculate Trigger */}
      <ForecastingHeader
        presets={presets}
        selectedPresetId={selectedPreset.id}
        onSelectPreset={handleSelectPreset}
        onRunSimulation={() => executeSimulation(params, selectedPreset.name)}
        isSimulating={isSimulating}
      />

      {/* Live Projected Metrics */}
      {result && <ForecastingKpis result={result} />}

      {/* Main Charts & Controls Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: 12-Month Predictive Fan Chart */}
        <div className="lg:col-span-2 space-y-6">
          {result && <FanChart data={result.fanChartData} scenarioName={result.scenarioName} />}
          <SimulationSliders
            params={params}
            onChange={handleParamsChange}
            onReset={handleReset}
          />
        </div>

        {/* Right 1 Col: Sensitivity Tornado & Comparison Matrix */}
        <div className="space-y-6">
          {result && <SensitivityTornado drivers={result.sensitivityDrivers} />}
          <ScenarioComparisonTable
            currentScenarioId={selectedPreset.id}
            onSelectScenario={handleSelectPreset}
          />
        </div>
      </div>
    </div>
  )
}

export default ForecastingPage
