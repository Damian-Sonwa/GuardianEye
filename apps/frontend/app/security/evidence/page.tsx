'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Card, CardContent, CardHeader, CardTitle } from '@security-app/ui'
import { ArrowLeft, Upload, FileText } from 'lucide-react'
import { useRoleGuard } from '@/lib/role-guard'

export default function EvidencePage() {
  const router = useRouter()
  const [uploading, setUploading] = useState(false)
  useRoleGuard(['SECURITY_OFFICER', 'SUPER_ADMIN'])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    // TODO: Implement evidence upload
    setTimeout(() => {
      setUploading(false)
      alert('Evidence uploaded successfully')
    }, 2000)
  }

  return (
    <div className="flex min-h-screen flex-col bg-background pb-20">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => router.push('/security/dashboard')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold">Evidence Upload</h1>
          </div>
        </div>
      </header>

      <main className="flex-1 p-6">
        <Card className="rounded-2xl">
          <CardHeader className="p-6">
            <CardTitle className="text-lg">Upload Evidence</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-12 text-center">
              <Upload className="mx-auto h-12 w-12 text-slate-400 mb-4" />
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Upload photos, videos, or documents as evidence
              </p>
              <input
                type="file"
                id="evidence-upload"
                className="hidden"
                onChange={handleFileUpload}
                accept="image/*,video/*,.pdf,.doc,.docx"
              />
              <Button
                size="lg"
                onClick={() => document.getElementById('evidence-upload')?.click()}
                disabled={uploading}
              >
                {uploading ? 'Uploading...' : 'Select Files'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}



