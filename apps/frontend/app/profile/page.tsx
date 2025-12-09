'use client'

import { useRouter } from 'next/navigation'
import { Button, Card, CardContent, CardHeader, CardTitle } from '@security-app/ui'
import { User, Bell, Shield, LogOut, Settings } from 'lucide-react'
import BottomNav from '@/components/bottom-nav'

export default function ProfilePage() {
  const router = useRouter()

  return (
    <div className="flex min-h-screen flex-col bg-background pb-20">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
        <div className="flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-bold">Profile</h1>
          <Button variant="ghost" size="icon" onClick={() => router.push('/settings')}>
            <Settings className="h-6 w-6" />
          </Button>
        </div>
      </header>

      <main className="flex-1 space-y-6 p-6">
        {/* Profile Info */}
        <Card className="rounded-2xl">
          <CardHeader className="p-6">
            <div className="flex items-center gap-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-900/20">
                <User className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <CardTitle className="text-xl mb-1">Guest User</CardTitle>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Not signed in</p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="rounded-2xl">
            <CardHeader className="p-6">
              <CardTitle className="text-3xl font-bold mb-2">0</CardTitle>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Reports</p>
            </CardHeader>
          </Card>
          <Card className="rounded-2xl">
            <CardHeader className="p-6">
              <CardTitle className="text-3xl font-bold mb-2">0</CardTitle>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Alerts</p>
            </CardHeader>
          </Card>
        </div>

        {/* Menu Items */}
        <div className="space-y-3">
          <Card className="cursor-pointer rounded-2xl transition-all duration-200 hover:shadow-lg" onClick={() => router.push('/notifications')}>
            <CardContent className="flex items-center justify-between p-5">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <Bell className="h-5 w-5 text-slate-700 dark:text-slate-300" />
                </div>
                <span className="text-base font-medium">Notifications</span>
              </div>
              <span className="text-slate-400">→</span>
            </CardContent>
          </Card>

          <Card className="cursor-pointer rounded-2xl transition-all duration-200 hover:shadow-lg" onClick={() => router.push('/community')}>
            <CardContent className="flex items-center justify-between p-5">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-slate-700 dark:text-slate-300" />
                </div>
                <span className="text-base font-medium">Community Watch</span>
              </div>
              <span className="text-slate-400">→</span>
            </CardContent>
          </Card>

          <Card className="cursor-pointer rounded-2xl transition-all duration-200 hover:shadow-lg" onClick={() => router.push('/settings')}>
            <CardContent className="flex items-center justify-between p-5">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <Settings className="h-5 w-5 text-slate-700 dark:text-slate-300" />
                </div>
                <span className="text-base font-medium">Settings</span>
              </div>
              <span className="text-slate-400">→</span>
            </CardContent>
          </Card>
        </div>

        {/* Sign Out */}
        <Button
          variant="outline"
          size="lg"
          className="w-full h-14 border-2 rounded-xl"
          onClick={() => {
            const { logout } = require('@/lib/logout')
            logout()
          }}
        >
          <LogOut className="mr-2 h-5 w-5" />
          Sign Out
        </Button>
      </main>

      <BottomNav />
    </div>
  )
}

