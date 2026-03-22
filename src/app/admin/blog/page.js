'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Pagination from '@/components/Pagination'

export default function AdminBlogPage() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [deletingSlug, setDeletingSlug] = useState(null)
  const pageSize = 10

  const showMessage = (type, text) => {
    setMessage({ type, text })
    setTimeout(() => setMessage({ type: '', text: '' }), 3000)
  }

  const loadArticles = async (page = 1) => {
    try {
      setLoading(true)
      const response = await fetch('/api/articles')
      const data = await response.json()
      const allArticles = data.data || []
      
      // Calculate pagination
      const total = allArticles.length
      const totalPagesCount = Math.ceil(total / pageSize)
      setTotalPages(totalPagesCount)
      
      // Get paginated articles
      const startIndex = (page - 1) * pageSize
      const endIndex = startIndex + pageSize
      setArticles(allArticles.slice(startIndex, endIndex))
    } catch (error) {
      console.error('Error loading articles:', error)
      showMessage('error', 'Failed to load articles')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadArticles(currentPage)
  }, [currentPage])

  const handleDelete = async (slug) => {
    if (!window.confirm('Are you sure you want to delete this article? This action cannot be undone.')) {
      return
    }

    try {
      setDeletingSlug(slug)
      const response = await fetch(`/api/articles/${slug}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete article')
      }

      showMessage('success', 'Article deleted successfully!')
      loadArticles(currentPage)
    } catch (error) {
      console.error('Error deleting article:', error)
      showMessage('error', 'Failed to delete article')
    } finally {
      setDeletingSlug(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading articles...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success/Error Messages */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-md ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            <div className="flex">
              <div className="flex-shrink-0">
                {message.type === 'success' ? (
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{message.text}</p>
              </div>
            </div>
          </div>
        )}

        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Blog Posts</h1>
          <Link
            href="/admin/blog/create"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Create New Post
          </Link>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Published
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {articles.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                    No articles found. Create your first blog post!
                  </td>
                </tr>
              ) : (
                articles.map((article) => (
                  <tr key={article._id || article.slug}>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{article.title}</div>
                      <div className="text-sm text-gray-500">{article.slug}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(article.publishedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={`/admin/blog/${article.slug}/edit`}
                        className="text-blue-600 hover:text-blue-900 mr-4 transition-colors"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(article.slug)}
                        disabled={deletingSlug === article.slug}
                        className={`text-red-600 hover:text-red-900 transition-colors ${
                          deletingSlug === article.slug ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        {deletingSlug === article.slug ? (
                          <span className="flex items-center">
                            <svg className="animate-spin h-4 w-4 mr-1" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                            </svg>
                            Deleting...
                          </span>
                        ) : (
                          'Delete'
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </div>
          )}
        </div>

        <div className="mt-6">
          <Link
            href="/admin"
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}

