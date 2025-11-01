import { useState, useEffect } from 'react';
import Sidebar, { useSidebar } from '../../../components/cashier/Sidebar';
import FilterBar from '../../../components/cashier/FilterBar';
import OrderCard from '../../../components/cashier/OrderCard';
import OrderModal from '../../../components/cashier/OrderModal';
import ConfirmationDialog from '../../../components/cashier/ConfirmationDialog';
import { useCashierData } from '../../../hooks/useCashierData';
import cashierApi from '../../../services/cashierApi';
import { RefreshCw, CheckCircle } from 'lucide-react';

const ReadyOrders = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTable, setSelectedTable] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [isCompleting, setIsCompleting] = useState(false);

  // ✅ ONLY ADDITION: Responsive sidebar
  const { isCollapsed } = useSidebar();

  // API Integration - filter by ready status
  const { orders, loading, error, refetch } = useCashierData({
    status: 'ready',
    category: selectedCategory !== 'all' ? selectedCategory : undefined,
    table_id: selectedTable !== 'all' ? selectedTable : undefined
  });

  // Auto-refresh every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 10000);
    return () => clearInterval(interval);
  }, [refetch]);

  // Handle mark as completed with confirmation
  const handleMarkCompleted = (orderId, orderNumber, tableNumber) => {
    console.log('🎯 handleMarkCompleted called!', { orderId, orderNumber, tableNumber });
    
    const action = {
      type: 'complete',
      orderId,
      orderNumber,
      tableNumber,
      title: 'Tandai Pesanan Selesai',
      message: `Apakah pesanan #${orderNumber} (Meja ${tableNumber}) sudah diantar ke customer?`
    };
    
    console.log('📦 Setting confirmAction:', action);
    setConfirmAction(action);
    
    console.log('🔔 Setting showConfirmation to true');
    setShowConfirmation(true);
    
    setTimeout(() => {
      console.log('⏰ State check after 100ms:', {
        showConfirmation: true,
        confirmAction: action
      });
    }, 100);
  };

  // Execute mark as completed
  const executeMarkCompleted = async () => {
    console.log('🚀 executeMarkCompleted called!');
    
    try {
      setIsCompleting(true);
      
      console.log('🔄 Starting completion process for order:', confirmAction.orderId);
      
      const response = await cashierApi.markCompleted(confirmAction.orderId);
      
      console.log('✅ API response:', response);
      
      setShowConfirmation(false);
      setSelectedOrder(null);
      
      console.log(`✅ Pesanan #${confirmAction.orderNumber} telah selesai!`);
      alert(`✅ Pesanan #${confirmAction.orderNumber} berhasil ditandai selesai!`);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log('🔄 Refetching orders...');
      await refetch();
      
      console.log('📊 Orders after refetch:', orders.length);
      
      console.log('📡 Dispatching orderCompleted event...');
      window.dispatchEvent(new CustomEvent('orderCompleted', {
        detail: { 
          orderId: confirmAction.orderId,
          orderNumber: confirmAction.orderNumber 
        }
      }));
      
      console.log('✅ Completion process done!');
      
    } catch (error) {
      console.error('❌ Failed to complete order:', error);
      alert('❌ Gagal menandai selesai: ' + (error.message || 'Unknown error'));
      setShowConfirmation(false);
    } finally {
      setIsCompleting(false);
      setConfirmAction(null);
    }
  };

  // Execute confirmation action
  const executeConfirmation = () => {
    console.log('🔵 executeConfirmation called!');
    console.log('🔵 confirmAction:', confirmAction);
    
    if (confirmAction && confirmAction.type === 'complete') {
      console.log('✅ Condition met, calling executeMarkCompleted');
      executeMarkCompleted();
    } else {
      console.log('❌ Condition NOT met:', {
        hasConfirmAction: !!confirmAction,
        type: confirmAction?.type
      });
    }
  };

  // Handle cancel confirmation
  const handleCancelConfirmation = () => {
    console.log('❌ Confirmation cancelled');
    setShowConfirmation(false);
    setConfirmAction(null);
  };

  // Debug: Log state changes
  useEffect(() => {
    console.log('🔄 State changed:', {
      showConfirmation,
      hasConfirmAction: !!confirmAction,
      confirmActionType: confirmAction?.type
    });
  }, [showConfirmation, confirmAction]);

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

  console.log('🎨 Rendering ReadyOrders, showConfirmation:', showConfirmation);

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
              <h1 className="text-3xl font-bold text-[#8b1538]">Pesanan Siap</h1>
              <p className="text-gray-600 mt-1">
                Pesanan yang sudah selesai diproses dan siap untuk diantar
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
            Auto-refresh setiap 10 detik
          </div>

          {/* Info Banner */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-green-900 mb-1">Siap Diantar</h4>
                <p className="text-sm text-green-800">
                  Pesanan di halaman ini sudah selesai diproses dapur dan siap untuk diantar ke customer. 
                  Klik "Tandai Selesai" setelah pesanan diantar.
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
            <p className="text-sm text-gray-600">
              Total: <span className="font-semibold text-green-600">{orders.length}</span> pesanan siap diantar
            </p>
          </div>

          {/* Orders Grid */}
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-gray-500 text-lg mb-2">Tidak ada pesanan siap</p>
              <p className="text-gray-400 text-sm">
                Pesanan akan muncul di sini setelah dapur selesai memproses
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
          onMarkCompleted={handleMarkCompleted}
          isCompleting={isCompleting}
        />
      )}

      {/* Confirmation Dialog */}
      {showConfirmation && confirmAction ? (
        <>
          {console.log('✅ Rendering ConfirmationDialog with:', { showConfirmation, confirmAction })}
          <ConfirmationDialog
            title={confirmAction.title}
            message={confirmAction.message}
            onConfirm={executeConfirmation}
            onClose={handleCancelConfirmation}
            confirmText="Ya, Tandai Selesai"
            cancelText="Batal"
            isLoading={isCompleting}
          />
        </>
      ) : (
        <>
          {console.log('❌ NOT rendering ConfirmationDialog:', { showConfirmation, hasConfirmAction: !!confirmAction })}
        </>
      )}
    </div>
  );
};

export default ReadyOrders;