import { useState, useEffect } from 'react';
import Sidebar, { useSidebar } from '../../../components/cashier/Sidebar';
import FilterBar from '../../../components/cashier/FilterBar';
import OrderCard from '../../../components/cashier/OrderCard';
import OrderModal from '../../../components/cashier/OrderModal';
import { useCashierData } from '../../../hooks/useCashierData';
import { RefreshCw, ChefHat } from 'lucide-react';

const ProcessingOrders = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTable, setSelectedTable] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  // ✅ ONLY ADDITION: Responsive sidebar
  const { isCollapsed } = useSidebar();

  // API Integration - Get PENDING orders (being processed by kitchen)
  const { orders, loading, error, refetch } = useCashierData({
    payment_status: 'Paid',
    exclude_completed: true,
    exclude_ready: true,
    category: selectedCategory !== 'all' ? selectedCategory : undefined,
    table_id: selectedTable !== 'all' ? selectedTable : undefined
  });

  // Filter to show only PENDING orders
  const processingOrders = orders.filter(order => {
    return order.status === 'pending';
  });

  // Auto-refresh every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 10000);
    return () => clearInterval(interval);
  }, [refetch]);

  // Loading state
  if (loading && processingOrders.length === 0) {
    return (
      <div className="flex min-h-screen bg-[#fefcf9]">
        <Sidebar />
        <div className={`
          flex-1 flex items-center justify-center transition-all duration-300
          ${isCollapsed ? 'lg:ml-0' : 'lg:ml-64'}
        `}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8b1538] mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat pesanan...</p>
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
              <h1 className="text-3xl font-bold text-[#8b1538]">Pesanan Diproses</h1>
              <p className="text-gray-600 mt-1">
                Monitoring pesanan yang sedang diproses Kitchen, Bar, dan Pastry
              </p>
            </div>
            <button
              onClick={refetch}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
              <span>Refresh</span>
            </button>
          </div>

          {/* Auto-refresh indicator */}
          <div className="mb-4 text-sm text-gray-500 flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            Auto-refresh setiap 10 detik
          </div>

          {/* Info Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <ChefHat size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">Sedang Diproses Dapur</h4>
                <p className="text-sm text-blue-800">
                  Halaman ini menampilkan pesanan yang <strong>sedang diproses</strong> oleh Kitchen, Bar, dan Pastry. 
                  Pesanan akan otomatis berpindah ke "Pesanan Siap" saat dapur update semua item menjadi "Done".
                </p>
              </div>
            </div>
          </div>
          
          {/* Filter Bar */}
          <FilterBar
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            selectedTable={selectedTable}
            onTableChange={setSelectedTable}
          />

          {/* Orders Count */}
          <div className="mb-4">
            <div className="flex items-center gap-4 text-sm">
              <span className="text-gray-600">
                Total: <span className="font-semibold text-blue-600">{processingOrders.length}</span> pesanan sedang diproses
              </span>
            </div>
          </div>

          {/* Orders Grid */}
          {processingOrders.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <p className="text-gray-500 text-lg mb-2">Tidak ada pesanan yang sedang diproses</p>
              <p className="text-gray-400 text-sm">
                Pesanan akan muncul di sini setelah pembayaran selesai
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {processingOrders.map(order => (
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

      {/* Order Modal (Read-only - no action buttons for kasir) */}
      {selectedOrder && (
        <OrderModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
};

export default ProcessingOrders;
