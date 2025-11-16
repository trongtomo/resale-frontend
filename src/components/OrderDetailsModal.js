'use client'

import { formatCurrency, formatDate, getStatusBadge } from '@/utils/format'

export default function OrderDetailsModal({ order, onClose }) {
  if (!order) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose}></div>
        
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Order Details</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900">Order Information</h4>
                <div className="mt-2 text-sm text-gray-600">
                  <p><strong>Order ID:</strong> {order.orderId}</p>
                  <p><strong>Date:</strong> {formatDate(order.createdAt, { format: 'DD-MM-YYYY HH:mm' })}</p>
                  <p className="flex items-center gap-2">
                    <strong>Status:</strong> {getStatusBadge(order.status, 'order')}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900">Customer Information</h4>
                <div className="mt-2 text-sm text-gray-600">
                  <p><strong>Name:</strong> {order.customer.fullName}</p>
                  <p><strong>Email:</strong> {order.customer.email}</p>
                  <p><strong>Phone:</strong> {order.customer.phone}</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900">Shipping Address</h4>
                <div className="mt-2 text-sm text-gray-600">
                  <p>{order.customer.address}</p>
                  <p>{order.customer.city} {order.customer.zipCode}</p>
                  <p>{order.customer.country}</p>
                </div>
              </div>

              {order.note && (
                <div>
                  <h4 className="font-semibold text-gray-900">Order Note</h4>
                  <div className="mt-2 text-sm text-gray-600 bg-gray-50 p-3 rounded">
                    {order.note}
                  </div>
                </div>
              )}

              <div>
                <h4 className="font-semibold text-gray-900">Order Items</h4>
                <div className="mt-2 space-y-2">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-gray-900">{item.name} x{item.quantity}</span>
                      <span className="text-gray-600">{formatCurrency(item.price * item.quantity)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between text-base font-semibold pt-2 border-t">
                    <span className="text-gray-900">Total</span>
                    <span className="text-gray-900">{formatCurrency(order.total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

