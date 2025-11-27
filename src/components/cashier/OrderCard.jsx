import { Clock, User, StickyNote } from 'lucide-react';

const OrderCard = ({ order, onClick }) => {
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Format time
  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status badge style - V4: No "processing"
  const getStatusBadge = () => {
    const styles = {
      unpaid: {
        bg: 'bg-red-100',
        text: 'text-red-800',
        border: 'border-red-200',
        label: 'Belum Bayar'
      },
      pending: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        border: 'border-yellow-200',
        label: 'Sedang Diproses'
      },
      ready: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        border: 'border-green-200',
        label: 'Siap Diantar'
      },
      completed: {
        bg: 'bg-gray-100',
        text: 'text-gray-800',
        border: 'border-gray-200',
        label: 'Selesai'
      }
    };

    return styles[order.status] || styles.pending;
  };

  // Get payment status badge
  const getPaymentBadge = () => {
    if (order.payment_status === 'Paid') {
      return {
        bg: 'bg-green-100',
        text: 'text-green-800',
        border: 'border-green-200',
        label: 'Lunas'
      };
    }
    return {
      bg: 'bg-red-100',
      text: 'text-red-800',
      border: 'border-red-200',
      label: 'Belum Lunas'
    };
  };

  // Group items by category
  const itemsByCategory = order.items.reduce((acc, item) => {
    const category = item.category || 'Lainnya';
    acc[category] = (acc[category] || 0) + item.quantity;
    return acc;
  }, {});

  const statusBadge = getStatusBadge();
  const paymentBadge = getPaymentBadge();

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl p-5 shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer border border-gray-100 hover:border-[#8b1538]/30"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-lg text-gray-900">
            Meja {order.table_number || order.table?.table_number || '-'}
          </h3>
          <p className="text-sm text-gray-500">#{order.order_number}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusBadge.bg} ${statusBadge.text} ${statusBadge.border}`}>
            {statusBadge.label}
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${paymentBadge.bg} ${paymentBadge.text} ${paymentBadge.border}`}>
            {paymentBadge.label}
          </span>
        </div>
      </div>

      {/* Order Info */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock size={16} className="text-[#8b1538]" />
          <span>{formatTime(order.order_time)}</span>
        </div>
        
        {order.customer_name && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <User size={16} className="text-[#8b1538]" />
            <span>{order.customer_name}</span>
          </div>
        )}
      </div>

      {/* Items Summary by Category */}
      <div className="border-t border-gray-100 pt-3 mb-4">
        <div className="flex flex-wrap gap-2">
          {Object.entries(itemsByCategory).map(([category, count]) => (
            <div
              key={category}
              className="inline-flex items-center gap-1 px-2 py-1 bg-gray-50 rounded-lg text-xs"
            >
              <span className="font-medium text-gray-700">{category}</span>
              <span className="text-gray-500">×{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Total & Notes */}
      <div className="flex justify-between items-center">
        <div>
          <p className="text-xs text-gray-500">Total</p>
          <p className="font-bold text-lg text-[#8b1538]">
            {formatCurrency(order.total_amount)}
          </p>
        </div>
        
        {order.notes && (
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <StickyNote size={14} />
            <span>Ada catatan</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderCard;