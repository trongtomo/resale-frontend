import Footer from '@/components/Footer'
import Header from '@/components/Header'
import LoadingBar from '@/components/LoadingBar'
import ScrollToTop from '@/components/ScrollToTop'
import { CartProvider } from '@/contexts/CartContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import '@/lib/loadingBar'; // Initialize loading bar
import '@/styles/nprogress.css'
import './globals.css'

export const metadata = {
  title: 'chauchaubling - Fashion, Accessories & More',
  description: 'Your go-to spot for affordable, curated fashion, accessories and more',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors">
        <div className="dark:hidden fixed inset-0 -z-10">
          <img 
            src="/images/background_chauchaubling.png" 
            alt="Background" 
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        <ThemeProvider>
          <CartProvider>
            <LoadingBar />
            <Header />
            <main className="flex-1 relative z-0">
              {children}
            </main>
            <Footer />
            <ScrollToTop />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
