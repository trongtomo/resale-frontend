import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { promisify } from 'util'

const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)

const dataDir = path.join(process.cwd(), 'src', 'data')
const articlesFile = path.join(dataDir, 'articles.json')

// GET - Fetch articles
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '9')
    
    const fileData = await readFile(articlesFile, 'utf8')
    const { articles } = JSON.parse(fileData)
    
    // Pagination
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    const paginatedArticles = articles.slice(startIndex, endIndex)
    
    return NextResponse.json({
      data: paginatedArticles,
      meta: {
        pagination: {
          page,
          pageSize,
          pageCount: Math.ceil(articles.length / pageSize),
          total: articles.length
        }
      }
    })
  } catch (error) {
    console.error('Error reading articles:', error)
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    )
  }
}

// POST - Create new article
export async function POST(request) {
  try {
    const body = await request.json()
    
    // Read existing articles
    const fileData = await readFile(articlesFile, 'utf8')
    const data = JSON.parse(fileData)
    
    // Generate new ID
    const maxId = Math.max(...data.articles.map(a => parseInt(a.documentId?.replace('art', '') || '0') || 0), 0)
    const newId = `art${maxId + 1}`
    
    // Generate slug from title if not provided
    const slug = body.slug || body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
    
    // Check if slug already exists
    const existingArticle = data.articles.find(a => a.slug === slug)
    if (existingArticle) {
      return NextResponse.json(
        { error: 'Article with this slug already exists' },
        { status: 400 }
      )
    }
    
    const now = new Date().toISOString()
    
    // Create new article
    const newArticle = {
      documentId: newId,
      title: body.title,
      slug: slug,
      content: body.content || '',
      description: body.description || body.content?.substring(0, 200) || '',
      cover: body.cover || null,
      author: body.author || null,
      category: body.category || null,
      publishedAt: body.publishedAt || now,
      createdAt: now,
      updatedAt: now
    }
    
    // Add to articles array
    data.articles.push(newArticle)
    
    // Write back to file
    await writeFile(articlesFile, JSON.stringify(data, null, 2), 'utf8')
    
    return NextResponse.json({
      data: newArticle
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating article:', error)
    return NextResponse.json(
      { error: 'Failed to create article' },
      { status: 500 }
    )
  }
}

