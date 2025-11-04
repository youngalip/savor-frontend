import { useState } from 'react';
import Sidebar, { useSidebar } from '../../../components/kitchen/Sidebar';
import StockHeader from '../../../components/kitchen/StockHeader';
import FilterBar from '../../../components/kitchen/FilterBar';
import StockCard from '../../../components/kitchen/StockCard';
import EmptyState from '../../../components/kitchen/EmptyState';

// Dummy data untuk stok menu (bukan bahan mentah)
const initialKitchenStock = [
  { id: 'm1', name: 'Nasi Goreng Spesial', subcategory: 'Mains', stock: 12, minStock: 5, price: 35000 },
  { id: 'm2', name: 'Mie Goreng Seafood', subcategory: 'Mains', stock: 8, minStock: 5, price: 38000 },
  { id: 'm3', name: 'Chicken Wings BBQ', subcategory: 'Bites', stock: 15, minStock: 8, price: 28000 },
  { id: 'm4', name: 'French Fries', subcategory: 'Bites', stock: 25, minStock: 10, price: 18000 },
  { id: 'm5', name: 'Ayam Geprek Sambal Matah', subcategory: 'Mains', stock: 10, minStock: 6, price: 42000 },
  { id: 'm6', name: 'Tahu Crispy', subcategory: 'Bites', stock: 18, minStock: 10, price: 15000 },
  { id: 'm7', name: 'Pasta Aglio Olio', subcategory: 'Mains', stock: 9, minStock: 5, price: 45000 },
  { id: 'm8', name: 'Chicken Katsu', subcategory: 'Mains', stock: 5, minStock: 8, price: 40000 },
  { id: 'm9', name: 'Spring Rolls', subcategory: 'Bites', stock: 6, minStock: 5, price: 22000 },
  { id: 'm10', name: 'Beef Teriyaki Rice Bowl', subcategory: 'Mains', stock: 4, minStock: 6, price: 48000 }
];

const KitchenStockManagement = () => {
  const [stockItems, setStockItems] = useState(initialKitchenStock);
  const [subcategoryFilter, setSubcategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { isCollapsed } = useSidebar();

  const handleStockChange = (itemId, newStock) => {
    setStockItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, stock: newStock } : item
      )
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStockStatus = (stock, minStock) => {
    const percentage = (stock / minStock) * 100;
    if (percentage <= 50) return 'critical';
    if (percentage <= 100) return 'low';
    return 'safe';
  };

  // Ambil daftar subcategory unik
  const subcategories = ['all', ...new Set(stockItems.map(item => item.subcategory))];
  
  // Filtering berdasarkan subcategory & pencarian
  const filteredItems = stockItems.filter(item => {
    const matchesSubcategory = subcategoryFilter === 'all' || item.subcategory === subcategoryFilter;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubcategory && matchesSearch;
  });

  const totalItems = stockItems.length;
  const criticalItems = stockItems.filter(item => 
    getStockStatus(item.stock, item.minStock) === 'critical'
  ).length;
  const lowStockItems = stockItems.filter(item => {
    const status = getStockStatus(item.stock, item.minStock);
    return status === 'critical' || status === 'low';
  }).length;
  const totalValue = formatCurrency(
    stockItems.reduce((sum, item) => sum + (item.stock * item.price), 0)
  );

  return (
    <div className="flex min-h-screen bg-cream-50">
      <Sidebar stationType="kitchen" />
      
      <div className={`
        flex-1 overflow-auto transition-all duration-300
        ${isCollapsed ? 'lg:ml-0' : 'lg:ml-64'}
      `}>
        <div className="mt-16 lg:mt-0">
          <StockHeader
            title="Manajemen Stok Menu Kitchen"
            subtitle="Kelola stok menu makanan untuk dapur utama"
            stats={{
              totalItems,
              criticalItems,
              lowStockItems,
              totalValue
            }}
          />

          <div className="p-8">
            <FilterBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              categories={subcategories}
              selectedCategory={subcategoryFilter}
              onCategoryChange={setSubcategoryFilter}
            />

            {filteredItems.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredItems.map(item => (
                  <StockCard
                    key={item.id}
                    item={item}
                    onStockChange={handleStockChange}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KitchenStockManagement;
