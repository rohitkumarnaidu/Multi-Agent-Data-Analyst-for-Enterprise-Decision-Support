import React, { useState, useEffect } from 'react'
import { riskService, RiskAnomaly, RiskStats as StatsType, RadarRiskFactor } from '../services/riskService'
import { RiskHeader } from '../features/risk/components/RiskHeader'
import { RiskStats } from '../features/risk/components/RiskStats'
import { RiskDistributionChart } from '../features/risk/components/RiskDistributionChart'
import { AnomalyTriageTable } from '../features/risk/components/AnomalyTriageTable'
import { RemediationModal } from '../features/risk/components/RemediationModal'

export const RiskCenterPage: React.FC = () => {
  const [stats, setStats] = useState<StatsType | null>(null)
  const [radarFactors, setRadarFactors] = useState<RadarRiskFactor[]>([])
  const [anomalies, setAnomalies] = useState<RiskAnomaly[]>([])
  const [selectedAnomaly, setSelectedAnomaly] = useState<RiskAnomaly | null>(null)
  const [isScanning, setIsScanning] = useState<boolean>(false)
  const [isRemediating, setIsRemediating] = useState<boolean>(false)

  const loadData = async () => {
    setIsScanning(true)
    try {
      const [s, rad, anom] = await Promise.all([
        riskService.getStats(),
        riskService.getRadarRiskFactors(),
        riskService.getAnomalies(),
      ])
      setStats(s)
      setRadarFactors(rad)
      setAnomalies(anom)
    } finally {
      setIsScanning(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleConfirmRemediation = async () => {
    if (!selectedAnomaly) return
    setIsRemediating(true)
    try {
      // Simulate remediation
      await new Promise(resolve => setTimeout(resolve, 800))
      setAnomalies(prev => prev.filter(a => a.id !== selectedAnomaly.id))
      setSelectedAnomaly(null)
    } finally {
      setIsRemediating(false)
    }
  }

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto p-2">
      {/* Header */}
      {stats && (
        <RiskHeader
          totalAnomalies={stats.totalAnomalies}
          onScan={loadData}
          isScanning={isScanning}
        />
      )}

      {/* Live Risk Stats */}
      {stats && <RiskStats stats={stats} />}

      {/* Risk Distribution Charts */}
      {radarFactors.length > 0 && <RiskDistributionChart factors={radarFactors} />}

      {/* Triage Queue Table */}
      <AnomalyTriageTable
        anomalies={anomalies}
        onSelectRemediate={setSelectedAnomaly}
      />

      {/* Remediation Action Modal */}
      <RemediationModal
        anomaly={selectedAnomaly}
        onClose={() => setSelectedAnomaly(null)}
        onConfirm={handleConfirmRemediation}
        isRemediating={isRemediating}
      />
    </div>
  )
}

export default RiskCenterPage
