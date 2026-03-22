import clientPromise from '@/lib/mongodb'

async function getDb() {
  const client = await clientPromise
  return client.db('chauchaublingstore')
}

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
    const db = await getDb()
    const col = db.collection('brands')
    let brands

    if (categorySlug) {
      const productCol = db.collection('products')
      const products = await productCol.find({ 'category.slug': categorySlug }).toArray()
      const brandIds = [...new Set(products.map(p => p.brand?.documentId).filter(Boolean))]
      brands = await col.find({ documentId: { $in: Array.from(brandIds) } }).maxTimeMS(3000).toArray()
    } else {
      brands = await col.find({}).maxTimeMS(3000).toArray()
    }

    const result = { data: brands }
    
    // Update cache
    brandsCache = result
    brandsCacheTime = Date.now()
    
    return result
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
