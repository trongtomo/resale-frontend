import { localData } from '@/lib/local-data'

export async function getArticles(page = 1, pageSize = 9) {
  try {
    const data = await localData.getArticles(page, pageSize)
    return data
  } catch (error) {
    console.error('Error fetching articles:', error)
    throw error
  }
}

export async function getArticleBySlug(slug) {
  try {
    const data = await localData.getArticleBySlug(slug)
    return data
  } catch (error) {
    console.error('Error fetching article by slug:', error)
    throw error
  }
}

export async function getArticlesByTag(tagSlug, page = 1, pageSize = 9) {
  try {
    const data = await localData.getArticlesByTag(tagSlug, page, pageSize)
    return data
  } catch (error) {
    console.error('Error fetching articles by tag:', error)
    throw error
  }
}
