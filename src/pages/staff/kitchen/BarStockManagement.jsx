import { useState } from 'react';
import Sidebar, { useSidebar } from '../../../components/kitchen/Sidebar';
import StockHeader from '../../../components/kitchen/StockHeader';
import FilterBar from '../../../components/kitchen/FilterBar';
import StockCard from '../../../components/kitchen/StockCard';
import EmptyState from '../../../components/kitchen/EmptyState';

const initialBarStock = [
  { id: 'b1', name: 'Kopi Arabica', category: 'Kopi', stock: 15, unit: 'kg', minStock: 10, price: 125000 },
  { id: 'b2', name: 'Kopi Robusta', category: 'Kopi', stock: 8, unit: 'kg', minStock: 10, price: 95000 },
  { id: 'b3', name: 'Susu Full Cream', category: 'Dairy', stock: 35, unit: 'liter', minStock: 20, price: 18000 },
  { id: 'b4', name: 'Susu Almond', category: 'Dairy', stock: 12, unit: 'liter', minStock: 8, price: 45000 },
  { id: 'b5', name: 'Teh Hitam Premium', category: 'Teh', stock: 6, unit: 'kg', minStock: 8, price: 85000 },
  { id: 'b6', name: 'Teh Hijau', category: 'Teh', stock: 4, unit: 'kg', minStock: 5, price: 95000 },
  { id: 'b7', name: 'Gula Pasir', category: 'Pemanis', stock: 25, unit: 'kg', minStock: 15, price: 14000 },
  { id: 'b8', name: 'Gula Aren', category: 'Pemanis', stock: 8, unit: 'kg', minStock: 10, price: 32000 },
  { id: 'b9', name: 'Sirup Vanila', category: 'Sirup', stock: 18, unit: 'botol', minStock: 12, price: 45000 },
  { id: 'b10', name: 'Sirup Hazelnut', category: 'Sirup', stock: 15, unit: 'botol', minStock: 12, price: 48000 },
  { id: 'b11', name: 'Sirup Caramel', category: 'Sirup', stock: 20, unit: 'botol', minStock: 12, price: 45000 },
  { id: 'b12', name: 'Whipped Cream', category: 'Topping', stock: 10, unit: 'kaleng', minStock: 15, price: 35000 },
  { id: 'b13', name: 'Cokelat Bubuk', category: 'Topping', stock: 5, unit: 'kg', minStock: 8, price: 65000 },
  { id: 'b14', name: 'Es Batu', category: 'Es & Frozen', stock: 50, unit: 'kg', minStock: 30, price: 5000 },
  { id: 'b15', name: 'Jus Jeruk Segar', category: 'Jus', stock: 8, unit: 'liter', minStock: 10, price: 25000 },
  { id: 'b16', name: 'Jus Lemon', category: 'Jus', stock: 6, unit: 'liter', minStock: 8, price: 28000 }
];

const BarStockManagement = () => {
  const [stockItems, setStockItems] = useState(initialBarStock);
  const [categoryFilter, setCategoryFilter] = useState('all');
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

  const categories = ['all', ...new Set(stockItems.map(item => item.category))];
  
  const filteredItems = stockItems.filter(item => {
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
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
      <Sidebar stationType="bar" />
      
      <div className={`
        flex-1 overflow-auto transition-all duration-300
        ${isCollapsed ? 'lg:ml-0' : 'lg:ml-64'}
      `}>
        <div className="mt-16 lg:mt-0">
          <StockHeader
            title="Manajemen Stok Bar"
            subtitle="Kelola inventori bahan minuman dan kopi"
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
              categories={categories}
              selectedCategory={categoryFilter}
              onCategoryChange={setCategoryFilter}
            />

            {filteredItems.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

export default BarStockManagement;