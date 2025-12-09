'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Card, CardContent, CardHeader, CardTitle, CardDescription } from '@security-app/ui'
import { Shield, Users, MapPin, AlertTriangle, TrendingUp, ArrowLeft } from 'lucide-react'
import BottomNav from '@/components/bottom-nav'
import { motion } from 'framer-motion'

export default function CommunityPage() {
  const router = useRouter()
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: 'high',
      title: 'Reported Incident',
      location: 'Market Square',
      time: '2 hours ago',
      description: 'Suspicious activity reported by community member',
    },
    {
      id: 2,
      type: 'medium',
      title: 'Road Closure',
      location: 'Main Street',
      time: '4 hours ago',
      description: 'Temporary road closure for security operation',
    },
    {
      id: 3,
      type: 'low',
      title: 'Community Meeting',
      location: 'Community Center',
      time: '1 day ago',
      description: 'Monthly community safety meeting scheduled',
    },
  ])

  const [stats] = useState({
    activeMembers: 156,
    reportsThisMonth: 24,
    resolvedCases: 18,
    responseTime: '15 min',
  })

  return (
    <div className="flex min-h-screen flex-col bg-background pb-20">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-xl font-bold">Community Watch</h1>
          </div>
        </div>
      </header>

      <main className="flex-1 space-y-6 p-4">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">{stats.activeMembers}</CardTitle>
              <CardDescription>Active Members</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">{stats.reportsThisMonth}</CardTitle>
              <CardDescription>Reports This Month</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">{stats.resolvedCases}</CardTitle>
              <CardDescription>Resolved Cases</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">{stats.responseTime}</CardTitle>
              <CardDescription>Avg Response Time</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Community Alerts */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent Alerts</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/map')}
            >
              <MapPin className="mr-2 h-4 w-4" />
              View Map
            </Button>
          </div>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card
                  className={`border-l-4 ${
                    alert.type === 'high' ? 'border-l-red-500' :
                    alert.type === 'medium' ? 'border-l-amber-500' :
                    'border-l-emerald-500'
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-base flex items-center gap-2">
                          {alert.type === 'high' && (
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                          )}
                          {alert.title}
                        </CardTitle>
                        <CardDescription className="mt-1 flex items-center gap-2">
                          <MapPin className="h-3 w-3" />
                          {alert.location}
                        </CardDescription>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {alert.time}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {alert.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Join Community */}
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Join Community Watch
            </CardTitle>
            <CardDescription>
              Become an active member and help keep your community safe
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">
              Join Now
            </Button>
          </CardContent>
        </Card>
      </main>

      <BottomNav />
    </div>
  )
}

