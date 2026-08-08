import React, { useState, useEffect } from 'react'
import { activityService, ActivityEvent, ActivityFilterOptions, ActivityStats as StatsType } from '../services/activityService'
import { ActivityHeader } from '../features/activity/components/ActivityHeader'
import { ActivityStats } from '../features/activity/components/ActivityStats'
import { ActivityFilters } from '../features/activity/components/ActivityFilters'
import { ActivityTimeline } from '../features/activity/components/ActivityTimeline'
import { EventDetailDrawer } from '../features/activity/components/EventDetailDrawer'

export const ActivityPage: React.FC = () => {
  const [stats, setStats] = useState<StatsType | null>(null)
  const [events, setEvents] = useState<ActivityEvent[]>([])
  const [filters, setFilters] = useState<ActivityFilterOptions>({ eventType: 'all' })
  const [selectedEvent, setSelectedEvent] = useState<ActivityEvent | null>(null)
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false)

  const loadData = async () => {
    setIsRefreshing(true)
    try {
      const [s, evts] = await Promise.all([
        activityService.getStats(),
        activityService.getEvents(filters),
      ])
      setStats(s)
      setEvents(evts)
    } finally {
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [filters])

  const handleExport = () => {
    const jsonStr = JSON.stringify(events, null, 2)
    const blob = new Blob([jsonStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `datasphere-audit-trail-${new Date().toISOString().split('T')[0]}.json`
    a.click()
  }

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto p-2">
      {/* Header */}
      {stats && (
        <ActivityHeader
          systemVerificationHash={stats.systemVerificationHash}
          onExport={handleExport}
        />
      )}

      {/* Live Telemetry Stats */}
      {stats && <ActivityStats stats={stats} />}

      {/* Filter Bar */}
      <ActivityFilters
        filters={filters}
        onChange={setFilters}
        onRefresh={loadData}
        isRefreshing={isRefreshing}
      />

      {/* Main Activity Timeline Stream */}
      <ActivityTimeline
        events={events}
        onSelectEvent={setSelectedEvent}
      />

      {/* Event Inspection Drawer */}
      <EventDetailDrawer
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </div>
  )
}

export default ActivityPage
