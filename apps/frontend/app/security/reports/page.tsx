'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button, Card, CardContent, CardHeader, CardTitle } from '@security-app/ui'
import { ArrowLeft, FileText, MapPin, Clock, AlertTriangle } from 'lucide-react'
import { useRoleGuard } from '@/lib/role-guard'
import { getAuthToken } from '@/lib/auth-storage'

export default function SecurityReportsPage() {
  const router = useRouter()
  const [reports, setReports] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  useRoleGuard(['SECURITY_OFFICER', 'SUPER_ADMIN'])

  useEffect(() => {
    loadReports()
  }, [])

  const loadReports = async () => {
    try {
      const token = getAuthToken()
      const response = await fetch('/api/reports', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setReports(data)
      }
    } catch (error) {
      console.error('Error loading reports:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background pb-20">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => router.push('/security/dashboard')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold">Reports Dashboard</h1>
          </div>
        </div>
      </header>

      <main className="flex-1 space-y-6 p-6">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-slate-600 dark:text-slate-400">Loading reports...</p>
          </div>
        ) : reports.length === 0 ? (
          <Card className="rounded-2xl">
            <CardContent className="p-12 text-center">
              <FileText className="mx-auto h-12 w-12 text-slate-400 mb-4" />
              <p className="text-slate-600 dark:text-slate-400">No reports available</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => (
              <Card key={report.id} className="rounded-2xl">
                <CardHeader className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{report.description}</CardTitle>
                      <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                        {report.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>Location captured</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{new Date(report.createdAt).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    {report.riskLevel && (
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        report.riskLevel === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400' :
                        report.riskLevel === 'medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400' :
                        'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                      }`}>
                        {report.riskLevel}
                      </div>
                    )}
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}



