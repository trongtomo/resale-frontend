import { localData } from '@/lib/local-data'

export async function getCategories() {
  try {
    const data = await localData.getCategories()
    return data
  } catch (error) {
    console.error('Error fetching categories:', error)
    throw error
  }
}

export async function getCategoriesWithTags() {
  try {
    // Tags are no longer used, so just return categories
    const data = await localData.getCategories()
    return data
  } catch (error) {
    console.error('Error fetching categories with tags:', error)
    throw error
  }
}
