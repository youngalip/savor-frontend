// src/components/history/OrderDetailModal.jsx

import React from 'react'
import { X, Calendar, MapPin, Clock, CheckCircle, Receipt } from 'lucide-react'
import { formatCurrency } from '../../utils/formatters'

const OrderDetailModal = ({ order, onClose, onReorder }) => {
  if (!order) return null

  const getStatusColor = () => {
    switch (order.payment_status) {
      case 'Paid':
        return 'text-green-600 bg-green-50'
      case 'Pending':
        return 'text-yellow-600 bg-yellow-50'
      case 'Failed':
        return 'text-red-600 bg-red-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch (error) {
      return dateString
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-center">
      {/* Modal Content */}
      <div className="bg-white w-full sm:max-w-2xl sm:rounded-3xl rounded-t-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-cream-200 px-6 py-4 flex items-center justify-between rounded-t-3xl">
          <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-cream-100 transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Order Number & Status */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {order.order_number}
              </h3>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(order.created_at)}</span>
              </div>
            </div>
            
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${getStatusColor()}`}>
              {order.payment_status === 'Paid' && <CheckCircle className="w-5 h-5" />}
              {order.payment_status === 'Pending' && <Clock className="w-5 h-5" />}
              <span className="font-medium">{order.payment_status}</span>
            </div>
          </div>

          {/* Table Info */}
          {order.table_number && (
            <div className="bg-cream-50 rounded-xl p-4 mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-600">Table</div>
                  <div className="font-bold text-gray-900">{order.table_number}</div>
                </div>
              </div>
            </div>
          )}

          {/* Items List */}
          <div className="mb-6">
            <h4 className="font-bold text-gray-900 mb-4">Order Items</h4>
            <div className="space-y-3">
              {order.items && order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      {item.quantity}x {item.menu_name}
                    </div>
                    {item.special_notes && (
                      <div className="text-sm text-gray-500 mt-1">
                        Note: {item.special_notes}
                      </div>
                    )}
                    <div className="text-sm text-gray-600 mt-1">
                      {formatCurrency(item.price)} each
                    </div>
                  </div>
                  <div className="font-medium text-gray-900">
                    {formatCurrency(item.subtotal)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Notes */}
          {order.notes && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <div className="flex items-start space-x-3">
                <Receipt className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-blue-900 mb-1">Order Notes</div>
                  <div className="text-sm text-blue-700">{order.notes}</div>
                </div>
              </div>
            </div>
          )}

          {/* Price Breakdown */}
          <div className="border-t border-cream-200 pt-4">
            <h4 className="font-bold text-gray-900 mb-4">Payment Summary</h4>
            
            <div className="space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              
              <div className="flex justify-between text-gray-600">
                <span>Service Charge</span>
                <span>{formatCurrency(order.service_charge)}</span>
              </div>
              
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span>{formatCurrency(order.tax)}</span>
              </div>
              
              <div className="border-t border-cream-200 pt-3">
                <div className="flex justify-between">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-lg font-bold text-primary-600">
                    {formatCurrency(order.total_amount)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Reference */}
          {order.payment_reference && (
            <div className="mt-4 text-sm text-gray-500">
              Payment Reference: {order.payment_reference}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {order.payment_status === 'Paid' && (
          <div className="sticky bottom-0 bg-white border-t border-cream-200 p-6">
            <button
              onClick={() => onReorder(order)}
              className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-4 rounded-2xl transition-colors duration-200"
            >
              Order Again
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default OrderDetailModal