import { Clock, Package } from 'lucide-react';
import { 
  formatCurrency, 
  formatTime, 
  getCategoryBadgeColor, 
  getPaymentBadgeColor,
  getStatusBadgeColor 
} from '../../store/dummyOrders';

const OrderCard = ({ order, onViewDetails }) => {
  // Count items by category
  const categoryCounts = order.items.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {});

  // Total items
  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);

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

  return (
    <div className="card p-5 hover:shadow-md transition-shadow cursor-pointer" onClick={onViewDetails}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Meja {order.tableNumber}</h3>
          <p className="text-sm text-gray-500">#{order.id}</p>
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

      {/* View Details Button */}
      <button 
        className="w-full mt-4 py-2 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition-colors"
        onClick={(e) => {
          e.stopPropagation();
          onViewDetails();
        }}
      >
        Lihat Detail
      </button>
    </div>
  );
};

export default OrderCard;