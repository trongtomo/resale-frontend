import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

async function getDb() {
  const client = await clientPromise
  return client.db('chauchaublingstore')
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get('category')
    
    const db = await getDb()
    const collection = db.collection('brands')
    let brands
    
    // If category is provided, filter brands that have products in that category
    if (categoryId) {
      const productsCollection = db.collection('products')
      
      // Get brands that have products in this category
      const categoryProducts = await productsCollection.find({
        $or: [
          { 'category._id': new ObjectId(categoryId) },
          { 'category.slug': categoryId }
        ]
      }).toArray()
      
      const brandIds = new Set(categoryProducts.map(p => p.brand?._id).filter(Boolean))
      brands = await collection.find({ _id: { $in: Array.from(brandIds) } }).toArray()
    } else {
      brands = await collection.find({}).toArray()
    }
    
    return NextResponse.json({ data: brands })
  } catch (error) {
    console.error('Error fetching brands:', error)
    return NextResponse.json(
      { error: 'Failed to fetch brands' },
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
        { error: 'Brand name is required' },
        { status: 400 }
      )
    }

    const db = await getDb()
    const collection = db.collection('brands')

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')

    // Check if slug already exists
    const existingBrand = await collection.findOne({ slug })
    if (existingBrand) {
      return NextResponse.json(
        { error: 'Brand with this name already exists' },
        { status: 400 }
      )
    }

    const newBrand = {
      name: name.trim(),
      slug: slug,
      description: body.description || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const result = await collection.insertOne(newBrand)
    newBrand._id = result.insertedId

    return NextResponse.json({ data: newBrand }, { status: 201 })
  } catch (error) {
    console.error('Error creating brand:', error)
    return NextResponse.json(
      { error: 'Failed to create brand' },
      { status: 500 }
    )
  }
}

