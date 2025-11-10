import AddToCartButton from '@/components/AddToCartButton'
import { api } from '@/lib/simple-api'
import { formatCurrency } from '@/utils/format'
import Image from 'next/image'
import Link from 'next/link'

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
    products = (productsData.products || []).filter(p => p.status === 'active').slice(0, 8)
  } catch (err) {
    error = err.message
    console.error('Failed to fetch data:', err)
  }

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <section className="relative bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Hot Deal Shoes
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-300">
              Find the best deals on shoes and more
            </p>
            {categories.length > 0 ? (
              <Link
                href={`/products?category=${categories[0].slug}`}
                className="inline-block bg-white text-gray-900 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-lg"
              >
                Shop Now
              </Link>
            ) : (
              <span className="inline-block bg-gray-600 text-white px-8 py-4 rounded-lg font-semibold text-lg cursor-not-allowed">
                Shop Now
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {products.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Products</h2>
              <p className="text-lg text-gray-600">Handpicked items just for you</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <Link
                  key={product.documentId}
                  href={`/products/${product.slug}`}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="aspect-square bg-gray-100 relative overflow-hidden">
                    {product.images && product.images.length > 0 ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                    {product.shortDescription && (
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {product.shortDescription}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-gray-900">
                        {formatCurrency(product.price)}
                      </span>
                    </div>
                    <div className="mt-3">
                      <AddToCartButton product={product} className="w-full" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {products.length >= 8 && categories.length > 0 && (
              <div className="text-center mt-12">
                <Link
                  href={`/products?category=${categories[0].slug}`}
                  className="inline-block bg-gray-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                >
                  View All Products
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Categories */}
      {categories.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Shop by Category</h2>
              <p className="text-lg text-gray-600">Browse our collections</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map((category) => (
                <Link
                  key={category.documentId}
                  href={`/products?category=${category.slug}`}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-300 text-center group"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="text-gray-600 text-sm">
                      {category.description}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Empty State */}
      {products.length === 0 && !error && (
        <section className="py-32 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Hot Deal Shoes</h2>
            <p className="text-lg text-gray-600 mb-8">Find the best deals on shoes and more</p>
            {categories.length > 0 && (
              <Link
                href={`/products?category=${categories[0].slug}`}
                className="inline-block bg-gray-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
              >
                Browse Shoes
              </Link>
            )}
          </div>
        </section>
      )}
    </div>
  )
}
