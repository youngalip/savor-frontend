// src/services/dashboardService.js
import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000';
const API_VERSION = 'v1';

// Create axios instance for dashboard
const dashboardClient = axios.create({
  baseURL: `${BASE_URL}/api/${API_VERSION}`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor - add auth token if exists
dashboardClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('owner_token'); // Adjust based on your auth
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`🚀 Dashboard API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
dashboardClient.interceptors.response.use(
  (response) => {
    console.log(`✅ Dashboard API Response: ${response.status}`, response.data);
    return response;
  },
  (error) => {
    console.error('❌ Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

/**
 * Dashboard Service
 * Handles all owner dashboard API calls
 */
export const dashboardService = {
  /**
   * Get complete dashboard data
   * @returns {Promise} Dashboard data with all metrics
   */
  getDashboardData: async () => {
    try {
      const { data } = await dashboardClient.get('/owner/dashboard');
      
      if (data.success) {
        return {
          success: true,
          data: data.data
        };
      }
      
      throw new Error(data.message || 'Failed to fetch dashboard data');
    } catch (error) {
      console.error('❌ Failed to fetch dashboard data:', error);
      throw error;
    }
  },

  /**
   * Refresh dashboard data (same as getDashboardData but explicitly for refresh action)
   * @returns {Promise} Dashboard data
   */
  refreshDashboard: async () => {
    return dashboardService.getDashboardData();
  }
};

export default dashboardService;