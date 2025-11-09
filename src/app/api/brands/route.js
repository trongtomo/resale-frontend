import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { promisify } from 'util'

const readFile = promisify(fs.readFile)

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

