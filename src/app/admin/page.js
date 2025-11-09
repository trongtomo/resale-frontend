'use client'

import Link from 'next/link'

export default function AdminPage() {
  const adminSections = [
    {
      title: 'Products',
      description: 'Manage your products - create, edit, and delete items for sale',
      href: '/admin/products',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      color: 'blue'
    },
    {
      title: 'Blog',
      description: 'Manage your blog posts - create, edit, and delete articles',
      href: '/admin/blog',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: 'green'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your store content and products</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {adminSections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200 hover:border-blue-300"
            >
              <div className={`text-${section.color}-600 mb-4`}>
                {section.icon}
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {section.title}
              </h2>
              <p className="text-gray-600 text-sm">
                {section.description}
              </p>
              <div className="mt-4 flex items-center text-blue-600 text-sm font-medium">
                Manage {section.title}
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Links</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Products</h3>
              <ul className="space-y-1">
                <li>
                  <Link href="/admin/products" className="text-blue-600 hover:text-blue-800 text-sm">
                    View All Products
                  </Link>
                </li>
                <li>
                  <Link href="/admin/products/create" className="text-blue-600 hover:text-blue-800 text-sm">
                    Create New Product
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Blog</h3>
              <ul className="space-y-1">
                <li>
                  <Link href="/admin/blog" className="text-blue-600 hover:text-blue-800 text-sm">
                    View All Posts
                  </Link>
                </li>
                <li>
                  <Link href="/admin/blog/create" className="text-blue-600 hover:text-blue-800 text-sm">
                    Create New Post
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Security Notice</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>These admin pages currently have no authentication. Please add authentication before deploying to production.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

