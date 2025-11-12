import AddToCartButton from '@/components/AddToCartButton'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import ProductPageClient from '@/components/ProductPageClient'
import ProductImageGallery from '@/components/ProductImageGallery'
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
      <ProductPageClient product={product} />
      <div className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
            <Link href="/" className="hover:text-gray-900">Home</Link>
            {product.category && (
              <>
                <span className="text-gray-400">/</span>
                <Link 
                  href={`/products?category=${product.category.slug}`} 
                  className="hover:text-gray-900"
                >
                  {product.category.name}
                </Link>
              </>
            )}
            <span className="text-gray-400">/</span>
            <span className="text-gray-900">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Images */}
          <div className="sticky top-8 h-fit">
            {product.images && product.images.length > 0 ? (
              <ProductImageGallery images={product.images} productName={product.name} />
            ) : (
              <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-gray-400 text-center">
                  <svg className="w-24 h-24 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-lg">No Image Available</p>
                </div>
              </div>
            )}
          </div>

          {/* Product Details */}
          <div>
            <div className="space-y-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                {product.shortDescription && (
                  <p className="text-lg text-gray-600">{product.shortDescription}</p>
                )}
              </div>
              
              <div className="flex items-center space-x-4">
                <span className="text-3xl font-bold text-gray-900">
                  {formatCurrency(product.price)}
                </span>
                {product.discount_price && (
                  <span className="text-xl text-gray-500 line-through">
                    {formatCurrency(product.discount_price)}
                  </span>
                )}
              </div>
            </div>

            {/* Product Actions */}
            <div className="space-y-3 mb-8">
              <AddToCartButton product={product} />
              <button className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                Add to Wishlist
              </button>
            </div>

            {/* Product Description */}
            {product.description && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-3">Description</h2>
                <div className="prose prose-sm max-w-none">
                  <MarkdownRenderer content={product.description} />
                </div>
              </div>
            )}

            {/* Product Content (MDX) */}
            {product.content && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-3">Details</h2>
                <div className="prose prose-sm max-w-none">
                  <MarkdownRenderer content={product.content} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
