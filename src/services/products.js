import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

async function getDb() {
  const client = await clientPromise
  return client.db('chauchaublingstore')
}

export async function getProducts(page = 1, pageSize = 12, filters = {}) {
  try {
    const db = await getDb()
    const col = db.collection('products')
    let query = { status: 'active' }

    if (filters.category) {
      // Try to find by ObjectId first (if it's an ID)
      if (ObjectId.isValid(filters.category)) {
        query['category._id'] = new ObjectId(filters.category)
      } else {
        // If not ObjectId, treat as slug
        query['category.slug'] = filters.category
      }
    }
    if (filters.selectedBrand) query['brand.documentId'] = filters.selectedBrand
    if (filters.priceMin || filters.priceMax) {
      query.price = {}
      if (filters.priceMin) query.price.$gte = parseInt(filters.priceMin)
      if (filters.priceMax) query.price.$lte = parseInt(filters.priceMax)
    }

    let sort = { createdAt: -1 }
    if (filters.sortBy === 'price-asc') sort = { price: 1 }
    if (filters.sortBy === 'price-desc') sort = { price: -1 }

    const page = filters.page || 1
    const pageSize = filters.pageSize || 12
    
    const total = await col.countDocuments(query, { maxTimeMS: 3000 })
    const products = await col.find(query)
      .sort(sort)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .maxTimeMS(5000)
      .toArray()

    return {
      data: products,
      meta: { pagination: { page, pageSize, pageCount: Math.ceil(total / pageSize), total } }
    }
  } catch (error) {
    console.error('Error fetching products:', error)
    throw error
  }
}

export async function getProductBySlug(slug) {
  try {
    const db = await getDb()
    const col = db.collection('products')
    
    const product = await col.findOne(
      { slug, status: 'active' }, 
      { maxTimeMS: 5000 }
    )
    
    return { data: product ? [product] : [] }
  } catch (error) {
    console.error('Error fetching product by slug:', error)
    throw error
  }
}

export async function getFeaturedProducts(limit = 6) {
  try {
    const db = await getDb()
    const col = db.collection('products')
    
    const products = await col.find({ status: 'active' })
      .sort({ createdAt: -1 })
      .limit(limit)
      .maxTimeMS(5000)
      .toArray()
    
    return { data: products }
  } catch (error) {
    console.error('Error fetching featured products:', error)
    throw error
  }
}
