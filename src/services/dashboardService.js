// src/services/dashboardService.js
import apiClient from './api';

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
      const { data } = await apiClient.get('/owner/dashboard');
      
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