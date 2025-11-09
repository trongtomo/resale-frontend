import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { promisify } from 'util'

const readFile = promisify(fs.readFile)

const dataDir = path.join(process.cwd(), 'src', 'data')
const brandsFile = path.join(dataDir, 'brands.json')

export async function GET() {
  try {
    const fileData = await readFile(brandsFile, 'utf8')
    const { brands } = JSON.parse(fileData)
    
    return NextResponse.json({ brands })
  } catch (error) {
    console.error('Error reading brands:', error)
    return NextResponse.json(
      { error: 'Failed to fetch brands' },
      { status: 500 }
    )
  }
}

