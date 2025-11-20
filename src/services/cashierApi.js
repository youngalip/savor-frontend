// src/services/cashierApi.js
import apiClient from './api';

const cashierApi = {
  /**
   * Get orders with filters
   * @param {Object} filters - { status?, payment_status?, exclude_completed? }
   */
  getOrders: async (filters = {}) => {
    try {
      const params = {};
      
      // Handle exclude_completed special filter
      if (filters.exclude_completed) {
        params.exclude_completed = 'true';
      }
      
      // Add other filters
      Object.keys(filters).forEach(key => {
        if (key !== 'exclude_completed' && filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
          params[key] = filters[key];
        }
      });
      
      const { data } = await apiClient.get('/cashier/orders', { params });
      return data;
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      throw error;
    }
  },

  /**
   * Get single order detail
   * @param {number} id - Order ID
   */
  getOrder: async (id) => {
    try {
      const { data } = await apiClient.get(`/cashier/orders/${id}`);
      return data;
    } catch (error) {
      console.error('Failed to fetch order:', error);
      throw error;
    }
  },

  /**
   * Validate cash payment
   * @param {number} id - Order ID
   */
  validatePayment: async (id) => {
    try {
      const { data } = await apiClient.patch(`/cashier/orders/${id}/validate-payment`);
      return data;
    } catch (error) {
      console.error('Failed to validate payment:', error);
      throw error;
    }
  },

  /**
   * Mark order as completed
   * @param {number} id - Order ID
   */
  markCompleted: async (id) => {
    try {
      console.log('🔄 cashierApi.markCompleted called with id:', id);
      const { data } = await apiClient.patch(`/cashier/orders/${id}/complete`);
      console.log('✅ API Success:', data);
      return data;
    } catch (error) {
      console.error('❌ API Error:', error);
      throw error;
    }
  },

  /**
   * Get statistics
   * @param {Object} filters - Optional filters
   */
  getStatistics: async (filters = {}) => {
    try {
      const params = {};
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
          params[key] = filters[key];
        }
      });
      
      const { data } = await apiClient.get('/cashier/statistics', { params });
      return data;
    } catch (error) {
      console.error('Failed to fetch statistics:', error);
      throw error;
    }
  },

  /**
   * Reopen completed order (undo complete)
   * @param {number} id - Order ID
   */
  reopenOrder: async (id) => {
    try {
      const { data } = await apiClient.patch(`/cashier/orders/${id}/reopen`);
      return data;
    } catch (error) {
      console.error('Failed to reopen order:', error);
      throw error;
    }
  }
};

export default cashierApi;