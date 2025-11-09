'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function WishlistPage() {
  const { user, isAuthenticated, loading } = useAuth()
  const [wishlist, setWishlist] = useState([])
  const [wishlistLoading, setWishlistLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/')
      return
    }

    if (isAuthenticated) {
      fetchWishlist()
    }
  }, [isAuthenticated, loading, router])

  const fetchWishlist = async () => {
    try {
      // TODO: Implement actual API call to fetch user wishlist
      // For now, we'll show a placeholder
      setWishlist([])
    } catch (error) {
      console.error('Error fetching wishlist:', error)
    } finally {
      setWishlistLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
          <p className="mt-2 text-gray-600">
            Save items you love for later
          </p>
        </div>

        {wishlistLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : wishlist.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 text-gray-400">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Your wishlist is empty</h3>
            <p className="mt-2 text-gray-500">
              Start adding items you love to your wishlist.
            </p>
            <div className="mt-6">
              <a
                href="/"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Start Shopping
              </a>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow p-4">
                <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-48 w-full object-cover object-center"
                  />
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                  <p className="mt-1 text-sm text-gray-500">{item.description}</p>
                  <p className="mt-2 text-lg font-semibold text-gray-900">${item.price}</p>
                </div>
                <div className="mt-4 flex space-x-2">
                  <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                    Add to Cart
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
