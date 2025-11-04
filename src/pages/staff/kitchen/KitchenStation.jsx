import { useState } from 'react';
import { X, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import Sidebar, { useSidebar, SidebarProvider } from '../../../components/kitchen/Sidebar';

// --- Dummy Orders (Kitchen Only) ---
const initialKitchenOrders = [
  {
    id: 'ORD-001',
    tableNumber: 5,
    orderTime: new Date().toISOString(),
    status: 'processing',
    items: [
      { id: 'item-1', name: 'Nasi Goreng Spesial', category: 'kitchen', quantity: 2, price: 35000, status: 'processing', notes: 'Pedas level 3' },
      { id: 'item-2', name: 'Ayam Bakar', category: 'kitchen', quantity: 1, price: 45000, status: 'processing', notes: '' }
    ],
    totalAmount: 115000
  },
  {
    id: 'ORD-002',
    tableNumber: 3,
    orderTime: new Date(Date.now() - 300000).toISOString(),
    status: 'processing',
    items: [
      { id: 'item-3', name: 'Spaghetti Carbonara', category: 'kitchen', quantity: 1, price: 55000, status: 'processing', notes: 'Extra cheese' }
    ],
    totalAmount: 55000
  },
  {
    id: 'ORD-003',
    tableNumber: 8,
    orderTime: new Date(Date.now() - 600000).toISOString(),
    status: 'processing',
    items: [
      { id: 'item-4', name: 'Beef Steak', category: 'kitchen', quantity: 1, price: 85000, status: 'done', notes: 'Medium rare' },
      { id: 'item-5', name: 'Nasi Goreng Seafood', category: 'kitchen', quantity: 2, price: 42000, status: 'processing', notes: '' }
    ],
    totalAmount: 169000
  }
];

// --- Helper Functions ---
const formatCurrency = (amount) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

const formatTime = (date) => new Date(date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

const formatDate = (date) =>
  new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

// --- Order Card ---
const OrderCard = ({ order, onViewDetails }) => {
  const processingItems = order.items.filter((item) => item.status === 'processing');
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

      <div className="flex flex-wrap gap-2 mb-4">
        <span className="px-3 py-1 rounded-full text-xs font-medium border bg-blue-50 text-blue-700 border-blue-200">
          Diproses: {processingItems.length}
        </span>
        <span className="px-3 py-1 rounded-full text-xs font-medium border bg-green-50 text-green-700 border-green-200">
          Siap: {doneItems.length}
        </span>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-cream-200">
        <span className="text-sm font-medium text-gray-700">Total</span>
        <span className="text-lg font-bold text-primary-500">{formatCurrency(order.totalAmount)}</span>
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
const OrderModal = ({ order, isOpen, onClose, onItemStatusUpdate }) => {
  if (!isOpen || !order) return null;

  const processingItems = order.items.filter((item) => item.status === 'processing');
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

          {processingItems.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex gap-3 items-start">
              <AlertCircle size={20} className="text-blue-600 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">Dalam Proses</h4>
                <p className="text-sm text-blue-800">Masih ada {processingItems.length} item yang sedang diproses.</p>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="card p-4 border border-cream-200 rounded-lg">
                <div className="flex justify-between mb-3">
                  <h4 className="font-semibold text-gray-900 text-lg">{item.name}</h4>
                  <span className="font-semibold text-gray-900">{formatCurrency(item.price * item.quantity)}</span>
                </div>
                {item.status === 'processing' ? (
                  <button
                    onClick={() => onItemStatusUpdate(order.id, item.id, 'done')}
                    className="btn-primary text-sm flex items-center gap-2 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600"
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
                      onClick={() => onItemStatusUpdate(order.id, item.id, 'processing')}
                      className="px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium rounded-lg transition-colors"
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
  const [orders, setOrders] = useState(initialKitchenOrders);
  const [filteredOrders, setFilteredOrders] = useState(initialKitchenOrders);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [tableFilter, setTableFilter] = useState('all');
  const { isCollapsed } = useSidebar();

  const handleItemStatusUpdate = (orderId, itemId, newStatus) => {
    const updatedOrders = orders.map((order) =>
      order.id === orderId
        ? { ...order, items: order.items.map((item) => (item.id === itemId ? { ...item, status: newStatus } : item)) }
        : order
    );
    setOrders(updatedOrders);
    setFilteredOrders(
      tableFilter === 'all'
        ? updatedOrders
        : updatedOrders.filter((o) => o.tableNumber === parseInt(tableFilter))
    );
    if (selectedOrder?.id === orderId)
      setSelectedOrder(updatedOrders.find((o) => o.id === orderId));
  };

  const handleTableFilterChange = (table) => {
    setTableFilter(table);
    setFilteredOrders(
      table === 'all' ? orders : orders.filter((o) => o.tableNumber === parseInt(table))
    );
  };

  const handleViewDetails = (order) => setSelectedOrder(order);

  const getTotalProcessingItems = () =>
    orders.reduce((total, order) => total + order.items.filter((item) => item.status === 'processing').length, 0);

  const tableNumbers = [...new Set(orders.map((o) => o.tableNumber))].sort((a, b) => a - b);

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
          <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 rounded-lg">
            <span className="text-2xl font-bold text-orange-600">{getTotalProcessingItems()}</span>
            <span className="text-sm text-orange-600 font-medium">Item Diproses</span>
          </div>
        </div>

        {/* Filter */}
        <div className="bg-white border-b border-cream-200 px-8 py-4">
          <span className="text-sm font-semibold text-gray-700 mr-2">Filter Meja:</span>
          <button
            onClick={() => handleTableFilterChange('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${tableFilter === 'all' ? 'bg-orange-500 text-white' : 'bg-cream-100 text-gray-700 hover:bg-cream-200'}`}
          >
            Semua Meja
          </button>
          {tableNumbers.map((table) => (
            <button
              key={table}
              onClick={() => handleTableFilterChange(table.toString())}
              className={`px-4 py-2 ml-2 rounded-lg text-sm font-medium ${tableFilter === table.toString() ? 'bg-orange-500 text-white' : 'bg-cream-100 text-gray-700 hover:bg-cream-200'}`}
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
