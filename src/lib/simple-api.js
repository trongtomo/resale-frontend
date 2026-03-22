// src/lib/simple-api.js
// Gọi qua API routes thay vì import mongodb trực tiếp

export const api = {
  getMainCategories: () =>
    fetch('/api/categories').then(r => r.json()).then(d => ({ categories: d.data || [] })),

  getSubcategories: () => Promise.resolve({ categories: [] }),

  getAllCategories: () =>
    fetch('/api/categories').then(r => r.json()).then(d => ({ categories: d.data || [] })),

  getProductsByCategory: (categorySlug) =>
    fetch(`/api/products?category=${categorySlug}`).then(r => r.json())
      .then(d => ({ products: d.data || [] })),

  getProductsByParentCategory: (parentCategorySlug) =>
    fetch(`/api/products?category=${parentCategorySlug}`).then(r => r.json())
      .then(d => ({ products: d.data || [] })),

  getAllProducts: () =>
    fetch('/api/products').then(r => r.json()).then(d => ({ products: d.data || [] })),

  getBrands: () =>
    fetch('/api/brands').then(r => r.json()).then(d => ({ data: d.data || [] })),

  getProductsByBrand: (brandSlug) =>
    fetch(`/api/products?brand=${brandSlug}`).then(r => r.json())
      .then(d => ({ products: d.data || [] })),

  getProduct: (slug) =>
    fetch(`/api/products/${slug}`).then(r => r.json())
      .then(d => ({ products: d.data ? [d.data] : [] })),
}