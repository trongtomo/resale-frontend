'use client'

import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'

export default function WelcomeBanner() {
  const { user, isAuthenticated } = useAuth()

  if (!isAuthenticated || !user) return null

  return (
    <div className="bg-blue-50 border-b border-blue-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
              {user.username ? user.username.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium text-blue-900">
                Welcome back, {user.username || user.email.split('@')[0]}!
              </p>
              <p className="text-xs text-blue-700">
                You're signed in and ready to shop
              </p>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4 text-sm">
            <Link 
              href="/orders" 
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              View Orders
            </Link>
            <Link 
              href="/profile" 
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              My Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
