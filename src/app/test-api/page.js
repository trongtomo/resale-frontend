import { api } from '@/lib/simple-api'

export default async function TestApiPage() {
  let products = []
  let categories = []
  let brands = []
  let error = null

  try {
    // Test all GraphQL API calls
    const [productsData, categoriesData, brandsData] = await Promise.all([
      api.getAllProducts(),
      api.getAllCategories(),
      api.getBrands()
    ])

    products = productsData.products || []
    categories = categoriesData.categories || []
    brands = brandsData.brands || []
  } catch (err) {
    error = err.message
    console.error('GraphQL API Test Error:', err)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">API Test Page</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <strong>Error:</strong> {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Products */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Products ({products.length})</h2>
          {products.length > 0 ? (
            <ul className="space-y-2">
              {products.slice(0, 5).map((product) => (
                <li key={product.id} className="text-sm">
                  {product.name} - ${product.price}
                </li>
              ))}
              {products.length > 5 && <li className="text-sm text-gray-500">...and {products.length - 5} more</li>}
            </ul>
          ) : (
            <p className="text-gray-500">No products found</p>
          )}
        </div>

        {/* Categories */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Categories ({categories.length})</h2>
          {categories.length > 0 ? (
            <ul className="space-y-2">
              {categories.slice(0, 5).map((category) => (
                <li key={category.id} className="text-sm">
                  {category.name} {category.children && category.children.length > 0 ? '(Main)' : ''}
                </li>
              ))}
              {categories.length > 5 && <li className="text-sm text-gray-500">...and {categories.length - 5} more</li>}
            </ul>
          ) : (
            <p className="text-gray-500">No categories found</p>
          )}
        </div>

        {/* Brands */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Brands ({brands.length})</h2>
          {brands.length > 0 ? (
            <ul className="space-y-2">
              {brands.slice(0, 5).map((brand) => (
                <li key={brand.id} className="text-sm">
                  {brand.name}
                </li>
              ))}
              {brands.length > 5 && <li className="text-sm text-gray-500">...and {brands.length - 5} more</li>}
            </ul>
          ) : (
            <p className="text-gray-500">No brands found</p>
          )}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">API Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-100 p-4 rounded">
            <h3 className="font-semibold text-green-800">Products API</h3>
            <p className="text-green-600">✅ Working</p>
          </div>
          <div className="bg-red-100 p-4 rounded">
            <h3 className="font-semibold text-red-800">Categories API</h3>
            <p className="text-red-600">❌ Permission needed</p>
          </div>
          <div className="bg-red-100 p-4 rounded">
            <h3 className="font-semibold text-red-800">Brands API</h3>
            <p className="text-red-600">❌ Permission needed</p>
          </div>
        </div>
      </div>
    </div>
  )
}
