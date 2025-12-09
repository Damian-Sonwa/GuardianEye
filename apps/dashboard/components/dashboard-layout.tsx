'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Button } from '@security-app/ui'
import {
  LayoutDashboard,
  Map,
  FileText,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react'

const navItems = [
  { path: '/dashboard/home', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/dashboard/map', icon: Map, label: 'Map' },
  { path: '/dashboard/cases', icon: FileText, label: 'Cases' },
  { path: '/dashboard/suspects', icon: Users, label: 'Suspects' },
  { path: '/dashboard/settings', icon: Settings, label: 'Settings' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed lg:static lg:translate-x-0 z-30 w-64 border-r bg-card transition-transform duration-300`}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-between border-b px-6">
            <h1 className="text-lg font-bold">Security Dashboard</h1>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <nav className="flex-1 space-y-1 p-4">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.path

              return (
                <a
                  key={item.path}
                  href={item.path}
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </a>
              )
            })}
          </nav>

          <div className="border-t p-4">
            <Button variant="ghost" className="w-full justify-start">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b bg-card px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex-1" />
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}

