import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { promisify } from 'util'

const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)

const dataDir = path.join(process.cwd(), 'src', 'data')
const productsFile = path.join(dataDir, 'products.json')

// GET - Fetch products
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '1000')
    const categorySlug = searchParams.get('category')
    
    const fileData = await readFile(productsFile, 'utf8')
    let { products } = JSON.parse(fileData)
    
    // Filter by category if provided
    if (categorySlug) {
      products = products.filter(p => p.category?.slug === categorySlug)
    }
    
    // Pagination
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    const paginatedProducts = products.slice(startIndex, endIndex)
    
    return NextResponse.json({
      data: paginatedProducts,
      meta: {
        pagination: {
          page,
          pageSize,
          pageCount: Math.ceil(products.length / pageSize),
          total: products.length
        }
      }
    })
  } catch (error) {
    console.error('Error reading products:', error)
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
    
    // Read existing products
    const fileData = await readFile(productsFile, 'utf8')
    const data = JSON.parse(fileData)
    
    // Generate new ID
    const maxId = Math.max(...data.products.map(p => parseInt(p.documentId) || 0), 0)
    const newId = (maxId + 1).toString()
    
    // Generate slug from name if not provided
    const slug = body.slug || body.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
    
    // Check if slug already exists
    const existingProduct = data.products.find(p => p.slug === slug)
    if (existingProduct) {
      return NextResponse.json(
        { error: 'Product with this slug already exists' },
        { status: 400 }
      )
    }
    
    // Create new product
    const newProduct = {
      documentId: newId,
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
    
    // Add to products array
    data.products.push(newProduct)
    
    // Write back to file
    await writeFile(productsFile, JSON.stringify(data, null, 2), 'utf8')
    
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

