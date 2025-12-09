'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@security-app/ui'
import { Shield, ArrowLeft, Home } from 'lucide-react'

export default function UnauthorizedPage() {
  const router = useRouter()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md text-center"
      >
        <div className="mb-8">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
            <Shield className="h-12 w-12 text-red-600 dark:text-red-400" />
          </div>
          <h1 className="mb-4 text-3xl font-bold text-slate-900 dark:text-slate-50">
            Access Denied
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            You don't have permission to access this page.
          </p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-500">
            This area is restricted to authorized personnel only.
          </p>
        </div>

        <div className="space-y-3">
          <Button
            size="lg"
            onClick={() => router.push('/home')}
            className="w-full h-14"
          >
            <Home className="mr-2 h-5 w-5" />
            Go to Home
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => router.back()}
            className="w-full h-14"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Go Back
          </Button>
        </div>
      </motion.div>
    </div>
  )
}



