'use client'

import { useRouter, usePathname } from 'next/navigation'
import { Home, Map, AlertTriangle, User, Settings } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@security-app/ui'
import { useLanguage } from '@/contexts/language-context'

const navItems = [
  { path: '/home', icon: Home, labelKey: 'nav.home' },
  { path: '/map', icon: Map, labelKey: 'nav.map' },
  { path: '/panic', icon: AlertTriangle, labelKey: 'nav.panic' },
  { path: '/profile', icon: User, labelKey: 'nav.profile' },
  { path: '/settings', icon: Settings, labelKey: 'nav.settings' },
]

export default function BottomNav() {
  const router = useRouter()
  const pathname = usePathname()
  const { t } = useLanguage()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200/50 bg-white/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/80 safe-area-bottom pointer-events-auto shadow-[0_-2px_12px_rgba(0,0,0,0.08)]">
      <div className="flex h-18 items-center justify-around pointer-events-auto py-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.path
          const label = t(item.labelKey)
          
          return (
            <button
              key={item.path}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                console.log('Navigating to:', item.path)
                router.push(item.path)
              }}
              className={cn(
                "flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors cursor-pointer touch-manipulation",
                "hover:bg-accent/50 active:bg-accent",
                isActive ? "text-[#2563EB]" : "text-slate-500"
              )}
              type="button"
              aria-label={label}
            >
              {isActive ? (
                <motion.div
                  initial={false}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.3 }}
                >
                  <Icon className="h-6 w-6" />
                </motion.div>
              ) : (
                <Icon className="h-6 w-6" />
              )}
              <span className="text-xs font-medium">{label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

