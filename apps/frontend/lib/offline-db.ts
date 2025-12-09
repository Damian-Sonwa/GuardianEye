import { openDB, DBSchema, IDBPDatabase } from 'idb'

// Use 'any' for Blob/File types as idb's DBSchema doesn't support them in types
// but IndexedDB supports them at runtime
interface ReportsDB {
  reports: {
    key: string
    value: {
      id: string
      description: string
      location: { lat: number; lng: number } | null
      media?: any
      timestamp: number
      synced: boolean
    }
    indexes: { 'by-timestamp': number; 'by-synced': boolean }
  }
  panicAlerts: {
    key: string
    value: {
      id: string
      location: { lat: number; lng: number } | null
      timestamp: number
      synced: boolean
    }
    indexes: { 'by-timestamp': number; 'by-synced': boolean }
  }
  // Security-specific offline stores
  evidence: {
    key: string
    value: {
      id: string
      caseId?: string
      file: any
      description?: string
      timestamp: number
      synced: boolean
    }
    indexes: { 'by-timestamp': number; 'by-synced': boolean; 'by-case': string }
  }
  cases: {
    key: string
    value: {
      id: string
      title: string
      description: string
      status: string
      priority: string
      assignedTo?: string
      timestamp: number
      synced: boolean
    }
    indexes: { 'by-timestamp': number; 'by-synced': boolean; 'by-status': string }
  }
  securityNotes: {
    key: string
    value: {
      id: string
      reportId?: string
      caseId?: string
      content: string
      timestamp: number
      synced: boolean
    }
    indexes: { 'by-timestamp': number; 'by-synced': boolean }
  }
}

let db: IDBPDatabase<any> | null = null

export async function getDB() {
  if (db) return db

  db = await openDB<any>('security-app-db', 2, {
    upgrade(db, oldVersion) {
      // Reports store (existing)
      if (!db.objectStoreNames.contains('reports')) {
        const reportsStore = db.createObjectStore('reports', {
          keyPath: 'id',
          autoIncrement: false,
        })
        reportsStore.createIndex('by-timestamp', 'timestamp')
        reportsStore.createIndex('by-synced', 'synced')
      }

      // Panic alerts store (existing)
      if (!db.objectStoreNames.contains('panicAlerts')) {
        const panicStore = db.createObjectStore('panicAlerts', {
          keyPath: 'id',
          autoIncrement: false,
        })
        panicStore.createIndex('by-timestamp', 'timestamp')
        panicStore.createIndex('by-synced', 'synced')
      }

      // Security-specific stores (new in version 2)
      if (oldVersion < 2) {
        // Evidence store
        const evidenceStore = db.createObjectStore('evidence', {
          keyPath: 'id',
          autoIncrement: false,
        })
        evidenceStore.createIndex('by-timestamp', 'timestamp')
        evidenceStore.createIndex('by-synced', 'synced')
        evidenceStore.createIndex('by-case', 'caseId')

        // Cases store
        const casesStore = db.createObjectStore('cases', {
          keyPath: 'id',
          autoIncrement: false,
        })
        casesStore.createIndex('by-timestamp', 'timestamp')
        casesStore.createIndex('by-synced', 'synced')
        casesStore.createIndex('by-status', 'status')

        // Security notes store
        const notesStore = db.createObjectStore('securityNotes', {
          keyPath: 'id',
          autoIncrement: false,
        })
        notesStore.createIndex('by-timestamp', 'timestamp')
        notesStore.createIndex('by-synced', 'synced')
      }
    },
  })

  return db
}

export async function saveReport(report: {
  description: string
  location: { lat: number; lng: number } | null
  media?: File | Blob
}) {
  const database = await getDB()
  const id = `report-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

  await database.put('reports', {
    id,
    ...report,
    timestamp: Date.now(),
    synced: false,
  })

  return id
}

export async function savePanicAlert(location: { lat: number; lng: number } | null) {
  const database = await getDB()
  const id = `panic-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

  await database.put('panicAlerts', {
    id,
    location,
    timestamp: Date.now(),
    synced: false,
  })

  return id
}

export async function getUnsyncedReports() {
  const database = await getDB()
  return database.getAllFromIndex('reports', 'by-synced', false)
}

export async function getUnsyncedPanicAlerts() {
  const database = await getDB()
  return database.getAllFromIndex('panicAlerts', 'by-synced', false)
}

export async function markReportSynced(id: string) {
  const database = await getDB()
  const report = await database.get('reports', id)
  if (report) {
    report.synced = true
    await database.put('reports', report)
  }
}

export async function markPanicSynced(id: string) {
  const database = await getDB()
  const alert = await database.get('panicAlerts', id)
  if (alert) {
    alert.synced = true
    await database.put('panicAlerts', alert)
  }
}

// Security-specific offline functions
export async function saveEvidence(evidence: {
  caseId?: string
  file: File | Blob
  description?: string
}) {
  const database = await getDB()
  const id = `evidence-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

  await database.put('evidence', {
    id,
    ...evidence,
    timestamp: Date.now(),
    synced: false,
  })

  return id
}

export async function saveCase(caseData: {
  title: string
  description: string
  status: string
  priority: string
  assignedTo?: string
}) {
  const database = await getDB()
  const id = `case-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

  await database.put('cases', {
    id,
    ...caseData,
    timestamp: Date.now(),
    synced: false,
  })

  return id
}

export async function saveSecurityNote(note: {
  reportId?: string
  caseId?: string
  content: string
}) {
  const database = await getDB()
  const id = `note-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

  await database.put('securityNotes', {
    id,
    ...note,
    timestamp: Date.now(),
    synced: false,
  })

  return id
}

export async function getUnsyncedEvidence() {
  const database = await getDB()
  return database.getAllFromIndex('evidence', 'by-synced', false)
}

export async function getUnsyncedCases() {
  const database = await getDB()
  return database.getAllFromIndex('cases', 'by-synced', false)
}

export async function getUnsyncedSecurityNotes() {
  const database = await getDB()
  return database.getAllFromIndex('securityNotes', 'by-synced', false)
}

