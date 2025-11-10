import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { promisify } from 'util'

const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)

const dataDir = path.join(process.cwd(), 'src', 'data')
const categoriesFile = path.join(dataDir, 'categories.json')

export async function GET() {
  try {
    const fileData = await readFile(categoriesFile, 'utf8')
    const { categories } = JSON.parse(fileData)
    
    return NextResponse.json({ categories })
  } catch (error) {
    console.error('Error reading categories:', error)
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

    const fileData = await readFile(categoriesFile, 'utf8')
    const data = JSON.parse(fileData)

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')

    // Check if slug already exists
    const existingCategory = data.categories.find(c => c.slug === slug)
    if (existingCategory) {
      return NextResponse.json(
        { error: 'Category with this name already exists' },
        { status: 400 }
      )
    }

    // Generate new ID
    const maxId = Math.max(...data.categories.map(c => parseInt(c.documentId?.replace('cat', '') || '0')), 0)
    const newId = `cat${maxId + 1}`

    const newCategory = {
      documentId: newId,
      name: name.trim(),
      slug: slug,
      description: body.description || '',
      createdAt: new Date().toISOString(),
      publishedAt: new Date().toISOString()
    }

    data.categories.push(newCategory)
    await writeFile(categoriesFile, JSON.stringify(data, null, 2), 'utf8')

    return NextResponse.json({ data: newCategory }, { status: 201 })
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    )
  }
}

