import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db('chauchaublingstore')
    
    // Test database connection
    await db.admin().ping()
    
    // Get collections info
    const collections = await db.listCollections().toArray()
    
    // Count documents in each collection
    const stats = {}
    for (const collection of collections) {
      const count = await db.collection(collection.name).countDocuments()
      stats[collection.name] = count
    }
    
    return NextResponse.json({
      success: true,
      database: 'chauchaublingstore',
      collections: collections.map(c => c.name),
      documentCounts: stats,
      message: 'Database connection successful!'
    })
  } catch (error) {
    console.error('Database test error:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      message: 'Database connection failed!'
    }, { status: 500 })
  }
}
