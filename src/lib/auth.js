import { cookies } from 'next/headers'

/**
 * Check if user is authenticated as admin
 * @returns {Promise<boolean>}
 */
export async function isAuthenticated() {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get('admin_session')
    return session?.value === 'authenticated'
  } catch (error) {
    return false
  }
}

/**
 * Get authentication status (for client components)
 * @returns {Promise<boolean>}
 */
export async function checkAuth() {
  try {
    const response = await fetch('/api/auth/check', {
      credentials: 'include',
    })
    const data = await response.json()
    return data.authenticated || false
  } catch (error) {
    return false
  }
}

