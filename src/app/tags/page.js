import { getTags } from '@/services/tags'
import { formatDate } from '@/utils/format'
import Link from 'next/link'

// Allow caching for better performance

export const metadata = {
  title: 'Tags',
  description: 'Browse all available tags',
}

export default async function TagsPage() {
  let tags = []
  let error = null

  try {
    const data = await getTags()
    tags = data.data || []
  } catch (err) {
    error = err.message
    console.error('Failed to fetch tags:', err)
  }

  return (
    <div className="min-h-screen">
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Tags</h1>
            <p className="text-lg text-gray-600">Browse all available content articles</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600">Error loading tags: {error}</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-gray-600">
                Found {tags.length} tag{tags.length !== 1 ? 's' : ''}
              </p>
            </div>

            {tags.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {tags.map((tag) => (
                  <Link
                    key={tag.id}
                    href={`/tags/${tag.slug}`}
                    className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow group"
                  >
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {tag.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">Slug: {tag.slug}</p>
                    <div className="text-xs text-gray-500">
                      <p>Created: {formatDate(tag.createdAt)}</p>
                      <p>Published: {formatDate(tag.publishedAt)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No tags found.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
