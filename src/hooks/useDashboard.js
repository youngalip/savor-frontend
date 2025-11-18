// src/hooks/useDashboard.js
import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboardService';

/**
 * Custom hook for dashboard data with React Query
 * Features:
 * - Auto caching
 * - Auto refetch every 60 seconds
 * - Loading & error states
 * - Manual refetch function
 */
export const useDashboard = () => {
  const query = useQuery({
    queryKey: ['ownerDashboard'], // Unique key for this query
    queryFn: dashboardService.getDashboardData, // Function to fetch data
    refetchInterval: 60000, // Auto refetch every 60 seconds (1 minute)
    refetchIntervalInBackground: false, // Pause when tab is not active (save resources)
    staleTime: 30000, // Consider data fresh for 30 seconds
    retry: 2, // Retry 2 times on failure
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000), // Exponential backoff
    onError: (error) => {
      console.error('❌ Dashboard query error:', error);
    }
  });

  return {
    // Data
    data: query.data?.data || null,
    
    // States
    isLoading: query.isLoading,
    isError: query.isError,
    isFetching: query.isFetching, // True when refetching in background
    isRefetching: query.isRefetching,
    
    // Error
    error: query.error,
    
    // Actions
    refetch: query.refetch, // Manual refetch function
    
    // Metadata
    dataUpdatedAt: query.dataUpdatedAt, // Timestamp of last successful fetch
    
    // Raw query object (for advanced use)
    query
  };
};

export default useDashboard;