'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, Suspense } from 'react'

function PaginationContent({ currentPage, totalPages, onPageChange }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const createQueryString = useCallback((name, value) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set(name, value)
    return params.toString()
  }, [searchParams])

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return
    
    if (onPageChange) {
      onPageChange(page)
    } else {
      router.push(`?${createQueryString('page', page)}`)
    }
  }

  if (totalPages <= 1) return null

  const getPageNumbers = () => {
    const pages = []
    const maxVisible = 5
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      const start = Math.max(1, currentPage - 2)
      const end = Math.min(totalPages, start + maxVisible - 1)
      
      if (start > 1) {
        pages.push(1)
        if (start > 2) pages.push('...')
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      
      if (end < totalPages) {
        if (end < totalPages - 1) pages.push('...')
        pages.push(totalPages)
      }
    }
    
    return pages
  }

  return (
    <div className="flex items-center justify-center space-x-2 mt-8">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>
      
      <div className="flex space-x-1">
        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === 'number' && handlePageChange(page)}
            disabled={page === '...'}
            className={`px-3 py-2 text-sm font-medium rounded-md ${
              page === currentPage
                ? 'bg-blue-600 text-white'
                : page === '...'
                ? 'text-gray-500 cursor-default'
                : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {page}
          </button>
        ))}
      </div>
      
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  )
}

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center space-x-2 mt-8">
        <span className="text-gray-400 text-sm">Loading...</span>
      </div>
    }>
      <PaginationContent currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
    </Suspense>
  )
}
