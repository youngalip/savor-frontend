import { useState } from 'react';
import OwnerSidebar, { useOwnerSidebar } from '../../components/owner/OwnerSidebar';
import { Clock, Package, RefreshCw } from 'lucide-react';

// Dummy Orders Data
const dummyOrders = [
  {
    id: 'ORD-101',
    tableNumber: 5,
    orderTime: new Date().toISOString(),
    status: 'processing',
    paymentStatus: 'unpaid',
    items: [
      { id: 1, name: 'Nasi Goreng Spesial', quantity: 2, price: 35000, category: 'kitchen' },
      { id: 2, name: 'Es Teh Manis', quantity: 2, price: 8000, category: 'bar' }
    ],
    totalAmount: 86000,
    cashier: 'Budi Santoso'
  },
  {
    id: 'ORD-102',
    tableNumber: 8,
    orderTime: new Date(Date.now() - 300000).toISOString(),
    status: 'ready',
    paymentStatus: 'paid',
    items: [
      { id: 3, name: 'Ayam Bakar', quantity: 1, price: 45000, category: 'kitchen' },
      { id: 4, name: 'Jus Alpukat', quantity: 1, price: 15000, category: 'bar' }
    ],
    totalAmount: 60000,
    cashier: 'Siti Rahayu'
  },
  {
    id: 'ORD-103',
    tableNumber: 3,
    orderTime: new Date(Date.now() - 600000).toISOString(),
    status: 'completed',
    paymentStatus: 'paid',
    items: [
      { id: 5, name: 'Spaghetti Carbonara', quantity: 1, price: 55000, category: 'kitchen' },
      { id: 6, name: 'Kopi Susu', quantity: 2, price: 18000, category: 'bar' }
    ],
    totalAmount: 91000,
    cashier: 'Budi Santoso'
  },
  {
    id: 'ORD-104',
    tableNumber: 12,
    orderTime: new Date(Date.now() - 900000).toISOString(),
    status: 'processing',
    paymentStatus: 'unpaid',
    items: [
      { id: 7, name: 'Croissant', quantity: 3, price: 25000, category: 'pastry' },
      { id: 8, name: 'Lemon Tea', quantity: 3, price: 12000, category: 'bar' }
    ],
    totalAmount: 111000,
    cashier: 'Siti Rahayu'
  }
];

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

const getStatusBadgeColor = (status) => {
  const colors = {
    pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    processing: 'bg-blue-50 text-blue-700 border-blue-200',
    ready: 'bg-green-50 text-green-700 border-green-200',
    completed: 'bg-gray-50 text-gray-700 border-gray-200'
  };
  return colors[status] || 'bg-gray-50 text-gray-700 border-gray-200';
};

const getPaymentBadgeColor = (status) => {
  const colors = {
    paid: 'bg-green-50 text-green-700 border-green-200',
    unpaid: 'bg-red-50 text-red-700 border-red-200'
  };
  return colors[status] || 'bg-gray-50 text-gray-700 border-gray-200';
};

const getCategoryBadgeColor = (category) => {
  const colors = {
    kitchen: 'bg-orange-50 text-orange-700 border-orange-200',
    bar: 'bg-blue-50 text-blue-700 border-blue-200',
    pastry: 'bg-pink-50 text-pink-700 border-pink-200'
  };
  return colors[category] || 'bg-gray-50 text-gray-700 border-gray-200';
};

const getStatusLabel = (status) => {
  const labels = {
    pending: 'Pending',
    processing: 'Diproses',
    ready: 'Siap',
    completed: 'Selesai'
  };
  return labels[status] || status;
};

const getPaymentLabel = (status) => {
  const labels = {
    paid: 'Lunas',
    unpaid: 'Belum Bayar'
  };
  return labels[status] || status;
};

const OrderCard = ({ order }) => {
  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const categoryCounts = order.items.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="card p-5">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Meja {order.tableNumber}</h3>
          <p className="text-sm text-gray-500">#{order.id}</p>
          <p className="text-xs text-gray-500 mt-1">Kasir: {order.cashier}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadgeColor(order.status)}`}>
            {getStatusLabel(order.status)}
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPaymentBadgeColor(order.paymentStatus)}`}>
            {getPaymentLabel(order.paymentStatus)}
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
          <Package size={16} />
          <span>{totalItems} Item</span>
        </div>
      </div>

      {/* Category Badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        {Object.entries(categoryCounts).map(([category, count]) => (
          <span 
            key={category}
            className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryBadgeColor(category)}`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}: {count}
          </span>
        ))}
      </div>

      {/* Total Amount */}
      <div className="flex items-center justify-between pt-4 border-t border-cream-200">
        <span className="text-sm font-medium text-gray-700">Total</span>
        <span className="text-lg font-bold text-primary-500">
          {formatCurrency(order.totalAmount)}
        </span>
      </div>
    </div>
  );
};

const CashierMonitor = () => {
  const { isCollapsed } = useOwnerSidebar();
  const [orders, setOrders] = useState(dummyOrders);
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredOrders = statusFilter === 'all' 
    ? orders 
    : orders.filter(order => order.status === statusFilter);

  const stats = {
    total: orders.length,
    processing: orders.filter(o => o.status === 'processing').length,
    ready: orders.filter(o => o.status === 'ready').length,
    completed: orders.filter(o => o.status === 'completed').length,
    unpaid: orders.filter(o => o.paymentStatus === 'unpaid').length
  };

  return (
    <div className="flex min-h-screen bg-cream-50">
      <OwnerSidebar />
      
      <div className={`
        flex-1 transition-all duration-300
        ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'}
      `}>
        <div className="p-8 mt-16 lg:mt-0">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Monitor Kasir</h1>
              <p className="text-gray-600 mt-1">Pantau semua aktivitas pesanan kasir secara real-time</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <RefreshCw size={18} />
              <span>Refresh</span>
            </button>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="card p-4">
              <p className="text-sm text-gray-600 mb-1">Total Pesanan</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="card p-4">
              <p className="text-sm text-gray-600 mb-1">Diproses</p>
              <p className="text-2xl font-bold text-blue-600">{stats.processing}</p>
            </div>
            <div className="card p-4">
              <p className="text-sm text-gray-600 mb-1">Siap</p>
              <p className="text-2xl font-bold text-green-600">{stats.ready}</p>
            </div>
            <div className="card p-4">
              <p className="text-sm text-gray-600 mb-1">Selesai</p>
              <p className="text-2xl font-bold text-gray-600">{stats.completed}</p>
            </div>
            <div className="card p-4">
              <p className="text-sm text-gray-600 mb-1">Belum Bayar</p>
              <p className="text-2xl font-bold text-red-600">{stats.unpaid}</p>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === 'all'
                  ? 'bg-primary-500 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Semua ({stats.total})
            </button>
            <button
              onClick={() => setStatusFilter('processing')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === 'processing'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Diproses ({stats.processing})
            </button>
            <button
              onClick={() => setStatusFilter('ready')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === 'ready'
                  ? 'bg-green-500 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Siap ({stats.ready})
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === 'completed'
                  ? 'bg-gray-500 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Selesai ({stats.completed})
            </button>
          </div>

          {/* Orders Grid */}
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-cream-100 rounded-full mb-4">
                <span className="text-2xl">📋</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Tidak ada pesanan</h3>
              <p className="text-gray-500">Tidak ada pesanan dengan status yang dipilih</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CashierMonitor;