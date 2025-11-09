import { NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import path from 'path'
import { randomBytes } from 'crypto'

export async function POST(request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only images are allowed.' },
        { status: 400 }
      )
    }
    
    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      )
    }
    
    // Generate unique filename
    const ext = path.extname(file.name)
    const uniqueId = randomBytes(16).toString('hex')
    const filename = `${uniqueId}${ext}`
    
    // Determine upload directory based on file type
    const uploadDir = path.join(process.cwd(), 'public', 'images')
    
    // Create directory if it doesn't exist
    const fs = require('fs')
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    
    // Save file
    const filePath = path.join(uploadDir, filename)
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    await writeFile(filePath, buffer)
    
    // Return the public URL
    const publicUrl = `/images/${filename}`
    
    return NextResponse.json({
      url: publicUrl,
      filename: filename
    })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
}

