/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import Sidebar, { useSidebar } from '../../../components/cashier/Sidebar';
import OrderCard from '../../../components/cashier/OrderCard';
import OrderModal from '../../../components/cashier/OrderModal';
import { Calendar, RefreshCw, TrendingUp, DollarSign, ShoppingBag, Clock } from 'lucide-react';
import { useCashierData } from '../../../hooks/useCashierData';
import cashierApi from '../../../services/cashierApi';

const CompletedOrders = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [dateFrom, setDateFrom] = useState(new Date().toISOString().split('T')[0]);
  const [dateTo, setDateTo] = useState(new Date().toISOString().split('T')[0]);
  const [statistics, setStatistics] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [todayStats, setTodayStats] = useState(null);

  // ✅ ONLY ADDITION: Responsive sidebar
  const { isCollapsed } = useSidebar();

  // API Integration - filter by completed status and date
  const { orders, loading, error, refetch } = useCashierData({
    status: 'completed',
    date_from: dateFrom,
    date_to: dateTo
  });

  // Fetch statistics for selected date range
  const fetchStatistics = async (from, to) => {
    try {
      setStatsLoading(true);
      console.log('📊 Fetching period statistics:', { from, to });
      const response = await cashierApi.getStatistics({ 
        date_from: from, 
        date_to: to 
      });
      console.log('✅ Period statistics loaded:', response.data);
      setStatistics(response.data);
    } catch (error) {
      console.error('❌ Failed to fetch statistics:', error);
      setStatistics(null);
    } finally {
      setStatsLoading(false);
    }
  };

  // Fetch today's statistics (Quick Stats)
  const fetchTodayStats = async () => {
    const today = new Date().toISOString().split('T')[0];
    try {
      console.log('📊 Fetching today statistics:', today);
      const response = await cashierApi.getStatistics({ 
        date_from: today, 
        date_to: today 
      });
      console.log('✅ Today statistics loaded:', response.data);
      setTodayStats(response.data);
    } catch (error) {
      console.error('❌ Failed to fetch today stats:', error);
    }
  };

  // Initial fetch statistics
  useEffect(() => {
    console.log('📊 Initial statistics fetch');
    fetchStatistics(dateFrom, dateTo);
  }, [dateFrom, dateTo]);

  // Initial fetch today stats
  useEffect(() => {
    console.log('📊 Initial today stats fetch');
    fetchTodayStats();

    // Auto-refresh today stats every 30 seconds
    const interval = setInterval(() => {
      console.log('🔄 Auto-refreshing today stats (30s)');
      fetchTodayStats();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Listen for orderCompleted event from ReadyOrders page
  useEffect(() => {
    const handleOrderCompleted = (event) => {
      console.log('📡 Order completed event received:', event.detail);
      
      if (event.detail.orderNumber) {
        console.log(`✅ Pesanan #${event.detail.orderNumber} completed!`);
      }
      
      console.log('🔄 Refetching completed orders...');
      refetch();
      
      console.log('🔄 Refetching today stats...');
      fetchTodayStats();
      
      const today = new Date().toISOString().split('T')[0];
      if (dateFrom === today || dateTo === today) {
        console.log('🔄 Refetching period stats (relevant to today)...');
        fetchStatistics(dateFrom, dateTo);
      }
    };

    console.log('👂 Registering orderCompleted event listener');
    window.addEventListener('orderCompleted', handleOrderCompleted);
    
    return () => {
      console.log('🔇 Removing orderCompleted event listener');
      window.removeEventListener('orderCompleted', handleOrderCompleted);
    };
  }, [dateFrom, dateTo, refetch]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Calculate preparation time
  const calculateAvgPrepTime = () => {
    if (orders.length === 0) return 0;
    
    const totalMinutes = orders.reduce((sum, order) => {
      const orderTime = new Date(order.order_time);
      const completedTime = new Date(order.completed_at);
      const diffMinutes = (completedTime - orderTime) / (1000 * 60);
      return sum + diffMinutes;
    }, 0);
    
    return Math.round(totalMinutes / orders.length);
  };

  const handleRefreshAll = () => {
    console.log('🔄 Manual refresh all');
    refetch();
    fetchTodayStats();
    fetchStatistics(dateFrom, dateTo);
  };

  // Loading state
  if (loading && orders.length === 0) {
    return (
      <div className="flex min-h-screen bg-[#fefcf9]">
        <Sidebar />
        <div className={`
          flex-1 flex items-center justify-center transition-all duration-300
          ${isCollapsed ? 'lg:ml-0' : 'lg:ml-64'}
        `}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8b1538] mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat data...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex min-h-screen bg-[#fefcf9]">
        <Sidebar />
        <div className={`
          flex-1 flex items-center justify-center transition-all duration-300
          ${isCollapsed ? 'lg:ml-0' : 'lg:ml-64'}
        `}>
          <div className="text-center">
            <p className="text-red-600 mb-4">Error: {error}</p>
            <button 
              onClick={refetch}
              className="px-4 py-2 bg-[#8b1538] text-white rounded-lg hover:bg-[#6d1029]"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#fefcf9]">
      <Sidebar />
      
      {/* ✅ ONLY CHANGE: Added responsive margin */}
      <div className={`
        flex-1 overflow-auto transition-all duration-300
        ${isCollapsed ? 'lg:ml-0' : 'lg:ml-64'}
      `}>
        {/* ✅ ONLY CHANGE: Added mobile margin */}
        <div className="p-8 mt-16 lg:mt-0">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-[#8b1538]">Pesanan Selesai</h1>
              <p className="text-gray-600 mt-1">
                Laporan dan statistik pesanan yang telah selesai
              </p>
            </div>
            <button
              onClick={handleRefreshAll}
              disabled={loading || statsLoading}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <RefreshCw size={18} className={loading || statsLoading ? 'animate-spin' : ''} />
              <span>Refresh</span>
            </button>
          </div>

          {/* Quick Stats - Today's Summary */}
          {todayStats && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <TrendingUp size={20} className="text-[#8b1538]" />
                  Ringkasan Hari Ini
                </h2>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  Update otomatis setiap 30 detik
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-blue-500 p-2 rounded-lg">
                      <ShoppingBag size={20} className="text-white" />
                    </div>
                    <p className="text-sm font-medium text-blue-900">Pesanan Selesai</p>
                  </div>
                  <p className="text-3xl font-bold text-blue-900">{todayStats.total_orders}</p>
                  <p className="text-xs text-blue-700 mt-1">pesanan hari ini</p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-green-500 p-2 rounded-lg">
                      <DollarSign size={20} className="text-white" />
                    </div>
                    <p className="text-sm font-medium text-green-900">Total Pendapatan</p>
                  </div>
                  <p className="text-2xl font-bold text-green-900">
                    {formatCurrency(todayStats.total_revenue)}
                  </p>
                  <p className="text-xs text-green-700 mt-1">revenue hari ini</p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-purple-500 p-2 rounded-lg">
                      <TrendingUp size={20} className="text-white" />
                    </div>
                    <p className="text-sm font-medium text-purple-900">Rata-rata</p>
                  </div>
                  <p className="text-2xl font-bold text-purple-900">
                    {formatCurrency(todayStats.average_order)}
                  </p>
                  <p className="text-xs text-purple-700 mt-1">per pesanan</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Date Filter */}
          <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="text-gray-600" size={20} />
              <h3 className="font-semibold text-gray-900">Filter Periode</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dari Tanggal
                </label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  max={dateTo}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8b1538] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sampai Tanggal
                </label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  min={dateFrom}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8b1538] focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Statistics for Selected Period */}
          {statsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : statistics ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <p className="text-gray-600 text-sm mb-2 font-medium">Total Pesanan</p>
                <p className="text-4xl font-bold text-[#8b1538] mb-1">
                  {statistics.total_orders}
                </p>
                <p className="text-xs text-gray-500">pesanan selesai</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <p className="text-gray-600 text-sm mb-2 font-medium">Total Pendapatan</p>
                <p className="text-3xl font-bold text-green-600 mb-1">
                  {formatCurrency(statistics.total_revenue)}
                </p>
                <p className="text-xs text-gray-500">total revenue</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <p className="text-gray-600 text-sm mb-2 font-medium">Rata-rata per Pesanan</p>
                <p className="text-3xl font-bold text-blue-600 mb-1">
                  {formatCurrency(Math.round(statistics.average_order))}
                </p>
                <p className="text-xs text-gray-500">average order value</p>
              </div>
            </div>
          ) : null}

          {/* Orders List */}
          <div className="mb-4 text-sm text-gray-600">
            Menampilkan <span className="font-semibold text-gray-900">{orders.length}</span> pesanan selesai
            {dateFrom === dateTo ? (
              <span> pada tanggal <span className="font-semibold">{dateFrom}</span></span>
            ) : (
              <span> dari <span className="font-semibold">{dateFrom}</span> sampai <span className="font-semibold">{dateTo}</span></span>
            )}
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl">
              <div className="text-gray-400 mb-4">
                <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <p className="text-gray-500 text-lg mb-2">Tidak ada pesanan selesai</p>
              <p className="text-gray-400 text-sm">
                pada periode {dateFrom === dateTo ? dateFrom : `${dateFrom} - ${dateTo}`}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {orders.map(order => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onClick={() => setSelectedOrder(order)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Order Modal (Read-only for completed orders) */}
      {selectedOrder && (
        <OrderModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
};

export default CompletedOrders;