'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { formatCurrency, getStatusBadge } from '@/utils/format'
import DeleteConfirmModal from '@/components/DeleteConfirmModal'
import Pagination from '@/components/Pagination'

export default function AdminProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, product: null })
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [deletingId, setDeletingId] = useState(null)
  const [updatingId, setUpdatingId] = useState(null)
  const pageSize = 10

  const showMessage = (type, text) => {
    setMessage({ type, text })
    setTimeout(() => setMessage({ type: '', text: '' }), 3000)
  }

  const loadProducts = async (page = 1) => {
    try {
      setLoading(true)
      const response = await fetch('/api/products?pageSize=1000')
      const data = await response.json()
      const allProducts = data.data || []
      
      // Calculate pagination
      const total = allProducts.length
      const totalPagesCount = Math.ceil(total / pageSize)
      setTotalPages(totalPagesCount)
      
      // Get paginated products
      const startIndex = (page - 1) * pageSize
      const endIndex = startIndex + pageSize
      setProducts(allProducts.slice(startIndex, endIndex))
    } catch (error) {
      console.error('Error loading products:', error)
      showMessage('error', 'Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts(currentPage)
  }, [currentPage])

  const handleDelete = async (id) => {
    try {
      setDeletingId(id)
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete product')
      }

      showMessage('success', 'Product deleted successfully!')
      loadProducts(currentPage)
      setDeleteModal({ isOpen: false, product: null })
    } catch (error) {
      console.error('Error deleting product:', error)
      showMessage('error', 'Failed to delete product')
    } finally {
      setDeletingId(null)
    }
  }

  const handleDisable = async (product) => {
    try {
      setUpdatingId(product.documentId || product._id)
      const newStatus = product.status === 'active' ? 'inactive' : 'active'
      const response = await fetch(`/api/products/${product.documentId || product._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...product,
          status: newStatus
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update product status')
      }

      // Update local state immediately
      setProducts(prevProducts =>
        prevProducts.map(p =>
          (p.documentId === product.documentId || p._id === product._id)
            ? { ...p, status: newStatus }
            : p
        )
      )
      
      showMessage('success', `Product ${newStatus === 'active' ? 'enabled' : 'disabled'} successfully!`)
    } catch (error) {
      console.error('Error updating product status:', error)
      showMessage('error', 'Failed to update product status')
    } finally {
      setUpdatingId(null)
    }
  }

  const openDeleteModal = (product) => {
    setDeleteModal({ isOpen: true, product })
  }

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, product: null })
  }

  // Group products by category
  const productsByCategory = products.reduce((acc, product) => {
    const categoryName = product.category?.name || 'Uncategorized'
    if (!acc[categoryName]) {
      acc[categoryName] = []
    }
    acc[categoryName].push(product)
    return acc
  }, {})

  const categories = Object.keys(productsByCategory).sort()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading products...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success/Error Messages */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-md ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            <div className="flex">
              <div className="flex-shrink-0">
                {message.type === 'success' ? (
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{message.text}</p>
              </div>
            </div>
          </div>
        )}

        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <Link
            href="/admin/products/create"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Create New Product
          </Link>
        </div>

        {categories.length === 0 ? (
          <div className="bg-white shadow rounded-lg p-6 text-center">
            <p className="text-gray-500">No products found. Create your first product!</p>
          </div>
        ) : (
          <div className="space-y-8">
            {categories.map((categoryName) => (
              <div key={categoryName} className="bg-white shadow rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">{categoryName}</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {productsByCategory[categoryName].length} product{productsByCategory[categoryName].length !== 1 ? 's' : ''}
                  </p>
                </div>
                
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Brand
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {productsByCategory[categoryName].map((product) => (
                      <tr key={product.documentId || product._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500">{product.slug}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(product.price)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {product.brand?.name || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(product.status, 'product')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                          <Link
                            href={`/admin/products/${product.documentId || product._id}/edit`}
                            className="text-blue-600 hover:text-blue-900 transition-colors"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDisable(product)}
                            disabled={updatingId === (product.documentId || product._id)}
                            className={`${
                              product.status === 'active'
                                ? 'text-yellow-600 hover:text-yellow-900'
                                : 'text-green-600 hover:text-green-900'
                            } ${
                              updatingId === (product.documentId || product._id) 
                                ? 'opacity-50 cursor-not-allowed' 
                                : ''
                            } transition-colors`}
                          >
                            {updatingId === (product.documentId || product._id) ? (
                              <span className="flex items-center">
                                <svg className="animate-spin h-4 w-4 mr-1" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                </svg>
                                Updating...
                              </span>
                            ) : (
                              product.status === 'active' ? 'Disable' : 'Enable'
                            )}
                          </button>
                          <button
                            onClick={() => openDeleteModal(product)}
                            disabled={deletingId === (product.documentId || product._id)}
                            className={`text-red-600 hover:text-red-900 transition-colors ${
                              deletingId === (product.documentId || product._id) 
                                ? 'opacity-50 cursor-not-allowed' 
                                : ''
                            }`}
                          >
                            {deletingId === (product.documentId || product._id) ? (
                              <span className="flex items-center">
                                <svg className="animate-spin h-4 w-4 mr-1" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                </svg>
                                Deleting...
                              </span>
                            ) : (
                              'Delete'
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        )}

        <DeleteConfirmModal
          isOpen={deleteModal.isOpen}
          onClose={closeDeleteModal}
          onConfirm={() => handleDelete(deleteModal.product?.documentId || deleteModal.product?._id)}
          productName={deleteModal.product?.name}
        />

        <div className="mt-6">
          <Link
            href="/admin"
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
