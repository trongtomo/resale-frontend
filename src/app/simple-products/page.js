import SimpleNavigation from '@/components/SimpleNavigation'
import { api } from '@/lib/simple-api'

export default async function SimpleProductsPage({ searchParams }) {
  const resolvedSearchParams = await searchParams
  const category = resolvedSearchParams?.category

  let products = []
  let currentCategory = null
  let subcategories = []

  try {
    if (category) {
      // Get products for specific category
      const productsData = await api.getProductsByCategory(category)
      products = productsData.data || []

      // Get category info
      const categoriesData = await api.getAllCategories()
      const allCategories = categoriesData.data || []
      currentCategory = allCategories.find(cat => cat.slug === category)
      
      // Get subcategories if this is a main category
      if (currentCategory?.children && currentCategory.children.length > 0) {
        subcategories = allCategories.filter(cat => cat.parent?.slug === category)
      }
    } else {
      // Get all products
      const productsData = await api.getAllProducts()
      products = productsData.data || []
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SimpleNavigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {currentCategory ? currentCategory.name : 'All Products'}
          </h1>
          {currentCategory?.description && (
            <p className="mt-2 text-gray-600">{currentCategory.description}</p>
          )}
        </div>

        {/* Subcategories */}
        {subcategories.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Categories</h2>
            <div className="flex flex-wrap gap-2">
              {subcategories.map((sub) => (
                <a
                  key={sub.id}
                  href={`/simple-products?category=${sub.slug}`}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
                >
                  {sub.name}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
              <a href={`/simple-products/${product.slug}`}>
                <div className="p-6">
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
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  
                  {product.shortDescription && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {product.shortDescription}
                    </p>
                  )}

                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xl font-bold text-gray-900">
                      ${(product.price / 100).toFixed(2)}
                    </span>
                    {product.brand && (
                      <span className="text-sm text-gray-500">{product.brand.name}</span>
                    )}
                  </div>

                  {product.category && (
                    <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded inline-block">
                      {product.category.name}
                    </div>
                  )}
                </div>
              </a>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">No products found</div>
            <p className="text-gray-400 mt-2">Try selecting a different category</p>
          </div>
        )}
      </main>
    </div>
  )
}
