import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

async function getDb() {
  const client = await clientPromise
  return client.db('chauchaublingstore')
}

// GET - Fetch articles
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '9')
    
    const db = await getDb()
    const collection = db.collection('articles')
    
    // Get total count
    const total = await collection.countDocuments()
    
    // Pagination
    const startIndex = (page - 1) * pageSize
    const articles = await collection.find({})
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(pageSize)
      .toArray()
    
    return NextResponse.json({
      data: articles,
      meta: {
        pagination: {
          page,
          pageSize,
          pageCount: Math.ceil(total / pageSize),
          total
        }
      }
    })
  } catch (error) {
    console.error('Error fetching articles:', error)
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    )
  }
}

// POST - Create new article
export async function POST(request) {
  try {
    const body = await request.json()
    
    const db = await getDb()
    const collection = db.collection('articles')
    
    // Generate slug from title if not provided
    const slug = body.slug || (body.title ? body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') : '')
    
    // Check if slug already exists
    const existingArticle = await collection.findOne({ slug })
    if (existingArticle) {
      return NextResponse.json(
        { error: 'Article with this slug already exists' },
        { status: 400 }
      )
    }
    
    const now = new Date().toISOString()
    
    // Create new article
    const newArticle = {
      title: body.title,
      slug: slug,
      content: body.content || '',
      description: body.description || body.content?.substring(0, 200) || '',
      cover: body.cover || null,
      author: body.author || null,
      category: body.category || null,
      publishedAt: body.publishedAt || now,
      createdAt: now,
      updatedAt: now
    }
    
    // Insert into MongoDB
    const result = await collection.insertOne(newArticle)
    newArticle._id = result.insertedId
    
    return NextResponse.json({
      data: newArticle
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating article:', error)
    return NextResponse.json(
      { error: 'Failed to create article' },
      { status: 500 }
    )
  }
}

