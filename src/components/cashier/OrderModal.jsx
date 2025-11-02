import { X, Clock, User, CreditCard, CheckCircle, XCircle } from 'lucide-react';

const OrderModal = ({ 
  order, 
  onClose, 
  onValidatePayment, 
  onMarkCompleted,
  isCompleting = false
}) => {
  if (!order) return null;

    console.log('📋 OrderModal Props:', {
    hasOrder: !!order,
    hasOnClose: !!onClose,
    hasOnValidatePayment: !!onValidatePayment,
    hasOnMarkCompleted: !!onMarkCompleted,  // ← Key check!
    isCompleting
  });

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('id-ID', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  };

  // Get status badge color - V5: No "processing"
  const getStatusColor = (status) => {
    const colors = {
      'unpaid': 'bg-red-100 text-red-800 border-red-200',
      'pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'ready': 'bg-green-100 text-green-800 border-green-200',
      'completed': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  // Get status label - V5: No "processing"
  const getStatusLabel = (status) => {
    const labels = {
      'unpaid': 'Belum Bayar',
      'pending': 'Sedang Diproses',
      'ready': 'Siap Diantar',
      'completed': 'Selesai'
    };
    return labels[status] || 'Unknown';
  };

  // Get payment status badge
  const getPaymentStatusBadge = (status) => {
    if (status === 'Paid') {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 border border-green-200 rounded-full text-sm font-medium">
          <CheckCircle size={14} />
          Sudah Lunas
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 border border-red-200 rounded-full text-sm font-medium">
        <XCircle size={14} />
        Belum Lunas
      </span>
    );
  };

  // Get item status badge - V5: Only Pending and Done
  const getItemStatusBadge = (status) => {
    const badges = {
      'Pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Done': 'bg-green-100 text-green-800 border-green-200'
    };
    return badges[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  // Group items by category
  const groupedItems = order.items.reduce((acc, item) => {
    const category = item.category || 'Lainnya';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {});

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-[#8b1538] text-white p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold mb-2">Detail Pesanan</h2>
              <p className="text-[#fefcf9] opacity-90">#{order.order_number}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)] p-6">
          {/* Order Info */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-[#8b1538]/10 p-3 rounded-lg">
                <Clock size={20} className="text-[#8b1538]" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Waktu Pesan</p>
                <p className="font-semibold">{formatDate(order.order_time)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-[#8b1538]/10 p-3 rounded-lg">
                <User size={20} className="text-[#8b1538]" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Meja</p>
                <p className="font-semibold">Meja {order.table_number}</p>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          {order.customer_name && (
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <p className="text-sm text-gray-600 mb-1">Customer</p>
              <p className="font-semibold text-gray-900">{order.customer_name}</p>
              {order.customer_email && (
                <p className="text-sm text-gray-600">{order.customer_email}</p>
              )}
            </div>
          )}

          {/* Status Badges */}
          <div className="flex gap-3 mb-6">
            <div>
              <p className="text-xs text-gray-600 mb-2">Status Pesanan</p>
              <span className={`inline-block px-4 py-2 border rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                {getStatusLabel(order.status)}
              </span>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-2">Status Pembayaran</p>
              {getPaymentStatusBadge(order.payment_status)}
            </div>
          </div>

          {/* Items by Category */}
          <div className="mb-6">
            <h3 className="font-bold text-lg mb-4">Detail Item</h3>
            {Object.entries(groupedItems).map(([category, items]) => (
              <div key={category} className="mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-px flex-1 bg-gray-200"></div>
                  <h4 className="font-semibold text-gray-700 px-3">{category}</h4>
                  <div className="h-px flex-1 bg-gray-200"></div>
                </div>
                <div className="space-y-2">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <p className="font-medium text-gray-900">{item.name}</p>
                          <span className={`px-2 py-1 border rounded-full text-xs font-medium ${getItemStatusBadge(item.status)}`}>
                            {item.status === 'Pending' ? 'Pending' : 'Selesai'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {item.quantity}x {formatCurrency(item.price)}
                        </p>
                        {item.notes && (
                          <p className="text-sm text-gray-500 italic mt-1">
                            Note: {item.notes}
                          </p>
                        )}
                      </div>
                      <p className="font-semibold text-gray-900">
                        {formatCurrency(item.subtotal)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Order Notes */}
          {order.notes && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-sm font-medium text-yellow-900 mb-1">Catatan Pesanan</p>
              <p className="text-sm text-yellow-800">{order.notes}</p>
            </div>
          )}

          {/* Payment Breakdown */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <CreditCard size={18} className="text-[#8b1538]" />
              Rincian Pembayaran
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">
                  Service Charge ({(order.service_charge_rate * 100).toFixed(0)}%)
                </span>
                <span className="font-medium">{formatCurrency(order.service_charge_amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">
                  PB1 ({(order.tax_rate * 100).toFixed(0)}%)
                </span>
                <span className="font-medium">{formatCurrency(order.tax_amount)}</span>
              </div>
              <div className="h-px bg-gray-300 my-2"></div>
              <div className="flex justify-between text-lg font-bold">
                <span className="text-gray-900">Total</span>
                <span className="text-[#8b1538]">{formatCurrency(order.total_amount)}</span>
              </div>
              <div className="flex justify-between text-sm pt-2">
                <span className="text-gray-600">Metode Pembayaran</span>
                <span className="font-medium">{order.payment_method}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 bg-gray-50 border-t border-gray-200">
          <div className="flex gap-3">
            {/* Show "Validasi Pembayaran" only if payment is pending */}
            {order.payment_status === 'Pending' && onValidatePayment && (
              <button
                onClick={() => onValidatePayment(order.id)}
                className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle size={20} />
                Validasi Pembayaran Cash
              </button>
            )}

            {/* Show "Tandai Selesai" only if status is ready and payment is done */}
            {order.status === 'ready' && order.payment_status === 'Paid' && onMarkCompleted && (
              <button
                onClick={() => {
                  console.log('🖱️ Tandai Selesai clicked!');
                  console.log('Order:', order.id, order.order_number, order.table_number);
                  // ✅ FIX: Pass all 3 required parameters
                  onMarkCompleted(order.id, order.order_number, order.table_number);
                }}
                disabled={isCompleting}
                className="flex-1 px-6 py-3 bg-[#8b1538] hover:bg-[#6d1029] text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isCompleting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Memproses...
                  </>
                ) : (
                  <>
                    <CheckCircle size={20} />
                    Tandai Selesai
                  </>
                )}
              </button>
            )}

            {/* Close button */}
            <button
              onClick={onClose}
              disabled={isCompleting}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;