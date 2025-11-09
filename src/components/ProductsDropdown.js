'use client'

import { getCategoryProducts } from '@/services/categoryProducts'
import { getProducts } from '@/services/products'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function ProductsDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const [categories, setCategories] = useState([])
  const [categoryTags, setCategoryTags] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') {
      setLoading(false)
      return
    }

    const fetchData = async () => {
      try {
        console.log('Starting to fetch dropdown data...')
        
        // Get all categories and products
        const [categoryProductsData, productsData] = await Promise.all([
          getCategoryProducts({ populate: 'parent' }),
          getProducts(1, 100, { populate: '*' })
        ])
        
        console.log('All Categories:', categoryProductsData)
        console.log('Products with relations:', productsData)
        console.log('Categories data length:', categoryProductsData.data?.length)
        
        // Build hierarchy from all categories
        const allCategories = categoryProductsData.data || []
        const categoriesMap = new Map()
        const hierarchy = {}
        const rootCategories = []
        
        // First, map all categories
        allCategories.forEach(category => {
          categoriesMap.set(category.slug, category)
        })
        
        // Build hierarchy - show root categories and their children
        allCategories.forEach(category => {
          console.log('Processing category:', category.name, 'parent:', category.parent)
          
          if (category.parent && category.parent.length > 0) {
            // This category has children - it's a root category
            console.log('Adding root category:', category.name, 'with children:', category.parent.length)
            rootCategories.push(category)
            hierarchy[category.slug] = category.parent
          } else {
            // Check if this is a root category (no children, not a child of others)
            const isChild = allCategories.some(otherCategory => 
              otherCategory.parent && otherCategory.parent.some(child => child.slug === category.slug)
            )
            
            if (!isChild) {
              // This is a root category with no children
              console.log('Adding root category with no children:', category.name)
              rootCategories.push(category)
              hierarchy[category.slug] = []
            }
          }
        })
        
        console.log('Root categories found:', rootCategories.length)
        console.log('Hierarchy:', hierarchy)
        
        // Group tags by category from products
        const tagsByCategory = {}
        productsData.data?.forEach(product => {
          if (product.category_products && product.category_products.length > 0) {
            product.category_products.forEach(category => {
              if (!tagsByCategory[category.slug]) {
                tagsByCategory[category.slug] = new Set()
              }
              
              if (product.tags && product.tags.length > 0) {
                product.tags.forEach(tag => {
                  tagsByCategory[category.slug].add(tag)
                })
              }
            })
          }
        })
        
        // Combine root categories with their subcategories
        const categoriesWithHierarchy = rootCategories.map(root => ({
          ...root,
          subcategories: hierarchy[root.slug] || []
        }))
        
        setCategories(categoriesWithHierarchy)
        
        // Convert Sets to Arrays
        const categoryTagsArray = {}
        Object.keys(tagsByCategory).forEach(categorySlug => {
          categoryTagsArray[categorySlug] = Array.from(tagsByCategory[categorySlug])
        })
        
        console.log('Final categories with hierarchy:', categoriesWithHierarchy)
        console.log('Tags by category:', categoryTagsArray)
        console.log('Final categories state length:', categoriesWithHierarchy.length)
        setCategoryTags(categoryTagsArray)
      } catch (error) {
        console.error('Error fetching dropdown data:', error)
        console.error('Error details:', error.message)
        console.error('Error stack:', error.stack)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="relative">
        <button className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">
          Products
          <svg
            className="ml-1 h-4 w-4 animate-spin"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004 12.582m0 0V19m15.418-2.582A8.001 8.001 0 0020 12.582m0 0V5h-.582"
            />
          </svg>
        </button>
      </div>
    )
  }

  console.log('Rendering dropdown with categories:', categories)
  console.log('Categories length:', categories.length)

  return (
    <div className="relative">
      <button
        onMouseEnter={() => setIsOpen(true)}
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center"
      >
        Products
        <svg
          className={`ml-1 h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div 
          className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
                  <div className="py-2">
                    {categories.length > 0 ? (
                      <>
                        {categories.map((rootCategory) => (
                          <div key={rootCategory.slug}>
                            {/* Root Category Header */}
                            <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-100">
                              {rootCategory.name}
                            </div>
                            
                            {/* Subcategories */}
                            {rootCategory.subcategories && rootCategory.subcategories.length > 0 ? (
                              rootCategory.subcategories.map((subcategory) => {
                                const hasTags = categoryTags[subcategory.slug] && categoryTags[subcategory.slug].length > 0

                                return (
                                  <div key={subcategory.slug} className="relative group">
                                    {hasTags ? (
                                      // Subcategory with tags - show arrow and submenu
                                      <>
                                        <div className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                                          <span>{subcategory.name}</span>
                                          <svg
                                            className="h-4 w-4 text-gray-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                          >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                          </svg>
                                        </div>
                                        
                                        {/* Tags Submenu */}
                                        <div className="absolute left-full top-0 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                          <div className="py-2">
                                            {categoryTags[subcategory.slug].map((tag) => (
                                              <Link
                                                key={tag.slug}
                                                href={`/products?category=${subcategory.slug}&tag=${tag.slug}`}
                                                className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 transition-colors"
                                                onClick={() => setIsOpen(false)}
                                              >
                                                {tag.name}
                                              </Link>
                                            ))}
                                          </div>
                                        </div>
                                      </>
                                    ) : (
                                      // Subcategory without tags - direct link
                                      <Link
                                        href={`/products?category=${subcategory.slug}`}
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                        onClick={() => setIsOpen(false)}
                                      >
                                        {subcategory.name}
                                      </Link>
                                    )}
                                  </div>
                                )
                              })
                            ) : (
                              // No subcategories - show root category as direct link
                              <Link
                                href={`/products?category=${rootCategory.slug}`}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                onClick={() => setIsOpen(false)}
                              >
                                {rootCategory.name}
                              </Link>
                            )}
                          </div>
                        ))}
                      </>
                    ) : (
                      <div className="px-4 py-2 text-sm text-gray-500">
                        No categories available
                      </div>
                    )}
                  </div>
        </div>
      )}
    </div>
  )
}
