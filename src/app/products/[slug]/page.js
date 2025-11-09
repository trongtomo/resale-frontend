import AddToCartButton from '@/components/AddToCartButton'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import { api } from '@/lib/simple-api'
import { formatCurrency, formatDate } from '@/utils/format'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }) {
  const { slug } = await params
  
  try {
    const data = await api.getProduct(slug)
    const product = data.products?.[0]
    
    if (!product) {
      return {
        title: 'Product Not Found',
        description: 'The requested product could not be found.'
      }
    }

    return {
      title: product.name,
      description: product.shortDescription || product.description?.replace(/[#*]/g, '').substring(0, 160)
    }
  } catch (error) {
    return {
      title: 'Product Not Found',
      description: 'The requested product could not be found.'
    }
  }
}

export default async function ProductPage({ params }) {
  const { slug } = await params
  let product = null
  let error = null

  try {
    const data = await api.getProduct(slug)
    product = data.products?.[0]
    
    if (!product) {
      notFound()
    }
  } catch (err) {
    error = err.message
    console.error('Failed to fetch product:', err)
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
          <p className="text-gray-600 mb-4">Failed to load product: {error}</p>
          <Link 
            href="/products" 
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Products
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
            <Link href="/" className="hover:text-gray-900">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-gray-900">Products</Link>
            <span>/</span>
            <span className="text-gray-900">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-gray-400 text-center">
              <svg className="w-24 h-24 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <p className="text-lg">Product Image</p>
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <p className="text-lg text-gray-600 mb-4">{product.shortDescription}</p>
              
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-3xl font-bold text-gray-900">
                  {formatCurrency(product.price)}
                </span>
                {product.discount_price && (
                  <span className="text-xl text-gray-500 line-through">
                    {formatCurrency(product.discount_price)}
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-4 mb-6">
                <span className={`px-3 py-1 text-sm rounded-full ${
                  product.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {product.status}
                </span>
              </div>
            </div>

            {/* Product Actions */}
            <div className="space-y-4">
              <AddToCartButton product={product} />
              <button className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                Add to Wishlist
              </button>
            </div>

            {/* Product Info */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Information</h3>
              <dl className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="font-medium text-gray-600">Status</dt>
                  <dd className="text-gray-900 capitalize">{product.status}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-600">Published</dt>
                  <dd className="text-gray-900">{formatDate(product.publishedAt)}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* Product Description */}
        {product.description && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Description</h2>
            <MarkdownRenderer content={product.description} />
          </div>
        )}

        <div className="mt-12 text-center">
          <Link 
            href="/products" 
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Products
          </Link>
        </div>
      </div>
    </div>
  )
}
