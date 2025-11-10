import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { promisify } from 'util'

const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)

const dataDir = path.join(process.cwd(), 'src', 'data')
const brandsFile = path.join(dataDir, 'brands.json')
const productsFile = path.join(dataDir, 'products.json')

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get('category')
    
    const fileData = await readFile(brandsFile, 'utf8')
    let { brands } = JSON.parse(fileData)
    
    // If category is provided, filter brands that have products in that category
    if (categoryId) {
      const productsData = await readFile(productsFile, 'utf8')
      const { products } = JSON.parse(productsData)
      
      // Get brands that have products in this category
      const categoryProducts = products.filter(p => 
        p.category?.documentId === categoryId || p.category?.slug === categoryId
      )
      const brandIds = new Set(categoryProducts.map(p => p.brand?.documentId).filter(Boolean))
      
      brands = brands.filter(b => brandIds.has(b.documentId))
    }
    
    return NextResponse.json({ brands })
  } catch (error) {
    console.error('Error reading brands:', error)
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

    const fileData = await readFile(brandsFile, 'utf8')
    const data = JSON.parse(fileData)

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')

    // Check if slug already exists
    const existingBrand = data.brands.find(b => b.slug === slug)
    if (existingBrand) {
      return NextResponse.json(
        { error: 'Brand with this name already exists' },
        { status: 400 }
      )
    }

    // Generate new ID
    const maxId = Math.max(...data.brands.map(b => parseInt(b.documentId?.replace('brand', '') || '0')), 0)
    const newId = `brand${maxId + 1}`

    const newBrand = {
      documentId: newId,
      name: name.trim(),
      slug: slug,
      description: body.description || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    data.brands.push(newBrand)
    await writeFile(brandsFile, JSON.stringify(data, null, 2), 'utf8')

    return NextResponse.json({ data: newBrand }, { status: 201 })
  } catch (error) {
    console.error('Error creating brand:', error)
    return NextResponse.json(
      { error: 'Failed to create brand' },
      { status: 500 }
    )
  }
}

