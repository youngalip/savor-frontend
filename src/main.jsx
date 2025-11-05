import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import './index.css'

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
      <RouterProvider router={router} />
      
      {/* React Query Devtools - hanya muncul di development */}
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  </StrictMode>
);