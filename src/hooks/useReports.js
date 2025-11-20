// src/hooks/useReports.js
import { useQuery } from '@tanstack/react-query';
import { reportService } from '../services/reportService';

/**
 * Hook for overview report
 */
export const useOverviewReport = (startDate, endDate, enabled = true) => {
  return useQuery({
    queryKey: ['report', 'overview', startDate, endDate],
    queryFn: () => reportService.getOverview(startDate, endDate),
    enabled: enabled && !!startDate && !!endDate,
    staleTime: 5 * 60 * 1000,  // 5 minutes
    retry: 1,
    onError: (error) => {
      console.error('Overview report error:', error);
    }
  });
};

/**
 * Hook for revenue report
 */
export const useRevenueReport = (startDate, endDate, categoryId = null, enabled = true) => {
  return useQuery({
    queryKey: ['report', 'revenue', startDate, endDate, categoryId],
    queryFn: () => reportService.getRevenue(startDate, endDate, categoryId),
    enabled: enabled && !!startDate && !!endDate,
    staleTime: 5 * 60 * 1000,
    retry: 1,
    onError: (error) => {
      console.error('Revenue report error:', error);
    }
  });
};

/**
 * Hook for revenue aggregated with comparison (NEW)
 * Untuk bar chart dengan 3m/6m/1y view
 */
export const useRevenueAggregated = (year, viewType, categoryId = null, enabled = true) => {
  return useQuery({
    queryKey: ['report', 'revenue-aggregated', year, viewType, categoryId],
    queryFn: () => reportService.getRevenueAggregated(year, viewType, categoryId),
    enabled: enabled,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    retry: 1,
    onError: (error) => {
      console.error('Revenue aggregated error:', error);
    }
  });
};

/**
 * Hook for menu performance
 */
export const useMenuPerformance = (startDate, endDate, sortBy, limit, enabled = true) => {
  return useQuery({
    queryKey: ['report', 'menu-performance', startDate, endDate, sortBy, limit],
    queryFn: () => reportService.getMenuPerformance(startDate, endDate, sortBy, limit),
    enabled: enabled && !!startDate && !!endDate,
    staleTime: 5 * 60 * 1000,
    retry: 1,
    onError: (error) => {
      console.error('Menu performance error:', error);
    }
  });
};

/**
 * Hook for peak hours
 */
export const usePeakHours = (startDate, endDate, enabled = true) => {
  return useQuery({
    queryKey: ['report', 'peak-hours', startDate, endDate],
    queryFn: () => reportService.getPeakHours(startDate, endDate),
    enabled: enabled && !!startDate && !!endDate,
    staleTime: 5 * 60 * 1000,
    retry: 1,
    onError: (error) => {
      console.error('Peak hours error:', error);
    }
  });
};

export default {
  useOverviewReport,
  useRevenueReport,
  useRevenueAggregated, // ADD THIS
  useMenuPerformance,
  usePeakHours
};