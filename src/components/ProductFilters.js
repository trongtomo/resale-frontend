'use client'

import { formatCurrency } from '@/utils/format'
import { useMemo, useState } from 'react'

export default function ProductFilters({
  onFiltersChange,
  currentFilters = {},
  products = [],
  categorySlug = null,
  onToggle,
  isVisible = false
}) {
  const [filters, setFilters] = useState({
    priceMin: currentFilters.priceMin || '',
    priceMax: currentFilters.priceMax || '',
    priceRange: currentFilters.priceRange || 'all',
    sortBy: currentFilters.sortBy || 'newest',
    selectedBrand: currentFilters.selectedBrand || null
  })

  // Extract unique brands from products
  const availableBrands = useMemo(() => {
    const brandMap = new Map()

    products.forEach(product => {
      if (product.brand && product.brand.documentId) {
        // Only add if not already in map
        if (!brandMap.has(product.brand.documentId)) {
          brandMap.set(product.brand.documentId, {
            documentId: product.brand.documentId,
            name: product.brand.name,
            slug: product.brand.slug
          })
        }
      }
    })

    // Convert map to array and sort by name
    return Array.from(brandMap.values()).sort((a, b) => a.name.localeCompare(b.name))
  }, [products])

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const clearFilters = () => {
    const clearedFilters = {
      priceMin: '',
      priceMax: '',
      priceRange: 'all',
      sortBy: 'newest',
      selectedBrand: null
    }
    setFilters(clearedFilters)
    onFiltersChange(clearedFilters)
  }

  const priceRanges = [
    { value: 'all', label: 'All Prices' },
    { value: 'under-50', label: `Under ${formatCurrency(5000000)}` },
    { value: '50-100', label: `${formatCurrency(5000000)} - ${formatCurrency(10000000)}` },
    { value: '100-200', label: `${formatCurrency(10000000)} - ${formatCurrency(20000000)}` },
    { value: 'above-200', label: `Above ${formatCurrency(20000000)}` }
  ]

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' }
  ]

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          {onToggle && (
            <button
              onClick={onToggle}
              className="p-1.5 text-gray-500 hover:text-gray-700 transition-all duration-200"
              title={isVisible ? 'Hide Filters' : 'Show Filters'}
              aria-label={isVisible ? 'Hide Filters' : 'Show Filters'}
            >
              <span className="hidden md:inline text-sm">
                {isVisible ? 'Hide Filters' : 'Show Filters'}
              </span>
            </button>
          )}
        </h3>
        <div className="flex items-center gap-2">

          <button
            onClick={clearFilters}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Clear all
          </button>
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Price Range</h4>
        <div className="space-y-2">
          {priceRanges.map((range) => (
            <label key={range.value} className="flex items-center">
              <input
                type="radio"
                name="priceRange"
                value={range.value}
                checked={filters.priceRange === range.value}
                onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">{range.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Custom Price Range */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Custom Price Range</h4>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Min Price</label>
            <input
              type="number"
              placeholder="0"
              value={filters.priceMin}
              onChange={(e) => handleFilterChange('priceMin', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Max Price</label>
            <input
              type="number"
              placeholder="No limit"
              value={filters.priceMax}
              onChange={(e) => handleFilterChange('priceMax', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Brands */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Brands</h4>
        {availableBrands.length === 0 ? (
          <div className="text-sm text-gray-500">No brands available</div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {availableBrands.map((brand) => (
              <button
                key={brand.documentId}
                onClick={() => handleFilterChange('selectedBrand',
                  filters.selectedBrand === brand.documentId ? null : brand.documentId
                )}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${filters.selectedBrand === brand.documentId
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {brand.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Sort By */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Sort By</h4>
        <select
          value={filters.sortBy}
          onChange={(e) => handleFilterChange('sortBy', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
