import qs from 'qs'

// Use local API routes instead of external Strapi API
const API_BASE_URL = ''

export function getApiUrl(path, query = {}) {
  const queryString = qs.stringify(query, { 
    encodeValuesOnly: false,
    addQueryPrefix: false
  })
  const url = `${API_BASE_URL}${path}`
  return queryString ? `${url}?${queryString}` : url
}

export async function fetchFromApi(path, options = {}) {
  const { query, cache = 'force-cache', revalidate = 3600, ...fetchOptions } = options
  const url = getApiUrl(path, query)
  
  // Use absolute URL for API routes in Next.js
  const apiUrl = url.startsWith('/') ? url : `/${url}`
  
  const response = await fetch(apiUrl, {
    cache,
    next: { revalidate },
    ...fetchOptions,
    headers: {
      'Content-Type': 'application/json',
      ...fetchOptions.headers,
    },
  })

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`)
  }

  return response.json()
}
