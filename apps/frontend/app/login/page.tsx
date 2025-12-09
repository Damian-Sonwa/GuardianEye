'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  
  // Redirect to unified auth page
  useEffect(() => {
    router.replace('/auth')
  }, [router])
  
  return null
}
