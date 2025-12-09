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
    <div className="flex min-h-screen flex-col bg-[#F8FAFC] pb-20">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-slate-200/50 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#3B82F6] flex items-center justify-center">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-[#0F172A]">{t('home.title')}</h1>
          </div>
          <div className="flex items-center gap-2">
            {isSuperAdmin && (
              <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1 mr-2">
                <Button
                  variant="default"
                  size="sm"
                  className="h-8 px-3 text-xs active:scale-95 bg-[#2563EB] hover:bg-[#1E40AF] text-white"
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
                  className="h-8 px-3 text-xs active:scale-95 cursor-pointer hover:bg-slate-200"
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
              onClick={() => router.push('/notifications')}
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
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="mb-4 text-xl font-bold text-[#0F172A]">{t('home.quickActions')}</h2>
          <div className="grid grid-cols-2 gap-4">
            <Card
              className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 rounded-2xl border border-slate-200 bg-white"
              onClick={() => router.push('/panic')}
            >
              <CardHeader className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#EF4444]/10">
                  <AlertTriangle className="h-6 w-6 text-[#EF4444]" />
                </div>
                <CardTitle className="text-lg font-bold text-[#0F172A]">{t('home.panicButton')}</CardTitle>
                <CardDescription className="text-sm font-medium text-slate-600">{t('home.emergencyAlert')}</CardDescription>
              </CardHeader>
            </Card>

            <Card
              className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 rounded-2xl border border-slate-200 bg-white"
              onClick={() => router.push('/report')}
            >
              <CardHeader className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#2563EB]/10">
                  <Shield className="h-6 w-6 text-[#2563EB]" />
                </div>
                <CardTitle className="text-lg font-bold text-[#0F172A]">{t('home.report')}</CardTitle>
                <CardDescription className="text-sm font-medium text-slate-600">{t('home.fileIncident')}</CardDescription>
              </CardHeader>
            </Card>

            <Card
              className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 rounded-2xl border border-slate-200 bg-white"
              onClick={() => router.push('/map')}
            >
              <CardHeader className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#3B82F6]/10">
                  <Map className="h-6 w-6 text-[#3B82F6]" />
                </div>
                <CardTitle className="text-lg font-bold text-[#0F172A]">{t('home.threatMap')}</CardTitle>
                <CardDescription className="text-sm font-medium text-slate-600">{t('home.viewHotspots')}</CardDescription>
              </CardHeader>
            </Card>

            <Card
              className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 rounded-2xl border border-slate-200 bg-white"
              onClick={() => router.push('/identify')}
            >
              <CardHeader className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#2563EB]/10">
                  <User className="h-6 w-6 text-[#2563EB]" />
                </div>
                <CardTitle className="text-lg font-bold text-[#0F172A]">{t('home.identify')}</CardTitle>
                <CardDescription className="text-sm font-medium text-slate-600">{t('home.aiFaceScan')}</CardDescription>
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
          <h2 className="mb-4 text-xl font-bold text-[#0F172A]">{t('home.communityAlerts')}</h2>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <Card key={alert.id} className="border-l-4 border-l-[#EF4444] rounded-xl bg-white border border-slate-200">
                <CardHeader className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-base font-semibold mb-1 text-[#0F172A]">{alert.message}</CardTitle>
                      <CardDescription className="text-sm font-medium text-slate-600">{alert.time}</CardDescription>
                    </div>
                    <AlertTriangle className="h-5 w-5 text-[#EF4444] flex-shrink-0 ml-3" />
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
          <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <CardHeader className="p-6">
              <CardTitle className="text-lg mb-2 font-bold text-[#0F172A]">{t('home.safeRoutes')}</CardTitle>
              <CardDescription className="text-sm font-medium text-slate-600">{t('home.recommendedPaths')}</CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full h-12 rounded-xl border-2 border-slate-200 hover:bg-[#2563EB] hover:text-white hover:border-[#2563EB] transition-all font-semibold" 
                onClick={() => router.push('/map')}
              >
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
