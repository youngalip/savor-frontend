import { useState } from 'react';
import Sidebar, { useSidebar } from '../../../components/kitchen/Sidebar';
import StockHeader from '../../../components/kitchen/StockHeader';
import FilterBar from '../../../components/kitchen/FilterBar';
import StockCard from '../../../components/kitchen/StockCard';
import EmptyState from '../../../components/kitchen/EmptyState';

const initialPastryStock = [
  { id: 'p1', name: 'Tepung Terigu Protein Tinggi', category: 'Tepung', stock: 35, unit: 'kg', minStock: 20, price: 12000 },
  { id: 'p2', name: 'Tepung Terigu Protein Rendah', category: 'Tepung', stock: 18, unit: 'kg', minStock: 15, price: 11000 },
  { id: 'p3', name: 'Tepung Maizena', category: 'Tepung', stock: 8, unit: 'kg', minStock: 10, price: 15000 },
  { id: 'p4', name: 'Gula Pasir Halus', category: 'Pemanis', stock: 40, unit: 'kg', minStock: 25, price: 14000 },
  { id: 'p5', name: 'Gula Halus (Icing Sugar)', category: 'Pemanis', stock: 12, unit: 'kg', minStock: 10, price: 18000 },
  { id: 'p6', name: 'Butter Unsalted', category: 'Dairy', stock: 15, unit: 'kg', minStock: 12, price: 85000 },
  { id: 'p7', name: 'Butter Salted', category: 'Dairy', stock: 8, unit: 'kg', minStock: 10, price: 82000 },
  { id: 'p8', name: 'Cream Cheese', category: 'Dairy', stock: 6, unit: 'kg', minStock: 8, price: 95000 },
  { id: 'p9', name: 'Telur Ayam', category: 'Protein', stock: 180, unit: 'butir', minStock: 120, price: 2500 },
  { id: 'p10', name: 'Cokelat Blok Dark', category: 'Cokelat', stock: 10, unit: 'kg', minStock: 8, price: 125000 },
  { id: 'p11', name: 'Cokelat Blok White', category: 'Cokelat', stock: 5, unit: 'kg', minStock: 6, price: 135000 },
  { id: 'p12', name: 'Cokelat Chips', category: 'Cokelat', stock: 8, unit: 'kg', minStock: 10, price: 95000 },
  { id: 'p13', name: 'Vanilla Extract', category: 'Perasa', stock: 15, unit: 'botol', minStock: 10, price: 45000 },
  { id: 'p14', name: 'Baking Powder', category: 'Pengembang', stock: 6, unit: 'kg', minStock: 8, price: 35000 },
  { id: 'p15', name: 'Baking Soda', category: 'Pengembang', stock: 4, unit: 'kg', minStock: 5, price: 28000 },
  { id: 'p16', name: 'Heavy Cream', category: 'Dairy', stock: 20, unit: 'liter', minStock: 15, price: 45000 },
  { id: 'p17', name: 'Strawberry Topping', category: 'Topping', stock: 12, unit: 'botol', minStock: 10, price: 35000 },
  { id: 'p18', name: 'Almond Slice', category: 'Kacang', stock: 5, unit: 'kg', minStock: 8, price: 125000 }
];

const PastryStockManagement = () => {
  const [stockItems, setStockItems] = useState(initialPastryStock);
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
      <Sidebar stationType="pastry" />
      
      <div className={`
        flex-1 overflow-auto transition-all duration-300
        ${isCollapsed ? 'lg:ml-0' : 'lg:ml-64'}
      `}>
        <div className="mt-16 lg:mt-0">
          <StockHeader
            title="Manajemen Stok Pastry"
            subtitle="Kelola inventori bahan kue dan dessert"
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

export default PastryStockManagement;