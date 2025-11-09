/**
 * GraphQL queries for products
 */

export const GET_PRODUCTS_BY_CATEGORY = `
  query GetProductsByCategory($categorySlug: String!) {
    products(filters: { category: { slug: { eq: $categorySlug } } }) {
      documentId
      name
      slug
      price
      shortDescription
      images {
        url
      }
      category {
        documentId
        name
        slug
      }
      brand {
        documentId
        name
        slug
      }
    }
  }
`

export const GET_PRODUCTS_BY_PARENT_CATEGORY = `
  query GetProductsByParentCategory($parentCategorySlug: String!) {
    products(filters: { category: { parent: { slug: { eq: $parentCategorySlug } } } }) {
      documentId
      name
      slug
      price
      shortDescription
      images {
        url
      }
      category {
        documentId
        name
        slug
      }
      brand {
        documentId
        name
        slug
      }
    }
  }
`

export const GET_ALL_PRODUCTS = `
  query GetAllProducts {
    products {
      documentId
      name
      slug
      price
      shortDescription
      images {
        url
      }
      category {
        documentId
        name
        slug
      }
      brand {
        documentId
        name
        slug
      }
    }
  }
`

export const GET_PRODUCTS_BY_BRAND = `
  query GetProductsByBrand($brandSlug: String!) {
    products(filters: { brand: { slug: { eq: $brandSlug } } }) {
      documentId
      name
      slug
      price
      shortDescription
      images {
        url
      }
      category {
        documentId
        name
        slug
      }
      brand {
        documentId
        name
        slug
      }
    }
  }
`

export const GET_PRODUCT = `
  query GetProduct($slug: String!) {
    products(filters: { slug: { eq: $slug } }) {
      documentId
      name
      slug
      price
      description
      shortDescription
      images {
        url
      }
      category {
        documentId
        name
        slug
      }
      brand {
        documentId
        name
        slug
      }
    }
  }
`
