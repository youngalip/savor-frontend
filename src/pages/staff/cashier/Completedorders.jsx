import { useState } from 'react';
import Sidebar from '../../../components/cashier/Sidebar';
import { useSidebar } from '../../../components/cashier/Sidebar';
import FilterBar from '../../../components/cashier/FilterBar';
import OrderCard from '../../../components/cashier/OrderCard';
import OrderModal from '../../../components/cashier/OrderModal';
import { dummyOrders, getOrdersByStatus, getOrdersByDateRange } from '../../../store/dummyOrders';

const CompletedOrders = () => {
  const completedOrders = getOrdersByStatus('completed');
  const [orders] = useState(completedOrders);
  const [filteredOrders, setFilteredOrders] = useState(completedOrders);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isCollapsed } = useSidebar();

  const handleFilterChange = ({ dateRange }) => {
    let filtered = [...orders];

    // Filter by date range
    if (dateRange.start && dateRange.end) {
      filtered = getOrdersByDateRange(filtered, dateRange.start, dateRange.end);
    } else if (dateRange.start) {
      filtered = filtered.filter(order => new Date(order.completedAt || order.orderTime) >= new Date(dateRange.start));
    } else if (dateRange.end) {
      filtered = filtered.filter(order => new Date(order.completedAt || order.orderTime) <= new Date(dateRange.end));
    }

    setFilteredOrders(filtered);
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  // Calculate statistics
  const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  const totalOrders = filteredOrders.length;

  return (
    <div className="flex min-h-screen bg-cream-50">
      <Sidebar />
      
      <div className={`
        flex-1 transition-all duration-300
        ${isCollapsed ? 'lg:ml-0' : 'lg:ml-64'}
      `}>
        {/* Page Header */}
        <div className="bg-white border-b border-cream-200 px-8 py-6 mt-16 lg:mt-0">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Pesanan Selesai</h1>
              <p className="text-gray-500 mt-1">Riwayat pesanan yang telah selesai</p>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="card p-4">
              <p className="text-sm text-gray-500 mb-1">Total Pesanan</p>
              <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
            </div>
            <div className="card p-4">
              <p className="text-sm text-gray-500 mb-1">Total Pendapatan</p>
              <p className="text-2xl font-bold text-primary-500">
                {new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  minimumFractionDigits: 0
                }).format(totalRevenue)}
              </p>
            </div>
            <div className="card p-4">
              <p className="text-sm text-gray-500 mb-1">Rata-rata Pesanan</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalOrders > 0 
                  ? new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                      minimumFractionDigits: 0
                    }).format(totalRevenue / totalOrders)
                  : 'Rp 0'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Filter Bar - Only Date Filter */}
        <FilterBar
          onFilterChange={handleFilterChange}
          showCategoryFilter={false}
          showTableFilter={false}
          showDateFilter={true}
        />

        {/* Orders Grid */}
        <div className="p-8">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-cream-100 rounded-full mb-4">
                <span className="text-2xl">📦</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Tidak ada pesanan selesai</h3>
              <p className="text-gray-500">Belum ada pesanan yang selesai pada periode yang dipilih</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onViewDetails={() => handleViewDetails(order)}
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
        onStatusUpdate={() => {}} // No status updates for completed orders
      />
    </div>
  );
};

export default CompletedOrders;