import { NextResponse } from 'next/server'
import { deleteFromCloudinary } from '@/lib/cloudinary'

export async function POST(request) {
  try {
    const { public_id } = await request.json()
    
    if (!public_id) {
      return NextResponse.json(
        { error: 'No public_id provided' },
        { status: 400 }
      )
    }
    
    await deleteFromCloudinary(public_id)
    
    return NextResponse.json({
      message: 'Image deleted successfully',
      public_id
    })
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete image' },
      { status: 500 }
    )
  }
}

