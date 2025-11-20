// src/utils/authStorage.js

/**
 * Authentication Storage Helper
 * Manages JWT token and user data in localStorage
 */

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export const authStorage = {
  /**
   * Save JWT token to localStorage
   */
  saveToken: (token) => {
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch (error) {
      console.error('Error saving token:', error);
    }
  },

  /**
   * Get JWT token from localStorage
   */
  getToken: () => {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  },

  /**
   * Remove JWT token from localStorage
   */
  removeToken: () => {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch (error) {
      console.error('Error removing token:', error);
    }
  },

  /**
   * Save user data to localStorage
   */
  saveUser: (user) => {
    try {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user:', error);
    }
  },

  /**
   * Get user data from localStorage
   */
  getUser: () => {
    try {
      const userStr = localStorage.getItem(USER_KEY);
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  },

  /**
   * Remove user data from localStorage
   */
  removeUser: () => {
    try {
      localStorage.removeItem(USER_KEY);
    } catch (error) {
      console.error('Error removing user:', error);
    }
  },

  /**
   * Clear all auth data
   */
  clearAuth: () => {
    authStorage.removeToken();
    authStorage.removeUser();
  }
};

export default authStorage;