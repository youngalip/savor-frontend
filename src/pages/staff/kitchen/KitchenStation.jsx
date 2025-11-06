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

// --- Order Modal with Inline Toggle ---
const OrderModal = ({ order, isOpen, onClose, onItemStatusUpdate, isUpdating }) => {
  if (!isOpen || !order) return null;

  const pendingItems = order.items.filter((item) => item.status === 'pending');
  const allItemsDone = order.items.every((item) => item.status === 'done');

  const handleToggle = (itemId, currentStatus) => {
    const newStatus = currentStatus === 'pending' ? 'done' : 'pending';
    onItemStatusUpdate(itemId, newStatus);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-cream-200 p-6 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Kelola Pesanan Kitchen</h2>
            <p className="text-sm text-gray-500 mt-1">Meja {order.tableNumber} • #{order.id}</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-cream-50 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Konten */}
        <div className="p-6">
          {/* Order Info Card */}
          <div className="card p-4 mb-6 border border-cream-200 bg-cream-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <Clock size={18} />
                  <span className="text-sm font-medium">Waktu Pemesanan</span>
                </div>
                <p className="text-lg font-semibold text-gray-900">{formatTime(order.orderTime)}</p>
                <p className="text-sm text-gray-500">{formatDate(order.orderTime)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-orange-600 font-medium">{getTimeElapsed(order.orderTime)}</p>
                <p className="text-xs text-gray-500 mt-1">Customer: {order.customerName}</p>
              </div>
            </div>
          </div>

          {/* Status Banner */}
          {allItemsDone && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex gap-3 items-start">
              <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-green-900 mb-1">Semua Item Siap!</h4>
                <p className="text-sm text-green-800">Semua makanan telah selesai dibuat dan siap disajikan.</p>
              </div>
            </div>
          )}

          {pendingItems.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex gap-3 items-start">
              <AlertCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">Dalam Proses</h4>
                <p className="text-sm text-blue-800">Masih ada {pendingItems.length} item yang perlu diselesaikan.</p>
              </div>
            </div>
          )}

          {/* Items List - Inline Toggle Design */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Daftar Pesanan</h3>
            
            {order.items.map((item) => (
              <div 
                key={item.id} 
                className={`
                  flex items-center justify-between p-4 rounded-lg border-2 transition-all
                  ${item.status === 'done' 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-white border-cream-200 hover:border-cream-300'
                  }
                  ${isUpdating ? 'opacity-50 pointer-events-none' : ''}
                `}
              >
                {/* Left: Item Info */}
                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-start gap-3">
                    {/* Status Icon */}
                    <div className="flex-shrink-0 mt-1">
                      {item.status === 'done' ? (
                        <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                          <CheckCircle size={16} className="text-white" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center">
                          <Clock size={14} className="text-gray-600" />
                        </div>
                      )}
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className={`font-bold text-base mb-1 ${item.status === 'done' ? 'text-green-900 line-through' : 'text-gray-900'}`}>
                        {item.name}
                      </h4>
                      
                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-1">
                        <span className="flex items-center gap-1">
                          <span className="font-medium">Qty:</span> {item.quantity}
                        </span>
                        {item.preparationTime && (
                          <span className="flex items-center gap-1">
                            <Clock size={14} />
                            {item.preparationTime} menit
                          </span>
                        )}
                      </div>

                      {item.notes && (
                        <div className="mt-2 p-2 bg-orange-50 border border-orange-200 rounded text-sm">
                          <span className="font-medium text-orange-900">📝 Catatan:</span>
                          <span className="text-orange-800 ml-1">{item.notes}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Toggle Switch */}
                <div className="flex-shrink-0">
                  <button
                    onClick={() => handleToggle(item.id, item.status)}
                    disabled={isUpdating}
                    className={`
                      relative inline-flex h-8 w-16 items-center rounded-full transition-colors
                      focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                      ${item.status === 'done' 
                        ? 'bg-green-500 hover:bg-green-600' 
                        : 'bg-gray-300 hover:bg-gray-400'
                      }
                      ${isUpdating ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                    `}
                    title={item.status === 'done' ? 'Tandai sebagai Pending' : 'Tandai sebagai Siap'}
                  >
                    <span
                      className={`
                        inline-block h-6 w-6 transform rounded-full bg-white transition-transform
                        ${item.status === 'done' ? 'translate-x-9' : 'translate-x-1'}
                      `}
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Footer Info */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Total Item:</span>
              <span className="font-bold text-gray-900">{order.items.length}</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-2">
              <span className="text-gray-600">Progress:</span>
              <span className="font-bold text-primary-600">
                {order.items.filter(i => i.status === 'done').length} / {order.items.length} Selesai
              </span>
            </div>
          </div>

          {/* Updating Indicator */}
          {isUpdating && (
            <div className="mt-4 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg">
                <RefreshCw size={16} className="animate-spin" />
                <span className="text-sm font-medium">Menyimpan perubahan...</span>
              </div>
            </div>
          )}
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

  const stationType = 'kitchen';

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
    refetchInterval: 30000,
  });

  const orders = transformBackendOrders(ordersResponse) || [];
  
  const filteredOrders = tableFilter === 'all' 
    ? orders 
    : orderorders.filter(o => o.tableNumber === tableFilter)

  // 🔥 MUTATION untuk update status item
  const updateStatusMutation = useMutation({
    mutationFn: ({ itemId, status }) => 
      kitchenApi.updateItemStatus(itemId, mapStatusToBackend(status)),
    onMutate: async ({ itemId, status }) => {
      await queryClient.cancelQueries(['station-orders', stationType]);
      const previousOrders = queryClient.getQueryData(['station-orders', stationType]);

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
      if (context?.previousOrders) {
        queryClient.setQueryData(['station-orders', stationType], context.previousOrders);
      }
      alert('Gagal update status: ' + (err.response?.data?.message || err.message));
    },
    onSuccess: () => {
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

  const lastUpdatedSeconds = dataUpdatedAt 
    ? Math.floor((Date.now() - dataUpdatedAt) / 1000)
    : 0;

  const tableNumbers = [...new Set(orders.map((o) => o.tableNumber))].sort((a, b) => a - b);

  // Loading State
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