// src/services/ownerApi.js
import apiClient from './api';

export const ownerApi = {
  /**
   * Get all users with optional filters
   * @param {Object} filters - { role?, status?, search? }
   */
  getUsers: async (filters = {}) => {
    try {
      const params = {};
      
      // Role filter: all, Kasir, Kitchen, Bar, Pastry, Owner
      if (filters.role && filters.role !== 'all') {
        params.role = filters.role;
      }
      
      // Status filter: all, active, inactive
      if (filters.status && filters.status !== 'all') {
        params.status = filters.status;
      }
      
      // Search by name or email
      if (filters.search) {
        params.search = filters.search;
      }
      
      const { data } = await apiClient.get('/owner/users', { params });
      return data;
    } catch (error) {
      console.error('Failed to fetch users:', error);
      throw error;
    }
  },

  /**
   * Create new user
   * @param {Object} userData - { name, email, password, role, is_active? }
   */
  createUser: async (userData) => {
    try {
      const { data } = await apiClient.post('/owner/users', userData);
      return data;
    } catch (error) {
      console.error('Failed to create user:', error);
      throw error;
    }
  },

  /**
   * Update existing user
   * @param {number} id - User ID
   * @param {Object} userData - { name?, email?, password?, role?, is_active? }
   */
  updateUser: async (id, userData) => {
    try {
      const { data } = await apiClient.put(`/owner/users/${id}`, userData);
      return data;
    } catch (error) {
      console.error('Failed to update user:', error);
      throw error;
    }
  },

  /**
   * Delete user
   * @param {number} id - User ID
   */
  deleteUser: async (id) => {
    try {
      const { data } = await apiClient.delete(`/owner/users/${id}`);
      return data;
    } catch (error) {
      console.error('Failed to delete user:', error);
      throw error;
    }
  },

  /**
   * Reset user password (separate endpoint)
   * @param {number} id - User ID
   * @param {string} newPassword - New password
   */
  resetPassword: async (id, newPassword) => {
    try {
      const { data } = await apiClient.post(`/owner/users/${id}/reset-password`, {
        new_password: newPassword
      });
      return data;
    } catch (error) {
      console.error('Failed to reset password:', error);
      throw error;
    }
  },
};

export default ownerApi;