import { useState } from 'react';
import OwnerSidebar, { useOwnerSidebar } from '../../components/owner/OwnerSidebar';
import { 
  Plus,
  Edit2,
  Trash2,
  Search,
  X,
  AlertTriangle,
  Package,
  DollarSign,
  Eye,
  EyeOff
} from 'lucide-react';

// Dummy Categories Data
const initialCategories = [
  { id: 1, name: 'Makanan Utama', slug: 'main-course', is_active: true, display_order: 1, active_menus_count: 8 },
  { id: 2, name: 'Minuman', slug: 'beverages', is_active: true, display_order: 2, active_menus_count: 12 },
  { id: 3, name: 'Dessert', slug: 'dessert', is_active: true, display_order: 3, active_menus_count: 6 },
  { id: 4, name: 'Appetizer', slug: 'appetizer', is_active: true, display_order: 4, active_menus_count: 5 }
];

// Dummy Menus Data
const initialMenus = [
  {
    id: 1,
    name: 'Nasi Goreng Spesial',
    category_id: 1,
    category: { name: 'Makanan Utama' },
    price: 35000,
    description: 'Nasi goreng dengan telur, ayam, dan sayuran',
    image_url: null,
    is_available: true,
    stock_quantity: 50,
    minimum_stock: 10,
    display_order: 1
  },
  {
    id: 2,
    name: 'Ayam Bakar',
    category_id: 1,
    category: { name: 'Makanan Utama' },
    price: 45000,
    description: 'Ayam bakar dengan bumbu kecap manis',
    image_url: null,
    is_available: true,
    stock_quantity: 8,
    minimum_stock: 10,
    display_order: 2
  },
  {
    id: 3,
    name: 'Es Teh Manis',
    category_id: 2,
    category: { name: 'Minuman' },
    price: 8000,
    description: 'Es teh manis segar',
    image_url: null,
    is_available: true,
    stock_quantity: 100,
    minimum_stock: 20,
    display_order: 1
  },
  {
    id: 4,
    name: 'Kopi Susu',
    category_id: 2,
    category: { name: 'Minuman' },
    price: 18000,
    description: 'Kopi susu premium',
    image_url: null,
    is_available: true,
    stock_quantity: 45,
    minimum_stock: 15,
    display_order: 2
  },
  {
    id: 5,
    name: 'Chocolate Cake',
    category_id: 3,
    category: { name: 'Dessert' },
    price: 35000,
    description: 'Kue cokelat lembut dengan frosting',
    image_url: null,
    is_available: false,
    stock_quantity: 0,
    minimum_stock: 5,
    display_order: 1
  },
  {
    id: 6,
    name: 'French Fries',
    category_id: 4,
    category: { name: 'Appetizer' },
    price: 20000,
    description: 'Kentang goreng crispy',
    image_url: null,
    is_available: true,
    stock_quantity: 30,
    minimum_stock: 10,
    display_order: 1
  }
];

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
};

