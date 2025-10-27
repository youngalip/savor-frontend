// src/pages/customer/OrderHistoryPage.jsx

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, RefreshCw, Receipt, TrendingUp } from 'lucide-react'
import { orderHistoryService } from '../../services/orderHistoryService'
import { formatCurrency } from '../../utils/formatters'
import OrderCard from '../../components/history/OrderCard'
import OrderDetailModal from '../../components/history/OrderDetailModal'
import EmptyHistoryState from '../../components/history/EmptyHistoryState'
import useCartStore from '../../store/useCartStore'

const OrderHistoryPage = () => {
  const navigate = useNavigate()
  const { addItem } = useCartStore()
  
  // State
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState(null)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  
  // Stats
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0
  })

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const result = await orderHistoryService.getDeviceHistory()
      
      if (result.success) {
        setOrders(result.data.orders || [])
        setStats({
          totalOrders: result.data.total_orders || 0,
          totalSpent: result.data.total_spent || 0
        })
      } else {
        setError(result.error || 'Failed to load order history')
      }
    } catch (err) {
      console.error('❌ Error loading history:', err)
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadHistory()
    setRefreshing(false)
  }

  const handleOrderClick = (order) => {
    setSelectedOrder(order)
    setShowDetailModal(true)
  }

  const handleCloseModal = () => {
    setShowDetailModal(false)
    setSelectedOrder(null)
  }

  const handleReorder = (order) => {
    try {
      // Add all items from order to cart
      if (order.items && order.items.length > 0) {
        order.items.forEach(item => {
          // Assuming your cart store has an addItem method
          // You may need to adjust this based on your actual cart implementation
          addItem({
            id: item.menu_id,
            name: item.menu_name,
            price: item.price,
            quantity: item.quantity,
            notes: item.special_notes || ''
          })
        })
        
        alert('Items added to cart!')
        handleCloseModal()
        navigate('/cart')
      }
    } catch (error) {
      console.error('❌ Reorder failed:', error)
      alert('Failed to add items to cart')
    }
  }

  const handleBack = () => {
    navigate(-1)
  }

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order history...</p>
        </div>
      </div>
    )
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-cream-50">
        <div className="sticky top-0 bg-white border-b border-cream-200 z-40">
          <div className="flex items-center justify-between px-4 py-4">
            <button 
              onClick={handleBack}
              className="p-2 hover:bg-cream-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">Order History</h1>
            <div className="w-9" />
          </div>
        </div>
        
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={handleRefresh}
              className="bg-primary-500 hover:bg-primary-600 text-white font-bold px-6 py-3 rounded-xl transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-cream-200 z-40">
        <div className="flex items-center justify-between px-4 py-4">
          <button 
            onClick={handleBack}
            className="p-2 hover:bg-cream-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Order History</h1>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 hover:bg-cream-100 rounded-lg transition-colors"
          >
            <RefreshCw className={`w-5 h-5 text-gray-700 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="pb-8">
        {/* Empty State */}
        {orders.length === 0 ? (
          <EmptyHistoryState />
        ) : (
          <>
            {/* Stats Card */}
            <div className="bg-white mx-4 mt-4 rounded-2xl border border-cream-200 p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Receipt className="w-5 h-5 text-primary-600" />
                    <span className="text-sm text-gray-600">Total Orders</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {stats.totalOrders}
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-gray-600">Total Spent</span>
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(stats.totalSpent)}
                  </div>
                </div>
              </div>
            </div>

            {/* Orders List */}
            <div className="px-4 mt-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">
                  Your Orders ({orders.length})
                </h2>
              </div>
              
              <div className="space-y-3">
                {orders.map((order) => (
                  <OrderCard
                    key={order.uuid}
                    order={order}
                    onClick={handleOrderClick}
                  />
                ))}
              </div>
            </div>

            {/* Info Card */}
            <div className="mx-4 mt-6 bg-blue-50 border border-blue-200 rounded-2xl p-4">
              <p className="text-sm text-blue-800">
                <span className="font-medium">💡 Note:</span> Order history is stored on this device. 
                Clearing browser data will remove your history.
              </p>
            </div>
          </>
        )}
      </div>

      {/* Order Detail Modal */}
      {showDetailModal && selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={handleCloseModal}
          onReorder={handleReorder}
        />
      )}
    </div>
  )
}

export default OrderHistoryPage