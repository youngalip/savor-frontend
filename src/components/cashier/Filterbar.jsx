import { Filter } from 'lucide-react';

const FilterBar = ({ 
  selectedCategory, 
  onCategoryChange, 
  selectedTable, 
  onTableChange,
  selectedPaymentStatus,
  onPaymentStatusChange,
  showPaymentFilter = false,
  showDateFilter = false,
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange
}) => {
  const categories = ['all', 'Kitchen', 'Bar', 'Pastry'];
  const tables = ['all', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
  const paymentStatuses = [
    { value: 'all', label: 'Semua Pembayaran' },
    { value: 'Pending', label: 'Belum Lunas' },
    { value: 'Paid', label: 'Sudah Lunas' }
  ];

  const getCategoryLabel = (category) => {
    return category === 'all' ? 'Semua Kategori' : category;
  };

  const getTableLabel = (table) => {
    return table === 'all' ? 'Semua Meja' : `Meja ${table}`;
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter size={20} className="text-gray-600" />
        <h3 className="font-semibold text-gray-900">Filter Pesanan</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kategori
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8b1538] focus:border-transparent transition-all"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {getCategoryLabel(category)}
              </option>
            ))}
          </select>
        </div>

        {/* Table Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Meja
          </label>
          <select
            value={selectedTable}
            onChange={(e) => onTableChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8b1538] focus:border-transparent transition-all"
          >
            {tables.map((table) => (
              <option key={table} value={table}>
                {getTableLabel(table)}
              </option>
            ))}
          </select>
        </div>

        {/* Payment Status Filter (Conditional) */}
        {showPaymentFilter && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status Pembayaran
            </label>
            <select
              value={selectedPaymentStatus}
              onChange={(e) => onPaymentStatusChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8b1538] focus:border-transparent transition-all"
            >
              {paymentStatuses.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Date Filter (Conditional) */}
        {showDateFilter && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dari Tanggal
              </label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => onDateFromChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8b1538] focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sampai Tanggal
              </label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => onDateToChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8b1538] focus:border-transparent transition-all"
              />
            </div>
          </>
        )}
      </div>

      {/* Active Filters Summary */}
      <div className="mt-4 flex flex-wrap gap-2">
        {selectedCategory !== 'all' && (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">
            Kategori: {selectedCategory}
            <button
              onClick={() => onCategoryChange('all')}
              className="hover:bg-orange-200 rounded-full p-0.5"
            >
              ✕
            </button>
          </span>
        )}
        {selectedTable !== 'all' && (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
            Meja {selectedTable}
            <button
              onClick={() => onTableChange('all')}
              className="hover:bg-blue-200 rounded-full p-0.5"
            >
              ✕
            </button>
          </span>
        )}
        {showPaymentFilter && selectedPaymentStatus !== 'all' && (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
            {selectedPaymentStatus === 'Paid' ? 'Sudah Lunas' : 'Belum Lunas'}
            <button
              onClick={() => onPaymentStatusChange('all')}
              className="hover:bg-green-200 rounded-full p-0.5"
            >
              ✕
            </button>
          </span>
        )}
      </div>
    </div>
  );
};

export default FilterBar;