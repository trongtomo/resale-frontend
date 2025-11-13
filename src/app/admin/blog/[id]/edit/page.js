'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import '@uiw/react-md-editor/markdown-editor.css'

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false })

export default function EditBlogPage() {
  const router = useRouter()
  const params = useParams()
  const articleSlug = params?.id // This is actually the slug now
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    description: '',
    cover: null
  })

  useEffect(() => {
    // Load article data
    if (articleSlug) {
      fetch(`/api/articles/${articleSlug}`)
        .then(res => res.json())
        .then(data => {
          const article = data.data?.[0]
          if (article) {
            setFormData({
              title: article.title || '',
              slug: article.slug || '',
              content: article.content || '',
              description: article.description || '',
              cover: article.cover || null
            })
          }
        })
        .catch(err => console.error('Error loading article:', err))
        .finally(() => setLoading(false))
    }
  }, [articleSlug])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleContentChange = (value) => {
    setFormData(prev => ({
      ...prev,
      content: value || ''
    }))
  }

  const handleCoverUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    try {
      const uploadFormData = new FormData()
      uploadFormData.append('file', file)
      uploadFormData.append('folder', 'resale-blog')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      setFormData(prev => ({
        ...prev,
        cover: {
          url: data.url,
          alternativeText: formData.title
        }
      }))
    } catch (error) {
      console.error('Error uploading cover:', error)
      alert('Failed to upload cover image')
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteCover = async () => {
    if (!formData.cover?.url) return

    try {
      // Extract public_id from Cloudinary URL
      const url = formData.cover.url
      const publicIdMatch = url.match(/\/v\d+\/(.+)\.[^.]+$/)
      
      if (publicIdMatch) {
        const publicId = publicIdMatch[1]
        const response = await fetch('/api/upload/delete', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ publicId })
        })

        if (!response.ok) {
          throw new Error('Delete failed')
        }
      }
    } catch (error) {
      console.error('Error deleting cover:', error)
    }

    setFormData(prev => ({
      ...prev,
      cover: null
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch(`/api/articles/${articleSlug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update article')
      }

      router.push('/admin/blog')
    } catch (error) {
      console.error('Error updating article:', error)
      alert(error.message || 'Failed to update article')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-gray-600">Loading article...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href="/admin/blog" className="text-blue-600 hover:text-blue-800">
            ← Back to Blog
          </Link>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Blog Post</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
                Slug *
              </label>
              <input
                type="text"
                id="slug"
                name="slug"
                required
                value={formData.slug}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows="2"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Content (MDX) *
              </label>
              <div data-color-mode="light">
                <MDEditor
                  value={formData.content}
                  onChange={handleContentChange}
                  preview="edit"
                  height={400}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cover Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverUpload}
                disabled={uploading}
                className="mb-4"
              />
              {uploading && <p className="text-sm text-gray-500">Uploading...</p>}
              
              {formData.cover && (
                <div className="mt-4 relative">
                  <img
                    src={formData.cover.url}
                    alt={formData.cover.alternativeText || formData.title}
                    className="w-full h-64 object-cover rounded border"
                  />
                  <button
                    type="button"
                    onClick={handleDeleteCover}
                    className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-4">
              <Link
                href="/admin/blog"
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

