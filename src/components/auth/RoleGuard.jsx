// src/components/auth/RoleGuard.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

/**
 * RoleGuard Component
 * Protects routes based on user role
 * Owner has access to all routes (handled in backend, but good to have fallback)
 */
const RoleGuard = ({ allowedRoles, children }) => {
  const { user, role } = useAuth();

  // If no user, this shouldn't happen (ProtectedRoute should catch it)
  if (!user || !role) {
    return <Navigate to="/login" replace />;
  }

  // Normalize role to lowercase for comparison
  const userRole = role.toLowerCase();
  const normalizedAllowedRoles = allowedRoles.map(r => r.toLowerCase());

  // Owner has all access
  if (userRole === 'owner') {
    return children;
  }

  // Check if user's role is in allowed roles
  if (!normalizedAllowedRoles.includes(userRole)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-50 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Akses Ditolak
          </h2>
          <p className="text-gray-600 mb-6">
            Anda tidak memiliki izin untuk mengakses halaman ini.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Role Anda:</span> {role}
            </p>
            <p className="text-sm text-gray-700 mt-1">
              <span className="font-semibold">Role yang diizinkan:</span>{' '}
              {allowedRoles.join(', ')}
            </p>
          </div>
          <button
            onClick={() => window.history.back()}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  // User has correct role, render children
  return children;
};

export default RoleGuard;