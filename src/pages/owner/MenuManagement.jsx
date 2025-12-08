// src/pages/owner/MenuManagement.jsx - PART 1: Components & Modals
import { useState, useEffect, useRef } from 'react';
import OwnerSidebar, { useOwnerSidebar } from '../../components/owner/OwnerSidebar';
import menuService from '../../services/menuAdminService';
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
  EyeOff,
  Upload,
  Loader,
  Image as ImageIcon
} from 'lucide-react';

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

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

// ============================================================================
// CUSTOM HOOKS
// ============================================================================

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// ============================================================================
// MENU CARD COMPONENT
// ============================================================================

const MenuCard = ({ menu, onEdit, onDelete, onToggleAvailability, onUploadImage }) => {
  const stockBadge = getStockBadge(menu);

  return (
    <div className="card p-5 hover:shadow-md transition-shadow flex flex-col h-full">
      {/* Image */}
      <div className="relative w-full h-40 bg-cream-100 rounded-lg mb-4 flex items-center justify-center overflow-hidden group flex-shrink-0">
        {menu.image_url ? (
          <img src={menu.image_url} alt={menu.name} className="w-full h-full object-cover" />
        ) : (
          <Package size={48} className="text-gray-400" />
        )}
        
        {/* Upload overlay on hover */}
        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button
            onClick={() => onUploadImage(menu)}
            className="px-4 py-2 bg-white text-gray-900 rounded-lg flex items-center gap-2 hover:bg-gray-100"
          >
            <Upload size={16} />
            <span className="text-sm font-medium">Upload Gambar</span>
          </button>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-gray-900 mb-1 truncate" title={menu.name}>{menu.name}</h3>
          <p className="text-xs text-gray-500">{menu.category_name}</p>
          {menu.subcategory && (
            <span className="inline-block mt-1 px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded">
              {menu.subcategory}
            </span>
          )}
        </div>
        <div className="flex gap-2 flex-shrink-0 ml-2">
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

      {/* Description - Fixed height */}
      <div className="mb-4 h-10 flex-shrink-0">
        {menu.description && (
          <p className="text-sm text-gray-600 line-clamp-2">{menu.description}</p>
        )}
      </div>

      {/* Price */}
      <div className="flex items-center gap-2 mb-3">
        <DollarSign size={16} className="text-primary-600" />
        <span className="text-lg font-bold text-primary-600">{formatCurrency(menu.price)}</span>
      </div>

      {/* Stock Info */}
      <div className="flex items-center justify-between mb-3 p-3 bg-cream-50 rounded-lg">
        <div>
          <p className="text-xs text-gray-500 mb-1">Stok Tersedia</p>
          <p className="text-lg font-bold text-gray-900">{menu.stock_quantity}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${stockBadge.bg} ${stockBadge.text} ${stockBadge.border}`}>
          {stockBadge.label}
        </span>
      </div>

      {/* Low Stock Warning - Fixed height */}
      <div className="mb-3 h-8 flex-shrink-0">
        {menu.stock_quantity > 0 && menu.stock_quantity <= menu.minimum_stock && (
          <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded-lg h-full">
            <AlertTriangle size={14} className="text-yellow-600 flex-shrink-0" />
            <p className="text-xs text-yellow-800">Stok di bawah minimum ({menu.minimum_stock})</p>
          </div>
        )}
      </div>

      {/* Availability Toggle */}
      <button
        onClick={() => onToggleAvailability(menu.id, !menu.is_available)}
        className={`w-full py-2 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2 mt-auto ${
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

// ============================================================================
// IMAGE UPLOAD MODAL (Standalone - for existing menus)
// ============================================================================

const ImageUploadModal = ({ menu, onClose, onUpload }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Ukuran file maksimal 5MB');
        return;
      }
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setUploading(true);
    try {
      await onUpload(menu.id, selectedFile);
      onClose();
    } catch (error) {
      alert('Gagal upload gambar: ' + (error.message || error));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Upload Gambar Menu</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X size={20} />
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-4">Upload gambar untuk: <strong>{menu?.name}</strong></p>

        <div className="mb-4">
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleFileSelect}
            className="w-full"
          />
          <p className="text-xs text-gray-500 mt-2">Format: JPG, PNG, WEBP. Maks 5MB</p>
        </div>

        {preview && (
          <div className="mb-4">
            <img src={preview} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={uploading}
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
          >
            Batal
          </button>
          <button
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {uploading ? <Loader size={16} className="animate-spin" /> : <Upload size={16} />}
            <span>{uploading ? 'Uploading...' : 'Upload'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// MENU FORM MODAL (Create/Edit with Image Upload)
// ============================================================================

const MenuFormModal = ({ menu, categories, subcategories, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: menu?.name || '',
    category_id: menu?.category_id || '',
    price: menu?.price || '',
    description: menu?.description || '',
    stock_quantity: menu?.stock_quantity || 0,
    minimum_stock: menu?.minimum_stock || 10,
    preparation_time: menu?.preparation_time || 15,
    subcategory: menu?.subcategory || '',
    is_available: menu?.is_available ?? true,
    display_order: menu?.display_order || 0
  });
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(menu?.image_url || null);
  const fileInputRef = useRef(null);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Ukuran file maksimal 5MB');
        return;
      }
      
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        alert('Format file tidak didukung. Gunakan JPG, PNG, atau WEBP');
        return;
      }

      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.category_id || !formData.price) {
      alert('Mohon lengkapi semua field yang wajib diisi');
      return;
    }

    setSaving(true);
    try {
      await onSave(formData, imageFile);
      onClose();
    } catch (error) {
      alert('Gagal menyimpan menu: ' + (error.message || error));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 my-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {menu ? 'Edit Menu' : 'Tambah Menu Baru'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Image Upload Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gambar Menu
            </label>
            <div className="flex gap-4">
              {/* Preview */}
              <div className="relative w-40 h-40 bg-cream-100 rounded-lg flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300">
                {imagePreview ? (
                  <>
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X size={16} />
                    </button>
                  </>
                ) : (
                  <ImageIcon size={48} className="text-gray-400" />
                )}
              </div>

              {/* Upload Button */}
              <div className="flex-1 flex flex-col justify-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleImageSelect}
                  className="hidden"
                  id="menu-image-upload"
                />
                <label
                  htmlFor="menu-image-upload"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-cream-100 text-gray-700 rounded-lg hover:bg-cream-200 cursor-pointer transition-colors"
                >
                  <Upload size={18} />
                  <span>Pilih Gambar</span>
                </label>
                <p className="text-xs text-gray-500 mt-2">
                  Format: JPG, PNG, WEBP. Maksimal 5MB
                </p>
              </div>
            </div>
          </div>

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

            {/* Subcategory */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subkategori
              </label>
              <select
                value={formData.subcategory}
                onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Pilih Subkategori</option>
                {subcategories.map(sub => (
                  <option key={sub} value={sub}>{sub}</option>
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
                onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>

            {/* Preparation Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Waktu Persiapan (menit)
              </label>
              <input
                type="number"
                min="0"
                value={formData.preparation_time}
                onChange={(e) => setFormData({ ...formData, preparation_time: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Stock Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stok Tersedia
              </label>
              <input
                type="number"
                min="0"
                value={formData.stock_quantity}
                onChange={(e) => setFormData({ ...formData, stock_quantity: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
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
                onChange={(e) => setFormData({ ...formData, minimum_stock: parseInt(e.target.value) || 0 })}
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                rows="3"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving && <Loader size={16} className="animate-spin" />}
              <span>{saving ? 'Menyimpan...' : 'Simpan'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const MenuManagement = () => {
  const { isCollapsed } = useOwnerSidebar();
  
  // State management
  const [menus, setMenus] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 500); // Debounce 500ms
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStock, setFilterStock] = useState('all');
  const [showFormModal, setShowFormModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [editingMenu, setEditingMenu] = useState(null);
  const [uploadingMenu, setUploadingMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false); // Separate loading for search
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0 });

  const [statsGlobal, setStatsGlobal] = useState({
    total: 0,
    available: 0,
    lowStock: 0,
    outOfStock: 0
  });

  // Reset page when filters or search change
  useEffect(() => {
    setPagination(prev => ({ ...prev, page: 1 }));
  }, [filterCategory, debouncedSearch]);

  // Load data on page change or filters
  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, filterCategory, filterStock, debouncedSearch]);

  // ============================================================================
  // DATA LOADING
  // ============================================================================

  const loadData = async () => {
    // Only show full loading on initial load
    if (pagination.page === 1 && !menus.length) {
      setLoading(true);
    } else {
      setSearching(true);
    }
    
    try {
      // 1) Fetch page data
      const menusRes = await menuService.getMenus({ 
        page: pagination.page, 
        limit: pagination.limit,
        category_id: filterCategory !== 'all' ? filterCategory : undefined,
        search: debouncedSearch || undefined,
        is_available: undefined
      });

      if (menusRes && menusRes.success) {
        const pageMenus = menusRes.data.menus || [];
        const total = menusRes.data.pagination?.total || 0;
        const pageFromResponse = menusRes.data.pagination?.page || pagination.page;
        const limitFromResponse = menusRes.data.pagination?.limit || pagination.limit;

        setMenus(pageMenus);
        setPagination(prev => ({ ...prev, total, page: pageFromResponse, limit: limitFromResponse }));

        // 2) Fetch ALL data (only to compute global stats)
        if (total === 0) {
          setStatsGlobal({ total: 0, available: 0, lowStock: 0, outOfStock: 0 });
        } else if (total <= limitFromResponse) {
          computeAndSetGlobalStats(pageMenus, total);
        } else {
          try {
            const allRes = await menuService.getMenus({ 
              page: 1, 
              limit: total, 
              category_id: filterCategory !== 'all' ? filterCategory : undefined, 
              search: debouncedSearch || undefined 
            });
            if (allRes && allRes.success) {
              const allMenus = allRes.data.menus || [];
              computeAndSetGlobalStats(allMenus, total);
            } else {
              computeAndSetGlobalStats(pageMenus, total);
            }
          } catch (errAll) {
            console.warn('Failed to fetch all menus for stats, falling back to page-based counts', errAll);
            computeAndSetGlobalStats(pageMenus, total);
          }
        }
      } else {
        setMenus([]);
        setPagination(prev => ({ ...prev, total: 0 }));
        setStatsGlobal({ total: 0, available: 0, lowStock: 0, outOfStock: 0 });
      }

      // Fetch categories & subcategories
      const [catsRes, subsRes] = await Promise.all([
        menuService.getCategories(),
        menuService.getSubcategories()
      ]);
      if (catsRes && catsRes.success) setCategories(catsRes.data || []);
      if (subsRes && subsRes.success) setSubcategories(subsRes.data || []);
    } catch (error) {
      console.error('Failed to load data:', error);
      alert('Gagal memuat data: ' + (error.message || error));
    } finally {
      setLoading(false);
      setSearching(false);
    }
  };

  const computeAndSetGlobalStats = (allMenusArray, totalCount) => {
    const available = allMenusArray.filter(m => m.is_available && m.stock_quantity > 0).length;
    const lowStock = allMenusArray.filter(m => m.stock_quantity > 0 && m.stock_quantity <= m.minimum_stock).length;
    const outOfStock = allMenusArray.filter(m => m.stock_quantity === 0).length;
    setStatsGlobal({
      total: totalCount,
      available,
      lowStock,
      outOfStock
    });
  };

  // Client-side filtered menus (stock filter applied on currently loaded page)
  const filteredMenus = menus.filter(menu => {
    const matchSearch = menu.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchStock = true;
    if (filterStock === 'available') {
      matchStock = menu.stock_quantity > menu.minimum_stock;
    } else if (filterStock === 'low') {
      matchStock = menu.stock_quantity > 0 && menu.stock_quantity <= menu.minimum_stock;
    } else if (filterStock === 'out') {
      matchStock = menu.stock_quantity === 0;
    }

    return matchSearch && matchStock;
  });

  const totalPages = Math.max(1, Math.ceil((pagination.total || 0) / pagination.limit));

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const handleEdit = (menu) => {
    setEditingMenu(menu);
    setShowFormModal(true);
  };

  const handleDelete = async (id) => {
    const menu = menus.find(m => m.id === id);
    if (window.confirm(`Apakah Anda yakin ingin menghapus menu "${menu?.name}"?`)) {
      try {
        await menuService.deleteMenu(id);
        loadData();
      } catch (error) {
        alert('Gagal menghapus menu: ' + (error.message || error));
      }
    }
  };

  const handleToggleAvailability = async (id, isAvailable) => {
    try {
      await menuService.updateMenu(id, { is_available: isAvailable });
      loadData();
    } catch (error) {
      alert('Gagal mengubah status: ' + (error.message || error));
    }
  };

  const handleSaveMenu = async (formData, imageFile) => {
    try {
      let menuId;
      
      if (editingMenu) {
        // Update existing menu
        await menuService.updateMenu(editingMenu.id, formData);
        menuId = editingMenu.id;
      } else {
        // Create new menu
        const result = await menuService.createMenu(formData);
        menuId = result.data.id;
      }

      // Upload image if provided
      if (imageFile && menuId) {
        await menuService.uploadMenuImage(menuId, imageFile);
      }

      loadData();
    } catch (error) {
      throw error;
    }
  };

  const handleUploadImage = (menu) => {
    setUploadingMenu(menu);
    setShowImageModal(true);
  };

  const handleImageUpload = async (menuId, file) => {
    try {
      await menuService.uploadMenuImage(menuId, file);
      loadData();
    } catch (error) {
      throw error;
    }
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages || page === pagination.page) return;
    setPagination(prev => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  if (loading) {
    return (
      <div className="flex min-h-screen bg-cream-50">
        <OwnerSidebar />
        <div className={`flex-1 transition-all duration-300 ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
          <div className="flex items-center justify-center h-screen">
            <Loader size={48} className="animate-spin text-primary-500" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-cream-50">
      <OwnerSidebar />
      
      <div className={`flex-1 transition-all duration-300 ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
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
              <p className="text-2xl font-bold text-gray-900">{statsGlobal.total}</p>
            </div>
            <div className="card p-4">
              <p className="text-sm text-gray-600 mb-1">Tersedia</p>
              <p className="text-2xl font-bold text-green-600">{statsGlobal.available}</p>
            </div>
            <div className="card p-4">
              <p className="text-sm text-gray-600 mb-1">Stok Rendah</p>
              <p className="text-2xl font-bold text-yellow-600">{statsGlobal.lowStock}</p>
            </div>
            <div className="card p-4">
              <p className="text-sm text-gray-600 mb-1">Habis</p>
              <p className="text-2xl font-bold text-red-600">{statsGlobal.outOfStock}</p>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="card p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
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
                  {searching && (
                    <Loader className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary-500 animate-spin" size={18} />
                  )}
                </div>
              </div>

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
                  onUploadImage={handleUploadImage}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              {/* Previous Button */}
              <button
                disabled={pagination.page === 1}
                onClick={() => handlePageChange(pagination.page - 1)}
                className="px-4 py-2 bg-white border border-cream-200 text-gray-700 rounded-lg hover:bg-cream-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Sebelumnya
              </button>

              {/* Page Numbers */}
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (pagination.page <= 3) {
                    pageNum = i + 1;
                  } else if (pagination.page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = pagination.page - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                        pagination.page === pageNum
                          ? 'bg-primary-500 text-white'
                          : 'bg-white border border-cream-200 text-gray-700 hover:bg-cream-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              {/* Next Button */}
              <button
                disabled={pagination.page >= totalPages}
                onClick={() => handlePageChange(pagination.page + 1)}
                className="px-4 py-2 bg-white border border-cream-200 text-gray-700 rounded-lg hover:bg-cream-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Selanjutnya
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showFormModal && (
        <MenuFormModal
          menu={editingMenu}
          categories={categories}
          subcategories={subcategories}
          onClose={() => {
            setShowFormModal(false);
            setEditingMenu(null);
          }}
          onSave={handleSaveMenu}
        />
      )}

      {showImageModal && (
        <ImageUploadModal
          menu={uploadingMenu}
          onClose={() => {
            setShowImageModal(false);
            setUploadingMenu(null);
          }}
          onUpload={handleImageUpload}
        />
      )}
    </div>
  );
};

export default MenuManagement;