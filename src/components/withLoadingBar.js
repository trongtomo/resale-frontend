'use client'

import { useRouter } from 'next/navigation'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { useEffect } from 'react'

// Configure NProgress
NProgress.configure({
  showSpinner: false,
  speed: 500,
  minimum: 0.1,
  template: `
    <div class="bar" role="bar">
      <div class="peg"></div>
    </div>
    <div class="spinner" role="spinner">
      <div class="spinner-icon"></div>
    </div>
  `
})

export default function withLoadingBar(WrappedComponent) {
  return function LoadingBarWrapper(props) {
    const router = useRouter()

    useEffect(() => {
      // Intercept all link clicks
      const handleClick = (e) => {
        const target = e.target.closest('a')
        if (target && target.href) {
          const url = new URL(target.href)
          // Only for internal links
          if (url.origin === window.location.origin) {
            NProgress.start()
          }
        }
      }

      // Add event listener
      document.addEventListener('click', handleClick)

      return () => {
        document.removeEventListener('click', handleClick)
        NProgress.done()
      }
    }, [])

    return <WrappedComponent {...props} />
  }
}
