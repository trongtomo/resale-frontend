/**
 * Cookie utility functions for storing and retrieving data
 */

// Set a cookie
export function setCookie(name, value, days = 365) {
  const expires = new Date()
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
  document.cookie = `${name}=${JSON.stringify(value)};expires=${expires.toUTCString()};path=/`
}

// Get a cookie
export function getCookie(name) {
  if (typeof document === 'undefined') return null
  
  const nameEQ = name + '='
  const ca = document.cookie.split(';')
  
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) === ' ') c = c.substring(1, c.length)
    if (c.indexOf(nameEQ) === 0) {
      try {
        return JSON.parse(c.substring(nameEQ.length, c.length))
      } catch (e) {
        return c.substring(nameEQ.length, c.length)
      }
    }
  }
  return null
}

// Delete a cookie
export function deleteCookie(name) {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`
}

// Get customer address from cookies
export function getCustomerAddress() {
  return getCookie('customer_address') || null
}

// Save customer address to cookies
export function saveCustomerAddress(address) {
  setCookie('customer_address', address, 365) // Save for 1 year
}

