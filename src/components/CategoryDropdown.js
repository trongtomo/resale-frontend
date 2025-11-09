'use client'

import Link from 'next/link'

export default function CategoryDropdown({ category, label, isActive, onToggle, onClose }) {
  // Use the children data directly from the category object
  const subcategories = category.children || []

  return (
    <div className="relative">
      <button
        onMouseEnter={onToggle}
        onClick={onToggle}
        className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center"
      >
        {label}
        <svg
          className={`ml-1 h-4 w-4 transition-transform ${isActive ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isActive && (
        <div 
          className="absolute left-0 z-50 mt-1 w-48 origin-top-left rounded-lg bg-white shadow-lg border border-gray-200"
          onMouseLeave={onClose}
        >
          <div className="py-2">
            {subcategories.length > 0 ? (
              <div className="grid grid-cols-1">
                {subcategories.map((subcategory) => (
                  <Link
                    key={subcategory.slug}
                    href={`/products?category=${subcategory.slug}`}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={onClose}
                  >
                    {subcategory.name}
                  </Link>
                ))}
              </div>
            ) : (
              // No subcategories - show main category as direct link
              <Link
                href={`/products?category=${category.slug}`}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={onClose}
              >
                All {label}
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  )
}