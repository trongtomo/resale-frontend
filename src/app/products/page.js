import { getCategories } from '@/services/categories'
import { getProducts } from '@/services/products'
import ProductGrid from '@/components/ProductGrid'

export const metadata = {
  title: 'Products - chauchaubling',
  description: 'Browse our collection of fashion items',
}

export default async function ProductsPage({ searchParams }) {
  const resolvedSearchParams = await searchParams
  const page = parseInt(resolvedSearchParams?.page || '1')
  const pageSize = 12
  const category = resolvedSearchParams?.category
  const brand = resolvedSearchParams?.brand
  const priceMin = resolvedSearchParams?.priceMin
  const priceMax = resolvedSearchParams?.priceMax
  const sortBy = resolvedSearchParams?.sortBy

  // Build filters object
  const filters = {
    category,
    selectedBrand: brand,
    priceMin,
    priceMax,
    sortBy,
    page,
    pageSize
  }

  try {
    const [categoriesData, productsData] = await Promise.all([
      getCategories(),
      getProducts(page, pageSize, filters)
    ])

    const categories = categoriesData.data || []
    const products = productsData.data || []
    const pagination = productsData.meta?.pagination || { page: 1, pageCount: 1, total: 0 }

    return (
      <ProductGrid 
        products={products}
        categories={categories}
        pagination={pagination}
        currentFilters={filters}
      />
    )
  } catch (error) {
    console.error('Error fetching products:', error)
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Error</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-4">Failed to load products</p>
        </div>
      </div>
    )
  }
}

