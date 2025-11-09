'use client'

import { useCart } from '@/contexts/CartContext'
import { useState } from 'react'

export default function AddToCartButton({ product, className = "" }) {
  const { addToCart } = useCart()
  const [isAdding, setIsAdding] = useState(false)
  const [added, setAdded] = useState(false)

  const handleAddToCart = async () => {
    setIsAdding(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    
    addToCart(product)
    setAdded(true)
    setIsAdding(false)
    
    // Reset the "added" state after 2 seconds
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <button
      onClick={handleAddToCart}
      disabled={isAdding || added}
      className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
        added
          ? 'bg-green-600 text-white'
          : isAdding
          ? 'bg-gray-400 text-white cursor-not-allowed'
          : 'bg-blue-600 text-white hover:bg-blue-700'
      } ${className}`}
    >
      {added ? (
        <span className="flex items-center justify-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Added to Cart!
        </span>
      ) : isAdding ? (
        <span className="flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Adding...
        </span>
      ) : (
        'Add to Cart'
      )}
    </button>
  )
}
