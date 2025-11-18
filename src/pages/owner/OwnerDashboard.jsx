// src/pages/owner/OwnerDashboard.jsx
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import OwnerSidebar, { useOwnerSidebar } from '../../components/owner/OwnerSidebar';
import { useDashboard } from '../../hooks/useDashboard';

// Import dashboard components
import StatCard from '../../components/owner/dashboard/StatCard';
import CategoryChart from '../../components/owner/dashboard/CategoryChart';
import RevenueChart from '../../components/owner/dashboard/RevenueChart';
import TopMenusTable from '../../components/owner/dashboard/TopMenusTable';
import HourlyChart from '../../components/owner/dashboard/HourlyChart';

// Icons
import { 
  DollarSign, 
  Receipt, 
  Users, 
  TrendingUp,
  RefreshCw,
  Clock
} from 'lucide-react';

/**
 * Owner Dashboard Page
 * Displays comprehensive business analytics and metrics
 */
const OwnerDashboard = () => {
  const { isCollapsed } = useOwnerSidebar();
  const { data, isLoading, isError, error, refetch, isFetching, dataUpdatedAt } = useDashboard();

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Format number with K/M suffix
  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  // Handle manual refresh
  const handleRefresh = async () => {
    try {
      await refetch();
      toast.success('Dashboard refreshed successfully');
    } catch (err) {
      toast.error('Failed to refresh dashboard');
    }
  };

  // Format last updated time
  const getLastUpdatedText = () => {
    if (!dataUpdatedAt) return '';
    const minutes = Math.floor((Date.now() - dataUpdatedAt) / 60000);
    if (minutes === 0) return 'Just now';
    if (minutes === 1) return '1 minute ago';
    if (minutes < 60) return `${minutes} minutes ago`;
    const hours = Math.floor(minutes / 60);
    return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
  };

  // Show error state
  if (isError) {
    return (
      <div className="flex min-h-screen bg-cream-50">
        <OwnerSidebar />
        <div className={`
          flex-1 transition-all duration-300
          ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'}
        `}>
          <div className="p-8 mt-16 lg:mt-0">
            <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
              <div className="text-red-600 text-6xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-red-900 mb-2">Failed to Load Dashboard</h2>
              <p className="text-red-700 mb-4">
                {error?.response?.data?.message || error?.message || 'An error occurred'}
              </p>
              <button
                onClick={handleRefresh}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-cream-50">
      <OwnerSidebar />
      
      <div className={`
        flex-1 transition-all duration-300
        ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'}
      `}>
        <div className="p-4 md:p-8 mt-16 lg:mt-0">
          {/* Header */}
          <div className="mb-6 md:mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  Dashboard Owner
                </h1>
                <p className="text-gray-600">Overview bisnis dan operasional restaurant Anda</p>
              </div>
              
              {/* Refresh Button & Last Updated */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock size={16} />
                  <span>{getLastUpdatedText()}</span>
                </div>
                <button
                  onClick={handleRefresh}
                  disabled={isFetching}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RefreshCw size={18} className={isFetching ? 'animate-spin' : ''} />
                  <span className="hidden md:inline">Refresh</span>
                </button>
              </div>
            </div>
          </div>

          {/* Today's Stats */}
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Today's Performance</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <StatCard
                title="Revenue"
                value={isLoading ? '...' : formatCurrency(data?.today?.revenue || 0)}
                subtitle={`${data?.today?.orders_count || 0} orders`}
                icon={DollarSign}
                color="bg-primary-500"
                loading={isLoading}
              />
              <StatCard
                title="Orders"
                value={isLoading ? '...' : (data?.today?.orders_count || 0).toString()}
                subtitle="Total orders today"
                icon={Receipt}
                color="bg-blue-500"
                loading={isLoading}
              />
              <StatCard
                title="Customers"
                value={isLoading ? '...' : (data?.today?.customers_count || 0).toString()}
                subtitle="Unique customers"
                icon={Users}
                color="bg-orange-500"
                loading={isLoading}
              />
              <StatCard
                title="Avg Order"
                value={isLoading ? '...' : formatCurrency(data?.today?.avg_order_value || 0)}
                subtitle="Average per order"
                icon={TrendingUp}
                color="bg-green-500"
                loading={isLoading}
              />
            </div>
          </div>

          {/* This Month Stats */}
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">This Month</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              <StatCard
                title="Monthly Revenue"
                value={isLoading ? '...' : formatCurrency(data?.this_month?.revenue || 0)}
                icon={DollarSign}
                color="bg-purple-500"
                loading={isLoading}
                trend={data?.this_month?.growth_rate > 0 ? 'up' : data?.this_month?.growth_rate < 0 ? 'down' : null}
                trendValue={data?.this_month?.growth_rate || 0}
              />
              <StatCard
                title="Monthly Orders"
                value={isLoading ? '...' : (data?.this_month?.orders_count || 0).toString()}
                subtitle="Total orders this month"
                icon={Receipt}
                color="bg-indigo-500"
                loading={isLoading}
              />
              <StatCard
                title="Growth Rate"
                value={isLoading ? '...' : `${data?.this_month?.growth_rate > 0 ? '+' : ''}${data?.this_month?.growth_rate?.toFixed(1) || 0}%`}
                subtitle="vs last month"
                icon={data?.this_month?.growth_rate >= 0 ? TrendingUp : TrendingUp}
                color={data?.this_month?.growth_rate >= 0 ? 'bg-green-500' : 'bg-red-500'}
                loading={isLoading}
              />
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Category Breakdown */}
            <CategoryChart 
              data={data?.category_breakdown} 
              loading={isLoading} 
            />

            {/* Revenue Trend */}
            <RevenueChart 
              data={data?.revenue_chart} 
              loading={isLoading}
              showDays={7} 
            />
          </div>

          {/* Top Menus Table */}
          <div className="mb-6">
            <TopMenusTable 
              data={data?.top_menus} 
              loading={isLoading} 
            />
          </div>

          {/* Orders by Hour */}
          <div className="mb-6">
            <HourlyChart 
              data={data?.orders_by_hour} 
              loading={isLoading} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;