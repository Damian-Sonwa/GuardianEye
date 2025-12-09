'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@security-app/ui'
import { AlertTriangle, Map, Shield, Bell, User, Menu, LogOut, LayoutDashboard, Home } from 'lucide-react'
import BottomNav from '@/components/bottom-nav'
import { useLanguage } from '@/contexts/language-context'
import { getUserData } from '@/lib/auth-storage'

export default function HomePage() {
  const router = useRouter()
  const { t } = useLanguage()
  const [alerts] = useState([
    { id: 1, type: 'danger', message: 'Reported incident near Market Square', time: '5 min ago' },
    { id: 2, type: 'warning', message: 'Road closure on Main Street', time: '15 min ago' },
  ])
  const userData = getUserData()
  const isSuperAdmin = userData?.role === 'SUPER_ADMIN'

  return (
    <div className="flex min-h-screen flex-col bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b-2 border-slate-200 bg-background/95 backdrop-blur-[10px] supports-[backdrop-filter]:bg-background/80 dark:border-slate-700">
        <div className="flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-50">{t('home.title')}</h1>
          <div className="flex items-center gap-2">
            {isSuperAdmin && (
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1 mr-2">
                <Button
                  variant="default"
                  size="sm"
                  className="h-8 px-3 text-xs active:scale-95 bg-emerald-600 hover:bg-emerald-700"
                  title="User Dashboard (Current)"
                  disabled
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
                    router.replace('/security/dashboard')
                  }}
                  className="h-8 px-3 text-xs active:scale-95 cursor-pointer"
                  title="Security Dashboard"
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
              onClick={() => router.push('/notifications')}
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
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="mb-6 text-xl font-semibold text-slate-900 dark:text-slate-50">{t('home.quickActions')}</h2>
          <div className="grid grid-cols-2 gap-4">
            <Card
              className="cursor-pointer transition-all duration-200"
              onClick={() => router.push('/panic')}
            >
              <CardHeader className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 dark:bg-red-900/20">
                  <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <CardTitle className="text-lg">{t('home.panicButton')}</CardTitle>
                <CardDescription className="text-sm font-medium">{t('home.emergencyAlert')}</CardDescription>
              </CardHeader>
            </Card>

            <Card
              className="cursor-pointer transition-all duration-200"
              onClick={() => router.push('/report')}
            >
              <CardHeader className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-900/20">
                  <Shield className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <CardTitle className="text-lg">{t('home.report')}</CardTitle>
                <CardDescription className="text-sm font-medium">{t('home.fileIncident')}</CardDescription>
              </CardHeader>
            </Card>

            <Card
              className="cursor-pointer transition-all duration-200"
              onClick={() => router.push('/map')}
            >
              <CardHeader className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 dark:bg-sky-900/20">
                  <Map className="h-6 w-6 text-sky-600 dark:text-sky-400" />
                </div>
                <CardTitle className="text-lg">{t('home.threatMap')}</CardTitle>
                <CardDescription className="text-sm font-medium">{t('home.viewHotspots')}</CardDescription>
              </CardHeader>
            </Card>

            <Card
              className="cursor-pointer transition-all duration-200"
              onClick={() => router.push('/identify')}
            >
              <CardHeader className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 dark:bg-amber-900/20">
                  <User className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <CardTitle className="text-lg">{t('home.identify')}</CardTitle>
                <CardDescription className="text-sm font-medium">{t('home.aiFaceScan')}</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </motion.div>

        {/* Community Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <h2 className="mb-6 text-xl font-semibold text-slate-900 dark:text-slate-50">{t('home.communityAlerts')}</h2>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <Card key={alert.id} className="border-l-4 border-l-red-600 rounded-xl">
                <CardHeader className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-base font-semibold mb-1">{alert.message}</CardTitle>
                      <CardDescription className="text-sm font-medium">{alert.time}</CardDescription>
                    </div>
                    <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 ml-3" />
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Safe Routes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="rounded-2xl">
            <CardHeader className="p-6">
              <CardTitle className="text-lg mb-2">{t('home.safeRoutes')}</CardTitle>
              <CardDescription className="text-sm font-medium">{t('home.recommendedPaths')}</CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <Button variant="outline" size="lg" className="w-full h-14" onClick={() => router.push('/map')}>
                {t('home.viewRoutes')}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </main>

      <BottomNav />
    </div>
  )
}

