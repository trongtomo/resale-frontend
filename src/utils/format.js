export function formatDate(date, options = {}) {
  if (!date) return ''
  
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options
  }
  
  return new Intl.DateTimeFormat('en-US', defaultOptions).format(new Date(date))
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
