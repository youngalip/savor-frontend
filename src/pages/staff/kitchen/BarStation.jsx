import { useState } from 'react';
import { X, Clock, CheckCircle, AlertCircle } from 'lucide-react';

// Dummy Orders - Only Bar Items
const initialBarOrders = [
  {
    id: 'ORD-001',
    tableNumber: 5,
    orderTime: new Date().toISOString(),
    status: 'processing',
    items: [
      {
        id: 'item-1',
        name: 'Es Teh Manis',
        category: 'bar',
        quantity: 2,
        price: 8000,
        status: 'processing',
        notes: ''
      },
      {
        id: 'item-2',
        name: 'Jus Alpukat',
        category: 'bar',
        quantity: 1,
        price: 15000,
        status: 'processing',
        notes: 'Tanpa gula'
      }
    ],
    totalAmount: 31000
  },
  {
    id: 'ORD-002',
    tableNumber: 3,
    orderTime: new Date(Date.now() - 300000).toISOString(),
    status: 'processing',
    items: [
      {
        id: 'item-3',
        name: 'Kopi Susu',
        category: 'bar',
        quantity: 2,
        price: 18000,
        status: 'done',
        notes: 'Gula sedikit'
      }
    ],
    totalAmount: 36000
  },
  {
    id: 'ORD-003',
    tableNumber: 8,
    orderTime: new Date(Date.now() - 600000).toISOString(),
    status: 'processing',
    items: [
      {
        id: 'item-4',
        name: 'Lemon Tea',
        category: 'bar',
        quantity: 3,
        price: 12000,
        status: 'processing',
        notes: ''
      },
      {
        id: 'item-5',
        name: 'Smoothie Mangga',
        category: 'bar',
        quantity: 1,
        price: 22000,
        status: 'processing',
        notes: 'Extra es'
      }
    ],
    totalAmount: 58000
  },
  {
    id: 'ORD-004',
    tableNumber: 12,
    orderTime: new Date(Date.now() - 900000).toISOString(),
    status: 'processing',
    items: [
      {
        id: 'item-6',
        name: 'Mineral Water',
        category: 'bar',
        quantity: 4,
        price: 5000,
        status: 'done',
        notes: ''
      }
    ],
    totalAmount: 20000
  }
];

// Helper Functions
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
};

