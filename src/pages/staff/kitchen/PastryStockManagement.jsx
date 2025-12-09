import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { RefreshCw, WifiOff } from 'lucide-react';
import Sidebar, { useSidebar } from '../../../components/kitchen/Sidebar';
import StockHeader from '../../../components/kitchen/StockHeader';
import FilterBar from '../../../components/kitchen/FilterBar';
import StockCard from '../../../components/kitchen/StockCard';
import EmptyState from '../../../components/kitchen/EmptyState';
import { kitchenApi } from '../../../services/kitchenApi';
import { transformBackendMenus } from '../../../utils/kitchenTransformer';

const PastryStockManagement = () => {
  const queryClient = useQueryClient();
  const [subcategoryFilter, setSubcategoryFilter] = useState('all'); // ✅ CHANGED: categoryFilter → subcategoryFilter
  const [searchQuery, setSearchQuery] = useState('');
  const { isCollapsed } = useSidebar();

  const stationType = 'pastry';

  // 🔥 FETCH MENUS
  const { 
    data: menusResponse, 
    isLoading, 
    isError,
    error,
    refetch,
    isFetching
  } = useQuery({
    queryKey: ['station-menus', stationType],
    queryFn: () => kitchenApi.getMenus(stationType),
    staleTime: 60000, // 1 menit
  });

  // Transform data dari backend
  const stockItems = transformBackendMenus(menusResponse) || [];

  // 🔥 MUTATION untuk update stock
  const updateStockMutation = useMutation({
    mutationFn: ({ menuId, stockData }) => 
      kitchenApi.updateMenuStock(stationType, menuId, stockData),
    onMutate: async ({ menuId, stockData }) => {
      await queryClient.cancelQueries(['station-menus', stationType]);
      const previousMenus = queryClient.getQueryData(['station-menus', stationType]);

      queryClient.setQueryData(['station-menus', stationType], (old) => {
        if (!old?.data?.data?.menus && !old?.data?.menus) return old;
        
        const menus = old?.data?.data?.menus || old?.data?.menus || [];
        const updatedMenus = menus.map(menu => 
          menu.id === menuId 
            ? { ...menu, ...stockData }
            : menu
        );

        if (old?.data?.data?.menus) {
          return {
            ...old,
            data: {
              ...old.data,
              data: {
                ...old.data.data,
                menus: updatedMenus
              }
            }
          };
        }
        
        return {
          ...old,
          data: {
            ...old.data,
            menus: updatedMenus
          }
        };
      });

      return { previousMenus };
    },
    onError: (err, variables, context) => {
      if (context?.previousMenus) {
        queryClient.setQueryData(['station-menus', stationType], context.previousMenus);
      }
      alert('Gagal update stok: ' + (err.response?.data?.message || err.message));
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['station-menus', stationType]);
    },
  });

  const handleStockChange = (itemId, newStock) => {
    updateStockMutation.mutate({ 
      menuId: itemId, 
      stockData: { stock_quantity: newStock } 
    });
  };

  // ✅ NEW: Handler untuk update availability
  const handleAvailabilityChange = (itemId, newAvailability) => {
    updateStockMutation.mutate({ 
      menuId: itemId, 
      stockData: { is_available: newAvailability } 
    });
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

  // ✅ CHANGED: Filter by subcategory instead of categoryName
  const subcategories = ['all', ...new Set(
    stockItems
      .map(item => item.subcategory)
      .filter(sub => sub) // Remove null/undefined
  )];
  
  // ✅ CHANGED: Filter logic menggunakan subcategory
  const filteredItems = stockItems.filter(item => {
    const matchesSubcategory = subcategoryFilter === 'all' || item.subcategory === subcategoryFilter;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubcategory && matchesSearch;
  });

  const totalItems = stockItems.length;
  const criticalItems = stockItems.filter(item => 
    getStockStatus(item.stockQuantity, item.minimumStock) === 'critical'
  ).length;
  const lowStockItems = stockItems.filter(item => {
    const status = getStockStatus(item.stockQuantity, item.minimumStock);
    return status === 'critical' || status === 'low';
  }).length;
  const totalValue = formatCurrency(0);

  // Loading State
  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-cream-50 items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
            <RefreshCw size={32} className="text-primary-600 animate-spin" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Memuat data stok...</h3>
          <p className="text-gray-500">Mohon tunggu sebentar</p>
        </div>
      </div>
    );
  }

  // Error State
  if (isError) {
    return (
      <div className="flex min-h-screen bg-cream-50 items-center justify-center">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <WifiOff size={32} className="text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Gagal Memuat Data</h3>
          <p className="text-gray-500 mb-4">
            {error?.response?.data?.message || error?.message || 'Terjadi kesalahan saat mengambil data'}
          </p>
          <button
            onClick={() => refetch()}
            className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-cream-50">
      <Sidebar stationType="pastry" />
      
      <div className={`
        flex-1 overflow-auto transition-all duration-300
        ${isCollapsed ? 'ml-16' : 'ml-64'}
      `}>
        <div className="mt-16 lg:mt-0">
          <StockHeader
            title="Manajemen Stok Pastry"
            subtitle="Kelola inventori menu kue dan dessert"
            stats={{
              totalItems,
              criticalItems,
              lowStockItems,
              totalValue
            }}
          />

          <div className="p-8">
            {/* ✅ CHANGED: Pass subcategories and subcategoryFilter */}
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map(item => (
                  <StockCard
                    key={item.id}
                    item={{
                      id: item.id,
                      name: item.name,
                      category: item.categoryName,
                      stock: item.stockQuantity,
                      minStock: item.minimumStock,
                      unit: 'porsi',
                      price: 0,
                      isAvailable: item.isAvailable 
                    }}
                    onStockChange={handleStockChange}
                    onAvailabilityChange={handleAvailabilityChange}
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