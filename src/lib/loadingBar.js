import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

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

// Global loading bar functions
export const startLoading = () => NProgress.start()
export const stopLoading = () => NProgress.done()

// Auto-start loading on any click
if (typeof window !== 'undefined') {
  document.addEventListener('click', (e) => {
    const target = e.target.closest('a')
    if (target && target.href) {
      const url = new URL(target.href)
      const currentUrl = new URL(window.location.href)
      
      // Only start loading if it's an internal link AND the URL is different
      if (url.origin === window.location.origin && url.pathname !== currentUrl.pathname) {
        startLoading()
      }
    }
  })
}
