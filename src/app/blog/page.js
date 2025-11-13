import MarkdownRenderer from '@/components/MarkdownRenderer'
import Pagination from '@/components/Pagination'
import BlogBreadcrumb from '@/components/BlogBreadcrumb'
import { getArticles } from '@/services/articles'
import { formatDate, truncateText } from '@/utils/format'
import Link from 'next/link'

// Allow caching for better performance

export const metadata = {
  title: 'Blog',
  description: 'Read our latest articles and insights',
}

export default async function BlogPage({ searchParams }) {
  const resolvedSearchParams = await searchParams
  const page = parseInt(resolvedSearchParams?.page || '1')
  const pageSize = 9

  let articles = []
  let pagination = { page: 1, pageCount: 1, total: 0 }
  let error = null

  try {
    const data = await getArticles(page, pageSize)
    articles = data.data || []
    pagination = data.meta?.pagination || { page: 1, pageCount: 1, total: 0 }
  } catch (err) {
    error = err.message
    console.error('Failed to fetch articles:', err)
  }

  return (
    <div className="min-h-screen">
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BlogBreadcrumb />
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog</h1>
            <p className="text-lg text-gray-600">Read our latest articles and insights</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600">Error loading articles: {error}</p>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="text-center">
              <p className="text-gray-600">
                Showing {articles.length} of {pagination.total} article{pagination.total !== 1 ? 's' : ''}
              </p>
            </div>
            
            {articles.length > 0 ? (
              <>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {articles.map((article) => (
                    <Link
                      key={article.documentId || article.slug}
                      href={`/blog/${article.slug}`}
                      className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow group"
                    >
                      <div className="aspect-video bg-gray-100 flex items-center justify-center">
                        {article.cover?.url ? (
                          <img
                            src={article.cover.url}
                            alt={article.cover.alternativeText || article.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-gray-400 text-center">
                            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <p className="text-sm">No image</p>
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                          {article.title}
                        </h3>
                        <div className="text-gray-600 text-sm mb-3">
                          {article.description ? (
                            <p>{truncateText(article.description, 120)}</p>
                          ) : article.blocks?.find(block => block.__component === 'shared.rich-text') ? (
                            <div className="prose prose-sm max-w-none">
                              <MarkdownRenderer 
                                content={truncateText(
                                  article.blocks.find(block => block.__component === 'shared.rich-text')?.body?.replace(/[#*]/g, '') || '', 
                                  120
                                )} 
                              />
                            </div>
                          ) : null}
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div>
                            <p>Published: {formatDate(article.publishedAt, { format: 'DD-MM-YYYY' })}</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.pageCount}
                />
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No articles found.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
