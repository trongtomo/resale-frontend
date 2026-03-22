import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

async function getDb() {
  const client = await clientPromise
  return client.db('chauchaublingstore')
}

// GET - Fetch products
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '1000')
    const categorySlug = searchParams.get('category')
    
    const db = await getDb()
    const collection = db.collection('products')
    
    let query = {}
    if (categorySlug) {
      query['category.slug'] = categorySlug
    }
    
    // Get total count
    const total = await collection.countDocuments(query)
    
    // Pagination
    const startIndex = (page - 1) * pageSize
    const products = await collection.find(query)
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(pageSize)
      .toArray()
    
    return NextResponse.json({
      data: products,
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
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

// POST - Create new product
export async function POST(request) {
  try {
    const body = await request.json()
    
    const db = await getDb()
    const collection = db.collection('products')
    
    // Generate slug from name if not provided
    const slug = body.slug || body.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
    
    // Check if slug already exists
    const existingProduct = await collection.findOne({ slug })
    if (existingProduct) {
      return NextResponse.json(
        { error: 'Product with this slug already exists' },
        { status: 400 }
      )
    }
    
    // Create new product
    const newProduct = {
      name: body.name,
      slug: slug,
      price: parseInt(body.price) || 0,
      description: body.description || '',
      shortDescription: body.shortDescription || body.description?.substring(0, 100) || '',
      content: body.content || '',
      status: body.status || 'active',
      category: body.category || null,
      brand: body.brand || null,
      images: body.images || [],
      publishedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    // Insert into MongoDB
    const result = await collection.insertOne(newProduct)
    newProduct._id = result.insertedId
    
    return NextResponse.json({
      data: newProduct
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}

