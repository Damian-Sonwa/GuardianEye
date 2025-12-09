'use client'

import { useRouter } from 'next/navigation'
import { Button, Card, CardContent } from '@security-app/ui'
import { ArrowLeft, Users } from 'lucide-react'
import { useRoleGuard } from '@/lib/role-guard'

export default function CollaborationPage() {
  const router = useRouter()
  useRoleGuard(['SECURITY_OFFICER', 'SUPER_ADMIN'])

  return (
    <div className="flex min-h-screen flex-col bg-background pb-20">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => router.push('/security/dashboard')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold">Multi-Agent Collaboration</h1>
          </div>
        </div>
      </header>

      <main className="flex-1 p-6">
        <Card className="rounded-2xl">
          <CardContent className="p-12 text-center">
            <Users className="mx-auto h-16 w-16 text-emerald-600 dark:text-emerald-400 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Team Coordination</h2>
            <p className="text-slate-600 dark:text-slate-400">
              Coordinate with other security officers and share information in real-time
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}



