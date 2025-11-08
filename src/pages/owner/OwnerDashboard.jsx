import { useState } from 'react';
import OwnerSidebar, { useOwnerSidebar } from '../../components/owner/OwnerSidebar';
import { 
  TrendingUp, 
  Users, 
  UtensilsCrossed, 
  Receipt,
  Clock,
  CheckCircle,
  AlertCircle,
  DollarSign
} from 'lucide-react';

// Dummy Statistics Data
const dashboardStats = {
  todaySales: 15750000,
  todayOrders: 87,
  activeOrders: 12,
  completedOrders: 75,
  occupiedTables: 8,
  totalTables: 15,
  activeStaff: 12,
  totalStaff: 15
};

// Dummy Recent Orders
const recentOrders = [
  {
    id: 'ORD-101',
    tableNumber: 5,
    time: '14:30',
    amount: 250000,
    status: 'completed',
    paymentStatus: 'paid'
  },
  {
    id: 'ORD-102',
    tableNumber: 8,
    time: '14:45',
    amount: 180000,
    status: 'processing',
    paymentStatus: 'unpaid'
  },
  {
    id: 'ORD-103',
    tableNumber: 3,
    time: '15:00',
    amount: 320000,
    status: 'ready',
    paymentStatus: 'paid'
  },
  {
    id: 'ORD-104',
    tableNumber: 12,
    time: '15:15',
    amount: 150000,
    status: 'processing',
    paymentStatus: 'unpaid'
  }
];

// Dummy Kitchen Status
const kitchenStatus = {
  kitchen: { processing: 8, ready: 3 },
  bar: { processing: 5, ready: 2 },
  pastry: { processing: 3, ready: 1 }
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
};

const getStatusBadge = (status) => {
  const badges = {
    pending: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', label: 'Pending' },
    processing: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', label: 'Diproses' },
    ready: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', label: 'Siap' },
    completed: { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200', label: 'Selesai' }
  };
  return badges[status] || badges.pending;
};

const getPaymentBadge = (status) => {
  const badges = {
    paid: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', label: 'Lunas' },
    unpaid: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', label: 'Belum Bayar' }
  };
  return badges[status] || badges.unpaid;
};

const StatCard = ({ title, value, subtitle, icon: Icon, color, trend }) => (
  <div className="card p-6">
    <div className="flex items-start justify-between mb-4">
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon size={24} className="text-white" />
      </div>
      {trend && (
        <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
          <TrendingUp size={16} />
          <span>{trend}</span>
        </div>
      )}
    </div>
    <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
    <p className="text-sm font-medium text-gray-700">{title}</p>
    {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
  </div>
);

const OwnerDashboard = () => {
  const { isCollapsed } = useOwnerSidebar();

  return (
    <div className="flex min-h-screen bg-cream-50">
      <OwnerSidebar />
      
      <div className={`
        flex-1 transition-all duration-300
        ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'}
      `}>
        <div className="p-8 mt-16 lg:mt-0">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Owner</h1>
            <p className="text-gray-600">Overview bisnis dan operasional restaurant Anda</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Penjualan Hari Ini"
              value={formatCurrency(dashboardStats.todaySales)}
              subtitle={`${dashboardStats.todayOrders} pesanan`}
              icon={DollarSign}
              color="bg-primary-500"
              trend="+12%"
            />
            <StatCard
              title="Pesanan Aktif"
              value={dashboardStats.activeOrders}
              subtitle={`${dashboardStats.completedOrders} selesai hari ini`}
              icon={Receipt}
              color="bg-blue-500"
            />
            <StatCard
              title="Okupansi Meja"
              value={`${dashboardStats.occupiedTables}/${dashboardStats.totalTables}`}
              subtitle={`${Math.round((dashboardStats.occupiedTables / dashboardStats.totalTables) * 100)}% terisi`}
              icon={UtensilsCrossed}
              color="bg-orange-500"
            />
            <StatCard
              title="Staff Aktif"
              value={`${dashboardStats.activeStaff}/${dashboardStats.totalStaff}`}
              subtitle="Staff sedang bertugas"
              icon={Users}
              color="bg-green-500"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Kitchen Status */}
            <div className="card p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Clock size={20} />
                Status Dapur
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Kitchen</p>
                    <p className="text-xs text-gray-600">Makanan Berat</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-blue-600">{kitchenStatus.kitchen.processing} Proses</p>
                    <p className="text-xs text-green-600">{kitchenStatus.kitchen.ready} Siap</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Bar</p>
                    <p className="text-xs text-gray-600">Minuman</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-blue-600">{kitchenStatus.bar.processing} Proses</p>
                    <p className="text-xs text-green-600">{kitchenStatus.bar.ready} Siap</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-pink-50 rounded-lg">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Pastry</p>
                    <p className="text-xs text-gray-600">Roti & Kue</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-blue-600">{kitchenStatus.pastry.processing} Proses</p>
                    <p className="text-xs text-green-600">{kitchenStatus.pastry.ready} Siap</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="card p-6 lg:col-span-2">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Receipt size={20} />
                Pesanan Terbaru
              </h2>
              <div className="space-y-3">
                {recentOrders.map((order) => {
                  const statusBadge = getStatusBadge(order.status);
                  const paymentBadge = getPaymentBadge(order.paymentStatus);
                  
                  return (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-cream-50 rounded-lg hover:bg-cream-100 transition-colors">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="font-semibold text-gray-900">Meja {order.tableNumber}</p>
                          <p className="text-xs text-gray-500">{order.id} • {order.time}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right mr-3">
                          <p className="font-bold text-primary-600">{formatCurrency(order.amount)}</p>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${statusBadge.bg} ${statusBadge.text} ${statusBadge.border}`}>
                            {statusBadge.label}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${paymentBadge.bg} ${paymentBadge.text} ${paymentBadge.border}`}>
                            {paymentBadge.label}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Aksi Cepat</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button className="p-4 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors text-center">
                <Receipt size={24} className="text-primary-600 mx-auto mb-2" />
                <p className="text-sm font-semibold text-gray-900">Monitor Kasir</p>
              </button>
              <button className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors text-center">
                <UtensilsCrossed size={24} className="text-orange-600 mx-auto mb-2" />
                <p className="text-sm font-semibold text-gray-900">Monitor Dapur</p>
              </button>
              <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-center">
                <TrendingUp size={24} className="text-green-600 mx-auto mb-2" />
                <p className="text-sm font-semibold text-gray-900">Laporan</p>
              </button>
              <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-center">
                <Users size={24} className="text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-semibold text-gray-900">Kelola Akun</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;