const formatTime = (date) => {
  return new Date(date).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

const getStatusBadgeColor = (status) => {
  const colors = {
    pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    processing: 'bg-blue-50 text-blue-700 border-blue-200',
    ready: 'bg-green-50 text-green-700 border-green-200',
    done: 'bg-green-50 text-green-700 border-green-200',
    completed: 'bg-gray-50 text-gray-700 border-gray-200'
  };
  return colors[status] || 'bg-gray-50 text-gray-700 border-gray-200';
};

// Order Card Component
const OrderCard = ({ order, onViewDetails }) => {
  const processingItems = order.items.filter(item => item.status === 'processing');
  const doneItems = order.items.filter(item => item.status === 'done');
  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
  
  return (
    <div className="card p-5 hover:shadow-md transition-shadow cursor-pointer" onClick={() => onViewDetails(order)}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Meja {order.tableNumber}</h3>
          <p className="text-sm text-gray-500">#{order.id}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-semibold border bg-blue-50 text-blue-700 border-blue-200">
            Bar
          </span>
        </div>
      </div>

      {/* Time & Items Info */}
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

      {/* Status Badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="px-3 py-1 rounded-full text-xs font-medium border bg-blue-50 text-blue-700 border-blue-200">
          Diproses: {processingItems.length}
        </span>
        <span className="px-3 py-1 rounded-full text-xs font-medium border bg-green-50 text-green-700 border-green-200">
          Siap: {doneItems.length}
        </span>
      </div>

      {/* Total Amount */}
      <div className="flex items-center justify-between pt-4 border-t border-cream-200">
        <span className="text-sm font-medium text-gray-700">Total</span>
        <span className="text-lg font-bold text-primary-500">
          {formatCurrency(order.totalAmount)}
        </span>
      </div>

      {/* View Details Button */}
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

// Order Modal Component
const OrderModal = ({ order, isOpen, onClose, onItemStatusUpdate }) => {
  if (!isOpen || !order) return null;

  const handleItemStatusChange = (itemId, newStatus) => {
    onItemStatusUpdate(order.id, itemId, newStatus);
  };

  const processingItems = order.items.filter(item => item.status === 'processing');
  const allItemsDone = order.items.every(item => item.status === 'done');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-cream-200 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Kelola Pesanan Bar</h2>
            <p className="text-sm text-gray-500 mt-1">Meja {order.tableNumber} • #{order.id}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-cream-50 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Order Info */}
          <div className="card p-4 mb-6">
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <Clock size={18} />
              <span className="text-sm font-medium">Waktu Pemesanan</span>
            </div>
            <p className="text-lg font-semibold text-gray-900">
              {formatTime(order.orderTime)}
            </p>
            <p className="text-sm text-gray-500">
              {formatDate(order.orderTime)}
            </p>
          </div>

          {/* Status Summary */}
          {allItemsDone && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-green-900 mb-1">Semua Item Siap!</h4>
                  <p className="text-sm text-green-800">
                    Semua minuman dalam pesanan ini telah selesai dibuat.
                  </p>
                </div>
              </div>
            </div>
          )}

          {processingItems.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900 mb-1">Dalam Proses</h4>
                  <p className="text-sm text-blue-800">
                    Masih ada {processingItems.length} item yang sedang diproses.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Items List */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Daftar Item Bar</h3>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="card p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-lg">{item.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">Jumlah: {item.quantity}x</p>
                      {item.notes && (
                        <p className="text-sm text-gray-500 mt-1">
                          <span className="font-medium">Catatan:</span> {item.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                    
                    {item.status === 'processing' ? (
                      <button
                        onClick={() => handleItemStatusChange(item.id, 'done')}
                        className="btn-primary text-sm flex items-center gap-2"
                      >
                        <CheckCircle size={16} />
                        <span>Tandai Siap</span>
                      </button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="px-4 py-2 bg-green-100 text-green-700 text-sm font-medium rounded-lg flex items-center gap-2">
                          <CheckCircle size={16} />
                          <span>Siap</span>
                        </span>
                        <button
                          onClick={() => handleItemStatusChange(item.id, 'processing')}
                          className="px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium rounded-lg transition-colors"
                        >
                          Batalkan
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="border-t border-cream-200 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-gray-700">Total Pesanan</span>
              <span className="text-2xl font-bold text-primary-500">
                {formatCurrency(order.totalAmount)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Component
const BarStation = () => {
  const [orders, setOrders] = useState(initialBarOrders);
  const [filteredOrders, setFilteredOrders] = useState(initialBarOrders);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tableFilter, setTableFilter] = useState('all');

  const handleTableFilterChange = (table) => {
    setTableFilter(table);
    if (table === 'all') {
      setFilteredOrders(orders);
    } else {
      const filtered = orders.filter(order => order.tableNumber === parseInt(table));
      setFilteredOrders(filtered);
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleItemStatusUpdate = (orderId, itemId, newStatus) => {
    const updatedOrders = orders.map(order => {
      if (order.id === orderId) {
        const updatedItems = order.items.map(item =>
          item.id === itemId ? { ...item, status: newStatus } : item
        );
        
        return {
          ...order,
          items: updatedItems
        };
      }
      return order;
    });
    
    setOrders(updatedOrders);
    
    // Update filtered orders
    if (tableFilter === 'all') {
      setFilteredOrders(updatedOrders);
    } else {
      const filtered = updatedOrders.filter(order => order.tableNumber === parseInt(tableFilter));
      setFilteredOrders(filtered);
    }
    
    // Update selected order if modal is open
    if (selectedOrder && selectedOrder.id === orderId) {
      const updatedOrder = updatedOrders.find(o => o.id === orderId);
      setSelectedOrder(updatedOrder);
    }
  };

  const getTotalProcessingItems = () => {
    return orders.reduce((total, order) => {
      return total + order.items.filter(item => item.status === 'processing').length;
    }, 0);
  };

  // Get unique table numbers
  const tableNumbers = [...new Set(orders.map(order => order.tableNumber))].sort((a, b) => a - b);

  return (
    <div className="flex min-h-screen bg-cream-50">
      <div className="flex-1">
        {/* Page Header */}
        <div className="bg-white border-b border-cream-200 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Bar Station</h1>
              <p className="text-gray-500 mt-1">Pesanan minuman yang sedang diproses</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg">
              <span className="text-2xl font-bold text-blue-600">{getTotalProcessingItems()}</span>
              <span className="text-sm text-blue-600 font-medium">Item Diproses</span>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white border-b border-cream-200 px-8 py-4">
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold text-gray-700">Filter Meja:</span>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => handleTableFilterChange('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  tableFilter === 'all'
                    ? 'bg-blue-500 text-white'
                    : 'bg-cream-100 text-gray-700 hover:bg-cream-200'
                }`}
              >
                Semua Meja
              </button>
              {tableNumbers.map(table => (
                <button
                  key={table}
                  onClick={() => handleTableFilterChange(table.toString())}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    tableFilter === table.toString()
                      ? 'bg-blue-500 text-white'
                      : 'bg-cream-100 text-gray-700 hover:bg-cream-200'
                  }`}
                >
                  Meja {table}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Orders Grid */}
        <div className="p-8">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-cream-100 rounded-full mb-4">
                <span className="text-2xl">🍹</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Tidak ada pesanan bar</h3>
              <p className="text-gray-500">Saat ini tidak ada pesanan minuman yang perlu diproses</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Order Modal */}
      <OrderModal
        order={selectedOrder}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onItemStatusUpdate={handleItemStatusUpdate}
      />
    </div>
  );
};

export default BarStation;