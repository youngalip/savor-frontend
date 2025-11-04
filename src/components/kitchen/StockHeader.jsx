import { Package, AlertTriangle, TrendingUp } from 'lucide-react';

const StockHeader = ({ title, subtitle, stats }) => {
  const { totalItems, criticalItems, lowStockItems, totalValue } = stats;

  return (
    <div className="bg-white border-b border-cream-200 px-8 py-6 sticky top-0 z-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-500 mt-1">{subtitle}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center">
              <Package className="text-white" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Item</p>
              <p className="text-2xl font-bold text-gray-900">{totalItems}</p>
            </div>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
              <AlertTriangle className="text-white" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Stok Kritis</p>
              <p className="text-2xl font-bold text-gray-900">{criticalItems}</p>
            </div>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
              <AlertTriangle className="text-white" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Stok Rendah</p>
              <p className="text-2xl font-bold text-gray-900">{lowStockItems}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockHeader;