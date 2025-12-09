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
    <div className="flex min-h-screen flex-col bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b-2 border-slate-200 bg-background/95 backdrop-blur-[10px] supports-[backdrop-filter]:bg-background/80 dark:border-slate-700">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-50">Security Dashboard</h1>
          </div>
          <div className="flex items-center gap-2">
            {isSuperAdmin && (
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1 mr-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    router.replace('/home')
                  }}
                  className="h-8 px-3 text-xs active:scale-95 cursor-pointer"
                  title="User Dashboard"
                >
                  <Home className="h-4 w-4 mr-1" />
                  User
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  className="h-8 px-3 text-xs active:scale-95 bg-emerald-600 hover:bg-emerald-700"
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
                  className="h-8 px-3 text-xs active:scale-95 cursor-pointer"
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
              className="h-10 w-10 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Bell className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => {
                const { logout } = require('@/lib/logout')
                logout()
              }}
              className="h-10 w-10 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
              title="Sign Out"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 space-y-8 p-6">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="mb-2 text-2xl font-bold text-slate-900 dark:text-slate-50">
            Welcome, {user?.name || 'Officer'}
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Manage incidents, review reports, and coordinate security operations
          </p>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <h2 className="mb-6 text-xl font-semibold text-slate-900 dark:text-slate-50">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <Card
              className="cursor-pointer transition-all duration-200 hover:shadow-lg"
              onClick={() => router.push('/security/reports')}
            >
              <CardHeader className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 dark:bg-blue-900/20">
                  <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-lg">Reports Dashboard</CardTitle>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">View and manage incident reports</p>
              </CardHeader>
            </Card>

            <Card
              className="cursor-pointer transition-all duration-200 hover:shadow-lg"
              onClick={() => router.push('/security/ai-match')}
            >
              <CardHeader className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 dark:bg-purple-900/20">
                  <Brain className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="text-lg">AI Identity Match</CardTitle>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Match faces using AI recognition</p>
              </CardHeader>
            </Card>

            <Card
              className="cursor-pointer transition-all duration-200 hover:shadow-lg"
              onClick={() => router.push('/security/heatmap')}
            >
              <CardHeader className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 dark:bg-red-900/20">
                  <Map className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <CardTitle className="text-lg">Crime Heat Map</CardTitle>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Visualize crime hotspots</p>
              </CardHeader>
            </Card>

            <Card
              className="cursor-pointer transition-all duration-200 hover:shadow-lg"
              onClick={() => router.push('/security/prioritization')}
            >
              <CardHeader className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 dark:bg-amber-900/20">
                  <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <CardTitle className="text-lg">Prioritization</CardTitle>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Manage incident priorities</p>
              </CardHeader>
            </Card>

            <Card
              className="cursor-pointer transition-all duration-200 hover:shadow-lg"
              onClick={() => router.push('/security/collaboration')}
            >
              <CardHeader className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-900/20">
                  <Users className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <CardTitle className="text-lg">Collaboration</CardTitle>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Multi-agent coordination</p>
              </CardHeader>
            </Card>

            <Card
              className="cursor-pointer transition-all duration-200 hover:shadow-lg"
              onClick={() => router.push('/security/evidence')}
            >
              <CardHeader className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-900/20">
                  <Upload className="h-6 w-6 text-slate-600 dark:text-slate-400" />
                </div>
                <CardTitle className="text-lg">Evidence Upload</CardTitle>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Upload and manage evidence</p>
              </CardHeader>
            </Card>

            <Card
              className="cursor-pointer transition-all duration-200 hover:shadow-lg"
              onClick={() => router.push('/security/setup-pin')}
            >
              <CardHeader className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 dark:bg-indigo-900/20">
                  <Lock className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <CardTitle className="text-lg">Setup PIN</CardTitle>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Set up a 4-digit PIN for quick login</p>
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
            <h2 className="mb-6 text-xl font-semibold text-slate-900 dark:text-slate-50">Admin Tools</h2>
            <div className="grid grid-cols-2 gap-4">
              <Card
                className="cursor-pointer transition-all duration-200 hover:shadow-lg"
                onClick={() => router.push('/admin/dashboard')}
              >
                <CardHeader className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 dark:bg-purple-900/20">
                    <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <CardTitle className="text-lg">Admin Dashboard</CardTitle>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">System overview and management</p>
                </CardHeader>
              </Card>
              <Card
                className="cursor-pointer transition-all duration-200 hover:shadow-lg"
                onClick={() => router.push('/admin/users')}
              >
                <CardHeader className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 dark:bg-indigo-900/20">
                    <Users className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <CardTitle className="text-lg">User Management</CardTitle>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Manage users and assign roles</p>
                </CardHeader>
              </Card>
              <Card
                className="cursor-pointer transition-all duration-200 hover:shadow-lg"
                onClick={() => router.push('/admin/security-verifications')}
              >
                <CardHeader className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 dark:bg-blue-900/20">
                    <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle className="text-lg">Security Verifications</CardTitle>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Review and approve security officers</p>
                </CardHeader>
              </Card>
              <Card
                className="cursor-pointer transition-all duration-200 hover:shadow-lg"
                onClick={() => router.push('/admin/analytics')}
              >
                <CardHeader className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-900/20">
                    <BarChart3 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <CardTitle className="text-lg">Analytics</CardTitle>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">View detailed system analytics</p>
                </CardHeader>
              </Card>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  )
}


