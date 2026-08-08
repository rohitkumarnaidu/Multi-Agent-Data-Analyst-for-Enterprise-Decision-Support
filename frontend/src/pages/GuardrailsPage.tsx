import React, { useState, useEffect } from 'react'
import { guardrailService, GuardrailPolicy, GuardrailStats as StatsType } from '../services/guardrailService'
import { GuardrailsHeader } from '../features/guardrails/components/GuardrailsHeader'
import { GuardrailStats } from '../features/guardrails/components/GuardrailStats'
import { PolicyRuleCard } from '../features/guardrails/components/PolicyRuleCard'
import { GuardrailSimulationTester } from '../features/guardrails/components/GuardrailSimulationTester'

export const GuardrailsPage: React.FC = () => {
  const [stats, setStats] = useState<StatsType | null>(null)
  const [policies, setPolicies] = useState<GuardrailPolicy[]>([])
  const [isSaving, setIsSaving] = useState<boolean>(false)

  const loadData = async () => {
    const [s, pols] = await Promise.all([
      guardrailService.getStats(),
      guardrailService.getPolicies(),
    ])
    setStats(s)
    setPolicies(pols)
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleToggleEnabled = (id: string) => {
    setPolicies(prev =>
      prev.map(p => (p.id === id ? { ...p, enabled: !p.enabled } : p))
    )
  }

  const handleChangeStrictness = (id: string, strictness: 'strict' | 'advisory' | 'disabled') => {
    setPolicies(prev =>
      prev.map(p => (p.id === id ? { ...p, strictness } : p))
    )
  }

  const handleChangeThreshold = (id: string, thresholdValue: number) => {
    setPolicies(prev =>
      prev.map(p => (p.id === id ? { ...p, thresholdValue } : p))
    )
  }

  const handleSavePolicies = async () => {
    setIsSaving(true)
    try {
      await guardrailService.savePolicies(policies)
      const s = await guardrailService.getStats()
      setStats(s)
    } finally {
      setIsSaving(false)
    }
  }

  const handleResetDefaults = async () => {
    const pols = await guardrailService.getPolicies()
    setPolicies(pols)
  }

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto p-2">
      {/* Header */}
      <GuardrailsHeader
        onResetDefaults={handleResetDefaults}
        onSavePolicies={handleSavePolicies}
        isSaving={isSaving}
      />

      {/* Live Policy Stats */}
      {stats && <GuardrailStats stats={stats} />}

      {/* Interactive Guardrail Sandbox / Simulator */}
      <GuardrailSimulationTester />

      {/* Active Guardrail Policy Rule Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-cyber-text">
            Enterprise Governance Policy Registry ({policies.length} Rules)
          </h3>
          <span className="text-xs text-cyber-muted">
            Configured with real-time AST validation
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {policies.map(policy => (
            <PolicyRuleCard
              key={policy.id}
              policy={policy}
              onToggleEnabled={handleToggleEnabled}
              onChangeStrictness={handleChangeStrictness}
              onChangeThreshold={handleChangeThreshold}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default GuardrailsPage
