// src/services/api.js
import axios from 'axios';
import { getDeviceId } from '../utils/deviceId';
import { authStorage } from '../utils/authStorage';

// Base configuration
const BASE_URL = 'http://127.0.0.1:8000';
const API_VERSION = 'v1';

// Axios instance
const apiClient = axios.create({
  baseURL: `${BASE_URL}/api/${API_VERSION}`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // 🔥 PRIORITY 1: JWT TOKEN for staff/owner routes
    const jwtToken = authStorage.getToken();
    if (jwtToken) {
      config.headers.Authorization = `Bearer ${jwtToken}`;
    } else {
      // PRIORITY 2: Session token for customer routes (only if no JWT)
      const sessionToken = localStorage.getItem('session_token');
      if (sessionToken) {
        config.headers.Authorization = `Bearer ${sessionToken}`;
      }
    }

    // Device ID: selalu sisipkan di semua request
    const deviceId = getDeviceId();
    config.headers['X-Device-Id'] = deviceId;

    // Kalau endpoint history by device → pastikan query param ikut
    const url = config.url || '';
    if (url.includes('/orders/history/device')) {
      config.params = { ...(config.params || {}), device_id: deviceId };
    }

    console.log(
      `🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`,
      config.params || config.data || {}
    );
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status}`, response.data);
    return response;
  },
  (error) => {
    console.error('❌ Response Error:', error.response?.data || error.message);
    
    // 🔥 HANDLE 401 - Unauthorized
    if (error.response?.status === 401) {
      const jwtToken = authStorage.getToken();
      
      // If user has JWT token but got 401, it means token expired/invalid
      if (jwtToken) {
        console.warn('🔐 JWT Token expired or invalid, logging out...');
        console.warn('🔍 ERROR DETAILS:', error.response?.data);  // 🔥 TAMBAH INI
        console.warn('🔍 REQUEST URL:', error.config?.url);        // 🔥 TAMBAH INI
        console.warn('🔍 TOKEN:', jwtToken.substring(0, 50));      // 🔥 TAMBAH INI
        
        // 🔥 TEMPORARY: Comment redirect untuk debug
        // authStorage.clearAuth();
        // window.location.href = '/login';
        
        alert('401 Error detected! Check console for details'); // 🔥 TAMBAH INI
      } else {
        // Customer session handling
        const sessionToken = localStorage.getItem('session_token');
        if (sessionToken) {
          localStorage.removeItem('session_token');
          localStorage.removeItem('customer_uuid');
          localStorage.removeItem('table_info');
          localStorage.removeItem('session_expires_at');
          console.warn('⚠️ Customer session expired, please scan QR again');
        }
      }
    }
    
    return Promise.reject(error);
  }
);

// ==========================================
// API SERVICE
// ==========================================
export const apiService = {
  // ==========================================
  // QR & SESSION MANAGEMENT (Customer)
  // ==========================================
  scanQR: async (qrCode, deviceInfo = {}) => {
    const { data } = await apiClient.post('/scan-qr', {
      qr_code: qrCode,
      device_info: deviceInfo,
      device_id: getDeviceId(),
    });
    return data;
  },

  validateSession: async (sessionToken) => {
    const { data } = await apiClient.post('/session/validate', { 
      session_token: sessionToken 
    });
    return data;
  },

  getSession: async (token) => {
    const { data } = await apiClient.get(`/session/${token}`);
    return data;
  },

  extendSession: async (token) => {
    const { data } = await apiClient.post(`/session/extend/${token}`);
    return data;
  },

  // ==========================================
  // MENU & CATEGORIES (Public)
  // ==========================================
  getCategories: async () => {
    const { data } = await apiClient.get('/categories');
    return data;
  },

  getMenus: async (params = {}) => {
    const { data } = await apiClient.get('/menus', { params });
    return data;
  },

  getMenu: async (id) => {
    const { data } = await apiClient.get(`/menus/${id}`);
    return data;
  },

  // ==========================================
  // STOCK CHECK
  // ==========================================
  checkStock: async (menuId) => {
    const { data: resp } = await apiClient.get(`/menus/${menuId}`);
    
    if (resp.success && resp.data) {
      const item = resp.data;
      return {
        success: true,
        data: {
          menu_item_id: item.id,
          name: item.name,
          stock_quantity: item.stock_quantity || 0,
          minimum_stock: item.minimum_stock || 0,
          is_available: item.is_available && item.stock_quantity > 0,
          is_low_stock: item.stock_quantity <= (item.minimum_stock || 5),
          stock_status: item.is_available && item.stock_quantity > 0 
            ? 'available' 
            : 'out_of_stock'
        }
      };
    }
    throw new Error('Invalid response format');
  },

  // ==========================================
  // ORDER MANAGEMENT (Customer)
  // ==========================================
  createOrder: async (orderData) => {
    const { data } = await apiClient.post('/orders', orderData);
    return data;
  },

  getOrder: async (uuid) => {
    const { data } = await apiClient.get(`/orders/${uuid}`);
    return data;
  },

  getOrderHistory: async (sessionToken) => {
    const { data } = await apiClient.get(`/orders/history/${sessionToken}`);
    return data;
  },

  getDeviceHistory: async (deviceId) => {
    const { data } = await apiClient.get('/orders/history/device', {
      params: { device_id: deviceId || getDeviceId() }
    });
    return data;
  },

  // ==========================================
  // CASHIER (Staff - Protected)
  // ==========================================
  payCashOrder: async (orderUuid) => {
    const { data } = await apiClient.post(
      `/staff/cashier/orders/${orderUuid}/pay-cash`
    );
    return data;
  },

  // ==========================================
  // PAYMENT PROCESSING
  // ==========================================
  processPayment: async (paymentData) => {
    const { data } = await apiClient.post('/payment/process', paymentData);
    return data;
  },

  finishPayment: async (params = {}) => {
    const { data } = await apiClient.get('/payment/finish', { params });
    return data;
  },

  // ==========================================
  // GENERIC HELPERS
  // ==========================================
  get: async (endpoint, config = {}) => apiClient.get(endpoint, config),
  post: async (endpoint, data = {}, config = {}) => apiClient.post(endpoint, data, config),
  patch: async (endpoint, data = {}, config = {}) => apiClient.patch(endpoint, data, config),
  put: async (endpoint, data = {}, config = {}) => apiClient.put(endpoint, data, config),
  delete: async (endpoint, config = {}) => apiClient.delete(endpoint, config),
};

// ==========================================
// SESSION STORAGE HELPERS (Customer)
// ==========================================
export const sessionStorage = {
  setSession: (sessionData) => {
    localStorage.setItem('session_token', sessionData.session_token);
    localStorage.setItem('customer_uuid', sessionData.customer_uuid);
    localStorage.setItem('table_info', JSON.stringify(sessionData.table));
    localStorage.setItem('session_expires_at', sessionData.session_expires_at);
  },

  getSession: () => ({
    session_token: localStorage.getItem('session_token'),
    customer_uuid: localStorage.getItem('customer_uuid'),
    table_info: JSON.parse(localStorage.getItem('table_info') || 'null'),
    session_expires_at: localStorage.getItem('session_expires_at')
  }),

  clearSession: () => {
    localStorage.removeItem('session_token');
    localStorage.removeItem('customer_uuid');
    localStorage.removeItem('table_info');
    localStorage.removeItem('session_expires_at');
  },

  isSessionValid: () => {
    const expiresAt = localStorage.getItem('session_expires_at');
    if (!expiresAt) return false;
    return new Date(expiresAt) > new Date();
  }
};

export default apiClient;