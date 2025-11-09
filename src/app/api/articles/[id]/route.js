import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { promisify } from 'util'

const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)

const dataDir = path.join(process.cwd(), 'src', 'data')
const articlesFile = path.join(dataDir, 'articles.json')

// GET - Get single article by ID or slug
export async function GET(request, { params }) {
  try {
    const { id } = await params
    const fileData = await readFile(articlesFile, 'utf8')
    const { articles } = JSON.parse(fileData)
    
    const article = articles.find(a => a.documentId === id || a.slug === id)
    
    if (!article) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ data: [article] })
  } catch (error) {
    console.error('Error reading article:', error)
    return NextResponse.json(
      { error: 'Failed to fetch article' },
      { status: 500 }
    )
  }
}

// PUT - Update article
export async function PUT(request, { params }) {
  try {
    const { id } = await params
    const body = await request.json()
    
    const fileData = await readFile(articlesFile, 'utf8')
    const data = JSON.parse(fileData)
    
    const articleIndex = data.articles.findIndex(a => a.documentId === id || a.slug === id)
    
    if (articleIndex === -1) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      )
    }
    
    // Update article
    const updatedArticle = {
      ...data.articles[articleIndex],
      ...body,
      documentId: data.articles[articleIndex].documentId, // Preserve ID
      updatedAt: new Date().toISOString()
    }
    
    data.articles[articleIndex] = updatedArticle
    
    await writeFile(articlesFile, JSON.stringify(data, null, 2), 'utf8')
    
    return NextResponse.json({ data: updatedArticle })
  } catch (error) {
    console.error('Error updating article:', error)
    return NextResponse.json(
      { error: 'Failed to update article' },
      { status: 500 }
    )
  }
}

// DELETE - Delete article
export async function DELETE(request, { params }) {
  try {
    const { id } = await params
    
    const fileData = await readFile(articlesFile, 'utf8')
    const data = JSON.parse(fileData)
    
    const articleIndex = data.articles.findIndex(a => a.documentId === id || a.slug === id)
    
    if (articleIndex === -1) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      )
    }
    
    data.articles.splice(articleIndex, 1)
    
    await writeFile(articlesFile, JSON.stringify(data, null, 2), 'utf8')
    
    return NextResponse.json({ message: 'Article deleted successfully' })
  } catch (error) {
    console.error('Error deleting article:', error)
    return NextResponse.json(
      { error: 'Failed to delete article' },
      { status: 500 }
    )
  }
}