const getStockBadge = (menu) => {
  if (menu.stock_quantity === 0) {
    return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', label: 'Habis' };
  } else if (menu.stock_quantity <= menu.minimum_stock) {
    return { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', label: 'Stok Rendah' };
  } else {
    return { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', label: 'Tersedia' };
  }
};

// Menu Card Component
const MenuCard = ({ menu, onEdit, onDelete, onToggleAvailability }) => {
  const stockBadge = getStockBadge(menu);

  return (
    <div className="card p-5 hover:shadow-md transition-shadow">
      {/* Image Placeholder */}
      <div className="w-full h-40 bg-cream-100 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
        {menu.image_url ? (
          <img src={menu.image_url} alt={menu.name} className="w-full h-full object-cover" />
        ) : (
          <Package size={48} className="text-gray-400" />
        )}
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-1">{menu.name}</h3>
          <p className="text-xs text-gray-500">{menu.category.name}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(menu)}
            className="p-2 hover:bg-cream-50 rounded-lg transition-colors"
            title="Edit Menu"
          >
            <Edit2 size={16} className="text-gray-600" />
          </button>
          <button
            onClick={() => onDelete(menu.id)}
            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
            title="Hapus Menu"
          >
            <Trash2 size={16} className="text-red-600" />
          </button>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{menu.description}</p>

      {/* Price */}
      <div className="flex items-center gap-2 mb-3">
        <DollarSign size={16} className="text-primary-600" />
        <span className="text-lg font-bold text-primary-600">{formatCurrency(menu.price)}</span>
      </div>

      {/* Stock Info */}
      <div className="flex items-center justify-between mb-4 p-3 bg-cream-50 rounded-lg">
        <div>
          <p className="text-xs text-gray-500 mb-1">Stok Tersedia</p>
          <p className="text-lg font-bold text-gray-900">{menu.stock_quantity}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${stockBadge.bg} ${stockBadge.text} ${stockBadge.border}`}>
          {stockBadge.label}
        </span>
      </div>

      {/* Low Stock Warning */}
      {menu.stock_quantity > 0 && menu.stock_quantity <= menu.minimum_stock && (
        <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded-lg mb-3">
          <AlertTriangle size={14} className="text-yellow-600" />
          <p className="text-xs text-yellow-800">Stok di bawah minimum ({menu.minimum_stock})</p>
        </div>
      )}

      {/* Availability Toggle */}
      <button
        onClick={() => onToggleAvailability(menu.id)}
        className={`w-full py-2 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2 ${
          menu.is_available
            ? 'bg-green-50 text-green-700 hover:bg-green-100'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        {menu.is_available ? <Eye size={16} /> : <EyeOff size={16} />}
        <span>{menu.is_available ? 'Tersedia' : 'Tidak Tersedia'}</span>
      </button>
    </div>
  );
};

// Menu Form Modal
const MenuFormModal = ({ menu, categories, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: menu?.name || '',
    category_id: menu?.category_id || '',
    price: menu?.price || '',
    description: menu?.description || '',
    stock_quantity: menu?.stock_quantity || '',
    minimum_stock: menu?.minimum_stock || 10,
    is_available: menu?.is_available ?? true,
    display_order: menu?.display_order || 1
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.category_id || !formData.price) {
      alert('Mohon lengkapi semua field yang wajib diisi');
      return;
    }

    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 my-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {menu ? 'Edit Menu' : 'Tambah Menu Baru'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Menu <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kategori <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              >
                <option value="">Pilih Kategori</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Harga <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>

            {/* Stock Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stok Tersedia <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                value={formData.stock_quantity}
                onChange={(e) => setFormData({ ...formData, stock_quantity: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>

            {/* Minimum Stock */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Stok
              </label>
              <input
                type="number"
                min="0"
                value={formData.minimum_stock}
                onChange={(e) => setFormData({ ...formData, minimum_stock: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deskripsi
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Display Order */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Urutan Tampil
              </label>
              <input
                type="number"
                min="1"
                value={formData.display_order}
                onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Availability */}
            <div className="flex items-center">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_available}
                  onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
                  className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="ml-3 text-sm font-medium text-gray-700">Tersedia untuk dijual</span>
              </label>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main Component
const MenuManagement = () => {
  const { isCollapsed } = useOwnerSidebar();
  const [menus, setMenus] = useState(initialMenus);
  const [categories] = useState(initialCategories);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStock, setFilterStock] = useState('all');
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingMenu, setEditingMenu] = useState(null);

  const filteredMenus = menus.filter(menu => {
    const matchSearch = menu.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = filterCategory === 'all' || menu.category_id === parseInt(filterCategory);
    
    let matchStock = true;
    if (filterStock === 'available') {
      matchStock = menu.stock_quantity > menu.minimum_stock;
    } else if (filterStock === 'low') {
      matchStock = menu.stock_quantity > 0 && menu.stock_quantity <= menu.minimum_stock;
    } else if (filterStock === 'out') {
      matchStock = menu.stock_quantity === 0;
    }

    return matchSearch && matchCategory && matchStock;
  });

  const stats = {
    total: menus.length,
    available: menus.filter(m => m.is_available && m.stock_quantity > 0).length,
    lowStock: menus.filter(m => m.stock_quantity > 0 && m.stock_quantity <= m.minimum_stock).length,
    outOfStock: menus.filter(m => m.stock_quantity === 0).length
  };

  const handleEdit = (menu) => {
    setEditingMenu(menu);
    setShowFormModal(true);
  };

  const handleDelete = (id) => {
    const menu = menus.find(m => m.id === id);
    if (window.confirm(`Apakah Anda yakin ingin menghapus menu "${menu.name}"?`)) {
      setMenus(menus.filter(m => m.id !== id));
    }
  };

  const handleToggleAvailability = (id) => {
    setMenus(menus.map(m =>
      m.id === id ? { ...m, is_available: !m.is_available } : m
    ));
  };

  const handleSaveMenu = (formData) => {
    if (editingMenu) {
      setMenus(menus.map(m =>
        m.id === editingMenu.id
          ? { ...m, ...formData, category: categories.find(c => c.id === formData.category_id) }
          : m
      ));
    } else {
      const newMenu = {
        id: Math.max(...menus.map(m => m.id), 0) + 1,
        ...formData,
        category: categories.find(c => c.id === formData.category_id),
        image_url: null
      };
      setMenus([...menus, newMenu]);
    }
    setShowFormModal(false);
    setEditingMenu(null);
  };

  return (
    <div className="flex min-h-screen bg-cream-50">
      <OwnerSidebar />
      
      <div className={`
        flex-1 transition-all duration-300
        ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'}
      `}>
        <div className="p-8 mt-16 lg:mt-0">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manajemen Menu</h1>
              <p className="text-gray-600 mt-1">Kelola menu dan stok produk restaurant</p>
            </div>
            <button 
              onClick={() => {
                setEditingMenu(null);
                setShowFormModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              <Plus size={18} />
              <span>Tambah Menu</span>
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="card p-4">
              <p className="text-sm text-gray-600 mb-1">Total Menu</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="card p-4">
              <p className="text-sm text-gray-600 mb-1">Tersedia</p>
              <p className="text-2xl font-bold text-green-600">{stats.available}</p>
            </div>
            <div className="card p-4">
              <p className="text-sm text-gray-600 mb-1">Stok Rendah</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.lowStock}</p>
            </div>
            <div className="card p-4">
              <p className="text-sm text-gray-600 mb-1">Habis</p>
              <p className="text-2xl font-bold text-red-600">{stats.outOfStock}</p>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="card p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Cari menu..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">Semua Kategori</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Stock Filter */}
              <div>
                <select
                  value={filterStock}
                  onChange={(e) => setFilterStock(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">Semua Stok</option>
                  <option value="available">Stok Normal</option>
                  <option value="low">Stok Rendah</option>
                  <option value="out">Habis</option>
                </select>
              </div>
            </div>
          </div>

          {/* Menus Grid */}
          {filteredMenus.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-cream-100 rounded-full mb-4">
                <Package size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Tidak ada menu</h3>
              <p className="text-gray-500">Tidak ada menu dengan filter yang dipilih</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredMenus.map((menu) => (
                <MenuCard
                  key={menu.id}
                  menu={menu}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onToggleAvailability={handleToggleAvailability}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Form Modal */}
      {showFormModal && (
        <MenuFormModal
          menu={editingMenu}
          categories={categories}
          onClose={() => {
            setShowFormModal(false);
            setEditingMenu(null);
          }}
          onSave={handleSaveMenu}
        />
      )}
    </div>
  );
};

export default MenuManagement;