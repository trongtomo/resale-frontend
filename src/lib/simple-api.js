/**
 * Simple API client - now uses local data instead of GraphQL/Strapi
 */

import { localData } from './local-data'

// Simple API functions - now using local data
export const api = {
  // Get all main categories (those with children)
  getMainCategories: () => localData.getMainCategories(),

  // Get subcategories of a main category
  getSubcategories: (parentSlug) => localData.getSubcategories(parentSlug),

  // Get all categories (for navigation)
  getAllCategories: () => localData.getAllCategories(),

  // Get products by category
  getProductsByCategory: (categorySlug) => localData.getProductsByCategory(categorySlug),

  // Get products by parent category (includes all subcategories)
  getProductsByParentCategory: (parentCategorySlug) => localData.getProductsByParentCategory(parentCategorySlug),

  // Get all products
  getAllProducts: () => localData.getAllProducts(),

  // Get all brands
  getBrands: () => localData.getAllBrands(),

  // Get products by brand
  getProductsByBrand: (brandSlug) => localData.getProductsByBrand(brandSlug),

  // Get single product
  getProduct: (slug) => localData.getProductBySlug(slug).then(result => ({
    products: result.data
  })),
}
