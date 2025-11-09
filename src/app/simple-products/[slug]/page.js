import SimpleNavigation from '@/components/SimpleNavigation'
import { api } from '@/lib/simple-api'
import { notFound } from 'next/navigation'

export default async function SimpleProductPage({ params }) {
  const resolvedParams = await params
  const slug = resolvedParams?.slug

  let product = null

  try {
    const data = await api.getProduct(slug)
    product = data.data?.[0] || null
  } catch (error) {
    console.error('Error fetching product:', error)
  }

  if (!product) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SimpleNavigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div>
            <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[0].url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No Image Available
                </div>
              )}
            </div>
          </div>

          {/* Product Details */}
          <div>
            <div className="mb-4">
              {product.brand && (
                <div className="text-sm text-gray-500 mb-2">{product.brand.name}</div>
              )}
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
              
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-3xl font-bold text-gray-900">
                  ${(product.price / 100).toFixed(2)}
                </span>
                {product.discountPrice && (
                  <span className="text-xl text-gray-500 line-through">
                    ${(product.discountPrice / 100).toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            {product.shortDescription && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
                <p className="text-gray-600">{product.shortDescription}</p>
              </div>
            )}

            {product.description && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Details</h2>
                <div 
                  className="text-gray-600 prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </div>
            )}

            {/* Product Info */}
            <div className="border-t pt-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-900">SKU:</span>
                  <span className="ml-2 text-gray-600">{product.sku || 'N/A'}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Status:</span>
                  <span className="ml-2 text-gray-600 capitalize">{product.status}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Stock:</span>
                  <span className="ml-2 text-gray-600">{product.stockQuantity || 0}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Category:</span>
                  <span className="ml-2 text-gray-600">{product.category?.name || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Add to Cart Button */}
            <div className="mt-8">
              <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
