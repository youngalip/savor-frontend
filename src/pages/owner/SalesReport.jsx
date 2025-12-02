// src/pages/owner/SalesReport.jsx
import { useState } from "react";
import { toast } from 'react-hot-toast';
import OwnerSidebar, { useOwnerSidebar } from "../../components/owner/OwnerSidebar";

// Hooks
import { 
  useOverviewReport, 
  useRevenueReport, 
  useMenuPerformance, 
  usePeakHours,
  useRevenueAggregated  
} from '../../hooks/useReports';
import { reportService } from '../../services/reportService';

// Components
import StatCard from '../../components/owner/dashboard/StatCard';
import RevenueTable from '../../components/owner/reports/RevenueTable';
import MenuPerformanceTable from '../../components/owner/reports/MenuPerformanceTable';
import PeakHoursChart from '../../components/owner/reports/PeakHoursChart';
import CategoryBreakdownCard from '../../components/owner/reports/CategoryBreakdownCard';
import PaymentMethodsCard from '../../components/owner/reports/PaymentMethodsCard';
import RevenueChart from '../../components/owner/reports/RevenueChart';

// Icons
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Users,
  Calendar,
  Download,
  RefreshCw,
  AlertCircle,
  BarChart3,
  Clock,
  PieChart as PieChartIcon,
} from "lucide-react";

