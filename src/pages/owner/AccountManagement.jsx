import { useState } from 'react';
import OwnerSidebar, { useOwnerSidebar } from '../../components/owner/OwnerSidebar';
import { 
  Plus,
  Edit2,
  Trash2,
  UserCheck,
  UserX,
  Search,
  Shield,
  Users as UsersIcon
} from 'lucide-react';

// Dummy Staff Data
const initialStaff = [
  {
    id: 1,
    name: 'Budi Santoso',
    email: 'budi@restaurant.com',
    role: 'cashier',
    status: 'active',
    phone: '081234567890',
    joinDate: '2024-01-15'
  },
  {
    id: 2,
    name: 'Siti Rahayu',
    email: 'siti@restaurant.com',
    role: 'cashier',
    status: 'active',
    phone: '081234567891',
    joinDate: '2024-01-10'
  },
  {
    id: 3,
    name: 'Ahmad Yani',
    email: 'ahmad@restaurant.com',
    role: 'kitchen',
    status: 'active',
    phone: '081234567892',
    joinDate: '2024-01-12'
  },
  {
    id: 4,
    name: 'Dewi Lestari',
    email: 'dewi@restaurant.com',
    role: 'bar',
    status: 'active',
    phone: '081234567893',
    joinDate: '2024-01-08'
  },
  {
    id: 5,
    name: 'Rina Susanti',
    email: 'rina@restaurant.com',
    role: 'pastry',
    status: 'active',
    phone: '081234567894',
    joinDate: '2024-01-20'
  },
  {
    id: 6,
    name: 'Joko Widodo',
    email: 'joko@restaurant.com',
    role: 'kitchen',
    status: 'inactive',
    phone: '081234567895',
    joinDate: '2023-12-01'
  }
];

const getRoleBadge = (role) => {
  const badges = {
    owner: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', label: 'Owner' },
    cashier: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', label: 'Kasir' },
    kitchen: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', label: 'Kitchen' },
    bar: { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200', label: 'Bar' },
    pastry: { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200', label: 'Pastry' }
  };
  return badges[role] || badges.cashier;
};

const getStatusBadge = (status) => {
  const badges = {
    active: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', label: 'Aktif' },
    inactive: { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200', label: 'Tidak Aktif' }
  };
  return badges[status] || badges.active;
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

const StaffCard = ({ staff, onEdit, onDelete, onToggleStatus }) => {
  const roleBadge = getRoleBadge(staff.role);
  const statusBadge = getStatusBadge(staff.status);

  return (
    <div className="card p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 ${roleBadge.bg} rounded-full flex items-center justify-center`}>
            <span className={`text-lg font-bold ${roleBadge.text}`}>
              {staff.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">{staff.name}</h3>
            <p className="text-sm text-gray-500">{staff.email}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(staff)}
            className="p-2 hover:bg-cream-50 rounded-lg transition-colors"
          >
            <Edit2 size={16} className="text-gray-600" />
          </button>
          <button
            onClick={() => onDelete(staff.id)}
            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 size={16} className="text-red-600" />
          </button>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>📞</span>
          <span>{staff.phone}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>📅</span>
          <span>Bergabung: {formatDate(staff.joinDate)}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${roleBadge.bg} ${roleBadge.text} ${roleBadge.border}`}>
          {roleBadge.label}
        </span>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusBadge.bg} ${statusBadge.text} ${statusBadge.border}`}>
          {statusBadge.label}
        </span>
      </div>

      <button
        onClick={() => onToggleStatus(staff.id)}
        className={`w-full py-2 rounded-lg font-medium text-sm transition-colors ${
          staff.status === 'active'
            ? 'bg-red-50 text-red-700 hover:bg-red-100'
            : 'bg-green-50 text-green-700 hover:bg-green-100'
        }`}
      >
        {staff.status === 'active' ? 'Nonaktifkan' : 'Aktifkan'}
      </button>
    </div>
  );
};

const AccountManagement = () => {
  const { isCollapsed } = useOwnerSidebar();
  const [staff, setStaff] = useState(initialStaff);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);

  const filteredStaff = staff.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       s.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchRole = filterRole === 'all' || s.role === filterRole;
    const matchStatus = filterStatus === 'all' || s.status === filterStatus;
    return matchSearch && matchRole && matchStatus;
  });

  const stats = {
    total: staff.length,
    active: staff.filter(s => s.status === 'active').length,
    inactive: staff.filter(s => s.status === 'inactive').length,
    cashier: staff.filter(s => s.role === 'cashier').length,
    kitchen: staff.filter(s => s.role === 'kitchen').length
  };

  const handleEdit = (staffMember) => {
    setEditingStaff(staffMember);
    setShowAddModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus akun ini?')) {
      setStaff(staff.filter(s => s.id !== id));
    }
  };

  const handleToggleStatus = (id) => {
    setStaff(staff.map(s => 
      s.id === id 
        ? { ...s, status: s.status === 'active' ? 'inactive' : 'active' }
        : s
    ));
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
              <h1 className="text-3xl font-bold text-gray-900">Manajemen Akun</h1>
              <p className="text-gray-600 mt-1">Kelola akun staff dan hak akses</p>
            </div>
            <button 
              onClick={() => {
                setEditingStaff(null);
                setShowAddModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              <Plus size={18} />
              <span>Tambah Staff</span>
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
              <p className="text-2xl font-bold text-green-600">{stats.active}</p>
            </div>
            <div className="card p-4">
              <p className="text-sm text-gray-600 mb-1">Tidak Aktif</p>
              <p className="text-2xl font-bold text-gray-600">{stats.inactive}</p>
            </div>
            <div className="card p-4">
              <p className="text-sm text-gray-600 mb-1">Kasir</p>
              <p className="text-2xl font-bold text-blue-600">{stats.cashier}</p>
            </div>
            <div className="card p-4">
              <p className="text-sm text-gray-600 mb-1">Kitchen</p>
              <p className="text-2xl font-bold text-orange-600">{stats.kitchen}</p>
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
                  <option value="cashier">Kasir</option>
                  <option value="kitchen">Kitchen</option>
                  <option value="bar">Bar</option>
                  <option value="pastry">Pastry</option>
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

          {/* Staff Grid */}
          {filteredStaff.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-cream-100 rounded-full mb-4">
                <UsersIcon size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Tidak ada staff</h3>
              <p className="text-gray-500">Tidak ada staff dengan filter yang dipilih</p>
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

      {/* Add/Edit Modal - Simplified */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {editingStaff ? 'Edit Staff' : 'Tambah Staff Baru'}
            </h2>
            <p className="text-gray-500 mb-4">Form untuk menambah/edit staff akan ada di sini</p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingStaff(null);
                }}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  // TODO: Implement save logic
                  setShowAddModal(false);
                  setEditingStaff(null);
                }}
                className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountManagement;