/**
 * Local data service - reads from JSON files instead of Strapi API
 */

import productsData from '@/data/products.json'
import categoriesData from '@/data/categories.json'
import brandsData from '@/data/brands.json'
import articlesData from '@/data/articles.json'

// Helper function to simulate API delay (optional, for realistic behavior)
const delay = (ms = 0) => new Promise(resolve => setTimeout(resolve, ms))

export const localData = {
  // Products
  async getProducts(filters = {}) {
    await delay(50) // Simulate network delay
    
    let products = [...productsData.products]
    
    // Filter out inactive products (only show active)
    products = products.filter(p => p.status === 'active')
    
    // Apply category filter
    if (filters.category) {
      products = products.filter(p => p.category?.slug === filters.category)
    }
    
    // Apply brand filter
    if (filters.selectedBrand) {
      products = products.filter(p => p.brand?.documentId === filters.selectedBrand)
    }
    
    // Apply price filters
    if (filters.priceMin) {
      products = products.filter(p => p.price >= parseInt(filters.priceMin))
    }
    if (filters.priceMax) {
      products = products.filter(p => p.price <= parseInt(filters.priceMax))
    }
    
    // Apply price range filters
    if (filters.priceRange && filters.priceRange !== 'all') {
      switch (filters.priceRange) {
        case 'under-50':
          products = products.filter(p => p.price < 5000000)
          break
        case '50-100':
          products = products.filter(p => p.price >= 5000000 && p.price <= 10000000)
          break
        case '100-200':
          products = products.filter(p => p.price >= 10000000 && p.price <= 20000000)
          break
        case 'above-200':
          products = products.filter(p => p.price > 20000000)
          break
      }
    }
    
    // Apply sorting
    if (filters.sortBy === 'price-asc') {
      products.sort((a, b) => a.price - b.price)
    } else if (filters.sortBy === 'price-desc') {
      products.sort((a, b) => b.price - a.price)
    } else {
      // Default: newest first
      products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    }
    
    // Pagination
    const page = filters.page || 1
    const pageSize = filters.pageSize || 12
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    const paginatedProducts = products.slice(startIndex, endIndex)
    
    return {
      data: paginatedProducts,
      meta: {
        pagination: {
          page,
          pageSize,
          pageCount: Math.ceil(products.length / pageSize),
          total: products.length
        }
      }
    }
  },
  
  async getProductBySlug(slug) {
    await delay(50)
    const product = productsData.products.find(p => p.slug === slug && p.status === 'active')
    return {
      data: product ? [product] : []
    }
  },
  
  async getAllProducts() {
    await delay(50)
    return {
      products: productsData.products.filter(p => p.status === 'active')
    }
  },
  
  async getProductsByCategory(categorySlug) {
    await delay(50)
    const products = productsData.products.filter(p => 
      p.category?.slug === categorySlug && p.status === 'active'
    )
    return {
      products
    }
  },
  
  async getProductsByParentCategory(parentCategorySlug) {
    await delay(50)
    // For now, return products by category (can be extended for parent/child relationships)
    const products = productsData.products.filter(p => 
      p.category?.slug === parentCategorySlug && p.status === 'active'
    )
    return {
      products
    }
  },
  
  async getProductsByBrand(brandSlug) {
    await delay(50)
    const products = productsData.products.filter(p => 
      p.brand?.slug === brandSlug && p.status === 'active'
    )
    return {
      products
    }
  },
  
  // Categories
  async getCategories() {
    await delay(50)
    return {
      data: categoriesData.categories
    }
  },
  
  async getAllCategories() {
    await delay(50)
    return {
      categories: categoriesData.categories
    }
  },
  
  async getMainCategories() {
    await delay(50)
    // Return all categories (flat structure)
    return {
      categories: categoriesData.categories
    }
  },
  
  async getSubcategories(parentSlug) {
    await delay(50)
    // Return empty array (no subcategories in flat structure)
    return {
      categories: []
    }
  },
  
  // Brands
  async getBrands(categorySlug = null) {
    await delay(50)
    let brands = [...brandsData.brands]
    
    if (categorySlug) {
      // Filter brands that have products in this category
      const categoryProducts = productsData.products.filter(p => p.category?.slug === categorySlug)
      const brandIds = new Set(categoryProducts.map(p => p.brand?.documentId))
      brands = brands.filter(b => brandIds.has(b.documentId))
    }
    
    return {
      data: brands
    }
  },
  
  async getAllBrands() {
    await delay(50)
    return {
      brands: brandsData.brands
    }
  },
  
  // Articles
  async getArticles(page = 1, pageSize = 9) {
    await delay(50)
    const articles = [...articlesData.articles]
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    const paginatedArticles = articles.slice(startIndex, endIndex)
    
    return {
      data: paginatedArticles,
      meta: {
        pagination: {
          page,
          pageSize,
          pageCount: Math.ceil(articles.length / pageSize),
          total: articles.length
        }
      }
    }
  },
  
  async getArticleBySlug(slug) {
    await delay(50)
    const article = articlesData.articles.find(a => a.slug === slug)
    return {
      data: article ? [article] : []
    }
  },
  
  async getArticlesByTag(tagSlug, page = 1, pageSize = 9) {
    await delay(50)
    // For now, return all articles (tags can be added later if needed)
    return this.getArticles(page, pageSize)
  }
}

