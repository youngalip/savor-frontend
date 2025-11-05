import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { X, Clock, CheckCircle, AlertCircle, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import Sidebar, { useSidebar, SidebarProvider } from '../../../components/kitchen/Sidebar';
import { kitchenApi } from '../../../services/kitchenApi';
import { transformBackendOrders, mapStatusToBackend, getTimeElapsed } from '../../../utils/kitchenTransformer';

// --- Helper Functions ---
const formatTime = (date) => new Date(date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

const formatDate = (date) =>
  new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

// --- Order Card ---
const OrderCard = ({ order, onViewDetails }) => {
  const pendingItems = order.items.filter((item) => item.status === 'pending');
  const doneItems = order.items.filter((item) => item.status === 'done');
  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div
      className="card p-5 hover:shadow-md transition-shadow cursor-pointer bg-white border border-cream-200 rounded-xl"
      onClick={() => onViewDetails(order)}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Meja {order.tableNumber}</h3>
          <p className="text-sm text-gray-500">#{order.id}</p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-semibold border bg-orange-50 text-orange-700 border-orange-200">
          Kitchen
        </span>
      </div>

      <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <Clock size={16} />
          <span>{formatTime(order.orderTime)}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-lg">📦</span>
          <span>{totalItems} Item</span>
        </div>
      </div>

      <div className="text-sm text-gray-500 mb-3">
        {getTimeElapsed(order.orderTime)}
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <span className="px-3 py-1 rounded-full text-xs font-medium border bg-blue-50 text-blue-700 border-blue-200">
          Pending: {pendingItems.length}
        </span>
        <span className="px-3 py-1 rounded-full text-xs font-medium border bg-green-50 text-green-700 border-green-200">
          Siap: {doneItems.length}
        </span>
      </div>

      <button
        className="w-full mt-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition-colors"
        onClick={(e) => {
          e.stopPropagation();
          onViewDetails(order);
        }}
      >
        Kelola Pesanan
      </button>
    </div>
  );
};

// --- Order Modal ---
const OrderModal = ({ order, isOpen, onClose, onItemStatusUpdate, isUpdating }) => {
  if (!isOpen || !order) return null;

  const pendingItems = order.items.filter((item) => item.status === 'pending');
  const allItemsDone = order.items.every((item) => item.status === 'done');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-cream-200 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Kelola Pesanan Kitchen</h2>
            <p className="text-sm text-gray-500 mt-1">Meja {order.tableNumber} • #{order.id}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-cream-50 rounded-lg transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Konten */}
        <div className="p-6">
          <div className="card p-4 mb-6 border border-cream-200 bg-cream-50 rounded-lg">
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <Clock size={18} />
              <span className="text-sm font-medium">Waktu Pemesanan</span>
            </div>
            <p className="text-lg font-semibold text-gray-900">{formatTime(order.orderTime)}</p>
            <p className="text-sm text-gray-500">{formatDate(order.orderTime)}</p>
            <p className="text-sm text-orange-600 font-medium mt-1">{getTimeElapsed(order.orderTime)}</p>
          </div>

          {allItemsDone && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex gap-3 items-start">
              <CheckCircle size={20} className="text-green-600 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-green-900 mb-1">Semua Item Siap!</h4>
                <p className="text-sm text-green-800">Semua makanan telah selesai dibuat.</p>
              </div>
            </div>
          )}

          {pendingItems.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex gap-3 items-start">
              <AlertCircle size={20} className="text-blue-600 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">Dalam Proses</h4>
                <p className="text-sm text-blue-800">Masih ada {pendingItems.length} item yang perlu diproses.</p>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="card p-4 border border-cream-200 rounded-lg">
                <div className="flex justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900 text-lg">{item.name}</h4>
                    <p className="text-sm text-gray-500">Qty: {item.quantity} • {item.preparationTime} menit</p>
                    {item.notes && (
                      <p className="text-sm text-orange-600 mt-1">📝 {item.notes}</p>
                    )}
                  </div>
                </div>
                
                {item.status === 'pending' ? (
                  <button
                    onClick={() => onItemStatusUpdate(item.id, 'done')}
                    disabled={isUpdating}
                    className="btn-primary text-sm flex items-center gap-2 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <CheckCircle size={16} />
                    <span>{isUpdating ? 'Memproses...' : 'Tandai Siap'}</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="px-4 py-2 bg-green-100 text-green-700 text-sm font-medium rounded-lg flex items-center gap-2">
                      <CheckCircle size={16} />
                      <span>Siap</span>
                    </span>
                    <button
                      onClick={() => onItemStatusUpdate(item.id, 'pending')}
                      disabled={isUpdating}
                      className="px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Batalkan
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Content ---
const KitchenStationContent = () => {
  const queryClient = useQueryClient();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [tableFilter, setTableFilter] = useState('all');
  const { isCollapsed } = useSidebar();

  const stationType = 'kitchen'; // Hardcoded untuk kitchen station

  // 🔥 FETCH ORDERS dengan auto-refetch 30 detik
  const { 
    data: ordersResponse, 
    isLoading, 
    isError,
    error,
    dataUpdatedAt,
    refetch,
    isFetching
  } = useQuery({
    queryKey: ['station-orders', stationType],
    queryFn: () => kitchenApi.getOrders(stationType, { status: 'pending' }),
    refetchInterval: 30000, // Auto-refetch setiap 30 detik
  });
  
  // ✅ Wrap in object karena transformer expect { data: {...} }
  const orders = transformBackendOrders(ordersResponse) || [];
  
  // Filter by table (client-side)
  const filteredOrders = tableFilter === 'all' 
    ? orders 
    : orders.filter(o => o.tableNumber === parseInt(tableFilter));

  // 🔥 MUTATION untuk update status item
  const updateStatusMutation = useMutation({
    mutationFn: ({ itemId, status }) => 
      kitchenApi.updateItemStatus(itemId, mapStatusToBackend(status)),
    onMutate: async ({ itemId, status }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries(['station-orders', stationType]);

      // Snapshot previous value (untuk rollback jika error)
      const previousOrders = queryClient.getQueryData(['station-orders', stationType]);

      // Optimistic update
      queryClient.setQueryData(['station-orders', stationType], (old) => {
        if (!old?.data?.orders) return old;
        
        return {
          ...old,
          data: {
            ...old.data,
            orders: old.data.orders.map(order => ({
              ...order,
              items: order.items.map(item => 
                item.id === itemId 
                  ? { ...item, status: mapStatusToBackend(status) }
                  : item
              )
            }))
          }
        };
      });

      return { previousOrders };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousOrders) {
        queryClient.setQueryData(['station-orders', stationType], context.previousOrders);
      }
      alert('Gagal update status: ' + (err.response?.data?.message || err.message));
    },
    onSuccess: () => {
      // Refetch untuk sinkronisasi dengan server
      queryClient.invalidateQueries(['station-orders', stationType]);
    },
  });

  const handleItemStatusUpdate = (itemId, newStatus) => {
    updateStatusMutation.mutate({ itemId, status: newStatus });
  };

  const handleTableFilterChange = (table) => {
    setTableFilter(table);
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
  };

  const getTotalPendingItems = () =>
    orders.reduce((total, order) => 
      total + order.items.filter((item) => item.status === 'pending').length, 0);

  // Hitung last update time
  const lastUpdatedSeconds = dataUpdatedAt 
    ? Math.floor((Date.now() - dataUpdatedAt) / 1000)
    : 0;

  // Get unique table numbers
  const tableNumbers = [...new Set(orders.map((o) => o.tableNumber))].sort((a, b) => a - b);

  // Loading State (initial load)
  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-cream-50 items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
            <RefreshCw size={32} className="text-primary-600 animate-spin" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Memuat data...</h3>
          <p className="text-gray-500">Mohon tunggu sebentar</p>
        </div>
      </div>
    );
  }

  // Error State
  if (isError) {
    return (
      <div className="flex min-h-screen bg-cream-50 items-center justify-center">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <WifiOff size={32} className="text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Gagal Memuat Data</h3>
          <p className="text-gray-500 mb-4">
            {error?.response?.data?.message || error?.message || 'Terjadi kesalahan saat mengambil data'}
          </p>
          <button
            onClick={() => refetch()}
            className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-cream-50">
      <Sidebar stationType="kitchen" />

      <div className={`flex-1 transition-all duration-300 ${isCollapsed ? 'lg:ml-0' : 'lg:ml-64'}`}>
        {/* Header */}
        <div className="bg-white border-b border-cream-200 px-8 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Kitchen Station</h1>
            <p className="text-gray-500 mt-1">Pesanan makanan berat yang sedang diproses</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 rounded-lg">
              <span className="text-2xl font-bold text-orange-600">{getTotalPendingItems()}</span>
              <span className="text-sm text-orange-600 font-medium">Item Pending</span>
            </div>
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="p-2 hover:bg-cream-100 rounded-lg transition-colors disabled:opacity-50"
              title="Refresh data"
            >
              <RefreshCw size={20} className={`text-gray-600 ${isFetching ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Status Bar */}
        <div className="bg-blue-50 border-b border-blue-200 px-8 py-2 flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-blue-700">
            <Wifi size={16} />
            <span>Last update: {lastUpdatedSeconds}s ago • Auto-refresh every 30s</span>
          </div>
          {isFetching && <span className="text-blue-600">Updating...</span>}
        </div>

        {/* Filter */}
        <div className="bg-white border-b border-cream-200 px-8 py-4">
          <span className="text-sm font-semibold text-gray-700 mr-2">Filter Meja:</span>
          <button
            onClick={() => handleTableFilterChange('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tableFilter === 'all' 
                ? 'bg-orange-500 text-white' 
                : 'bg-cream-100 text-gray-700 hover:bg-cream-200'
            }`}
          >
            Semua Meja
          </button>
          {tableNumbers.map((table) => (
            <button
              key={table}
              onClick={() => handleTableFilterChange(table.toString())}
              className={`px-4 py-2 ml-2 rounded-lg text-sm font-medium transition-colors ${
                tableFilter === table.toString() 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-cream-100 text-gray-700 hover:bg-cream-200'
              }`}
            >
              Meja {table}
            </button>
          ))}
        </div>

        {/* Grid Pesanan */}
        <div className="p-8">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-cream-100 rounded-full mb-4">🍳</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Tidak ada pesanan kitchen</h3>
              <p className="text-gray-500">Saat ini tidak ada pesanan makanan yang perlu diproses</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOrders.map((order) => (
                <OrderCard key={order.id} order={order} onViewDetails={handleViewDetails} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <OrderModal
        order={selectedOrder}
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onItemStatusUpdate={handleItemStatusUpdate}
        isUpdating={updateStatusMutation.isPending}
      />
    </div>
  );
};

// --- Wrapper Provider ---
const KitchenStation = () => (
  <SidebarProvider>
    <KitchenStationContent />
  </SidebarProvider>
);

export default KitchenStation;