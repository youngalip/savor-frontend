import { useState } from 'react';
import OwnerSidebar, { useOwnerSidebar } from '../../components/owner/OwnerSidebar';
import { Clock, RefreshCw, ChefHat } from 'lucide-react';

// Dummy Kitchen Orders Data
const dummyKitchenOrders = {
  kitchen: [
    {
      id: 'ORD-101',
      tableNumber: 5,
      orderTime: new Date().toISOString(),
      items: [
        { id: 1, name: 'Nasi Goreng Spesial', quantity: 2, status: 'processing', notes: 'Pedas level 3' },
        { id: 2, name: 'Ayam Bakar', quantity: 1, status: 'done', notes: '' }
      ]
    },
    {
      id: 'ORD-103',
      tableNumber: 8,
      orderTime: new Date(Date.now() - 300000).toISOString(),
      items: [
        { id: 3, name: 'Spaghetti Carbonara', quantity: 1, status: 'processing', notes: 'Extra cheese' }
      ]
    }
  ],
  bar: [
    {
      id: 'ORD-101',
      tableNumber: 5,
      orderTime: new Date().toISOString(),
      items: [
        { id: 4, name: 'Es Teh Manis', quantity: 2, status: 'done', notes: '' },
        { id: 5, name: 'Jus Alpukat', quantity: 1, status: 'processing', notes: 'Tanpa gula' }
      ]
    },
    {
      id: 'ORD-102',
      tableNumber: 3,
      orderTime: new Date(Date.now() - 600000).toISOString(),
      items: [
        { id: 6, name: 'Kopi Susu', quantity: 2, status: 'done', notes: 'Gula sedikit' }
      ]
    }
  ],
  pastry: [
    {
      id: 'ORD-104',
      tableNumber: 12,
      orderTime: new Date(Date.now() - 900000).toISOString(),
      items: [
        { id: 7, name: 'Croissant', quantity: 3, status: 'processing', notes: 'Hangat' },
        { id: 8, name: 'Chocolate Cake', quantity: 1, status: 'processing', notes: '' }
      ]
    }
  ]
};

const formatTime = (date) => {
  return new Date(date).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getStatusBadgeColor = (status) => {
  const colors = {
    processing: 'bg-blue-50 text-blue-700 border-blue-200',
    done: 'bg-green-50 text-green-700 border-green-200'
  };
  return colors[status] || 'bg-gray-50 text-gray-700 border-gray-200';
};

const StationCard = ({ station, orders, color }) => {
  const totalItems = orders.reduce((sum, order) => 
    sum + order.items.length, 0
  );
  const processingItems = orders.reduce((sum, order) => 
    sum + order.items.filter(item => item.status === 'processing').length, 0
  );
  const doneItems = orders.reduce((sum, order) => 
    sum + order.items.filter(item => item.status === 'done').length, 0
  );

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-3 ${color} rounded-lg`}>
            <ChefHat size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{station}</h2>
            <p className="text-sm text-gray-500">{totalItems} item total</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold text-blue-600">{processingItems} Diproses</p>
          <p className="text-sm font-semibold text-green-600">{doneItems} Siap</p>
        </div>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {orders.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">Tidak ada pesanan</p>
          </div>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="bg-cream-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-semibold text-gray-900">Meja {order.tableNumber}</p>
                  <p className="text-xs text-gray-500">#{order.id} • {formatTime(order.orderTime)}</p>
                </div>
              </div>
              <div className="space-y-2">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-start justify-between text-sm">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.quantity}x {item.name}</p>
                      {item.notes && (
                        <p className="text-xs text-gray-500 mt-1">Note: {item.notes}</p>
                      )}
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold border ml-2 ${getStatusBadgeColor(item.status)}`}>
                      {item.status === 'processing' ? 'Diproses' : 'Siap'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const KitchenMonitor = () => {
  const { isCollapsed } = useOwnerSidebar();
  const [kitchenData] = useState(dummyKitchenOrders);

  const totalStats = {
    kitchen: {
      total: kitchenData.kitchen.reduce((sum, order) => sum + order.items.length, 0),
      processing: kitchenData.kitchen.reduce((sum, order) => 
        sum + order.items.filter(item => item.status === 'processing').length, 0
      ),
      done: kitchenData.kitchen.reduce((sum, order) => 
        sum + order.items.filter(item => item.status === 'done').length, 0
      )
    },
    bar: {
      total: kitchenData.bar.reduce((sum, order) => sum + order.items.length, 0),
      processing: kitchenData.bar.reduce((sum, order) => 
        sum + order.items.filter(item => item.status === 'processing').length, 0
      ),
      done: kitchenData.bar.reduce((sum, order) => 
        sum + order.items.filter(item => item.status === 'done').length, 0
      )
    },
    pastry: {
      total: kitchenData.pastry.reduce((sum, order) => sum + order.items.length, 0),
      processing: kitchenData.pastry.reduce((sum, order) => 
        sum + order.items.filter(item => item.status === 'processing').length, 0
      ),
      done: kitchenData.pastry.reduce((sum, order) => 
        sum + order.items.filter(item => item.status === 'done').length, 0
      )
    }
  };

  const grandTotal = {
    total: totalStats.kitchen.total + totalStats.bar.total + totalStats.pastry.total,
    processing: totalStats.kitchen.processing + totalStats.bar.processing + totalStats.pastry.processing,
    done: totalStats.kitchen.done + totalStats.bar.done + totalStats.pastry.done
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
              <h1 className="text-3xl font-bold text-gray-900">Monitor Dapur</h1>
              <p className="text-gray-600 mt-1">Pantau aktivitas semua station dapur secara real-time</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <RefreshCw size={18} />
              <span>Refresh</span>
            </button>
          </div>

          {/* Overall Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="card p-4">
              <p className="text-sm text-gray-600 mb-1">Total Item</p>
              <p className="text-3xl font-bold text-gray-900">{grandTotal.total}</p>
            </div>
            <div className="card p-4">
              <p className="text-sm text-gray-600 mb-1">Sedang Diproses</p>
              <p className="text-3xl font-bold text-blue-600">{grandTotal.processing}</p>
            </div>
            <div className="card p-4">
              <p className="text-sm text-gray-600 mb-1">Sudah Siap</p>
              <p className="text-3xl font-bold text-green-600">{grandTotal.done}</p>
            </div>
          </div>

          {/* Station Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <StationCard 
              station="Kitchen Station"
              orders={kitchenData.kitchen}
              color="bg-orange-500"
            />
            <StationCard 
              station="Bar Station"
              orders={kitchenData.bar}
              color="bg-blue-500"
            />
            <StationCard 
              station="Pastry Station"
              orders={kitchenData.pastry}
              color="bg-pink-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default KitchenMonitor;