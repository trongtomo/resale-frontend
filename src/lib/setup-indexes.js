import clientPromise from './mongodb'

async function setupIndexes() {
  try {
    const client = await clientPromise
    const db = client.db('chauchaublingstore')
    
    console.log('Setting up MongoDB indexes...')
    
    // Articles collection indexes
    const articlesCollection = db.collection('articles')
    await articlesCollection.createIndex({ slug: 1 }, { unique: true })
    await articlesCollection.createIndex({ createdAt: -1 })
    await articlesCollection.createIndex({ publishedAt: -1 })
    console.log('✅ Articles indexes created')
    
    // Products collection indexes
    const productsCollection = db.collection('products')
    await productsCollection.createIndex({ slug: 1 }, { unique: true })
    await productsCollection.createIndex({ createdAt: -1 })
    await productsCollection.createIndex({ status: 1 })
    await productsCollection.createIndex({ 'category.slug': 1 })
    await productsCollection.createIndex({ 'brand.documentId': 1 })
    await productsCollection.createIndex({ price: 1 })
    console.log('✅ Products indexes created')
    
    // Categories collection indexes
    const categoriesCollection = db.collection('categories')
    await categoriesCollection.createIndex({ slug: 1 }, { unique: true })
    console.log('✅ Categories indexes created')
    
    // Brands collection indexes
    const brandsCollection = db.collection('brands')
    await brandsCollection.createIndex({ slug: 1 }, { unique: true })
    await brandsCollection.createIndex({ documentId: 1 })
    console.log('✅ Brands indexes created')
    
    console.log('🎉 All indexes created successfully!')
    return true
  } catch (error) {
    console.error('❌ Error setting up indexes:', error)
    return false
  }
}

export default setupIndexes
