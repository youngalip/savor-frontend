// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { authStorage } from '../utils/authStorage';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [role, setRole] = useState(null);

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    setIsLoading(true);
    
    try {
      const token = authStorage.getToken();
      const storedUser = authStorage.getUser();

      if (!token || !storedUser) {
        setIsAuthenticated(false);
        setUser(null);
        setRole(null);
        return;
      }

      // Verify token with backend
      const result = await authService.getCurrentUser();

      if (result.success) {
        setUser(result.user);
        setRole(result.user.role);
        setIsAuthenticated(true);
      } else {
        // Token invalid, clear storage
        authStorage.clearAuth();
        setIsAuthenticated(false);
        setUser(null);
        setRole(null);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      authStorage.clearAuth();
      setIsAuthenticated(false);
      setUser(null);
      setRole(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const result = await authService.login(email, password);

      if (result.success) {
        setUser(result.data.user);
        setRole(result.data.user.role);
        setIsAuthenticated(true);
        
        return {
          success: true,
          redirectUrl: result.data.redirectUrl
        };
      }

      return {
        success: false,
        error: result.error
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'Login failed. Please try again.'
      };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
      setRole(null);
      setIsAuthenticated(false);
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    role,
    login,
    logout,
    checkAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;