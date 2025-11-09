'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'
import Link from 'next/link'

export default function PersonalizedContent() {
  const { user, isAuthenticated } = useAuth()
  const { getTotalItems, getTotalPrice } = useCart()

  if (!isAuthenticated || !user) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            Welcome to Resale!
          </h3>
          <p className="text-blue-700 mb-4">
            Sign in to get personalized recommendations and save your cart.
          </p>
          <Link 
            href="/auth/login"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-green-900 mb-1">
            Welcome back, {user.username || user.email.split('@')[0]}!
          </h3>
          <p className="text-green-700">
            You have {getTotalItems()} items in your cart (${getTotalPrice().toFixed(2)})
          </p>
        </div>
        <div className="flex space-x-3">
          <Link 
            href="/orders"
            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
          >
            My Orders
          </Link>
          <Link 
            href="/wishlist"
            className="bg-white text-green-600 border border-green-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-50 transition-colors"
          >
            Wishlist
          </Link>
        </div>
      </div>
    </div>
  )
}
