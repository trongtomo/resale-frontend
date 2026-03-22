import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

async function getDb() {
  const client = await clientPromise
  return client.db('chauchaublingstore')
}

// GET - Get single product by ID or slug
export async function GET(request, { params }) {
  try {
    const { id } = await params
    const db = await getDb()
    const collection = db.collection('products')
    
    let product
    // Try to find by ObjectId first, then by slug
    if (ObjectId.isValid(id)) {
      product = await collection.findOne({ _id: new ObjectId(id) })
    }
    if (!product) {
      product = await collection.findOne({ slug: id })
    }
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }
    
    // Populate category and brand data
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
    
    return NextResponse.json({ data: [populatedProduct] })
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

// PUT - Update product
export async function PUT(request, { params }) {
  try {
    const { id } = await params
    const body = await request.json()
    
    const db = await getDb()
    const collection = db.collection('products')
    
    let query
    if (ObjectId.isValid(id)) {
      query = { _id: new ObjectId(id) }
    } else {
      query = { slug: id }
    }
    
    const existingProduct = await collection.findOne(query)
    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }
    
    // Update product
    const updatedProduct = {
      ...body,
      updatedAt: new Date().toISOString()
    }
    
    const result = await collection.updateOne(query, { $set: updatedProduct })
    
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }
    
    // Return updated product
    const product = await collection.findOne(query)
    
    // Populate category and brand data
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
    
    return NextResponse.json({ data: populatedProduct })
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

// DELETE - Delete product
export async function DELETE(request, { params }) {
  try {
    const { id } = await params
    const db = await getDb()
    const collection = db.collection('products')
    
    let query
    if (ObjectId.isValid(id)) {
      query = { _id: new ObjectId(id) }
    } else {
      query = { slug: id }
    }
    
    const result = await collection.deleteOne(query)
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ message: 'Product deleted successfully' })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}

