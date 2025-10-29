import { X, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { 
  formatCurrency, 
  formatTime, 
  formatDate,
  getCategoryBadgeColor, 
  getPaymentBadgeColor,
  getStatusBadgeColor 
} from '../../store/dummyOrders';

const OrderModal = ({ order, isOpen, onClose, onStatusUpdate }) => {
  if (!isOpen || !order) return null;

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'Pending',
      processing: 'Diproses',
      ready: 'Siap',
      completed: 'Selesai',
      done: 'Selesai'
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

  const getCategoryLabel = (category) => {
    const labels = {
      kitchen: 'Kitchen',
      bar: 'Bar',
      pastry: 'Pastry'
    };
    return labels[category] || category;
  };

  // Check if all items are done
  const allItemsDone = order.items.every(item => item.status === 'done');
  
  // Can mark as complete only if order status is 'ready'
  const canMarkAsComplete = order.status === 'ready';

  const handleMarkAsComplete = () => {
    if (canMarkAsComplete) {
      onStatusUpdate(order.id, 'completed');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-cream-200 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Detail Pesanan</h2>
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
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="card p-4">
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

            <div className="card p-4">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <AlertCircle size={18} />
                <span className="text-sm font-medium">Status</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadgeColor(order.status)}`}>
                  {getStatusLabel(order.status)}
                </span>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getPaymentBadgeColor(order.paymentStatus)}`}>
                  {getPaymentLabel(order.paymentStatus)}
                </span>
              </div>
            </div>
          </div>

          {/* Items List */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Daftar Pesanan</h3>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="card p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{item.name}</h4>
                      {item.notes && (
                        <p className="text-sm text-gray-500 mt-1">
                          <span className="font-medium">Catatan:</span> {item.notes}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getCategoryBadgeColor(item.category)}`}>
                        {getCategoryLabel(item.category)}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadgeColor(item.status)}`}>
                        {getStatusLabel(item.status)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Jumlah: {item.quantity}x</span>
                    <span className="font-semibold text-gray-900">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Status Info */}
          {order.status === 'ready' && !allItemsDone && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle size={20} className="text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-yellow-900 mb-1">Perhatian</h4>
                  <p className="text-sm text-yellow-800">
                    Beberapa item masih dalam proses. Pastikan semua item telah selesai sebelum menandai pesanan sebagai selesai.
                  </p>
                </div>
              </div>
            </div>
          )}

          {order.status === 'ready' && allItemsDone && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-green-900 mb-1">Siap Diantar</h4>
                  <p className="text-sm text-green-800">
                    Semua item telah selesai dibuat. Pesanan siap untuk diantar ke pelanggan.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Total */}
          <div className="border-t border-cream-200 pt-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold text-gray-700">Total Pembayaran</span>
              <span className="text-2xl font-bold text-primary-500">
                {formatCurrency(order.totalAmount)}
              </span>
            </div>

            {/* Action Button */}
            {canMarkAsComplete && (
              <button
                onClick={handleMarkAsComplete}
                className="w-full py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle size={20} />
                <span>Tandai Selesai</span>
              </button>
            )}

            {order.status === 'completed' && (
              <div className="text-center py-3 bg-gray-100 rounded-lg">
                <span className="text-gray-600 font-medium">Pesanan telah selesai</span>
              </div>
            )}

            {order.status === 'pending' && (
              <div className="text-center py-3 bg-yellow-100 rounded-lg">
                <span className="text-yellow-800 font-medium">Menunggu dapur memproses pesanan</span>
              </div>
            )}

            {order.status === 'processing' && (
              <div className="text-center py-3 bg-blue-100 rounded-lg">
                <span className="text-blue-800 font-medium">Pesanan sedang diproses dapur</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;