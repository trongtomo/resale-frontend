import AddToCartButton from '@/components/AddToCartButton'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import { api } from '@/lib/simple-api'
import { formatCurrency, formatDate, truncateText } from '@/utils/format'
import Link from 'next/link'

// Allow caching for better performance

export default async function Home() {
  let categories = []
  let products = []
  let error = null

  try {
    const [categoriesData, productsData] = await Promise.all([
      api.getMainCategories(),
      api.getAllProducts()
    ])
    categories = categoriesData.categories || []
    products = (productsData.products || []).slice(0, 6) // Get first 6 products as featured
  } catch (err) {
    error = err.message
    console.error('Failed to fetch data:', err)
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Welcome to Resale
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              A clean client commerce storefront built with Next.js
            </p>
            <div className="space-x-4">
              <Link 
                href="/products" 
                className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Shop Products
              </Link>
              <Link 
                href="/blog" 
                className="inline-block border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                Read Blog
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Features</h2>
            <p className="text-lg text-gray-600">Modern web technologies for a great user experience</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast & Modern</h3>
              <p className="text-gray-600">Built with Next.js 15 and React 18 for optimal performance</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">User Friendly</h3>
              <p className="text-gray-600">Clean, intuitive interface designed for the best user experience</p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Developer Ready</h3>
              <p className="text-gray-600">Well-structured codebase with modern development practices</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
            <p className="text-lg text-gray-600">Discover our premium collection</p>
          </div>
          
          {error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
              <p className="text-red-600">Unable to load products: {error}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.slice(0, 6).map((product) => (
                <Link 
                  key={product.documentId} 
                  href={`/products/${product.slug}`}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow group"
                >
                  <div className="aspect-square bg-gray-100 flex items-center justify-center">
                    <div className="text-gray-400 text-center">
                      <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                      <p className="text-sm">No image</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {product.name}
                    </h3>
                    <div className="text-gray-600 text-sm mb-3">
                      {product.shortDescription ? (
                        <p>{truncateText(product.shortDescription, 80)}</p>
                      ) : product.description ? (
                        <div className="prose prose-sm max-w-none">
                          <MarkdownRenderer 
                            content={truncateText(product.description.replace(/[#*]/g, ''), 80)} 
                          />
                        </div>
                      ) : null}
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold text-gray-900">
                        {formatCurrency(product.price)}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        product.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.status}
                      </span>
                    </div>
                    <AddToCartButton product={product} className="w-full" />
                  </div>
                </Link>
              ))}
            </div>
          )}
          
          {products.length > 6 && (
            <div className="text-center mt-8">
              <Link 
                href="/products" 
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                View All Products
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Categories Preview Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Shop by Category</h2>
            <p className="text-lg text-gray-600">Explore our product categories</p>
          </div>
          
          {error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
              <p className="text-red-600">Unable to load categories: {error}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.slice(0, 6).map((category) => (
                <Link 
                  key={category.documentId} 
                  href={`/products?category=${category.slug}`}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">{category.description || 'No description'}</p>
                  <div className="text-xs text-gray-500">
                    <p>Created: {formatDate(category.createdAt)}</p>
                    <p>Published: {formatDate(category.publishedAt)}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
          
          {categories.length > 6 && (
            <div className="text-center mt-8">
              <Link 
                href="/products" 
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                View All Categories
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
