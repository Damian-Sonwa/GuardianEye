'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@security-app/ui'
import { ArrowLeft, Brain } from 'lucide-react'
import { useRoleGuard } from '@/lib/role-guard'

export default function AIMatchPage() {
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
            <h1 className="text-xl font-bold">AI Identity Matching</h1>
          </div>
        </div>
      </header>

      <main className="flex-1 p-6">
        <div className="text-center py-12">
          <Brain className="mx-auto h-16 w-16 text-purple-600 dark:text-purple-400 mb-4" />
          <h2 className="text-2xl font-bold mb-2">AI Face Recognition</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            Upload a photo to match against the suspect database
          </p>
          <Button size="lg" onClick={() => router.push('/identify')}>
            Open Face Scanner
          </Button>
        </div>
      </main>
    </div>
  )
}



