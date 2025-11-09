import { v2 as cloudinary } from 'cloudinary'
import { Readable } from 'stream'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'ddez0qflc',
  api_key: process.env.CLOUDINARY_API_KEY || '533122228674959',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'EQUISOv6sNmHLk9jZ3HCeTmU354',
})

/**
 * Upload image to Cloudinary
 * @param {Buffer} fileBuffer - The file buffer to upload
 * @param {string} folder - Optional folder name in Cloudinary
 * @returns {Promise<{url: string, public_id: string, width: number, height: number}>}
 */
export async function uploadToCloudinary(fileBuffer, folder = 'resale-products') {
  return new Promise((resolve, reject) => {
    // Convert buffer to readable stream
    const stream = Readable.from(fileBuffer)
    
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: 'image',
        transformation: [
          { quality: 'auto' },
          { fetch_format: 'auto' }
        ]
      },
      (error, result) => {
        if (error) {
          reject(error)
        } else {
          resolve({
            url: result.secure_url,
            public_id: result.public_id,
            width: result.width,
            height: result.height
          })
        }
      }
    )
    
    stream.pipe(uploadStream)
  })
}

/**
 * Delete image from Cloudinary
 * @param {string} publicId - The public_id of the image to delete
 * @returns {Promise<void>}
 */
export async function deleteFromCloudinary(publicId) {
  try {
    await cloudinary.uploader.destroy(publicId)
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error)
    throw error
  }
}

export default cloudinary

