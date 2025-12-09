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
    <div className="flex min-h-screen flex-col bg-[#F8FAFC]">
      <header className="sticky top-0 z-10 border-b border-slate-200/50 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => router.back()} className="active:scale-95">
              <ArrowLeft className="h-5 w-5 text-[#0F172A]" />
            </Button>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#3B82F6] flex items-center justify-center">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-[#0F172A]">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-2">
            {/* Dashboard Switcher for Super Admin */}
            <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
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
                className="h-8 px-3 text-xs active:scale-95 cursor-pointer hover:bg-slate-200"
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
                className="h-8 px-3 text-xs active:scale-95 cursor-pointer hover:bg-slate-200"
                title="Security Dashboard"
              >
                <Shield className="h-4 w-4 mr-1" />
                Security
              </Button>
              <Button
                variant="default"
                size="sm"
                className="h-8 px-3 text-xs active:scale-95 bg-[#2563EB] hover:bg-[#1E40AF] text-white"
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
              className="h-10 w-10 rounded-xl hover:bg-slate-100 active:scale-95"
              title="Sign Out"
            >
              <LogOut className="h-5 w-5 text-[#0F172A]" />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 p-6 space-y-6">
        {/* Statistics Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Total Reports</p>
                  {loadingAnalytics && !analytics ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
                      <span className="text-sm text-slate-400">Loading...</span>
                    </div>
                  ) : (
                    <p className="text-2xl font-bold text-[#0F172A]">
                      {analytics?.reports?.total || 0}
                    </p>
                  )}
                </div>
                <div className="p-3 rounded-xl bg-[#3B82F6]/10">
                  <FileText className="h-6 w-6 text-[#3B82F6]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Total Users</p>
                  {loadingAnalytics && !analytics ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
                      <span className="text-sm text-slate-400">Loading...</span>
                    </div>
                  ) : (
                    <p className="text-2xl font-bold text-[#0F172A]">
                      {analytics?.users?.total || 0}
                    </p>
                  )}
                </div>
                <div className="p-3 rounded-xl bg-[#2563EB]/10">
                  <Users className="h-6 w-6 text-[#2563EB]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Resolved Cases</p>
                  {loadingAnalytics && !analytics ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
                      <span className="text-sm text-slate-400">Loading...</span>
                    </div>
                  ) : (
                    <p className="text-2xl font-bold text-[#0F172A]">
                      {analytics?.cases?.resolved || 0}
                    </p>
                  )}
                </div>
                <div className="p-3 rounded-xl bg-[#10B981]/10">
                  <CheckCircle className="h-6 w-6 text-[#10B981]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Pending Verifications</p>
                  {loadingAnalytics && !analytics ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
                      <span className="text-sm text-slate-400">Loading...</span>
                    </div>
                  ) : (
                    <p className="text-2xl font-bold text-[#0F172A]">
                      {analytics?.verifications?.pending || 0}
                    </p>
                  )}
                </div>
                <div className="p-3 rounded-xl bg-amber-100">
                  <Clock className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Management Tools */}
        <div>
          <h2 className="text-xl font-bold text-[#0F172A] mb-4">Management Tools</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Card
              className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 active:scale-95 rounded-2xl border border-slate-200 bg-white"
              onClick={() => {
                router.push('/admin/users')
              }}
            >
              <CardHeader className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#2563EB]/10">
                  <Users className="h-6 w-6 text-[#2563EB]" />
                </div>
                <CardTitle className="text-lg font-bold text-[#0F172A]">User Management</CardTitle>
                <p className="text-sm text-slate-600 mt-1">
                  Manage users and assign roles
                </p>
              </CardHeader>
            </Card>

            <Card
              className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 active:scale-95 rounded-2xl border border-slate-200 bg-white"
              onClick={() => router.push('/admin/security-verifications')}
            >
              <CardHeader className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#3B82F6]/10">
                  <Shield className="h-6 w-6 text-[#3B82F6]" />
                </div>
                <CardTitle className="text-lg font-bold text-[#0F172A]">Security Verifications</CardTitle>
                <p className="text-sm text-slate-600 mt-1">
                  Review and approve security officers
                </p>
              </CardHeader>
            </Card>

            <Card
              className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 active:scale-95 rounded-2xl border border-slate-200 bg-white"
              onClick={() => router.push('/admin/analytics')}
            >
              <CardHeader className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#2563EB]/10">
                  <BarChart3 className="h-6 w-6 text-[#2563EB]" />
                </div>
                <CardTitle className="text-lg font-bold text-[#0F172A]">Analytics</CardTitle>
                <p className="text-sm text-slate-600 mt-1">
                  View detailed analytics and reports
                </p>
              </CardHeader>
            </Card>

            <Card
              className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 active:scale-95 rounded-2xl border border-slate-200 bg-white"
              onClick={() => router.push('/admin/generate-code')}
            >
              <CardHeader className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#3B82F6]/10">
                  <Shield className="h-6 w-6 text-[#3B82F6]" />
                </div>
                <CardTitle className="text-lg font-bold text-[#0F172A]">Generate Invitation Codes</CardTitle>
                <p className="text-sm text-slate-600 mt-1">
                  Create codes for security officers
                </p>
              </CardHeader>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
