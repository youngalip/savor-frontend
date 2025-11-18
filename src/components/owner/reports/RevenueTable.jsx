// src/components/owner/reports/RevenueTable.jsx
import { Calendar } from 'lucide-react';

/**
 * Revenue Table Component
 * Shows daily breakdown of revenue, orders, customers
 */
const RevenueTable = ({ data, loading = false }) => {
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
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Breakdown Harian</h2>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg animate-pulse">
              <div className="flex-1">
                <div className="w-32 h-4 bg-gray-200 rounded mb-2"></div>
                <div className="w-48 h-3 bg-gray-200 rounded"></div>
              </div>
              <div className="w-24 h-4 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Breakdown Harian</h2>
        <div className="text-center py-8 text-gray-500">
          <Calendar size={48} className="mx-auto mb-4 text-gray-400" />
          <p>Tidak ada data untuk periode ini</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Breakdown Harian</h2>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {data.map((day) => (
          <div
            key={day.date}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex-1">
              <p className="font-semibold text-gray-900">
                {formatDate(day.date)}
              </p>
              <p className="text-sm text-gray-500">
                {day.orders} pesanan • {day.customers} pelanggan
              </p>
            </div>
            <div className="text-right">
              <p className="font-bold text-primary-600">
                {formatCurrency(day.revenue)}
              </p>
              <p className="text-xs text-gray-500">
                Avg: {formatCurrency(day.avg_order_value)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RevenueTable;