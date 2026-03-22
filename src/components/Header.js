'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import Cart from './Cart'
import CartIcon from './CartIcon'
import MobileNavigation from './MobileNavigation'
import SearchBar from './SearchBar'
import ThemeToggle from './ThemeToggle'

export default function Header() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Get all categories for the main menu via API
        const response = await fetch('/api/categories')
        const data = await response.json()
        setCategories(data.data || [])
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
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <img 
                src="/images/logo_v3.png" 
                alt="chauchaubling" 
                className="h-8 w-auto"
              />
              
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <SearchBar placeholder="Search items..." />
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <Link 
              href="/" 
              className="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Home
            </Link>
            
            {/* Categories as direct menu items */}
            {loading ? (
              <div className="text-gray-500 dark:text-gray-400 px-3 py-2 text-sm">Loading...</div>
            ) : (
              categories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/products?category=${category.slug}`}
                  className="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {category.name}
                </Link>
              ))
            )}

            <Link 
              href="/blog" 
              className="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Blog
            </Link>
          </nav>

          {/* Cart, Theme Toggle and Mobile Menu */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <CartIcon onClick={handleCartToggle} />
            
            <div className="md:hidden">
              <button 
                onClick={handleMobileMenuToggle}
                className="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white focus:outline-none focus:text-gray-900 dark:focus:text-white"
              > 
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-4 py-3 transition-colors">
        <SearchBar placeholder="Search items..." />
      </div>

      {/* Cart Sidebar */}
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      
      {/* Mobile Navigation */}
      <MobileNavigation isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </header>
  )
}
