'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Button } from '@security-app/ui'
import { Shield, LogIn } from 'lucide-react'

export default function DashboardLogin() {
  const router = useRouter()

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="w-full max-w-md space-y-8 p-8">
        <div className="text-center">
          <Shield className="mx-auto h-16 w-16 text-primary mb-4" />
          <h1 className="text-3xl font-bold text-white mb-2">Agency Dashboard</h1>
          <p className="text-slate-400">Officer login required</p>
        </div>

        <div className="space-y-4">
          <Button
            size="xl"
            onClick={() => router.push('/dashboard/home')}
            className="w-full"
          >
            <LogIn className="mr-2 h-5 w-5" />
            Login (Demo)
          </Button>
        </div>
      </div>
    </div>
  )
}

