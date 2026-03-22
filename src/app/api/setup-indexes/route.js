import { NextResponse } from 'next/server'
import setupIndexes from '@/lib/setup-indexes'

export async function POST() {
  try {
    const success = await setupIndexes()
    
    if (success) {
      return NextResponse.json({ 
        message: 'Database indexes created successfully!',
        indexes: [
          'articles: slug (unique), createdAt, publishedAt',
          'products: slug (unique), createdAt, status, category.slug, brand._id, price',
          'categories: slug (unique)',
          'brands: slug (unique), _id'
        ]
      })
    } else {
      return NextResponse.json(
        { error: 'Failed to create indexes' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error in setup indexes API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
