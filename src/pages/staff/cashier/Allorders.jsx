import { useState } from 'react';
import Sidebar from '../../../components/cashier/Sidebar';
import { useSidebar } from '../../../components/cashier/Sidebar';
import FilterBar from '../../../components/cashier/FilterBar';
import OrderCard from '../../../components/cashier/OrderCard';
import OrderModal from '../../../components/cashier/OrderModal';
import { dummyOrders, getOrdersByCategory, getOrdersByTable } from '../../../store/dummyOrders';


const AllOrders = () => {
  const [orders, setOrders] = useState(dummyOrders);
  const [filteredOrders, setFilteredOrders] = useState(dummyOrders);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isCollapsed } = useSidebar();

  const handleFilterChange = ({ category, table }) => {
    let filtered = [...orders];

    // Filter by category
    if (category !== 'all') {
      filtered = getOrdersByCategory(filtered, category);
    }

    // Filter by table
    if (table !== 'all') {
      filtered = getOrdersByTable(filtered, parseInt(table));
    }

    setFilteredOrders(filtered);
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleStatusUpdate = (orderId, newStatus) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, status: newStatus, completedAt: new Date().toISOString() } : order
      )
    );
    setFilteredOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, status: newStatus, completedAt: new Date().toISOString() } : order
      )
    );
  };

  return (
    <div className="flex min-h-screen bg-cream-50">
      <Sidebar />
      
      <div className={`
        flex-1 transition-all duration-300
        ${isCollapsed ? 'lg:ml-0' : 'lg:ml-64'}
      `}>
        {/* Page Header */}
        <div className="bg-white border-b border-cream-200 px-8 py-6 mt-16 lg:mt-0">
          <h1 className="text-3xl font-bold text-gray-900">Semua Pesanan</h1>
          <p className="text-gray-500 mt-1">Kelola dan pantau semua pesanan yang masuk</p>
        </div>

        {/* Filter Bar */}
        <FilterBar
          onFilterChange={handleFilterChange}
          showCategoryFilter={true}
          showTableFilter={true}
          showDateFilter={false}
        />

        {/* Orders Grid */}
        <div className="p-8">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-cream-100 rounded-full mb-4">
                <span className="text-2xl">📋</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Tidak ada pesanan</h3>
              <p className="text-gray-500">Belum ada pesanan yang sesuai dengan filter yang dipilih</p>
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
        onStatusUpdate={handleStatusUpdate}
      />
    </div>
  );
};

export default AllOrders;