'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const router = useRouter()
  
  // Redirect to unified auth page with signup mode
  useEffect(() => {
    router.replace('/auth?mode=signup')
  }, [router])
  
  return null
}
