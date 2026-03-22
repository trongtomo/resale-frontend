import clientPromise from '@/lib/mongodb'

async function getDb() {
  const client = await clientPromise
  return client.db('chauchaublingstore')
}

export async function getCategories() {
  try {
    const db = await getDb()
    const col = db.collection('categories')
    const categories = await col.find({}).maxTimeMS(3000).toArray()
    return { data: categories }
  } catch (error) {
    console.error('Error fetching categories:', error)
    throw error
  }
}

export async function getCategoriesWithTags() {
  try {
    const db = await getDb()
    const col = db.collection('categories')
    const categories = await col.find({}).maxTimeMS(3000).toArray()
    return { data: categories }
  } catch (error) {
    console.error('Error fetching categories with tags:', error)
    throw error
  }
}
