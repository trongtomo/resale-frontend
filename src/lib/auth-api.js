/**
 * Frontend-only authentication - no backend required
 * Simple localStorage-based authentication
 */

export const authApi = {
  // Request magic link for email (simulated - no actual email sent)
  async requestMagicLink(email) {
    console.log('🔗 Requesting magic link for:', email)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // In a real frontend-only app, you might want to:
    // 1. Generate a token locally
    // 2. Store it temporarily
    // 3. Show a message to the user with the link
    
    // For now, we'll just simulate success
    return {
      message: 'Magic link sent! (Frontend-only mode - check console for token)',
      email
    }
  },

  // Validate magic link token (simulated)
  async validateMagicLink(token) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // In frontend-only mode, we can create a simple user object
    // You might want to store user data in localStorage or generate it from token
    const user = {
      id: token || 'user_' + Date.now(),
      email: 'user@example.com',
      username: 'user',
      confirmed: true,
      blocked: false
    }
    
    // Generate a simple JWT-like token (just for localStorage)
    const jwt = 'frontend_token_' + Date.now()
    
    return {
      jwt,
      user
    }
  },

  // Get current user with token (from localStorage)
  async getCurrentUser(token) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200))
    
    // In frontend-only mode, return a simple user object
    // You can enhance this to read from localStorage if you store user data there
    return {
      id: 'user_1',
      email: 'user@example.com',
      username: 'user',
      confirmed: true,
      blocked: false
    }
  },

  // Logout (just clear client-side data)
  async logout(token) {
    // In frontend-only mode, logout is handled client-side
    // No server call needed
    console.log('Logout - clearing client-side data')
  }
}
