// src/components/owner/reports/CategoryBreakdownCard.jsx
import { PieChart } from 'lucide-react';

/**
 * Category Breakdown Card Component
 * Shows revenue breakdown by category with percentage bars
 */
const CategoryBreakdownCard = ({ data, loading = false }) => {
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Color mapping for categories
  const getCategoryColor = (category) => {
    const colors = {
      'Kitchen': 'bg-red-500',
      'Bar': 'bg-teal-500',
      'Pastry': 'bg-yellow-500'
    };
    return colors[category] || 'bg-gray-500';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Breakdown Kategori</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center justify-between mb-2">
                <div className="w-24 h-4 bg-gray-200 rounded"></div>
                <div className="w-16 h-4 bg-gray-200 rounded"></div>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded"></div>
              <div className="w-20 h-3 bg-gray-200 rounded mt-1"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Breakdown Kategori</h2>
        <div className="text-center py-8 text-gray-500">
          <PieChart size={48} className="mx-auto mb-4 text-gray-400" />
          <p>Tidak ada data kategori</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Breakdown Kategori</h2>
      <div className="space-y-4">
        {data.map((cat) => (
          <div key={cat.category}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${getCategoryColor(cat.category)}`}></div>
                <span className="text-sm font-semibold text-gray-900">{cat.category}</span>
              </div>
              <span className="text-sm font-bold text-primary-600">
                {cat.percentage.toFixed(1)}%
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
              <div 
                className={`h-2.5 rounded-full ${getCategoryColor(cat.category)}`}
                style={{ width: `${cat.percentage}%` }}
              ></div>
            </div>
            
            <p className="text-xs text-gray-600">
              {formatCurrency(cat.revenue)}
            </p>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-700">Total Revenue</span>
          <span className="text-base font-bold text-gray-900">
            {formatCurrency(data.reduce((sum, cat) => sum + cat.revenue, 0))}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CategoryBreakdownCard;