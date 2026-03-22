import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function GET() {
  const results = {}
  
  try {
    const client = await clientPromise
    const db = client.db('chauchaublingstore')
    
    // Test articles collection
    console.log('Testing articles collection...')
    const start1 = Date.now()
    await db.collection('articles').findOne({ slug: 'facebook-opening-page' }, { maxTimeMS: 5000 })
    const articlesTime = Date.now() - start1
    results.articles = { time: articlesTime, status: articlesTime < 1000 ? 'good' : 'slow' }
    
    // Test products collection
    console.log('Testing products collection...')
    const start2 = Date.now()
    await db.collection('products').find({}).limit(1).maxTimeMS(5000).toArray()
    const productsTime = Date.now() - start2
    results.products = { time: productsTime, status: productsTime < 1000 ? 'good' : 'slow' }
    
    // Test categories collection
    console.log('Testing categories collection...')
    const start3 = Date.now()
    await db.collection('categories').find({}).limit(1).maxTimeMS(3000).toArray()
    const categoriesTime = Date.now() - start3
    results.categories = { time: categoriesTime, status: categoriesTime < 500 ? 'good' : 'slow' }
    
    // Test connection ping
    console.log('Testing connection ping...')
    const start4 = Date.now()
    await db.admin().ping()
    const pingTime = Date.now() - start4
    results.ping = { time: pingTime, status: pingTime < 500 ? 'good' : 'slow' }
    
    return NextResponse.json({
      success: true,
      results,
      message: 'Performance test completed'
    })
    
  } catch (error) {
    console.error('Performance test error:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      message: 'Performance test failed'
    }, { status: 500 })
  }
}
