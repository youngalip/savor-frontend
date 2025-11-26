// src/services/authService.js
import apiClient from './api';
import { authStorage } from '../utils/authStorage';

/**
 * Authentication Service
 * Handles all authentication related API calls
 */
export const authService = {
  /**
   * Login user
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  login: async (email, password) => {
    try {
        console.log('🔐 Login attempt:', { email });
        
        const response = await apiClient.post('/auth/login', {
        email,
        password
        });

        console.log('📥 Login response:', response.data);

        if (response.data.success) {
        const { token, user, redirect_url } = response.data.data;
        
        console.log('✅ Login successful!');
        console.log('🔑 Token received:', token ? token.substring(0, 50) + '...' : 'NO TOKEN');
        console.log('👤 User:', user);
        
        // Save to localStorage
        authStorage.saveToken(token);
        authStorage.saveUser(user);
        
        // 🔥 VERIFY TOKEN SAVED
        const savedToken = authStorage.getToken();
        console.log('✅ Token saved verification:', savedToken ? 'SUCCESS ✅' : 'FAILED ❌');
        console.log('🔍 Saved token matches:', savedToken === token);
        
        // 🔥 CHECK LOCALSTORAGE DIRECTLY
        console.log('🗄️ localStorage check:', {
            auth_token: localStorage.getItem('auth_token'),
            auth_user: localStorage.getItem('auth_user')
        });
        
        return {
            success: true,
            data: {
            user,
            token,
            redirectUrl: redirect_url
            }
        };
        }

        return {
        success: false,
        error: response.data.message || 'Login failed'
        };
    } catch (error) {
        console.error('❌ Login Error:', error);
        return {
        success: false,
        error: error.response?.data?.message || error.message || 'Login failed'
        };
    }
    },

  /**
   * Logout user
   * @returns {Promise<{success: boolean}>}
   */
  logout: async () => {
    try {
      // Call backend logout (optional - token akan expire sendiri)
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('❌ Logout API Error:', error);
      // Continue with local logout even if API fails
    } finally {
      // Always clear local storage
      authStorage.clearAuth();
      return { success: true };
    }
  },

  /**
   * Refresh token
   * @returns {Promise<{success: boolean, token?: string}>}
   */
  refreshToken: async () => {
    try {
      const response = await apiClient.post('/auth/refresh');

      if (response.data.success) {
        const { token, user } = response.data.data;
        
        authStorage.saveToken(token);
        authStorage.saveUser(user);
        
        return {
          success: true,
          token,
          user
        };
      }

      return { success: false };
    } catch (error) {
      console.error('❌ Refresh Token Error:', error);
      return { success: false };
    }
  },

  /**
   * Get current user from backend
   * @returns {Promise<{success: boolean, user?: object}>}
   */
  getCurrentUser: async () => {
    try {
      const response = await apiClient.get('/auth/me');

      if (response.data.success) {
        const user = response.data.data;
        authStorage.saveUser(user);
        
        return {
          success: true,
          user
        };
      }

      return { success: false };
    } catch (error) {
      console.error('❌ Get Current User Error:', error);
      return { success: false };
    }
  },

  /**
   * Check if user is authenticated (has valid token)
   * @returns {boolean}
   */
  isAuthenticated: () => {
    return !!authStorage.getToken();
  },

  /**
   * Get stored user
   * @returns {object|null}
   */
  getStoredUser: () => {
    return authStorage.getUser();
  }
};

export default authService;