'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Card, CardContent, CardHeader, CardTitle, CardDescription } from '@security-app/ui'
import { Bell, AlertTriangle, CheckCircle, ArrowLeft, Settings } from 'lucide-react'
import BottomNav from '@/components/bottom-nav'
import { motion } from 'framer-motion'

export default function NotificationsPage() {
  const router = useRouter()
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'alert',
      title: 'New Incident Reported',
      message: 'A security incident was reported near Market Square',
      time: '5 minutes ago',
      read: false,
    },
    {
      id: 2,
      type: 'info',
      title: 'Community Alert',
      message: 'Road closure on Main Street due to security operation',
      time: '15 minutes ago',
      read: false,
    },
    {
      id: 3,
      type: 'success',
      title: 'Case Resolved',
      message: 'The reported incident has been resolved by security officers',
      time: '2 hours ago',
      read: true,
    },
  ])

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="flex min-h-screen flex-col bg-background pb-20">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-xl font-bold">Notifications</h1>
            {unreadCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                {unreadCount}
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              Mark all read
            </Button>
          )}
        </div>
      </header>

      <main className="flex-1 space-y-4 p-4">
        {notifications.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <Card className="w-full max-w-md">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No notifications</p>
              </CardContent>
            </Card>
          </div>
        ) : (
          notifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card
                className={`cursor-pointer transition-colors ${
                  !notification.read ? 'border-l-4 border-l-primary bg-primary/5' : ''
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      notification.type === 'alert' ? 'bg-red-100 dark:bg-red-900/20' :
                      notification.type === 'info' ? 'bg-blue-100 dark:bg-blue-900/20' :
                      'bg-emerald-100 dark:bg-emerald-900/20'
                    }`}>
                      {notification.type === 'alert' ? (
                        <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                      ) : notification.type === 'info' ? (
                        <Bell className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      ) : (
                        <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold">{notification.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {notification.time}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="h-2 w-2 rounded-full bg-primary ml-2" />
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </main>

      <BottomNav />
    </div>
  )
}

