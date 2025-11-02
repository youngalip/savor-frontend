// src/services/api.js - Update for subcategory support
import axios from 'axios'

// Base configuration
const BASE_URL = 'http://127.0.0.1:8000'
const API_VERSION = 'v1'

// Create axios instance
const apiClient = axios.create({
  baseURL: `${BASE_URL}/api/${API_VERSION}`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add session token if available
    const sessionToken = localStorage.getItem('session_token')
    if (sessionToken) {
      config.headers.Authorization = `Bearer ${sessionToken}`
    }
    
    console.log(`🚀 API Request: ${config.method.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    console.error('❌ Request Error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status}`, response.data)
    return response
  },
  (error) => {
    console.error('❌ Response Error:', error.response?.data || error.message)
    
    // Handle common errors
    if (error.response?.status === 401) {
      // Session expired, clear local storage
      localStorage.removeItem('session_token')
      localStorage.removeItem('customer_uuid')
      localStorage.removeItem('table_info')
      
      // Redirect to QR scan (in a real app)
      console.warn('Session expired, please scan QR again')
    }
    
    return Promise.reject(error)
  }
)

// API service functions
export const apiService = {
  // QR & Session Management
  scanQR: async (qrCode, deviceInfo) => {
    const response = await apiClient.post('/scan-qr', {
      qr_code: qrCode,
      device_info: deviceInfo
    })
    return response.data
  },

  validateSession: async (sessionToken) => {
    const response = await apiClient.post('/session/validate', {
      session_token: sessionToken
    })
    return response.data
  },

  getSession: async (token) => {
    const response = await apiClient.get(`/session/${token}`)
    return response.data
  },

  extendSession: async (token) => {
    const response = await apiClient.post(`/session/extend/${token}`)
    return response.data
  },

  // Menu Management
  getCategories: async () => {
    const response = await apiClient.get('/categories')
    return response.data
  },

  getMenus: async (params = {}) => {
    const response = await apiClient.get('/menus', { params })
    return response.data
  },

  getMenu: async (id) => {
    const response = await apiClient.get(`/menus/${id}`)
    return response.data
  },

  // Stock Management
  checkStock: async (menuId) => {
    try {
      // Gunakan endpoint getMenu yang sudah ada
      const response = await apiClient.get(`/menus/${menuId}`)
      
      // Transform response untuk format stock check
      if (response.data.success && response.data.data) {
        const item = response.data.data
        return {
          success: true,
          data: {
            menu_item_id: item.id,
            name: item.name,
            stock_quantity: item.stock_quantity || 0,
            minimum_stock: item.minimum_stock || 0,
            is_available: item.is_available && item.stock_quantity > 0,
            is_low_stock: item.stock_quantity <= (item.minimum_stock || 5),
            stock_status: item.is_available && item.stock_quantity > 0 ? 'available' : 'out_of_stock'
          }
        }
      }
      
      throw new Error('Invalid response format')
    } catch (error) {
      console.error('Error checking stock:', error)
      throw error
    }
  },

  // Order Management
  createOrder: async (orderData) => {
    const response = await apiClient.post('/orders', orderData)
    return response.data
  },

  getOrder: async (uuid) => {
    const response = await apiClient.get(`/orders/${uuid}`)
    return response.data
  },

  getOrderHistory: async (sessionToken) => {
    const response = await apiClient.get(`/orders/history/${sessionToken}`)
    return response.data
  },

  // Payment Management
  processPayment: async (paymentData) => {
    const response = await apiClient.post('/payment/process', paymentData)
    return response.data
  },

  finishPayment: async (params = {}) => {
    const response = await apiClient.get('/payment/finish', { params })
    return response.data
  },

  // Development/Testing endpoints
  get: async (endpoint, config = {}) => {
    const response = await apiClient.get(endpoint, config)
    return response
  },

  post: async (endpoint, data = {}, config = {}) => {
    const response = await apiClient.post(endpoint, data, config)
    return response
  }
}

// Helper functions for local storage
export const sessionStorage = {
  setSession: (sessionData) => {
    localStorage.setItem('session_token', sessionData.session_token)
    localStorage.setItem('customer_uuid', sessionData.customer_uuid)
    localStorage.setItem('table_info', JSON.stringify(sessionData.table))
    localStorage.setItem('session_expires_at', sessionData.session_expires_at)
  },

  getSession: () => {
    return {
      session_token: localStorage.getItem('session_token'),
      customer_uuid: localStorage.getItem('customer_uuid'),
      table_info: JSON.parse(localStorage.getItem('table_info') || 'null'),
      session_expires_at: localStorage.getItem('session_expires_at')
    }
  },

  clearSession: () => {
    localStorage.removeItem('session_token')
    localStorage.removeItem('customer_uuid')
    localStorage.removeItem('table_info')
    localStorage.removeItem('session_expires_at')
  },

  isSessionValid: () => {
    const expiresAt = localStorage.getItem('session_expires_at')
    if (!expiresAt) return false
    
    return new Date(expiresAt) > new Date()
  }
}

export default apiClient