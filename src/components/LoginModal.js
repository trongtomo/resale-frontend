'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useState } from 'react'

export default function LoginModal({ isOpen, onClose }) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) return

    console.log('📝 LoginModal: Starting form submission for:', email)
    setLoading(true)
    setMessage('')

    try {
      console.log('📝 LoginModal: Calling login function...')
      const result = await login(email)
      console.log('📝 LoginModal: Login result:', result)
      setMessage(result.message)
      if (result.success) {
        setEmail('')
        // Close modal after 2 seconds
        setTimeout(() => {
          onClose()
        }, 2000)
      }
    } catch (error) {
      console.error('📝 LoginModal: Unexpected error:', error)
      setMessage('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Sign In</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || !email}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Sending...' : 'Send Magic Link'}
          </button>
        </form>

        {message && (
          <div className={`mt-4 p-3 rounded-md ${
            message.includes('sent') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {message}
          </div>
        )}

        <p className="mt-4 text-sm text-gray-600">
          We'll send you a magic link to sign in without a password.
        </p>
      </div>
    </div>
  )
}
