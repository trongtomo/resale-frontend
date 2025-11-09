import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { promisify } from 'util'

const readFile = promisify(fs.readFile)

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

