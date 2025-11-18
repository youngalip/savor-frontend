// src/services/ownerApi.js
const API_BASE = 'http://127.0.0.1:8000/api/v1';

export const ownerApi = {
  /**
   * Get all users with optional filters
   * @param {Object} filters - { role?, status?, search? }
   */
  getUsers: async (filters = {}) => {
    const params = new URLSearchParams();
    
    // Role filter: all, Kasir, Kitchen, Bar, Pastry, Owner
    if (filters.role && filters.role !== 'all') {
      params.append('role', filters.role);
    }
    
    // Status filter: all, active, inactive
    if (filters.status && filters.status !== 'all') {
      params.append('status', filters.status);
    }
    
    // Search by name or email
    if (filters.search) {
      params.append('search', filters.search);
    }
    
    const url = `${API_BASE}/owner/users${params.toString() ? '?' + params.toString() : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Failed to fetch users: ${response.status}`);
    }
    
    return response.json();
  },

  /**
   * Create new user
   * @param {Object} userData - { name, email, password, role, is_active? }
   */
  createUser: async (userData) => {
    const response = await fetch(`${API_BASE}/owner/users`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create user');
    }
    
    return response.json();
  },

  /**
   * Update existing user
   * @param {number} id - User ID
   * @param {Object} userData - { name?, email?, password?, role?, is_active? }
   */
  updateUser: async (id, userData) => {
    const response = await fetch(`${API_BASE}/owner/users/${id}`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update user');
    }
    
    return response.json();
  },

  /**
   * Delete user
   * @param {number} id - User ID
   */
  deleteUser: async (id) => {
    const response = await fetch(`${API_BASE}/owner/users/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete user');
    }
    
    return response.json();
  },

  /**
   * Reset user password (separate endpoint)
   * @param {number} id - User ID
   * @param {string} newPassword - New password
   */
  resetPassword: async (id, newPassword) => {
    const response = await fetch(`${API_BASE}/owner/users/${id}/reset-password`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ new_password: newPassword }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to reset password');
    }
    
    return response.json();
  },
};

export default ownerApi;