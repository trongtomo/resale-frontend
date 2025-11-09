import { localData } from '@/lib/local-data'

// Cache for brands
let brandsCache = null
let brandsCacheTime = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export async function getBrands(categorySlug = null) {
  // Check if cache is still valid
  if (brandsCache && Date.now() - brandsCacheTime < CACHE_DURATION) {
    return brandsCache
  }

  try {
    const data = await localData.getBrands(categorySlug)
    
    // Update cache
    brandsCache = data
    brandsCacheTime = Date.now()
    
    return data
  } catch (error) {
    console.error('Error fetching brands:', error)
    // Return cached data if available, even if expired
    return brandsCache || { data: [] }
  }
}

// Get brands for display (just the data array)
export async function getBrandsForDisplay(categorySlug = null) {
  const response = await getBrands(categorySlug)
  return response.data || []
}
