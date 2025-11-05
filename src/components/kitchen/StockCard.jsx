const StockCard = ({ item, onStockChange }) => {
  const getStockStatus = (stock, minStock) => {
    const percentage = (stock / minStock) * 100;
    if (percentage <= 50) return 'critical';
    if (percentage <= 100) return 'low';
    return 'safe';
  };

  const status = getStockStatus(item.stock, item.minStock);
  
  const statusConfig = {
    critical: {
      badge: 'bg-red-50 text-red-700 border-red-200',
      label: 'Kritis',
      icon: '🔴'
    },
    low: {
      badge: 'bg-orange-50 text-orange-700 border-orange-200',
      label: 'Rendah',
      icon: '🟠'
    },
    safe: {
      badge: 'bg-green-50 text-green-700 border-green-200',
      label: 'Aman',
      icon: '🟢'
    }
  };

  const config = statusConfig[status];

  return (
    <div className="card p-4 hover:shadow-md transition-shadow">
      {/* Header Section */}
      <div className="flex items-start justify-between mb-3 gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 text-base mb-1 truncate">{item.name}</h3>
          <p className="text-xs text-gray-500 truncate">{item.category}</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${config.badge} flex items-center gap-1 whitespace-nowrap shrink-0`}>
          <span>{config.icon}</span>
          {config.label}
        </span>
      </div>

      {/* Stock Section - Inline Layout */}
      <div className="p-3 bg-cream-50 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-700">Stok Saat Ini</span>
          <span className="text-xs text-gray-500">Min: {item.minStock} {item.unit}</span>
        </div>
        
        {/* Stock Display & Control in One Line */}
        <div className="flex items-center justify-between gap-3">
          {/* Left: Display Stock */}
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-gray-900">{item.stock}</span>
            <span className="text-sm text-gray-600">{item.unit}</span>
          </div>
          
          {/* Right: Stock Control */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => item.stock > 0 && onStockChange(item.id, item.stock - 1)}
              disabled={item.stock === 0}
              className="w-9 h-9 flex items-center justify-center bg-red-500 hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors text-lg shrink-0"
            >
              −
            </button>
            
            <input
              type="number"
              value={item.stock}
              onChange={(e) => {
                const value = parseInt(e.target.value) || 0;
                if (value >= 0) onStockChange(item.id, value);
              }}
              min="0"
              className="w-16 h-9 px-2 text-center text-base font-semibold border-2 border-cream-200 rounded-lg focus:border-primary-500 focus:outline-none shrink-0"
            />
            
            <button
              onClick={() => onStockChange(item.id, item.stock + 1)}
              className="w-9 h-9 flex items-center justify-center bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition-colors text-lg shrink-0"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockCard;