import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { promisify } from 'util'

const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)

const dataDir = path.join(process.cwd(), 'src', 'data')
const productsFile = path.join(dataDir, 'products.json')

// GET - Get single product by ID
export async function GET(request, { params }) {
  try {
    const { id } = await params
    const fileData = await readFile(productsFile, 'utf8')
    const { products } = JSON.parse(fileData)
    
    const product = products.find(p => p.documentId === id || p.slug === id)
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ data: [product] })
  } catch (error) {
    console.error('Error reading product:', error)
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
    
    const fileData = await readFile(productsFile, 'utf8')
    const data = JSON.parse(fileData)
    
    const productIndex = data.products.findIndex(p => p.documentId === id || p.slug === id)
    
    if (productIndex === -1) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }
    
    // Update product
    const updatedProduct = {
      ...data.products[productIndex],
      ...body,
      documentId: data.products[productIndex].documentId, // Preserve ID
      updatedAt: new Date().toISOString()
    }
    
    data.products[productIndex] = updatedProduct
    
    await writeFile(productsFile, JSON.stringify(data, null, 2), 'utf8')
    
    return NextResponse.json({ data: updatedProduct })
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
    
    const fileData = await readFile(productsFile, 'utf8')
    const data = JSON.parse(fileData)
    
    const productIndex = data.products.findIndex(p => p.documentId === id || p.slug === id)
    
    if (productIndex === -1) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }
    
    data.products.splice(productIndex, 1)
    
    await writeFile(productsFile, JSON.stringify(data, null, 2), 'utf8')
    
    return NextResponse.json({ message: 'Product deleted successfully' })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}

