/**
 * GraphQL queries for brands
 */

export const GET_BRANDS = `
  query GetBrands {
    brands {
      documentId
      name
      slug
      description
      logo {
        url
      }
    }
  }
`
