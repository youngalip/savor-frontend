// src/services/reportService.js
import apiClient from './api';

export const reportService = {
  /**
   * Get overview report
   */
  getOverview: async (startDate, endDate) => {
    try {
      const { data } = await apiClient.get('/owner/reports/overview', {
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
      
      const { data } = await apiClient.get('/owner/reports/revenue', { params });
      return data;
    } catch (error) {
      console.error('Failed to fetch revenue:', error);
      throw error;
    }
  },

  /**
   * 🔥 UPDATED: Get revenue aggregated with comparison
   * Removed year parameter, backend now uses NOW() as base
   * @param {string} viewType - '3m' | '6m' | '1y' | '5y'
   * @param {number|null} categoryId - Optional category filter
   */
  getRevenueAggregated: async (viewType, categoryId = null) => {
    try {
      const params = {
        view_type: viewType,
      };
      
      if (categoryId && categoryId !== 'all') {
        params.category_id = categoryId;
      }

      const { data } = await apiClient.get('/owner/reports/revenue/aggregated', { params });
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
      const { data } = await apiClient.get('/owner/reports/menu-performance', {
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
      const { data } = await apiClient.get('/owner/reports/peak-hours', {
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
      const response = await apiClient.get('/owner/reports/export', {
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