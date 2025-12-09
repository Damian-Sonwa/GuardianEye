'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button, Card, CardContent, CardHeader, CardTitle } from '@security-app/ui'
import { BarChart3, ArrowLeft, Loader2, TrendingUp, TrendingDown, MapPin } from 'lucide-react'
import { useRoleGuard } from '@/lib/role-guard'
import { getAuthToken } from '@/lib/auth-storage'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default function AnalyticsPage() {
  const router = useRouter()
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useRoleGuard(['SUPER_ADMIN'])

  useEffect(() => {
    loadAnalytics()
  }, [])

  const loadAnalytics = async () => {
    try {
      const token = getAuthToken()
      if (!token) {
        router.push('/auth')
        return
      }

      const response = await fetch('/api/analytics', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setAnalytics(data)
      }
    } catch (error) {
      console.error('Error loading analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background pb-20">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <BarChart3 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            <h1 className="text-xl font-bold">Analytics Dashboard</h1>
          </div>
        </div>
      </header>

      <main className="flex-1 p-6 space-y-6 max-w-6xl mx-auto">
        {/* Reports Statistics */}
        <Card className="rounded-2xl">
          <CardHeader className="p-6">
            <CardTitle className="text-lg mb-4">Reports Overview</CardTitle>
            <CardContent className="p-0 space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Reports</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                    {analytics?.reports?.total || 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Recent (30 days)</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                    {analytics?.reports?.recent || 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">High Risk</p>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {analytics?.reports?.byRiskLevel?.high || 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Heatmap Points</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                    {analytics?.heatmap?.totalLocations || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </CardHeader>
        </Card>

        {/* Cases Statistics */}
        <Card className="rounded-2xl">
          <CardHeader className="p-6">
            <CardTitle className="text-lg mb-4">Case Management</CardTitle>
            <CardContent className="p-0">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Cases</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                    {analytics?.cases?.total || 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Resolved</p>
                  <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    {analytics?.cases?.resolved || 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Unresolved</p>
                  <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                    {analytics?.cases?.unresolved || 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Resolution Rate</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                    {analytics?.cases?.resolutionRate?.toFixed(1) || 0}%
                  </p>
                </div>
              </div>
            </CardContent>
          </CardHeader>
        </Card>

        {/* User Statistics */}
        <Card className="rounded-2xl">
          <CardHeader className="p-6">
            <CardTitle className="text-lg mb-4">User Statistics</CardTitle>
            <CardContent className="p-0">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Users</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                    {analytics?.users?.total || 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Regular Users</p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {analytics?.users?.regularUsers || 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Security Officers</p>
                  <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    {analytics?.users?.securityOfficers || 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Admins</p>
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {analytics?.users?.admins || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </CardHeader>
        </Card>

        {/* Verification Statistics */}
        <Card className="rounded-2xl">
          <CardHeader className="p-6">
            <CardTitle className="text-lg mb-4">Security Verifications</CardTitle>
            <CardContent className="p-0">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Pending</p>
                  <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                    {analytics?.verifications?.pending || 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Approved</p>
                  <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    {analytics?.verifications?.approved || 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Rejected</p>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {analytics?.verifications?.rejected || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </CardHeader>
        </Card>

        {/* Panic Alerts */}
        <Card className="rounded-2xl">
          <CardHeader className="p-6">
            <CardTitle className="text-lg mb-4">Panic Alerts</CardTitle>
            <CardContent className="p-0">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Alerts</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                    {analytics?.panicAlerts?.total || 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Recent (30 days)</p>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {analytics?.panicAlerts?.recent || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </CardHeader>
        </Card>
      </main>
    </div>
  )
}

