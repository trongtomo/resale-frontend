/**
 * GraphQL queries for categories
 */

export const GET_MAIN_CATEGORIES = `
  query GetMainCategories {
    categories {
      documentId
      name
      slug
      description
      children {
        documentId
        name
        slug
      }
    }
  }
`

export const GET_SUBCATEGORIES = `
  query GetSubcategories($parentSlug: String!) {
    categories(filters: { parent: { slug: { eq: $parentSlug } } }) {
      documentId
      name
      slug
      description
    }
  }
`

export const GET_ALL_CATEGORIES = `
  query GetAllCategories {
    categories {
      documentId
      name
      slug
      description
      parent {
        documentId
        name
        slug
      }
      children {
        documentId
        name
        slug
      }
    }
  }
`
