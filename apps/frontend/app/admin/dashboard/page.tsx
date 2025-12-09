'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button, Card, CardContent, CardHeader, CardTitle } from '@security-app/ui'
import { 
  Shield, 
  Users, 
  FileText, 
  BarChart3, 
  Map, 
  Settings, 
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowLeft,
  Loader2,
  LogOut,
  LayoutDashboard,
  User,
  Home
} from 'lucide-react'
import { useRoleGuard } from '@/lib/role-guard'
import { getAuthToken } from '@/lib/auth-storage'
import { logout } from '@/lib/logout'

export default function AdminDashboardPage() {
  const router = useRouter()
  const [analytics, setAnalytics] = useState<any>(null)
  const [loadingAnalytics, setLoadingAnalytics] = useState(true)

  // Only admins can access
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

      // Show UI immediately, load analytics in background
      setLoadingAnalytics(true)

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
      setLoadingAnalytics(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background pb-20">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => router.back()} className="active:scale-95">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Shield className="h-6 w-6 text-[#1D4ED8] dark:text-blue-400" />
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-2">
            {/* Dashboard Switcher for Super Admin */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  try {
                    router.replace('/home')
                  } catch (error) {
                    window.location.href = '/home'
                  }
                }}
                className="h-8 px-3 text-xs active:scale-95 cursor-pointer"
                title="User Dashboard"
              >
                <Home className="h-4 w-4 mr-1" />
                User
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  try {
                    router.replace('/security/dashboard')
                  } catch (error) {
                    window.location.href = '/security/dashboard'
                  }
                }}
                className="h-8 px-3 text-xs active:scale-95 cursor-pointer"
                title="Security Dashboard"
              >
                <Shield className="h-4 w-4 mr-1" />
                Security
              </Button>
              <Button
                variant="default"
                size="sm"
                className="h-8 px-3 text-xs active:scale-95 bg-[#1D4ED8] hover:bg-[#1E40AF]"
                title="Admin Dashboard (Current)"
                disabled
              >
                <LayoutDashboard className="h-4 w-4 mr-1" />
                Admin
              </Button>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={logout}
              className="h-10 w-10 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95"
              title="Sign Out"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 p-6 space-y-6">
        {/* Statistics Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Reports</p>
                  {loadingAnalytics && !analytics ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
                      <span className="text-sm text-slate-400">Loading...</span>
                    </div>
                  ) : (
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                      {analytics?.reports?.total || 0}
                    </p>
                  )}
                </div>
                <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/20">
                  <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Users</p>
                  {loadingAnalytics && !analytics ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
                      <span className="text-sm text-slate-400">Loading...</span>
                    </div>
                  ) : (
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                      {analytics?.users?.total || 0}
                    </p>
                  )}
                </div>
                <div className="p-3 rounded-xl bg-[#1D4ED8]/10 dark:bg-[#1D4ED8]/20">
                  <Users className="h-6 w-6 text-[#1D4ED8] dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Resolved Cases</p>
                  {loadingAnalytics && !analytics ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
                      <span className="text-sm text-slate-400">Loading...</span>
                    </div>
                  ) : (
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                      {analytics?.cases?.resolved || 0}
                    </p>
                  )}
                </div>
                <div className="p-3 rounded-xl bg-green-100 dark:bg-green-900/20">
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Pending Verifications</p>
                  {loadingAnalytics && !analytics ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
                      <span className="text-sm text-slate-400">Loading...</span>
                    </div>
                  ) : (
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                      {analytics?.verifications?.pending || 0}
                    </p>
                  )}
                </div>
                <div className="p-3 rounded-xl bg-amber-100 dark:bg-amber-900/20">
                  <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Management Tools */}
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-4">Management Tools</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Card
              className="cursor-pointer transition-all duration-200 hover:shadow-lg active:scale-95"
              onClick={() => {
                router.push('/admin/users')
              }}
            >
              <CardHeader className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 dark:bg-indigo-900/20">
                  <Users className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <CardTitle className="text-lg">User Management</CardTitle>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Manage users and assign roles
                </p>
              </CardHeader>
            </Card>

            <Card
              className="cursor-pointer transition-all duration-200 hover:shadow-lg active:scale-95"
              onClick={() => router.push('/admin/security-verifications')}
            >
              <CardHeader className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 dark:bg-blue-900/20">
                  <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-lg">Security Verifications</CardTitle>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Review and approve security officers
                </p>
              </CardHeader>
            </Card>

            <Card
              className="cursor-pointer transition-all duration-200 hover:shadow-lg active:scale-95"
              onClick={() => router.push('/admin/analytics')}
            >
              <CardHeader className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 dark:bg-purple-900/20">
                  <BarChart3 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="text-lg">Analytics</CardTitle>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  View detailed analytics and reports
                </p>
              </CardHeader>
            </Card>

            <Card
              className="cursor-pointer transition-all duration-200 hover:shadow-lg active:scale-95"
              onClick={() => router.push('/admin/generate-code')}
            >
              <CardHeader className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 dark:bg-violet-900/20">
                  <Shield className="h-6 w-6 text-violet-600 dark:text-violet-400" />
                </div>
                <CardTitle className="text-lg">Invitation Codes</CardTitle>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Generate invitation codes
                </p>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* Quick Stats */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="rounded-2xl">
              <CardHeader className="p-6">
                <CardTitle className="text-lg mb-4">User Statistics</CardTitle>
                <CardContent className="p-0 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400">Regular Users</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-50">
                      {analytics.users?.regularUsers || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400">Security Officers</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-50">
                      {analytics.users?.securityOfficers || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400">Admins</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-50">
                      {analytics.users?.admins || 0}
                    </span>
                  </div>
                </CardContent>
              </CardHeader>
            </Card>

            <Card className="rounded-2xl">
              <CardHeader className="p-6">
                <CardTitle className="text-lg mb-4">Case Statistics</CardTitle>
                <CardContent className="p-0 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400">Total Cases</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-50">
                      {analytics.cases?.total || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400">Resolved</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      {analytics.cases?.resolved || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400">Unresolved</span>
                    <span className="font-semibold text-amber-600 dark:text-amber-400">
                      {analytics.cases?.unresolved || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400">Resolution Rate</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-50">
                      {analytics.cases?.resolutionRate?.toFixed(1) || 0}%
                    </span>
                  </div>
                </CardContent>
              </CardHeader>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}

