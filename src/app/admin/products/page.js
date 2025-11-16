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
  const pageSize = 10


  const loadProducts = async (page = 1) => {
    try {
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
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts(currentPage)
  }, [currentPage])

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete product')
      }

      loadProducts(currentPage)
      setDeleteModal({ isOpen: false, product: null })
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Failed to delete product')
    }
  }

  const handleDisable = async (product) => {
    try {
      const newStatus = product.status === 'active' ? 'inactive' : 'active'
      const response = await fetch(`/api/products/${product.documentId}`, {
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
          p.documentId === product.documentId
            ? { ...p, status: newStatus }
            : p
        )
      )
    } catch (error) {
      console.error('Error updating product status:', error)
      alert('Failed to update product status')
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
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <Link
            href="/admin/products/create"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
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
                      <tr key={product.documentId}>
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
                            href={`/admin/products/${product.documentId}/edit`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDisable(product)}
                            className={`${
                              product.status === 'active'
                                ? 'text-yellow-600 hover:text-yellow-900'
                                : 'text-green-600 hover:text-green-900'
                            }`}
                          >
                            {product.status === 'active' ? 'Disable' : 'Enable'}
                          </button>
                          <button
                            onClick={() => openDeleteModal(product)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
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
          onConfirm={() => handleDelete(deleteModal.product?.documentId)}
          productName={deleteModal.product?.name}
        />

        <div className="mt-6">
          <Link
            href="/admin"
            className="text-blue-600 hover:text-blue-800"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
