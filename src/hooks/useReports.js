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
 * 🔥 UPDATED: Hook for revenue aggregated with comparison
 * Removed year parameter - backend now calculates from NOW()
 * 
 * @param {string} viewType - '3m' | '6m' | '1y' | '5y'
 * @param {number|null} categoryId - Optional category filter
 * @param {boolean} enabled - Enable/disable query
 * 
 * Response structure:
 * {
 *   view_type: '3m',
 *   current_period: { start, end, label },
 *   previous_period: { start, end, label },
 *   current_data: [{ period, revenue, orders_count, ... }],
 *   previous_data: [{ period, revenue, orders_count, ... }],
 *   comparison: { current_total, previous_total, growth_rate, difference }
 * }
 */
export const useRevenueAggregated = (viewType, categoryId = null, enabled = true) => {
  return useQuery({
    queryKey: ['report', 'revenue-aggregated', viewType, categoryId],
    queryFn: () => reportService.getRevenueAggregated(viewType, categoryId),
    enabled: enabled && !!viewType,
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
  useRevenueAggregated,
  useMenuPerformance,
  usePeakHours
};