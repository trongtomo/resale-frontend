import SimpleNavigation from '@/components/SimpleNavigation'
import { api } from '@/lib/simple-api'
import Link from 'next/link'

export default async function SimpleHomePage() {
  let mainCategories = []
  let featuredProducts = []

  try {
    // Get main categories
    const categoriesData = await api.getMainCategories()
    mainCategories = categoriesData.data || []

    // Get some featured products
    const productsData = await api.getAllProducts()
    featuredProducts = (productsData.data || []).slice(0, 8)
  } catch (error) {
    console.error('Error fetching data:', error)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SimpleNavigation />
      
      <main>
        {/* Hero Section */}
        <div className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
                Welcome to Resale
              </h1>
              <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                Discover amazing products with our simple, clean interface
              </p>
              <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
                <div className="rounded-md shadow">
                  <Link
                    href="/simple-products"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                  >
                    Browse Products
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Section */}
        {mainCategories.length > 0 && (
          <div className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                Shop by Category
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {mainCategories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/simple-products?category=${category.slug}`}
                    className="group bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
                  >
                    <div className="p-8 text-center">
                      <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600">
                        {category.name}
                      </h3>
                      {category.description && (
                        <p className="mt-2 text-gray-600">{category.description}</p>
                      )}
                      {category.children && category.children.length > 0 && (
                        <div className="mt-4">
                          <p className="text-sm text-gray-500">
                            {category.children.length} subcategories
                          </p>
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Featured Products */}
        {featuredProducts.length > 0 && (
          <div className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                Featured Products
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={`/simple-products/${product.slug}`}
                    className="group bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
                  >
                    <div className="p-4">
                      {/* Product Image */}
                      <div className="aspect-square bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                        {product.images && product.images.length > 0 ? (
                          <img
                            src={product.images[0].url}
                            alt={product.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <div className="text-gray-400">No Image</div>
                        )}
                      </div>

                      {/* Product Info */}
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 line-clamp-2">
                        {product.name}
                      </h3>
                      
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xl font-bold text-gray-900">
                          ${(product.price / 100).toFixed(2)}
                        </span>
                        {product.brand && (
                          <span className="text-sm text-gray-500">{product.brand.name}</span>
                        )}
                      </div>

                      {product.category && (
                        <div className="mt-2">
                          <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                            {product.category.name}
                          </span>
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
              
              <div className="text-center mt-12">
                <Link
                  href="/simple-products"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-blue-50 hover:bg-blue-100"
                >
                  View All Products
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Simple Features */}
        <div className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-12">
                Why Choose Our Simple Approach?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-md bg-blue-500 text-white">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-gray-900">Fast & Simple</h3>
                  <p className="mt-2 text-gray-600">No complex queries, just simple API calls that work</p>
                </div>
                
                <div className="text-center">
                  <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-md bg-blue-500 text-white">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-gray-900">Reliable</h3>
                  <p className="mt-2 text-gray-600">Clean data structure with clear relationships</p>
                </div>
                
                <div className="text-center">
                  <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-md bg-blue-500 text-white">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-gray-900">Easy to Customize</h3>
                  <p className="mt-2 text-gray-600">Simple codebase that's easy to understand and modify</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
