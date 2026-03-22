import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

async function getDb() {
  const client = await clientPromise
  return client.db('chauchaublingstore')
}

// GET - Get single article by ID or slug
export async function GET(request, { params }) {
  try {
    const { id } = await params
    const db = await getDb()
    const collection = db.collection('articles')
    
    let article
    // Try to find by ObjectId first, then by slug
    if (ObjectId.isValid(id)) {
      article = await collection.findOne({ _id: new ObjectId(id) })
    }
    if (!article) {
      // Add timeout for slug query and create index if needed
      article = await collection.findOne({ slug: id }, { maxTimeMS: 5000 })
    }
    
    if (!article) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ data: [article] })
  } catch (error) {
    console.error('Error fetching article:', error)
    return NextResponse.json(
      { error: 'Failed to fetch article' },
      { status: 500 }
    )
  }
}

// PUT - Update article
export async function PUT(request, { params }) {
  try {
    const { id } = await params
    const body = await request.json()
    
    const db = await getDb()
    const collection = db.collection('articles')
    
    let query
    if (ObjectId.isValid(id)) {
      query = { _id: new ObjectId(id) }
    } else {
      query = { slug: id }
    }
    
    const existingArticle = await collection.findOne(query, { maxTimeMS: 5000 })
    if (!existingArticle) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      )
    }
    
    // Update article
    const updatedArticle = {
      ...body,
      updatedAt: new Date().toISOString()
    }
    
    const result = await collection.updateOne(query, { $set: updatedArticle }, { maxTimeMS: 5000 })
    
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      )
    }
    
    // Return updated article
    const article = await collection.findOne(query, { maxTimeMS: 5000 })
    return NextResponse.json({ data: article })
  } catch (error) {
    console.error('Error updating article:', error)
    return NextResponse.json(
      { error: 'Failed to update article' },
      { status: 500 }
    )
  }
}

// DELETE - Delete article
export async function DELETE(request, { params }) {
  try {
    const { id } = await params
    const db = await getDb()
    const collection = db.collection('articles')
    
    let query
    if (ObjectId.isValid(id)) {
      query = { _id: new ObjectId(id) }
    } else {
      query = { slug: id }
    }
    
    const result = await collection.deleteOne(query, { maxTimeMS: 5000 })
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ message: 'Article deleted successfully' })
  } catch (error) {
    console.error('Error deleting article:', error)
    return NextResponse.json(
      { error: 'Failed to delete article' },
      { status: 500 }
    )
  }
}

