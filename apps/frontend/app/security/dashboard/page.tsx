'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button, Card, CardContent, CardHeader, CardTitle } from '@security-app/ui'
import { 
  Shield, 
  FileText, 
  Brain, 
  Map, 
  AlertTriangle, 
  Users, 
  Upload,
  LogOut,
  Bell,
  Lock,
  BarChart3,
  LayoutDashboard,
  Home
} from 'lucide-react'
import { useRoleGuard } from '@/lib/role-guard'
import { getUserData } from '@/lib/auth-storage'

export default function SecurityDashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  
  // Ensure only security officers and admins can access
  useRoleGuard(['SECURITY_OFFICER', 'SUPER_ADMIN'])

  useEffect(() => {
    const userData = getUserData()
    setUser(userData)
    
    // Check verification status for security officers only (SUPER_ADMIN bypasses verification)
    if (userData?.role === 'SECURITY_OFFICER') {
      checkVerificationStatus(userData)
    }
  }, [])
  
  const isSuperAdmin = user?.role === 'SUPER_ADMIN'

  const checkVerificationStatus = async (userData?: any) => {
    // SUPER_ADMIN bypasses verification
    const currentUser = userData || user
    if (currentUser?.role === 'SUPER_ADMIN') {
      return
    }
    
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) {
        router.push('/auth')
        return
      }

      const response = await fetch('/api/security-verification/status', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        if (data) {
          if (data.status === 'pending') {
            router.push('/security/verify')
            return
          } else if (data.status === 'rejected') {
            router.push('/security/verify')
            return
          }
          // If approved or no record, allow access
        } else {
          // No verification record, redirect to verification
          router.push('/security/verify')
        }
      }
    } catch (error) {
      console.error('Error checking verification status:', error)
      router.push('/security/verify')
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAFC]">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-slate-200/50 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#3B82F6] flex items-center justify-center">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-[#0F172A]">Security Dashboard</h1>
          </div>
          <div className="flex items-center gap-2">
            {isSuperAdmin && (
              <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1 mr-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    router.replace('/home')
                  }}
                  className="h-8 px-3 text-xs active:scale-95 cursor-pointer hover:bg-slate-200"
                  title="User Dashboard"
                >
                  <Home className="h-4 w-4 mr-1" />
                  User
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  className="h-8 px-3 text-xs active:scale-95 bg-[#2563EB] hover:bg-[#1E40AF] text-white"
                  title="Security Dashboard (Current)"
                  disabled
                >
                  <Shield className="h-4 w-4 mr-1" />
                  Security
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    router.replace('/admin/dashboard')
                  }}
                  className="h-8 px-3 text-xs active:scale-95 cursor-pointer hover:bg-slate-200"
                  title="Admin Dashboard"
                >
                  <LayoutDashboard className="h-4 w-4 mr-1" />
                  Admin
                </Button>
              </div>
            )}
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => router.push('/security/notifications')}
              className="h-10 w-10 rounded-xl hover:bg-slate-100"
            >
              <Bell className="h-5 w-5 text-[#0F172A]" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => {
                const { logout } = require('@/lib/logout')
                logout()
              }}
              className="h-10 w-10 rounded-xl hover:bg-slate-100"
              title="Sign Out"
            >
              <LogOut className="h-5 w-5 text-[#0F172A]" />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 space-y-6 p-6">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="mb-2 text-2xl font-bold text-[#0F172A]">
            Welcome, {user?.name || 'Officer'}
          </h2>
          <p className="text-slate-600">
            Manage incidents, review reports, and coordinate security operations
          </p>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <h2 className="mb-4 text-xl font-bold text-[#0F172A]">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <Card
              className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 active:scale-95 rounded-2xl border border-slate-200 bg-white"
              onClick={() => router.push('/security/reports')}
            >
              <CardHeader className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#3B82F6]/10">
                  <FileText className="h-6 w-6 text-[#3B82F6]" />
                </div>
                <CardTitle className="text-lg font-bold text-[#0F172A]">Reports Dashboard</CardTitle>
                <p className="text-sm text-slate-600 mt-1">View and manage incident reports</p>
              </CardHeader>
            </Card>

            <Card
              className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 active:scale-95 rounded-2xl border border-slate-200 bg-white"
              onClick={() => router.push('/security/ai-match')}
            >
              <CardHeader className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#2563EB]/10">
                  <Brain className="h-6 w-6 text-[#2563EB]" />
                </div>
                <CardTitle className="text-lg font-bold text-[#0F172A]">AI Identity Match</CardTitle>
                <p className="text-sm text-slate-600 mt-1">Match faces using AI recognition</p>
              </CardHeader>
            </Card>

            <Card
              className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 active:scale-95 rounded-2xl border border-slate-200 bg-white"
              onClick={() => router.push('/security/heatmap')}
            >
              <CardHeader className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#EF4444]/10">
                  <Map className="h-6 w-6 text-[#EF4444]" />
                </div>
                <CardTitle className="text-lg font-bold text-[#0F172A]">Crime Heat Map</CardTitle>
                <p className="text-sm text-slate-600 mt-1">Visualize crime hotspots</p>
              </CardHeader>
            </Card>

            <Card
              className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 active:scale-95 rounded-2xl border border-slate-200 bg-white"
              onClick={() => router.push('/security/prioritization')}
            >
              <CardHeader className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100">
                  <AlertTriangle className="h-6 w-6 text-amber-600" />
                </div>
                <CardTitle className="text-lg font-bold text-[#0F172A]">Prioritization</CardTitle>
                <p className="text-sm text-slate-600 mt-1">Manage incident priorities</p>
              </CardHeader>
            </Card>

            <Card
              className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 active:scale-95 rounded-2xl border border-slate-200 bg-white"
              onClick={() => router.push('/security/collaboration')}
            >
              <CardHeader className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#10B981]/10">
                  <Users className="h-6 w-6 text-[#10B981]" />
                </div>
                <CardTitle className="text-lg font-bold text-[#0F172A]">Collaboration</CardTitle>
                <p className="text-sm text-slate-600 mt-1">Multi-agent coordination</p>
              </CardHeader>
            </Card>

            <Card
              className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 active:scale-95 rounded-2xl border border-slate-200 bg-white"
              onClick={() => router.push('/security/evidence')}
            >
              <CardHeader className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
                  <Upload className="h-6 w-6 text-slate-600" />
                </div>
                <CardTitle className="text-lg font-bold text-[#0F172A]">Evidence Upload</CardTitle>
                <p className="text-sm text-slate-600 mt-1">Upload and manage evidence</p>
              </CardHeader>
            </Card>

            <Card
              className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 active:scale-95 rounded-2xl border border-slate-200 bg-white"
              onClick={() => router.push('/security/setup-pin')}
            >
              <CardHeader className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#2563EB]/10">
                  <Lock className="h-6 w-6 text-[#2563EB]" />
                </div>
                <CardTitle className="text-lg font-bold text-[#0F172A]">Setup PIN</CardTitle>
                <p className="text-sm text-slate-600 mt-1">Set up a 4-digit PIN for quick login</p>
              </CardHeader>
            </Card>
          </div>
        </motion.div>

        {/* Admin Tools (for admins only) */}
        {user?.role === 'SUPER_ADMIN' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <h2 className="mb-4 text-xl font-bold text-[#0F172A]">Admin Tools</h2>
            <div className="grid grid-cols-2 gap-4">
              <Card
                className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 active:scale-95 rounded-2xl border border-slate-200 bg-white"
                onClick={() => router.push('/admin/dashboard')}
              >
                <CardHeader className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#2563EB]/10">
                    <Shield className="h-6 w-6 text-[#2563EB]" />
                  </div>
                  <CardTitle className="text-lg font-bold text-[#0F172A]">Admin Dashboard</CardTitle>
                  <p className="text-sm text-slate-600 mt-1">System overview and management</p>
                </CardHeader>
              </Card>
              <Card
                className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 active:scale-95 rounded-2xl border border-slate-200 bg-white"
                onClick={() => router.push('/admin/users')}
              >
                <CardHeader className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#3B82F6]/10">
                    <Users className="h-6 w-6 text-[#3B82F6]" />
                  </div>
                  <CardTitle className="text-lg font-bold text-[#0F172A]">User Management</CardTitle>
                  <p className="text-sm text-slate-600 mt-1">Manage users and assign roles</p>
                </CardHeader>
              </Card>
              <Card
                className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 active:scale-95 rounded-2xl border border-slate-200 bg-white"
                onClick={() => router.push('/admin/security-verifications')}
              >
                <CardHeader className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#2563EB]/10">
                    <Shield className="h-6 w-6 text-[#2563EB]" />
                  </div>
                  <CardTitle className="text-lg font-bold text-[#0F172A]">Security Verifications</CardTitle>
                  <p className="text-sm text-slate-600 mt-1">Review and approve security officers</p>
                </CardHeader>
              </Card>
              <Card
                className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 active:scale-95 rounded-2xl border border-slate-200 bg-white"
                onClick={() => router.push('/admin/analytics')}
              >
                <CardHeader className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#3B82F6]/10">
                    <BarChart3 className="h-6 w-6 text-[#3B82F6]" />
                  </div>
                  <CardTitle className="text-lg font-bold text-[#0F172A]">Analytics</CardTitle>
                  <p className="text-sm text-slate-600 mt-1">View detailed system analytics</p>
                </CardHeader>
              </Card>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  )
}
