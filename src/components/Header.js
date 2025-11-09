'use client'

import { api } from '@/lib/simple-api'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import Cart from './Cart'
import CartIcon from './CartIcon'
import CategoryDropdown from './CategoryDropdown'
import MobileNavigation from './MobileNavigation'
import SearchBar from './SearchBar'

export default function Header() {
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Get all categories for the Products dropdown
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

  const handleDropdownToggle = (dropdownName) => {
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName)
  }

  const handleDropdownClose = () => {
    setActiveDropdown(null)
  }

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
            
            {/* Products Dropdown */}
            <div className="relative group">
              <Link 
                href="/products" 
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center"
                onMouseEnter={() => handleDropdownToggle('products')}
              >
                Products
                <svg
                  className={`ml-1 h-4 w-4 transition-transform ${activeDropdown === 'products' ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>

              {activeDropdown === 'products' && (
                <div 
                  className="absolute left-0 z-50 mt-1 w-56 origin-top-left rounded-lg bg-white shadow-lg border border-gray-200"
                  onMouseLeave={handleDropdownClose}
                >
                  <div className="py-2">
                    {loading ? (
                      <div className="px-4 py-2 text-sm text-gray-500">Loading...</div>
                    ) : categories.length > 0 ? (
                      <div className="grid grid-cols-1">
                        {categories.map((category) => (
                          <Link
                            key={category.slug}
                            href={`/products?category=${category.slug}`}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            onClick={handleDropdownClose}
                          >
                            {category.name}
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="px-4 py-2 text-sm text-gray-500">No categories available</div>
                    )}
                  </div>
                </div>
              )}
            </div>

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
