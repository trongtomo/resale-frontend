'use client'

import { api } from '@/lib/simple-api'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function SimpleNavigation() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await api.getAllCategories()
        setCategories(data.data || [])
      } catch (error) {
        console.error('Error fetching categories:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  if (loading) {
    return (
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="text-xl font-bold text-gray-900">Resale</div>
            </div>
            <div className="flex items-center space-x-8">
              <div className="animate-pulse bg-gray-200 h-4 w-20 rounded"></div>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  // Group categories by main category
  const mainCategories = categories.filter(cat => cat.children && cat.children.length > 0)
  const subCategories = categories.filter(cat => cat.parent)

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900">
              Resale
            </Link>
          </div>
          
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-gray-900">
              Home
            </Link>
            
            {mainCategories.map((mainCategory) => (
              <div key={mainCategory.id} className="relative group">
                <Link 
                  href={`/products?category=${mainCategory.slug}`}
                  className="text-gray-700 hover:text-gray-900 flex items-center"
                >
                  {mainCategory.name}
                  <svg className="ml-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
                
                {/* Dropdown */}
                <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-1">
                    {subCategories
                      .filter(sub => sub.parent?.slug === mainCategory.slug)
                      .map((subCategory) => (
                        <Link
                          key={subCategory.id}
                          href={`/products?category=${subCategory.slug}`}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          {subCategory.name}
                        </Link>
                      ))}
                  </div>
                </div>
              </div>
            ))}
            
            <Link href="/blog" className="text-gray-700 hover:text-gray-900">
              Blog
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
