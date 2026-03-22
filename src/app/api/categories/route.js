import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

async function getDb() {
  const client = await clientPromise
  return client.db('chauchaublingstore')
}

export async function GET() {
  try {
    const db = await getDb()
    const collection = db.collection('categories')
    const categories = await collection.find({}).toArray()
    
    return NextResponse.json({ data: categories })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { name } = body

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      )
    }

    const db = await getDb()
    const collection = db.collection('categories')

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')

    // Check if slug already exists
    const existingCategory = await collection.findOne({ slug })
    if (existingCategory) {
      return NextResponse.json(
        { error: 'Category with this name already exists' },
        { status: 400 }
      )
    }

    const newCategory = {
      name: name.trim(),
      slug: slug,
      description: body.description || '',
      createdAt: new Date().toISOString(),
      publishedAt: new Date().toISOString()
    }

    const result = await collection.insertOne(newCategory)
    newCategory._id = result.insertedId

    return NextResponse.json({ data: newCategory }, { status: 201 })
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    )
  }
}

