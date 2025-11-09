// Context text mapping for different categories
export const contextTexts = {
  // Shoes subcategories
  'running': 'Discover our vast collection of running shoes',
  'sneaker': 'Explore our premium sneaker collection',
  
  // Main categories
  'beauty': 'Find your perfect beauty products',
  'food': 'Fresh, quality food products',
  'shoes': 'Step into style with our shoe collection',
  
  // Default fallback
  'default': 'Discover our premium collection'
}

// Get context text for a category
export function getContextText(categorySlug) {
  return contextTexts[categorySlug] || contextTexts.default
}

// Get page title for a category
export function getPageTitle(category) {
  if (!category) return 'Products'
  
  if (category.category_product) {
    // Subcategory: "Running Shoes" or "Sneaker Shoes"
    return `${category.name} ${category.category_product.name}`
  }
  
  // Main category: "Beauty", "Food", etc.
  return category.name
}
