'use client'

import { stopLoading } from '@/lib/loadingBar'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export default function LoadingBar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Complete loading bar when route changes (page loaded)
    stopLoading()
  }, [pathname, searchParams])

  return null
}