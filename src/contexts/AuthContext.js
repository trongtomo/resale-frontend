'use client'

import { authApi } from '@/lib/auth-api'
import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check if user is already authenticated on app load
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      if (token) {
        const userData = await authApi.getCurrentUser(token)
        setUser(userData)
        setIsAuthenticated(true)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      // Clear invalid token
      localStorage.removeItem('auth_token')
    } finally {
      setLoading(false)
    }
  }

  const login = async (email) => {
    console.log('🚀 Starting login process for:', email)
    try {
      console.log('📧 Calling authApi.requestMagicLink...')
      const result = await authApi.requestMagicLink(email)
      console.log('✅ Magic link request successful:', result)
      return { success: true, message: 'Magic link sent to your email!' }
    } catch (error) {
      console.error('❌ Login failed:', error)
      console.error('❌ Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      })
      return { success: false, message: error.message || 'Failed to send magic link' }
    }
  }

  const logout = () => {
    localStorage.removeItem('auth_token')
    setUser(null)
    setIsAuthenticated(false)
  }

  const handleMagicLinkCallback = async (token) => {
    try {
      const response = await authApi.validateMagicLink(token)
      // The response contains jwt, user, and other data
      const { jwt, user } = response
      localStorage.setItem('auth_token', jwt)
      setUser(user)
      setIsAuthenticated(true)
      return { success: true, user }
    } catch (error) {
      console.error('Magic link validation failed:', error)
      return { success: false, message: error.message || 'Invalid magic link' }
    }
  }

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    handleMagicLinkCallback,
    checkAuthStatus
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
