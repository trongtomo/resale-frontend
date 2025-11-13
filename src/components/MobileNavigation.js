'use client'

import { api } from '@/lib/simple-api'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function MobileNavigation({ isOpen, onClose }) {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

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

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      
      <div className="relative ml-auto flex h-full w-full max-w-sm flex-col bg-white shadow-xl">
        <div className="flex items-center justify-between px-4 py-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6">
          <nav className="space-y-4">
            <Link 
              href="/" 
              className="block text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-base font-medium transition-colors"
              onClick={onClose}
            >
              Home
            </Link>
            
            {/* Categories as direct menu items */}
            {loading ? (
              <div className="text-gray-500 px-3 py-2 text-base">Loading categories...</div>
            ) : (
              categories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/products?category=${category.slug}`}
                  className="block text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-base font-medium transition-colors"
                  onClick={onClose}
                >
                  {category.name}
                </Link>
              ))
            )}
            
            <Link 
              href="/blog" 
              className="block text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-base font-medium transition-colors"
              onClick={onClose}
            >
              Blog
            </Link>
          </nav>
        </div>
      </div>
    </div>
  )
}
