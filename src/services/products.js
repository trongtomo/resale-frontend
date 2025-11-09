import { localData } from '@/lib/local-data'

export async function getProducts(page = 1, pageSize = 12, filters = {}) {
  try {
    const result = await localData.getProducts({
      page,
      pageSize,
      ...filters
    })
    return result
  } catch (error) {
    console.error('Error fetching products:', error)
    throw error
  }
}

export async function getProductBySlug(slug) {
  try {
    const result = await localData.getProductBySlug(slug)
    return result
  } catch (error) {
    console.error('Error fetching product by slug:', error)
    throw error
  }
}

export async function getFeaturedProducts(limit = 6) {
  try {
    const result = await localData.getProducts({
      page: 1,
      pageSize: limit
    })
    return result
  } catch (error) {
    console.error('Error fetching featured products:', error)
    throw error
  }
}
