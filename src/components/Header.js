'use client'

import { api } from '@/lib/simple-api'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import Cart from './Cart'
import CartIcon from './CartIcon'
import MobileNavigation from './MobileNavigation'
import SearchBar from './SearchBar'

export default function Header() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Get all categories for the main menu
        const data = await api.getAllCategories()
        setCategories(data.categories || [])
      } catch (error) {
        console.error('Error fetching categories:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const handleCartToggle = () => {
    setIsCartOpen(!isCartOpen)
  }

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              Resale
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <SearchBar placeholder="Search products..." />
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <Link 
              href="/" 
              className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Home
            </Link>
            
            {/* Categories as direct menu items */}
            {loading ? (
              <div className="text-gray-500 px-3 py-2 text-sm">Loading...</div>
            ) : (
              categories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/products?category=${category.slug}`}
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {category.name}
                </Link>
              ))
            )}

            <Link 
              href="/blog" 
              className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Blog
            </Link>
            <Link 
              href="/tags" 
              className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Tags
            </Link>
          </nav>

          {/* Cart and Mobile Menu */}
          <div className="flex items-center space-x-4">
            <CartIcon onClick={handleCartToggle} />
            
            <div className="md:hidden">
              <button 
                onClick={handleMobileMenuToggle}
                className="text-gray-700 hover:text-gray-900 focus:outline-none focus:text-gray-900"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" suppressHydrationWarning>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden border-t bg-gray-50 px-4 py-3">
        <SearchBar placeholder="Search products..." />
      </div>

      {/* Cart Sidebar */}
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      
      {/* Mobile Navigation */}
      <MobileNavigation isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </header>
  )
}
