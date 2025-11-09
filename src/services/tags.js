import { localData } from '@/lib/local-data'

// Tags are not currently stored in local data
// Return empty array for now - can be extended later if needed
export async function getTags() {
  try {
    // Return empty tags for now
    return { data: [] }
  } catch (error) {
    console.error('Error fetching tags:', error)
    throw error
  }
}
