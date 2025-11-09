import { localData } from '@/lib/local-data'

// Get categories with their associated tags (lightweight)
export async function getCategoriesWithTags() {
  try {
    const data = await localData.getCategories()
    return data
  } catch (error) {
    console.error('Error fetching categories with tags:', error)
    throw error
  }
}

// Get just categories (for direct links)
export async function getCategoryProducts(options = {}) {
  try {
    const data = await localData.getCategories()
    return data
  } catch (error) {
    console.error('Error fetching product categories:', error)
    throw error
  }
}