import React, { useState } from 'react'
import { Card } from '@/shared/ui/Card'
import { Badge } from '@/shared/ui/Badge'
import { Tabs } from '@/shared/ui/Tabs'
import {
  useLLMConfig,
  useUpdateLLMConfig,
  useHITLPolicies,
  useToggleHITLPolicy,
  useTokenUsage,
  useAuditLogs,
} from '@/hooks/useSettings'
import { LLMConfigCard } from '@/features/settings/components/LLMConfigCard'
import { HITLPoliciesCard } from '@/features/settings/components/HITLPoliciesCard'
import { TokenCostCard } from '@/features/settings/components/TokenCostCard'
import { AuditTrailCard } from '@/features/settings/components/AuditTrailCard'
import {
  Sliders,
  Cpu,
  ShieldCheck,
  DollarSign,
  History,
  CheckCircle2,
  Lock,
} from 'lucide-react'

export const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'llm' | 'hitl' | 'tokens' | 'audit'>('llm')

  const { data: llmConfig } = useLLMConfig()
  const { mutate: updateConfig, isPending: isUpdatingConfig } = useUpdateLLMConfig()

  const { data: hitlPolicies } = useHITLPolicies()
  const { mutate: togglePolicy, isPending: isTogglingPolicy } = useToggleHITLPolicy()

  const { data: tokenUsage } = useTokenUsage()
  const { data: auditLogs } = useAuditLogs()

  const tabs = [
    { id: 'llm', label: 'LLM Routing & Temperature' },
    { id: 'hitl', label: 'HITL Guardrails & Policies' },
    { id: 'tokens', label: 'Token & Cost Telemetry' },
    { id: 'audit', label: 'Cryptographic Audit Trail' },
  ]

  return (
    <div className="space-y-6">
      {/* 1. Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-100">
              System Administration & AI Governance
            </h1>
            <Badge variant="cyber" size="sm">
              Enterprise SOC2 Type II
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Foundation model routing, deterministic guardrails, human-in-the-loop policies, and immutable audit logs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="success" size="sm" pulseDot>
            Vault KMS Connected
          </Badge>
        </div>
      </div>

      {/* 2. Main Settings Card */}
      <Card glow="none" className="p-6 bg-slate-900/90 border-slate-800 space-y-5">
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onChange={t => setActiveTab(t as any)}
          variant="underline"
        />

        {/* Tab 1: LLM Config */}
        {activeTab === 'llm' && llmConfig && (
          <LLMConfigCard
            config={llmConfig}
            onSave={updateConfig}
            isSaving={isUpdatingConfig}
          />
        )}

        {/* Tab 2: HITL Policies */}
        {activeTab === 'hitl' && hitlPolicies && (
          <HITLPoliciesCard
            policies={hitlPolicies}
            onTogglePolicy={(policyId, enabled) => togglePolicy({ policyId, enabled })}
            isToggling={isTogglingPolicy}
          />
        )}

        {/* Tab 3: Token Usage */}
        {activeTab === 'tokens' && tokenUsage && (
          <TokenCostCard usage={tokenUsage} />
        )}

        {/* Tab 4: Audit Trail */}
        {activeTab === 'audit' && auditLogs && (
          <AuditTrailCard logs={auditLogs} />
        )}
      </Card>
    </div>
  )
}

export default SettingsPage
