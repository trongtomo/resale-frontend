'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function AdminDashboard() {
  const router = useRouter()
  const [loggingOut, setLoggingOut] = useState(false)

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/admin/login')
      router.refresh()
    } catch (error) {
      console.error('Logout error:', error)
      setLoggingOut(false)
    }
  }

  const adminSections = [
    {
      title: 'Orders',
      description: 'View and manage customer orders',
      href: '/admin/orders',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
      color: 'purple'
    },
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
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Manage your store content and products</p>
          </div>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            {loggingOut ? 'Logging out...' : 'Logout'}
          </button>
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
      </div>
    </div>
  )
}

