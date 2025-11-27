// src/components/history/OrderCard.jsx
import React from 'react'
import { Clock, CheckCircle, XCircle, MapPin, ChevronRight } from 'lucide-react'
import { formatCurrency } from '../../utils/formatters'
import { formatDistanceToNow } from 'date-fns'
import { id } from 'date-fns/locale'

const safeNum = (v) => (Number.isFinite(Number(v)) ? Number(v) : 0)

const OrderCard = ({ order, onClick }) => {
  const getStatusIcon = () => {
    switch (order.payment_status) {
      case 'Paid': return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'Pending': return <Clock className="w-5 h-5 text-yellow-600" />
      case 'Failed': return <XCircle className="w-5 h-5 text-red-600" />
      default: return <Clock className="w-5 h-5 text-gray-400" />
    }
  }

  const getStatusColor = () => {
    switch (order.payment_status) {
      case 'Paid': return 'text-green-600 bg-green-50'
      case 'Pending': return 'text-yellow-600 bg-yellow-50'
      case 'Failed': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const formatDate = (dateString) => {
    try {
      if (!dateString) return 'baru saja'
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return 'baru saja'
      return formatDistanceToNow(date, { addSuffix: true, locale: id })
    } catch {
      return 'baru saja'
    }
  }

  const itemsCount = safeNum(order.items_count)

  return (
    <div
      onClick={() => onClick(order)}
      className="bg-white rounded-2xl border border-cream-200 p-4 hover:shadow-md transition-shadow duration-200 cursor-pointer"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-bold text-lg text-gray-900">
            Meja {order.table_number || order.table?.table_number || '-'}
          </h3>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>{formatDate(order.created_at)}</span>
          </div>
        </div>

        <div className={`flex items-center space-x-1 px-3 py-1 rounded-full ${getStatusColor()}`}>
          {getStatusIcon()}
          <span className="text-sm font-medium">{order.payment_status}</span>
        </div>
      </div>

      {/* Table Info */}
      {order.table_number && (
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
          <MapPin className="w-4 h-4" />
          <span>Table {order.table_number}</span>
        </div>
      )}

      {/* Items Preview */}
      <div className="bg-cream-50 rounded-xl p-3 mb-3">
        <div className="text-sm text-gray-600 mb-2">
          {itemsCount} {itemsCount === 1 ? 'item' : 'items'}
        </div>

        {order.items && order.items.length > 0 && (
          <div className="space-y-1">
            {order.items.slice(0, 2).map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-gray-700">
                  {item.quantity}x {item.menu_name}
                </span>
                <span className="text-gray-600">
                  {formatCurrency(item.subtotal)}
                </span>
              </div>
            ))}
            {order.items.length > 2 && (
              <div className="text-xs text-gray-500 mt-1">
                +{order.items.length - 2} more items
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-gray-500 mb-1">Total Amount</div>
          <div className="text-lg font-bold text-gray-900">
            {formatCurrency(safeNum(order.total_amount))}
          </div>
        </div>

        <ChevronRight className="w-5 h-5 text-gray-400" />
      </div>
    </div>
  )
}

export default OrderCard
