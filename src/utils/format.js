export function formatDate(date, options = {}) {
  if (!date) return ''
  
  const d = new Date(date)
  
  // If format is 'DD-MM-YYYY', use custom formatting
  if (options.format === 'DD-MM-YYYY') {
    const day = String(d.getDate()).padStart(2, '0')
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const year = d.getFullYear()
    return `${day}-${month}-${year}`
  }
  
  // If format is 'DD-MM-YYYY HH:mm', include time
  if (options.format === 'DD-MM-YYYY HH:mm') {
    const day = String(d.getDate()).padStart(2, '0')
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const year = d.getFullYear()
    const hours = String(d.getHours()).padStart(2, '0')
    const minutes = String(d.getMinutes()).padStart(2, '0')
    return `${day}-${month}-${year} ${hours}:${minutes}`
  }
  
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options
  }
  
  return new Intl.DateTimeFormat('en-US', defaultOptions).format(d)
}

export function formatCurrency(amount, currency = 'VND', locale = 'vi-VN') {
  if (amount === null || amount === undefined || isNaN(amount)) return ''
  
  if (currency === 'VND') {
    // Vietnamese Dong formatting: 1.500.000 vnđ
    return new Intl.NumberFormat('vi-VN', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount) + ' vnđ'
  }
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency
  }).format(amount)
}

export function truncateText(text, maxLength = 100) {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}

export function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function formatNumber(value) {
  if (!value && value !== 0) return ''
  // Remove any non-digit characters
  const numStr = String(value).replace(/\D/g, '')
  if (!numStr) return ''
  // Format with commas
  return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export function parseFormattedNumber(formattedValue) {
  if (!formattedValue) return ''
  // Remove commas and return as string
  return formattedValue.replace(/,/g, '')
}

/**
 * Get status badge configuration
 * @param {string} status - The status value
 * @param {string} type - Type of status: 'order', 'product', 'blog', 'page'
 * @returns {object} - Object with label, color, and className
 */
export function getStatusConfig(status, type = 'order') {
  const statusLower = (status || '').toLowerCase()

  // Order statuses
  if (type === 'order') {
    const orderStatuses = {
      pending: { label: 'Pending', color: 'yellow', className: 'bg-yellow-100 text-yellow-800' },
      paid: { label: 'Paid', color: 'blue', className: 'bg-blue-100 text-blue-800' },
      processing: { label: 'Processing', color: 'indigo', className: 'bg-indigo-100 text-indigo-800' },
      shipped: { label: 'Shipped', color: 'purple', className: 'bg-purple-100 text-purple-800' },
      delivered: { label: 'Delivered', color: 'green', className: 'bg-green-100 text-green-800' },
      cancelled: { label: 'Cancelled', color: 'red', className: 'bg-red-100 text-red-800' },
    }
    return orderStatuses[statusLower] || orderStatuses.pending
  }

  // Product statuses
  if (type === 'product') {
    const productStatuses = {
      active: { label: 'Active', color: 'green', className: 'bg-green-100 text-green-800' },
      inactive: { label: 'Inactive', color: 'gray', className: 'bg-gray-100 text-gray-800' },
      draft: { label: 'Draft', color: 'yellow', className: 'bg-yellow-100 text-yellow-800' },
    }
    return productStatuses[statusLower] || productStatuses.inactive
  }

  // Blog/Page statuses
  if (type === 'blog' || type === 'page') {
    const blogStatuses = {
      published: { label: 'Published', color: 'green', className: 'bg-green-100 text-green-800' },
      draft: { label: 'Draft', color: 'yellow', className: 'bg-yellow-100 text-yellow-800' },
      archived: { label: 'Archived', color: 'gray', className: 'bg-gray-100 text-gray-800' },
    }
    return blogStatuses[statusLower] || blogStatuses.draft
  }

  // Default
  return { label: status || 'Unknown', color: 'gray', className: 'bg-gray-100 text-gray-800' }
}

/**
 * Get status badge JSX element (for client components)
 * Note: This function returns JSX, so it should only be used in 'use client' components
 * @param {string} status - The status value
 * @param {string} type - Type of status: 'order', 'product', 'blog', 'page'
 * @returns {JSX.Element} - Status badge span element
 */
export function getStatusBadge(status, type = 'order') {
  const config = getStatusConfig(status, type)
  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${config.className}`}>
      {config.label}
    </span>
  )
}
