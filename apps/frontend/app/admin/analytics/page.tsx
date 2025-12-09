'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button, Card, CardContent, CardHeader, CardTitle } from '@security-app/ui'
import { BarChart3, ArrowLeft, Loader2, TrendingUp, TrendingDown, MapPin } from 'lucide-react'
import { useRoleGuard } from '@/lib/role-guard'
import { getAuthToken } from '@/lib/auth-storage'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

const COLORS = {
  primary: '#2563EB',
  accent: '#3B82F6',
  success: '#10B981',
  warning: '#f59e0b',
  error: '#EF4444',
  slate: '#64748b',
}

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
        <Loader2 className="h-8 w-8 animate-spin text-[#2563EB]" />
      </div>
    )
  }

  // Prepare data for charts
  const reportsByRiskData = analytics?.reports?.byRiskLevel
    ? Object.entries(analytics.reports.byRiskLevel).map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value,
      }))
    : []

  const userDistributionData = analytics?.users
    ? [
        { name: 'Regular Users', value: analytics.users.regularUsers, color: COLORS.primary },
        { name: 'Security Officers', value: analytics.users.securityOfficers, color: COLORS.accent },
        { name: 'Admins', value: analytics.users.admins, color: COLORS.primary },
      ].filter((item) => item.value > 0)
    : []

  const verificationStatusData = analytics?.verifications
    ? [
        { name: 'Approved', value: analytics.verifications.approved, color: COLORS.success },
        { name: 'Pending', value: analytics.verifications.pending, color: COLORS.warning },
        { name: 'Rejected', value: analytics.verifications.rejected, color: COLORS.error },
      ].filter((item) => item.value > 0)
    : []

  const dailyReportsData = analytics?.charts?.dailyReports || []
  const dailyCasesData = analytics?.charts?.dailyCases || []
  const dailyPanicData = analytics?.charts?.dailyPanic || []

  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAFC] pb-20">
      <header className="sticky top-0 z-10 border-b border-slate-200/50 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#3B82F6] flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-[#0F172A]">Analytics Dashboard</h1>
          </div>
        </div>
      </header>

      <main className="flex-1 p-6 space-y-6 max-w-7xl mx-auto">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <CardContent className="p-6">
              <p className="text-sm text-slate-600 mb-1">Total Reports</p>
              <p className="text-3xl font-bold text-[#0F172A]">
                {analytics?.reports?.total || 0}
              </p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <CardContent className="p-6">
              <p className="text-sm text-slate-600 mb-1">Total Cases</p>
              <p className="text-3xl font-bold text-[#0F172A]">
                {analytics?.cases?.total || 0}
              </p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <CardContent className="p-6">
              <p className="text-sm text-slate-600 mb-1">Total Users</p>
              <p className="text-3xl font-bold text-[#0F172A]">
                {analytics?.users?.total || 0}
              </p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <CardContent className="p-6">
              <p className="text-sm text-slate-600 mb-1">Panic Alerts</p>
              <p className="text-3xl font-bold text-[#EF4444]">
                {analytics?.panicAlerts?.total || 0}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Reports Over Time Chart */}
          <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <CardHeader className="p-6">
              <CardTitle className="text-lg font-bold text-[#0F172A]">Reports Over Time (Last 30 Days)</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyReportsData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => {
                    const date = new Date(value)
                    return `${date.getMonth() + 1}/${date.getDate()}`
                  }}
                  className="text-xs text-slate-600"
                />
                <YAxis className="text-xs text-slate-600" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                  }}
                  labelFormatter={(value) => {
                    const date = new Date(value)
                    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke={COLORS.primary}
                  strokeWidth={2}
                  name="Reports"
                  dot={{ fill: COLORS.primary, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Cases Over Time Chart */}
        <Card className="rounded-2xl">
          <CardHeader className="p-6">
            <CardTitle className="text-lg">Cases Over Time (Last 30 Days)</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyCasesData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => {
                    const date = new Date(value)
                    return `${date.getMonth() + 1}/${date.getDate()}`
                  }}
                  className="text-xs text-slate-600"
                />
                <YAxis className="text-xs text-slate-600" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                  }}
                  labelFormatter={(value) => {
                    const date = new Date(value)
                    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="created"
                  stroke={COLORS.accent}
                  strokeWidth={2}
                  name="Created"
                  dot={{ fill: COLORS.accent, r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="resolved"
                  stroke={COLORS.primary}
                  strokeWidth={2}
                  name="Resolved"
                  dot={{ fill: COLORS.primary, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Panic Alerts Over Time */}
        <Card className="rounded-2xl">
          <CardHeader className="p-6">
            <CardTitle className="text-lg">Panic Alerts Over Time (Last 30 Days)</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyPanicData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => {
                    const date = new Date(value)
                    return `${date.getMonth() + 1}/${date.getDate()}`
                  }}
                  className="text-xs text-slate-600"
                />
                <YAxis className="text-xs text-slate-600" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                  }}
                  labelFormatter={(value) => {
                    const date = new Date(value)
                    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                  }}
                />
                <Legend />
                <Bar dataKey="count" fill={COLORS.error} name="Panic Alerts" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Charts Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Reports by Risk Level */}
          <Card className="rounded-2xl">
            <CardHeader className="p-6">
              <CardTitle className="text-lg">Reports by Risk Level</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={reportsByRiskData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry: any) => `${entry.name}: ${(entry.percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {reportsByRiskData.map((entry, index) => {
                      const colors = [COLORS.red, COLORS.amber, COLORS.emerald, COLORS.blue]
                      return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    })}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* User Distribution */}
          <Card className="rounded-2xl">
            <CardHeader className="p-6">
              <CardTitle className="text-lg">User Distribution</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={userDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry: any) => `${entry.name}: ${(entry.percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {userDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Verification Status Chart */}
        <Card className="rounded-2xl">
          <CardHeader className="p-6">
            <CardTitle className="text-lg">Security Verifications Status</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={verificationStatusData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                <XAxis dataKey="name" className="text-xs text-slate-600 dark:text-slate-400" />
                <YAxis className="text-xs text-slate-600 dark:text-slate-400" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar dataKey="value" fill={COLORS.purple} radius={[8, 8, 0, 0]}>
                  {verificationStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Detailed Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Cases Statistics */}
          <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <CardHeader className="p-6">
              <CardTitle className="text-lg font-bold text-[#0F172A]">Case Management</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Resolved</span>
                  <span className="text-2xl font-bold text-[#10B981]">
                    {analytics?.cases?.resolved || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Unresolved</span>
                  <span className="text-2xl font-bold text-amber-600">
                    {analytics?.cases?.unresolved || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                  <span className="text-sm font-semibold text-[#0F172A]">Resolution Rate</span>
                  <span className="text-2xl font-bold text-[#0F172A]">
                    {analytics?.cases?.resolutionRate?.toFixed(1) || 0}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Verification Statistics */}
          <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <CardHeader className="p-6">
              <CardTitle className="text-lg font-bold text-[#0F172A]">Security Verifications</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Approved</span>
                  <span className="text-2xl font-bold text-[#10B981]">
                    {analytics?.verifications?.approved || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Pending</span>
                  <span className="text-2xl font-bold text-amber-600">
                    {analytics?.verifications?.pending || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Rejected</span>
                  <span className="text-2xl font-bold text-[#EF4444]">
                    {analytics?.verifications?.rejected || 0}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
