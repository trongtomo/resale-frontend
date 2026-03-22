import clientPromise from '@/lib/mongodb'

async function getDb() {
  const client = await clientPromise
  return client.db('chauchaublingstore')
}

export async function getArticles(page = 1, pageSize = 9) {
  try {
    const db = await getDb()
    const col = db.collection('articles')
    
    // Add timeout and use lean query for better performance
    const total = await col.countDocuments({}, { maxTimeMS: 3000 })
    const articles = await col.find({})
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .maxTimeMS(5000)
      .toArray()

    return {
      data: articles,
      meta: { pagination: { page, pageSize, pageCount: Math.ceil(total / pageSize), total } }
    }
  } catch (error) {
    console.error('Error fetching articles:', error)
    throw error
  }
}

export async function getArticleBySlug(slug) {
  try {
    const db = await getDb()
    const col = db.collection('articles')
    
    // Use lean query and timeout for better performance
    const article = await col.findOne(
      { slug }, 
      { maxTimeMS: 5000 }
    )
    
    return { data: article ? [article] : [] }
  } catch (error) {
    console.error('Error fetching article by slug:', error)
    throw error
  }
}

export async function getArticlesByTag(tagSlug, page = 1, pageSize = 9) {
  try {
    const db = await getDb()
    const col = db.collection('articles')
    
    const total = await col.countDocuments({}, { maxTimeMS: 3000 })
    const articles = await col.find({})
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .maxTimeMS(5000)
      .toArray()

    return {
      data: articles,
      meta: { pagination: { page, pageSize, pageCount: Math.ceil(total / pageSize), total } }
    }
  } catch (error) {
    console.error('Error fetching articles by tag:', error)
    throw error
  }
}
