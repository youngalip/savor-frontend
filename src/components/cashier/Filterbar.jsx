import { useState } from 'react';
import { Filter, X } from 'lucide-react';

const FilterBar = ({ 
  onFilterChange, 
  showCategoryFilter = true, 
  showTableFilter = true,
  showDateFilter = false 
}) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTable, setSelectedTable] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    { value: 'all', label: 'Semua Kategori' },
    { value: 'kitchen', label: 'Kitchen' },
    { value: 'bar', label: 'Bar' },
    { value: 'pastry', label: 'Pastry' }
  ];

  const tables = [
    { value: 'all', label: 'Semua Meja' },
    ...Array.from({ length: 10 }, (_, i) => ({
      value: (i + 1).toString(),
      label: `Meja ${i + 1}`
    }))
  ];

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    onFilterChange({ category: value, table: selectedTable, dateRange });
  };

  const handleTableChange = (value) => {
    setSelectedTable(value);
    onFilterChange({ category: selectedCategory, table: value, dateRange });
  };

  const handleDateChange = (type, value) => {
    const newDateRange = { ...dateRange, [type]: value };
    setDateRange(newDateRange);
    onFilterChange({ category: selectedCategory, table: selectedTable, dateRange: newDateRange });
  };

  const clearFilters = () => {
    setSelectedCategory('all');
    setSelectedTable('all');
    setDateRange({ start: '', end: '' });
    onFilterChange({ category: 'all', table: 'all', dateRange: { start: '', end: '' } });
  };

  const hasActiveFilters = selectedCategory !== 'all' || selectedTable !== 'all' || dateRange.start || dateRange.end;

  return (
    <div className="bg-white border-b border-cream-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 bg-cream-50 hover:bg-cream-100 rounded-lg transition-colors"
        >
          <Filter size={18} />
          <span className="font-medium">Filter</span>
          {hasActiveFilters && (
            <span className="ml-2 px-2 py-0.5 bg-primary-500 text-white text-xs rounded-full">
              Active
            </span>
          )}
        </button>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-cream-50 rounded-lg transition-colors"
          >
            <X size={18} />
            <span className="text-sm">Clear Filters</span>
          </button>
        )}
      </div>

      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-cream-200">
          {showCategoryFilter && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kategori
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full px-4 py-2 border border-cream-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {showTableFilter && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nomor Meja
              </label>
              <select
                value={selectedTable}
                onChange={(e) => handleTableChange(e.target.value)}
                className="w-full px-4 py-2 border border-cream-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {tables.map((table) => (
                  <option key={table.value} value={table.value}>
                    {table.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {showDateFilter && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tanggal Mulai
                </label>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => handleDateChange('start', e.target.value)}
                  className="w-full px-4 py-2 border border-cream-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tanggal Akhir
                </label>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => handleDateChange('end', e.target.value)}
                  className="w-full px-4 py-2 border border-cream-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterBar;