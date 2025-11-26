// src/components/owner/reports/PaymentMethodsCard.jsx
import { CreditCard, Wallet, Banknote } from 'lucide-react';

/**
 * Payment Methods Card Component
 * Shows payment method breakdown with icons
 */
const PaymentMethodsCard = ({ data, loading = false }) => {
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Get icon for payment method
  const getPaymentIcon = (method) => {
    const lowerMethod = method.toLowerCase();
    if (lowerMethod.includes('cash') || lowerMethod.includes('tunai')) {
      return <Banknote size={20} className="text-green-600" />;
    }
    if (lowerMethod.includes('qris') || lowerMethod.includes('wallet') || lowerMethod.includes('ewallet')) {
      return <Wallet size={20} className="text-blue-600" />;
    }
    return <CreditCard size={20} className="text-purple-600" />;
  };

  // Get color for payment method
  const getPaymentColor = (method) => {
    const lowerMethod = method.toLowerCase();
    if (lowerMethod.includes('cash') || lowerMethod.includes('tunai')) {
      return 'bg-green-100 text-green-800 border-green-200';
    }
    if (lowerMethod.includes('qris') || lowerMethod.includes('wallet') || lowerMethod.includes('ewallet')) {
      return 'bg-blue-100 text-blue-800 border-blue-200';
    }
    return 'bg-purple-100 text-purple-800 border-purple-200';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Metode Pembayaran</h2>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg animate-pulse">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="w-24 h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="w-32 h-3 bg-gray-200 rounded"></div>
                </div>
              </div>
              <div className="w-20 h-4 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Metode Pembayaran</h2>
        <div className="text-center py-8 text-gray-500">
          <CreditCard size={48} className="mx-auto mb-4 text-gray-400" />
          <p>Tidak ada data pembayaran</p>
        </div>
      </div>
    );
  }

  // Calculate total
  const total = data.reduce((sum, method) => sum + method.revenue, 0);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Metode Pembayaran</h2>
      <div className="space-y-3">
        {data.map((method) => {
          const percentage = total > 0 ? (method.revenue / total * 100) : 0;
          
          return (
            <div
              key={method.method}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${getPaymentColor(method.method)}`}>
                  {getPaymentIcon(method.method)}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{method.method}</p>
                  <p className="text-sm text-gray-500">
                    {method.count} transaksi • {percentage.toFixed(1)}%
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-primary-600">
                  {formatCurrency(method.revenue)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Total */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-700">
            Total ({data.reduce((sum, m) => sum + m.count, 0)} transaksi)
          </span>
          <span className="text-base font-bold text-gray-900">
            {formatCurrency(total)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodsCard;