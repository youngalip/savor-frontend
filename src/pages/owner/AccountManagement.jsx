import { useState, useEffect } from "react";
import OwnerSidebar, {
  useOwnerSidebar,
} from "../../components/owner/OwnerSidebar";
import {
  Plus,
  Edit2,
  Trash2,
  UserCheck,
  UserX,
  Search,
  Users as UsersIcon,
} from "lucide-react";
import toast, { Toaster } from 'react-hot-toast';
import ownerApi from '../../services/ownerApi';

const getRoleBadge = (role) => {
  const badges = {
    Owner: {
      bg: "bg-purple-50",
      text: "text-purple-700",
      border: "border-purple-200",
      label: "Owner",
    },
    Kasir: {
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
      label: "Kasir",
    },
    Kitchen: {
      bg: "bg-orange-50",
      text: "text-orange-700",
      border: "border-orange-200",
      label: "Kitchen",
    },
    Bar: {
      bg: "bg-cyan-50",
      text: "text-cyan-700",
      border: "border-cyan-200",
      label: "Bar",
    },
    Pastry: {
      bg: "bg-pink-50",
      text: "text-pink-700",
      border: "border-pink-200",
      label: "Pastry",
    },
  };
  return badges[role] || badges.Kasir;
};

const getStatusBadge = (isActive) => {
  return isActive
    ? {
        bg: "bg-green-50",
        text: "text-green-700",
        border: "border-green-200",
        label: "Aktif",
      }
    : {
        bg: "bg-gray-50",
        text: "text-gray-700",
        border: "border-gray-200",
        label: "Tidak Aktif",
      };
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const StaffCard = ({ staff, onEdit, onDelete, onToggleStatus }) => {
  const roleBadge = getRoleBadge(staff.role);
  const statusBadge = getStatusBadge(staff.is_active);

  return (
    <div className="card p-5 hover:shadow-md transition-shadow relative"> {/* ✅ TAMBAH relative */}
      
      {/* ✅ ICON BUTTONS - Fixed Position (Absolute) */}
      <div className="absolute top-4 right-4 flex gap-2">
        <button
          onClick={() => onEdit(staff)}
          className="p-2 hover:bg-cream-50 rounded-lg transition-colors"
          title="Edit User"
        >
          <Edit2 size={16} className="text-gray-600" />
        </button>
        <button
          onClick={() => onDelete(staff.id)}
          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
          title="Hapus User"
        >
          <Trash2 size={16} className="text-red-600" />
        </button>
      </div>

      {/* Avatar & Info */}
      <div className="flex items-center gap-3 mb-4 pr-20"> {/* ✅ TAMBAH pr-20 untuk spacing icon */}
        <div
          className={`w-12 h-12 ${roleBadge.bg} rounded-full flex items-center justify-center flex-shrink-0`}
        >
          <span className={`text-lg font-bold ${roleBadge.text}`}>
            {staff.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)}
          </span>
        </div>
        <div className="min-w-0 flex-1"> {/* ✅ TAMBAH min-w-0 untuk text truncation */}
          <h3 className="text-lg font-bold text-gray-900 truncate">{staff.name}</h3>
          <p className="text-sm text-gray-500 truncate">{staff.email}</p>
        </div>
      </div>

      {/* Join Date */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>📅</span>
          <span>Bergabung: {formatDate(staff.created_at)}</span>
        </div>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold border ${roleBadge.bg} ${roleBadge.text} ${roleBadge.border}`}
        >
          {roleBadge.label}
        </span>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusBadge.bg} ${statusBadge.text} ${statusBadge.border}`}
        >
          {statusBadge.label}
        </span>
      </div>

      {/* Toggle Status Button */}
      <button
        onClick={() => onToggleStatus(staff.id, staff.is_active)}
        className={`w-full py-2 rounded-lg font-medium text-sm transition-colors ${
          staff.is_active
            ? "bg-red-50 text-red-700 hover:bg-red-100"
            : "bg-green-50 text-green-700 hover:bg-green-100"
        }`}
      >
        {staff.is_active ? "Nonaktifkan" : "Aktifkan"}
      </button>
    </div>
  );
};

