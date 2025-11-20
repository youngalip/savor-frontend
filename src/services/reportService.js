// src/services/reportService.js
import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000/api/v1';

const reportClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // 30s timeout for reports
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor - add auth token
reportClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('owner_token'); // Adjust if needed
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`🚀 Report API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
reportClient.interceptors.response.use(
  (response) => {
    console.log(`✅ Report API Response: ${response.status}`, response.data);
    return response;
  },
  (error) => {
    console.error('❌ Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const reportService = {
  /**
   * Get overview report
   */
  getOverview: async (startDate, endDate) => {
    try {
      const { data } = await reportClient.get('/owner/reports/overview', {
        params: { 
          start_date: startDate, 
          end_date: endDate 
        }
      });
      return data;
    } catch (error) {
      console.error('Failed to fetch overview:', error);
      throw error;
    }
  },

  /**
   * Get revenue report
   */
  getRevenue: async (startDate, endDate, categoryId = null) => {
    try {
      const params = { 
        start_date: startDate, 
        end_date: endDate 
      };
      
      if (categoryId && categoryId !== 'all') {
        params.category_id = categoryId;
      }
      
      const { data } = await reportClient.get('/owner/reports/revenue', { params });
      return data;
    } catch (error) {
      console.error('Failed to fetch revenue:', error);
      throw error;
    }
  },

  /**
   * Get revenue aggregated with comparison
   * NEW METHOD - untuk bar chart dengan 3m/6m/1y view
   */
  getRevenueAggregated: async (year, viewType, categoryId = null) => {
    try {
      const params = {
        year,
        view_type: viewType,
      };
      
      if (categoryId && categoryId !== 'all') {
        params.category_id = categoryId;
      }

      // FIX: Ganti apiService menjadi reportClient
      // FIX: Path sesuai dengan pattern yang lain (/owner/reports/...)
      const { data } = await reportClient.get('/owner/reports/revenue/aggregated', { params });
      return data;
    } catch (error) {
      console.error('Failed to fetch aggregated revenue:', error);
      throw error;
    }
  },

  /**
   * Get menu performance report
   */
  getMenuPerformance: async (startDate, endDate, sortBy = 'revenue', limit = 20) => {
    try {
      const { data } = await reportClient.get('/owner/reports/menu-performance', {
        params: { 
          start_date: startDate, 
          end_date: endDate,
          sort_by: sortBy,
          limit: limit
        }
      });
      return data;
    } catch (error) {
      console.error('Failed to fetch menu performance:', error);
      throw error;
    }
  },

  /**
   * Get peak hours report
   */
  getPeakHours: async (startDate, endDate) => {
    try {
      const { data } = await reportClient.get('/owner/reports/peak-hours', {
        params: { 
          start_date: startDate, 
          end_date: endDate 
        }
      });
      return data;
    } catch (error) {
      console.error('Failed to fetch peak hours:', error);
      throw error;
    }
  },

  /**
   * Export report to CSV/XLSX
   */
  exportReport: async (type, format, startDate, endDate) => {
    try {
      const response = await reportClient.get('/owner/reports/export', {
        params: {
          type: type,           // overview | revenue | menu-performance | peak-hours
          format: format,       // csv | xlsx
          start_date: startDate,
          end_date: endDate
        },
        responseType: 'blob'    // Important for file download
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${type}_report_${startDate}_to_${endDate}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      return { success: true };
    } catch (error) {
      console.error('Failed to export report:', error);
      throw error;
    }
  }
};

export default reportService;