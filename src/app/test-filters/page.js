import { api } from '@/lib/simple-api'

export default async function TestFiltersPage() {
  let shoesProducts = []
  let runningProducts = []
  let sneakerProducts = []
  let brands = []
  let error = null

  try {
    // Test parent category (Shoes)
    const shoesData = await api.getProductsByParentCategory('shoes')
    shoesProducts = shoesData.products || []

    // Test subcategories
    const runningData = await api.getProductsByCategory('running')
    runningProducts = runningData.products || []

    const sneakerData = await api.getProductsByCategory('sneaker')
    sneakerProducts = sneakerData.products || []

    // Test brands
    const brandsData = await api.getBrands()
    brands = brandsData.brands || []
  } catch (err) {
    error = err.message
    console.error('Test Filters Error:', err)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Filter Testing</h1>
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">Error: {error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Shoes Category (Parent) */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Shoes Category (Parent)</h2>
            <p className="text-sm text-gray-600 mb-4">
              Should show both Running and Sneaker products
            </p>
            {shoesProducts.length > 0 ? (
              <div className="space-y-2">
                {shoesProducts.map((product) => (
                  <div key={product.documentId} className="p-3 bg-gray-50 rounded">
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-600">
                      {product.category.name} - {product.brand.name}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No products found</p>
            )}
          </div>

          {/* Running Category */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Running Category</h2>
            <p className="text-sm text-gray-600 mb-4">
              Should show only Running products
            </p>
            {runningProducts.length > 0 ? (
              <div className="space-y-2">
                {runningProducts.map((product) => (
                  <div key={product.documentId} className="p-3 bg-gray-50 rounded">
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-600">
                      {product.category.name} - {product.brand.name}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No products found</p>
            )}
          </div>

          {/* Sneaker Category */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Sneaker Category</h2>
            <p className="text-sm text-gray-600 mb-4">
              Should show only Sneaker products
            </p>
            {sneakerProducts.length > 0 ? (
              <div className="space-y-2">
                {sneakerProducts.map((product) => (
                  <div key={product.documentId} className="p-3 bg-gray-50 rounded">
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-600">
                      {product.category.name} - {product.brand.name}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No products found</p>
            )}
          </div>

          {/* Brands */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Available Brands</h2>
            <p className="text-sm text-gray-600 mb-4">
              Brands for filtering
            </p>
            {brands.length > 0 ? (
              <div className="space-y-2">
                {brands.map((brand) => (
                  <div key={brand.documentId} className="p-3 bg-gray-50 rounded">
                    <p className="font-medium">{brand.name}</p>
                    <p className="text-sm text-gray-600">ID: {brand.documentId}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No brands found</p>
            )}
          </div>
        </div>

        <div className="mt-8 text-center">
          <a 
            href="/products?category=shoes" 
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Test Shoes Category
          </a>
        </div>
      </div>
    </div>
  )
}
