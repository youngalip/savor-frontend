// src/components/owner/reports/MenuPerformanceTable.jsx
import { Medal, TrendingUp, Package } from 'lucide-react';

/**
 * Menu Performance Table Component
 * Shows top selling menus with rankings
 */
const MenuPerformanceTable = ({ data, loading = false }) => {
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Get medal color based on rank
  const getMedalColor = (index) => {
    if (index === 0) return 'text-yellow-500 bg-yellow-50'; // Gold
    if (index === 1) return 'text-gray-400 bg-gray-50'; // Silver
    if (index === 2) return 'text-orange-600 bg-orange-50'; // Bronze
    return 'text-gray-300 bg-gray-50';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Menu Terlaris</h2>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg animate-pulse">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="w-32 h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="w-48 h-3 bg-gray-200 rounded"></div>
                </div>
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
        <h2 className="text-lg font-bold text-gray-900 mb-4">Menu Terlaris</h2>
        <div className="text-center py-8 text-gray-500">
          <Package size={48} className="mx-auto mb-4 text-gray-400" />
          <p>Tidak ada data menu untuk periode ini</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Menu Terlaris</h2>
      <div className="space-y-3">
        {data.map((item, index) => (
          <div
            key={item.menu_id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-3 flex-1">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getMedalColor(index)}`}>
                {index < 3 ? (
                  <Medal size={20} className={getMedalColor(index).split(' ')[0]} />
                ) : (
                  <span className="text-sm font-bold text-gray-600">#{index + 1}</span>
                )}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{item.name}</p>
                <p className="text-sm text-gray-500">
                  {item.category} • {item.quantity_sold} terjual
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-primary-600">
                {formatCurrency(item.revenue)}
              </p>
              <p className="text-xs text-gray-500">
                @{formatCurrency(item.avg_price || (item.revenue / item.quantity_sold))}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuPerformanceTable;