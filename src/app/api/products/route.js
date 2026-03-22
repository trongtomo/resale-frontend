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
      // Try to find by ObjectId first (if it's an ID)
      if (ObjectId.isValid(categorySlug)) {
        query['category._id'] = new ObjectId(categorySlug)
      } else {
        // If not ObjectId, treat as slug
        query['category.slug'] = categorySlug
      }
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
    
    // Populate category and brand data
    const populatedProducts = await Promise.all(
      products.map(async (product) => {
        let populatedProduct = { ...product }
        
        // Populate category if it exists
        if (product.category && product.category._id) {
          const categoryCollection = db.collection('categories')
          const category = await categoryCollection.findOne({ _id: product.category._id })
          populatedProduct.category = category
        }
        
        // Populate brand if it exists
        if (product.brand && product.brand._id) {
          const brandCollection = db.collection('brands')
          const brand = await brandCollection.findOne({ _id: product.brand._id })
          populatedProduct.brand = brand
        }
        
        return populatedProduct
      })
    )
    
    return NextResponse.json({
      data: populatedProducts,
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
      category: body.category ? {
        _id: new ObjectId(body.category)
      } : null,
      brand: body.brand ? {
        _id: new ObjectId(body.brand)
      } : null,
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

