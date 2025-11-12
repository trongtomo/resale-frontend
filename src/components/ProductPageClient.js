'use client'

import { useEffect } from 'react'

export default function ProductPageClient({ product }) {
  useEffect(() => {
    // Store category in localStorage when product page loads
    if (product?.category?.slug) {
      localStorage.setItem('lastCategory', product.category.slug)
    }
  }, [product])

  return null // This component doesn't render anything, just handles side effects
}