const SalesReport = () => {
  const { isCollapsed } = useOwnerSidebar();
  
  // State
  const [dateRange, setDateRange] = useState({
    start_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    end_date: new Date().toISOString().split("T")[0],
  });
  const [activeTab, setActiveTab] = useState("overview");
  const [sortBy, setSortBy] = useState("revenue");
  const [categoryFilter, setCategoryFilter] = useState("all");
  
  // 🔥 UPDATED: Remove chartYear, only keep chartViewType
  const [chartViewType, setChartViewType] = useState('1y');

  // React Query Hooks
  const { 
    data: overviewData, 
    isLoading: overviewLoading, 
    error: overviewError,
    refetch: refetchOverview 
  } = useOverviewReport(
    dateRange.start_date,
    dateRange.end_date,
    activeTab === 'overview'
  );

  const { 
    data: revenueData, 
    isLoading: revenueLoading,
    error: revenueError,
    refetch: refetchRevenue 
  } = useRevenueReport(
    dateRange.start_date,
    dateRange.end_date,
    categoryFilter !== 'all' ? categoryFilter : null,
    activeTab === 'revenue'
  );

  // 🔥 UPDATED: Remove year parameter, only pass viewType
  const { 
    data: chartData, 
    isLoading: chartLoading,
    error: chartError,
    refetch: refetchChart 
  } = useRevenueAggregated(
    chartViewType,
    categoryFilter !== 'all' ? categoryFilter : null,
    activeTab === 'revenue'
  );

  const { 
    data: menuData, 
    isLoading: menuLoading,
    error: menuError,
    refetch: refetchMenu 
  } = useMenuPerformance(
    dateRange.start_date,
    dateRange.end_date,
    sortBy,
    20,
    activeTab === 'menu-performance'
  );

  const { 
    data: peakData, 
    isLoading: peakLoading,
    error: peakError,
    refetch: refetchPeak 
  } = usePeakHours(
    dateRange.start_date,
    dateRange.end_date,
    activeTab === 'peak-hours'
  );

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Handle refresh
  const handleRefresh = async () => {
    try {
      const loadingToast = toast.loading('Refreshing data...');
      
      switch(activeTab) {
        case 'overview':
          await refetchOverview();
          break;
        case 'revenue':
          await Promise.all([refetchRevenue(), refetchChart()]);
          break;
        case 'menu-performance':
          await refetchMenu();
          break;
        case 'peak-hours':
          await refetchPeak();
          break;
      }
      
      toast.dismiss(loadingToast);
      toast.success('Data refreshed successfully');
    } catch (error) {
      toast.dismiss();
      toast.error('Failed to refresh data');
    }
  };

  // Handle export
  const handleExport = async (reportType, format) => {
    try {
      const loadingToast = toast.loading(`Generating ${format.toUpperCase()}...`);
      
      await reportService.exportReport(
        reportType,
        format,
        dateRange.start_date,
        dateRange.end_date
      );
      
      toast.dismiss(loadingToast);
      toast.success(`${format.toUpperCase()} exported successfully`);
    } catch (error) {
      toast.dismiss();
      toast.error('Failed to export report');
      console.error('Export error:', error);
    }
  };

  // Error state for overview
  if (overviewError && activeTab === 'overview') {
    return (
      <div className="flex min-h-screen bg-cream-50">
        <OwnerSidebar />
        <div className={`flex-1 transition-all duration-300 ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
          <div className="p-8 mt-16 lg:mt-0">
            <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
              <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
              <h2 className="text-2xl font-bold text-red-900 mb-2">Failed to Load Report</h2>
              <p className="text-red-700 mb-4">
                {overviewError?.response?.data?.message || overviewError?.message || 'An error occurred'}
              </p>
              <button
                onClick={refetchOverview}
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
      
      <div
        className={`flex-1 transition-all duration-300 ${
          isCollapsed ? "lg:ml-20" : "lg:ml-64"
        }`}
      >
        <div className="p-8 mt-16 lg:mt-0 max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Laporan Penjualan
              </h1>
              <p className="text-gray-600 mt-1">
                Analisis performa dan statistik penjualan
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleRefresh}
                disabled={overviewLoading || revenueLoading || menuLoading || peakLoading || chartLoading}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw size={18} className={(overviewLoading || chartLoading) ? 'animate-spin' : ''} />
                <span>Refresh</span>
              </button>
              <button
                onClick={() => handleExport(activeTab, "csv")}
                className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                <Download size={18} />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* Date Range Filter */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tanggal Mulai
                </label>
                <input
                  type="date"
                  value={dateRange.start_date}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, start_date: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tanggal Akhir
                </label>
                <input
                  type="date"
                  value={dateRange.end_date}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, end_date: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-2 mb-6 bg-white p-2 rounded-xl shadow-sm border border-gray-200">
            <button
              onClick={() => setActiveTab("overview")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap focus:outline-none ${
                activeTab === "overview"
                  ? "bg-primary-500 text-white relative z-10 shadow-sm"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              <PieChartIcon size={18} />
              Overview
            </button>
            <button
              onClick={() => setActiveTab("revenue")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap focus:outline-none ${
                activeTab === "revenue"
                  ? "bg-primary-500 text-white relative z-10 shadow-sm"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              <DollarSign size={18} />
              Revenue
            </button>
            <button
              onClick={() => setActiveTab("menu-performance")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap focus:outline-none ${
                activeTab === "menu-performance"
                  ? "bg-primary-500 text-white relative z-10 shadow-sm"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              <BarChart3 size={18} />
              Menu Performance
            </button>
            <button
              onClick={() => setActiveTab("peak-hours")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap focus:outline-none ${
                activeTab === "peak-hours"
                  ? "bg-primary-500 text-white relative z-10 shadow-sm"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              <Clock size={18} />
              Peak Hours
            </button>
          </div>

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-fr">
                <StatCard
                  title="Total Pendapatan"
                  value={formatCurrency(overviewData?.data?.summary?.total_revenue || 0)}
                  icon={DollarSign}
                  trend={overviewData?.data?.summary?.growth_rate > 0 ? "up" : overviewData?.data?.summary?.growth_rate < 0 ? "down" : null}
                  trendValue={overviewData?.data?.summary?.growth_rate || 0}
                  loading={overviewLoading}
                />
                <StatCard
                  title="Total Pesanan Selesai"
                  value={overviewData?.data?.summary?.total_orders || 0}
                  icon={ShoppingBag}
                  loading={overviewLoading}
                />
                <StatCard
                  title="Total Pelanggan"
                  value={overviewData?.data?.summary?.total_customers || 0}
                  icon={Users}
                  loading={overviewLoading}
                />
                <StatCard
                  title="Rata-rata Pesanan"
                  value={formatCurrency(overviewData?.data?.summary?.avg_order_value || 0)}
                  icon={Calendar}
                  loading={overviewLoading}
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RevenueTable 
                  data={overviewData?.data?.daily_breakdown}
                  loading={overviewLoading}
                />
                <MenuPerformanceTable
                  data={overviewData?.data?.top_menus}
                  loading={overviewLoading}
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <CategoryBreakdownCard
                  data={overviewData?.data?.category_breakdown}
                  loading={overviewLoading}
                />
                <PaymentMethodsCard
                  data={overviewData?.data?.payment_methods}
                  loading={overviewLoading}
                />
              </div>
            </div>
          )}

          {/* Revenue Tab */}
          {activeTab === "revenue" && (
            <div className="space-y-6">
              {/* Category Filter */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter Kategori
                </label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="all">Semua Kategori</option>
                  <option value="1">Kitchen</option>
                  <option value="2">Bar</option>
                  <option value="3">Pastry</option>
                </select>
              </div>

              {/* 🔥 UPDATED: Remove year prop, only viewType */}
              <RevenueChart
                data={chartData?.data}
                loading={chartLoading}
                viewType={chartViewType}
                onViewTypeChange={setChartViewType}
              />

              {/* Revenue Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                  title="Total Revenue"
                  value={formatCurrency(revenueData?.data?.total_revenue || 0)}
                  icon={DollarSign}
                  trend={revenueData?.data?.growth_rate > 0 ? "up" : revenueData?.data?.growth_rate < 0 ? "down" : null}
                  trendValue={revenueData?.data?.growth_rate || 0}
                  loading={revenueLoading}
                />
                <StatCard
                  title="Daily Average"
                  value={formatCurrency((revenueData?.data?.total_revenue || 0) / (revenueData?.data?.daily_data?.length || 1))}
                  subtitle="Rata-rata per hari"
                  icon={Calendar}
                  loading={revenueLoading}
                />
                <StatCard
                  title="Growth Rate"
                  value={`${revenueData?.data?.growth_rate > 0 ? '+' : ''}${revenueData?.data?.growth_rate?.toFixed(1) || 0}%`}
                  subtitle="vs periode sebelumnya"
                  icon={TrendingUp}
                  color={revenueData?.data?.growth_rate >= 0 ? 'bg-green-500' : 'bg-red-500'}
                  loading={revenueLoading}
                />
              </div>

              <RevenueTable
                data={revenueData?.data?.daily_data}
                loading={revenueLoading}
              />
            </div>
          )}

          {/* Menu Performance Tab */}
          {activeTab === "menu-performance" && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Urutkan Berdasarkan
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="revenue">Revenue Tertinggi</option>
                  <option value="quantity">Terjual Terbanyak</option>
                </select>
              </div>

              <MenuPerformanceTable
                data={menuData?.data?.menus}
                loading={menuLoading}
              />
            </div>
          )}

          {/* Peak Hours Tab */}
          {activeTab === "peak-hours" && (
            <div className="space-y-6">
              <PeakHoursChart
                data={peakData?.data?.hourly_data}
                loading={peakLoading}
              />

              {peakData?.data?.hourly_data && peakData.data.hourly_data.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <div className="flex gap-4">
                    <AlertCircle
                      className="text-blue-600 flex-shrink-0 mt-1"
                      size={24}
                    />
                    <div>
                      <h3 className="font-semibold text-blue-900 mb-2">
                        Rekomendasi Operasional
                      </h3>
                      <ul className="space-y-2 text-sm text-blue-800">
                        <li>• Perhatikan jam-jam dengan volume pesanan tinggi untuk optimasi staff</li>
                        <li>• Pastikan stok bahan baku mencukupi sebelum jam sibuk</li>
                        <li>• Pertimbangkan promo khusus pada jam-jam sepi untuk meningkatkan traffic</li>
                        <li>• Monitor efisiensi dapur pada jam puncak</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalesReport;