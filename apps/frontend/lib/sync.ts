import { getUnsyncedReports, getUnsyncedPanicAlerts, markReportSynced, markPanicSynced } from './offline-db'

export async function syncOfflineData() {
  if (!navigator.onLine) {
    console.log('Device is offline, skipping sync')
    return
  }

  // Sync reports
  const unsyncedReports = await getUnsyncedReports()
  for (const report of unsyncedReports) {
    try {
      const formData = new FormData()
      formData.append('description', report.description)
      formData.append('location', JSON.stringify(report.location))
      if (report.media) {
        formData.append('media', report.media)
      }

      const response = await fetch('/api/reports', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        await markReportSynced(report.id)
      }
    } catch (error) {
      console.error('Error syncing report:', error)
    }
  }

  // Sync panic alerts
  const unsyncedPanicAlerts = await getUnsyncedPanicAlerts()
  for (const alert of unsyncedPanicAlerts) {
    try {
      const response = await fetch('/api/panic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location: alert.location,
          timestamp: new Date(alert.timestamp).toISOString(),
        }),
      })

      if (response.ok) {
        await markPanicSynced(alert.id)
      }
    } catch (error) {
      console.error('Error syncing panic alert:', error)
    }
  }
}

// Auto-sync when online
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    syncOfflineData()
  })

  // Periodic sync
  setInterval(syncOfflineData, 60000) // Every minute
}

