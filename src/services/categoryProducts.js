import clientPromise from '@/lib/mongodb'

async function getDb() {
  const client = await clientPromise
  return client.db('chauchaublingstore')
}

// Get categories with their associated tags (lightweight)
export async function getCategoriesWithTags() {
  try {
    const db = await getDb()
    const col = db.collection('categories')
    const categories = await col.find({}).toArray()
    return { data: categories }
  } catch (error) {
    console.error('Error fetching categories with tags:', error)
    throw error
  }
}

// Get just categories (for direct links)
export async function getCategoryProducts(options = {}) {
  try {
    const db = await getDb()
    const col = db.collection('categories')
    const categories = await col.find({}).toArray()
    return { data: categories }
  } catch (error) {
    console.error('Error fetching product categories:', error)
    throw error
  }
}