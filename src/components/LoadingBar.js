'use client'

import { stopLoading } from '@/lib/loadingBar'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, Suspense } from 'react'

function LoadingBarContent() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Complete loading bar when route changes (page loaded)
    stopLoading()
  }, [pathname, searchParams])

  return null
}

export default function LoadingBar() {
  return (
    <Suspense fallback={null}>
      <LoadingBarContent />
    </Suspense>
  )
}