import { useState, useEffect } from 'react';
import Sidebar, { useSidebar } from '../../../components/cashier/Sidebar';
import FilterBar from '../../../components/cashier/FilterBar';
import OrderCard from '../../../components/cashier/OrderCard';
import OrderModal from '../../../components/cashier/OrderModal';
import ConfirmationDialog from '../../../components/cashier/ConfirmationDialog';
import { useCashierData } from '../../../hooks/useCashierData';
import cashierApi from '../../../services/cashierApi';
import { RefreshCw } from 'lucide-react';

const AllOrders = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTable, setSelectedTable] = useState('all');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  // ✅ ONLY ADDITION: Responsive sidebar
  const { isCollapsed } = useSidebar();

  // API Integration - exclude completed orders
  const { orders, loading, error, refetch } = useCashierData({
    exclude_completed: true,
    payment_status: selectedPaymentStatus !== 'all' ? selectedPaymentStatus : undefined,
    category: selectedCategory !== 'all' ? selectedCategory : undefined,
    table_id: selectedTable !== 'all' ? selectedTable : undefined
  });

  // Auto-refresh every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 15000);
    return () => clearInterval(interval);
  }, [refetch]);

  // Handle validate payment with confirmation
  const handleValidatePayment = (orderId) => {
    setConfirmAction({
      type: 'validate',
      orderId,
      title: 'Validasi Pembayaran Cash',
      message: 'Apakah pembayaran cash untuk pesanan ini sudah diterima?'
    });
    setShowConfirmation(true);
  };

  // Execute validate payment
  const executeValidatePayment = async () => {
    try {
      await cashierApi.validatePayment(confirmAction.orderId);
      setShowConfirmation(false);
      setSelectedOrder(null);
      refetch();
      alert('✅ Pembayaran berhasil divalidasi!');
    } catch (error) {
      alert('❌ Gagal validasi: ' + error.message);
      setShowConfirmation(false);
    }
  };

  // Execute confirmation action
  const executeConfirmation = () => {
    if (confirmAction.type === 'validate') {
      executeValidatePayment();
    }
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
              <h1 className="text-3xl font-bold text-[#8b1538]">Semua Pesanan</h1>
              <p className="text-gray-600 mt-1">
                Pesanan aktif yang perlu ditangani
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
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Auto-refresh setiap 15 detik
          </div>
          
          {/* Filter Bar */}
          <FilterBar
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            selectedTable={selectedTable}
            onTableChange={setSelectedTable}
            selectedPaymentStatus={selectedPaymentStatus}
            onPaymentStatusChange={setSelectedPaymentStatus}
            showPaymentFilter={true}
          />

          {/* Orders Count */}
          <div className="mb-4 text-sm text-gray-600">
            Menampilkan <span className="font-semibold text-[#8b1538]">{orders.length}</span> pesanan aktif
          </div>

          {/* Orders Grid */}
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-gray-500 text-lg mb-2">Tidak ada pesanan aktif</p>
              <p className="text-gray-400 text-sm">
                Pesanan baru akan muncul di sini secara otomatis
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

      {/* Order Modal */}
      {selectedOrder && (
        <OrderModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onValidatePayment={handleValidatePayment}
        />
      )}

      {/* Confirmation Dialog */}
      {showConfirmation && confirmAction && (
        <ConfirmationDialog
          onClose={() => setShowConfirmation(false)}
          onConfirm={executeConfirmation}
          title={confirmAction.title}
          message={confirmAction.message}
          type="warning"
          confirmText="Ya, Validasi"
          cancelText="Batal"
        />
      )}
    </div>
  );
};

export default AllOrders;