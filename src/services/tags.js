import clientPromise from '@/lib/mongodb'

async function getDb() {
  const client = await clientPromise
  return client.db('chauchaublingstore')
}

// Tags are not currently stored in MongoDB
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