const AccountManagement = () => {
  const { isCollapsed } = useOwnerSidebar();
  
  // State
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    is_active: true,
  });

  // Fetch staff on mount
  useEffect(() => {
    fetchStaff();
  }, []);

  // Fetch staff dari API
  const fetchStaff = async () => {
    setLoading(true);
    try {
      const response = await ownerApi.getUsers({
        role: filterRole,
        status: filterStatus,
        search: searchQuery,
      });

      if (response.success) {
        setStaff(response.data.users || []);
      } else {
        toast.error('Gagal memuat data staff');
      }
    } catch (error) {
      console.error('Error fetching staff:', error);
      toast.error(error.message || 'Gagal memuat data staff');
    } finally {
      setLoading(false);
    }
  };

  // Refetch saat filter berubah
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchStaff();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [filterRole, filterStatus, searchQuery]);

  // Filter staff (client-side untuk search)
  const filteredStaff = staff.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSearch;
  });

  // Calculate stats
  const stats = {
    total: staff.length,
    active: staff.filter((s) => s.is_active).length,
    inactive: staff.filter((s) => !s.is_active).length,
    kasir: staff.filter((s) => s.role === "Kasir").length,
    kitchen: staff.filter((s) => s.role === "Kitchen").length,
  };

  const handleDelete = async (id) => {
    const staffMember = staff.find(s => s.id === id);
    
    if (!window.confirm(`Apakah Anda yakin ingin menghapus akun ${staffMember.name}?`)) {
      return;
    }

    const loadingToast = toast.loading('Menghapus user...');
    
    try {
      const response = await ownerApi.deleteUser(id);
      
      if (response.success) {
        toast.success('User berhasil dihapus!', { id: loadingToast });
        fetchStaff(); // Refresh list
      } else {
        toast.error(response.message || 'Gagal menghapus user', { id: loadingToast });
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error(error.message || 'Gagal menghapus user', { id: loadingToast });
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const loadingToast = toast.loading('Mengubah status...');
    
    try {
      const response = await ownerApi.updateUser(id, {
        is_active: !currentStatus
      });

      if (response.success) {
        toast.success(`Status berhasil diubah!`, { id: loadingToast });
        fetchStaff(); // Refresh list
      } else {
        toast.error(response.message || 'Gagal mengubah status', { id: loadingToast });
      }
    } catch (error) {
      console.error('Error toggling status:', error);
      toast.error(error.message || 'Gagal mengubah status', { id: loadingToast });
    }
  };

  // Reset form when opening modal
  const handleOpenModal = () => {
    setEditingStaff(null);
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "",
      is_active: true,
    });
    setShowAddModal(true);
  };

  // Set form data when editing
  const handleEdit = (staffMember) => {
    setEditingStaff(staffMember);
    setFormData({
      name: staffMember.name,
      email: staffMember.email,
      password: "", // Don't include password when editing
      role: staffMember.role,
      is_active: staffMember.is_active,
    });
    setShowAddModal(true);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.name || !formData.email || !formData.role) {
      toast.error('Mohon lengkapi semua field yang diperlukan');
      return;
    }

    // Password required saat create, optional saat edit
    if (!editingStaff && !formData.password) {
      toast.error('Password wajib diisi saat membuat user baru');
      return;
    }

    const loadingToast = toast.loading(editingStaff ? 'Mengupdate user...' : 'Membuat user baru...');

    try {
      // Prepare data - hapus password jika kosong saat edit
      const submitData = { ...formData };
      if (editingStaff && !formData.password) {
        delete submitData.password;
      }

      let response;
      if (editingStaff) {
        response = await ownerApi.updateUser(editingStaff.id, submitData);
      } else {
        response = await ownerApi.createUser(submitData);
      }

      if (response.success) {
        toast.success(
          editingStaff ? 'User berhasil diupdate!' : 'User berhasil dibuat!',
          { id: loadingToast }
        );
        
        setShowAddModal(false);
        setEditingStaff(null);
        setFormData({
          name: "",
          email: "",
          password: "",
          role: "",
          is_active: true,
        });
        
        fetchStaff(); // Refresh list
      } else {
        toast.error(response.message || 'Operasi gagal', { id: loadingToast });
      }
    } catch (error) {
      console.error('Error saving user:', error);
      toast.error(error.message || 'Gagal menyimpan user', { id: loadingToast });
    }
  };

  return (
    <div className="flex min-h-screen bg-cream-50">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#fff',
            color: '#363636',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      
      <OwnerSidebar />

      <div
        className={`
        flex-1 transition-all duration-300
        ${isCollapsed ? "lg:ml-20" : "lg:ml-64"}
      `}
      >
        <div className="p-8 mt-16 lg:mt-0">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Manajemen Akun
              </h1>
              <p className="text-gray-600 mt-1">
                Kelola akun staff dan hak akses
              </p>
            </div>
            <button
              onClick={handleOpenModal}
              className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              <Plus size={18} />
              <span>Tambah Akun</span>
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="card p-4">
              <p className="text-sm text-gray-600 mb-1">Total Staff</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="card p-4">
              <p className="text-sm text-gray-600 mb-1">Aktif</p>
              <p className="text-2xl font-bold text-green-600">
                {stats.active}
              </p>
            </div>
            <div className="card p-4">
              <p className="text-sm text-gray-600 mb-1">Tidak Aktif</p>
              <p className="text-2xl font-bold text-gray-600">
                {stats.inactive}
              </p>
            </div>
            <div className="card p-4">
              <p className="text-sm text-gray-600 mb-1">Kasir</p>
              <p className="text-2xl font-bold text-blue-600">
                {stats.kasir}
              </p>
            </div>
            <div className="card p-4">
              <p className="text-sm text-gray-600 mb-1">Kitchen</p>
              <p className="text-2xl font-bold text-orange-600">
                {stats.kitchen}
              </p>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="card p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Cari nama atau email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              {/* Role Filter */}
              <div>
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">Semua Role</option>
                  <option value="Kasir">Kasir</option>
                  <option value="Kitchen">Kitchen</option>
                  <option value="Bar">Bar</option>
                  <option value="Pastry">Pastry</option>
                  <option value="Owner">Owner</option>
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">Semua Status</option>
                  <option value="active">Aktif</option>
                  <option value="inactive">Tidak Aktif</option>
                </select>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
          ) : filteredStaff.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-cream-100 rounded-full mb-4">
                <UsersIcon size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Tidak ada staff
              </h3>
              <p className="text-gray-500">
                {searchQuery || filterRole !== 'all' || filterStatus !== 'all'
                  ? 'Tidak ada staff dengan filter yang dipilih'
                  : 'Tambahkan staff baru untuk memulai'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredStaff.map((staffMember) => (
                <StaffCard
                  key={staffMember.id}
                  staff={staffMember}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onToggleStatus={handleToggleStatus}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {editingStaff ? "Edit Akun" : "Tambah Akun Baru"}
            </h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Nama */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Masukkan nama lengkap"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Masukkan email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password {!editingStaff && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="password"
                  name="password"
                  required={!editingStaff}
                  placeholder={editingStaff ? "Kosongkan jika tidak ingin mengubah" : "Masukkan password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                {editingStaff && (
                  <p className="text-xs text-gray-500 mt-1">
                    Biarkan kosong jika tidak ingin mengubah password
                  </p>
                )}
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role <span className="text-red-500">*</span>
                </label>
                <select
                  name="role"
                  required
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Pilih Role</option>
                  <option value="Kasir">Kasir</option>
                  <option value="Kitchen">Kitchen</option>
                  <option value="Bar">Bar</option>
                  <option value="Pastry">Pastry</option>
                  <option value="Owner">Owner</option>
                </select>
              </div>

              {/* Status - Only show when editing */}
              {editingStaff && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    name="is_active"
                    value={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.value === 'true' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="true">Aktif</option>
                    <option value="false">Tidak Aktif</option>
                  </select>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingStaff(null);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  {editingStaff ? "Simpan Perubahan" : "Buat Akun"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountManagement;