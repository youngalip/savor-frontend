// src/main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; // ✅ IMPORT TOASTER
import { router } from './router';
import './index.css';

// Setup Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Tidak auto-refetch saat window focus
      retry: 1, // Retry 1x jika gagal
      staleTime: 30000, // Data dianggap fresh selama 30 detik
      gcTime: 5 * 60 * 1000, // Cache disimpan 5 menit (dulu cacheTime)
    },
    mutations: {
      retry: 0, // Tidak retry untuk mutations
    },
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      {/* ✅ TAMBAHKAN TOASTER - Global notification component */}
      <Toaster 
        position="top-right"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          // Default options
          duration: 3000,
          style: {
            background: '#fff',
            color: '#363636',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            borderRadius: '0.5rem',
            padding: '16px',
          },
          // Success toast style
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981', // green-500
              secondary: '#fff',
            },
          },
          // Error toast style
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444', // red-500
              secondary: '#fff',
            },
          },
          // Loading toast style
          loading: {
            iconTheme: {
              primary: '#8b1538', // primary-500
              secondary: '#fff',
            },
          },
        }}
      />

      <RouterProvider router={router} />
      
      {/* React Query Devtools - hanya muncul di development */}
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  </StrictMode>
);