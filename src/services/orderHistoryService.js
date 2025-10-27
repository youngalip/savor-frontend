// src/services/orderHistoryService.js

import { apiService } from './api'
import { getDeviceId } from '../utils/deviceId'

export const orderHistoryService = {
  /**
   * Get order history by device ID
   * Returns all orders from this device (permanent history)
   * 
   * @returns {Promise<Object>}
   */
  getDeviceHistory: async () => {
    try {
      const deviceId = getDeviceId()
      
      console.log('📜 Fetching order history for device:', deviceId)
      
      const response = await apiService.get('/orders/history/device', {
        params: { device_id: deviceId }
      })
      
      if (response.data.success) {
        console.log('✅ Order history loaded:', response.data.data)
        return {
          success: true,
          data: response.data.data
        }
      }
      
      throw new Error(response.data.message || 'Failed to fetch order history')
    } catch (error) {
      console.error('❌ Failed to fetch order history:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to fetch order history'
      }
    }
  },

  /**
   * Get order detail by UUID
   * 
   * @param {string} orderUuid 
   * @returns {Promise<Object>}
   */
  getOrderDetail: async (orderUuid) => {
    try {
      console.log('📄 Fetching order detail:', orderUuid)
      
      const response = await apiService.get(`/orders/${orderUuid}`)
      
      if (response.data.success) {
        return {
          success: true,
          data: response.data.data
        }
      }
      
      throw new Error(response.data.message || 'Failed to fetch order detail')
    } catch (error) {
      console.error('❌ Failed to fetch order detail:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message
      }
    }
  },

  /**
   * Reorder - Add order items back to cart
   * 
   * @param {Array} items - Order items to add to cart
   * @returns {Promise<Object>}
   */
  reorder: async (items) => {
    try {
      console.log('🔄 Reordering items:', items)
      
      // This will be implemented based on your cart logic
      // For now, return success
      return {
        success: true,
        message: 'Items added to cart',
        data: { items }
      }
    } catch (error) {
      console.error('❌ Reorder failed:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }
}

export default orderHistoryService