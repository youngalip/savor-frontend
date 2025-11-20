// src/hooks/useRevenueAggregated.js
import { useQuery } from '@tanstack/react-query';
import { reportService } from '../services/reportService';

/**
 * Hook untuk fetch revenue aggregated data dengan comparison
 */
export const useRevenueAggregated = (year, viewType, categoryId = null, enabled = true) => {
  return useQuery({
    queryKey: ['revenue-aggregated', year, viewType, categoryId],
    queryFn: () => reportService.getRevenueAggregated(year, viewType, categoryId),
    enabled: enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};