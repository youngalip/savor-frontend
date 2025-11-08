import { useState } from 'react';
import OwnerSidebar, { useOwnerSidebar } from '../../components/owner/OwnerSidebar';
import { 
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  UtensilsCrossed
} from 'lucide-react';

// Dummy Tables Data
const initialTables = [
  { id: 1, number: 1, capacity: 2, status: 'available', location: 'indoor' },
  { id: 2, number: 2, capacity: 4, status: 'occupied', location: 'indoor', currentOrder: 'ORD-101' },
  { id: 3, number: 3, capacity: 4, status: 'occupied', location: 'indoor', currentOrder: 'ORD-102' },
  { id: 4, number: 4, capacity: 2, status: 'available', location: 'indoor' },
  { id: 5, number: 5, capacity: 6, status: 'occupied', location: 'indoor', currentOrder: 'ORD-103' },
  { id: 6, number: 6, capacity: 4, status: 'reserved', location: 'indoor' },
  { id: 7, number: 7, capacity: 2, status: 'available', location: 'outdoor' },
  { id: 8, number: 8, capacity: 4, status: 'occupied', location: 'outdoor', currentOrder: 'ORD-104' },
  { id: 9, number: 9, capacity: 6, status: 'available', location: 'outdoor' },
  { id: 10, number: 10, capacity: 8, status: 'available', location: 'outdoor' },
  { id: 11, number: 11, capacity: 4, status: 'available', location: 'vip' },
  { id: 12, number: 12, capacity: 6, status: 'occupied', location: 'vip', currentOrder: 'ORD-105' }
];

const getStatusBadge = (status) => {
  const badges = {
    available: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', label: 'Tersedia' },
    occupied: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', label: 'Terisi' },
    reserved: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', label: 'Reservasi' },
    maintenance: { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200', label: 'Maintenance' }
  };
  return badges[status] || badges.available;
};

const getLocationBadge = (location) => {
  const badges = {
    indoor: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', label: 'Indoor' },
    outdoor: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', label: 'Outdoor' },
    vip: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', label: 'VIP' }
  };
  return badges[location] || badges.indoor;
};

const TableCard = ({ table, onEdit, onDelete }) => {
  const statusBadge = getStatusBadge(table.status);
  const locationBadge = getLocationBadge(table.location);

  return (
    <div className="card p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 ${statusBadge.bg} rounded-lg flex items-center justify-center`}>
            <UtensilsCrossed size={24} className={statusBadge.text} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Meja {table.number}</h3>
            <p className="text-sm text-gray-500">Kapasitas: {table.capacity} orang</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(table)}
            className="p-2 hover:bg-cream-50 rounded-lg transition-colors"
          >
            <Edit2 size={16} className="text-gray-600" />
          </button>
          <button
            onClick={() => onDelete(table.id)}
            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 size={16} className="text-red-600" />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusBadge.bg} ${statusBadge.text} ${statusBadge.border}`}>
          {statusBadge.label}
        </span>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${locationBadge.bg} ${locationBadge.text} ${locationBadge.border}`}>
          {locationBadge.label}
        </span>
      </div>

      {table.currentOrder && (
        <div className="pt-3 border-t border-cream-200">
          <p className="text-xs text-gray-500">Pesanan Aktif:</p>
          <p className="text-sm font-semibold text-primary-600">{table.currentOrder}</p>
        </div>
      )}
    </div>
  );
};

const TableManagement = () => {
  const { isCollapsed } = useOwnerSidebar();
  const [tables, setTables] = useState(initialTables);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterLocation, setFilterLocation] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTable, setEditingTable] = useState(null);

  const filteredTables = tables.filter(table => {
    const matchStatus = filterStatus === 'all' || table.status === filterStatus;
    const matchLocation = filterLocation === 'all' || table.location === filterLocation;
    return matchStatus && matchLocation;
  });

  const stats = {
    total: tables.length,
    available: tables.filter(t => t.status === 'available').length,
    occupied: tables.filter(t => t.status === 'occupied').length,
    reserved: tables.filter(t => t.status === 'reserved').length
  };

  const handleEdit = (table) => {
    setEditingTable(table);
    setShowAddModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus meja ini?')) {
      setTables(tables.filter(t => t.id !== id));
    }
  };

  const handleSave = (tableData) => {
    if (editingTable) {
      setTables(tables.map(t => t.id === editingTable.id ? { ...t, ...tableData } : t));
    } else {
      const newTable = {
        id: Math.max(...tables.map(t => t.id)) + 1,
        ...tableData
      };
      setTables([...tables, newTable]);
    }
    setShowAddModal(false);
    setEditingTable(null);
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
              <h1 className="text-3xl font-bold text-gray-900">Manajemen Meja</h1>
              <p className="text-gray-600 mt-1">Kelola tata letak dan status meja restaurant</p>
            </div>
            <button 
              onClick={() => {
                setEditingTable(null);
                setShowAddModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              <Plus size={18} />
              <span>Tambah Meja</span>
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="card p-4">
              <p className="text-sm text-gray-600 mb-1">Total Meja</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="card p-4">
              <p className="text-sm text-gray-600 mb-1">Tersedia</p>
              <p className="text-2xl font-bold text-green-600">{stats.available}</p>
            </div>
            <div className="card p-4">
              <p className="text-sm text-gray-600 mb-1">Terisi</p>
              <p className="text-2xl font-bold text-red-600">{stats.occupied}</p>
            </div>
            <div className="card p-4">
              <p className="text-sm text-gray-600 mb-1">Reservasi</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.reserved}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setFilterStatus('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filterStatus === 'all'
                      ? 'bg-primary-500 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Semua
                </button>
                <button
                  onClick={() => setFilterStatus('available')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filterStatus === 'available'
                      ? 'bg-green-500 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Tersedia
                </button>
                <button
                  onClick={() => setFilterStatus('occupied')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filterStatus === 'occupied'
                      ? 'bg-red-500 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Terisi
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Lokasi</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setFilterLocation('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filterLocation === 'all'
                      ? 'bg-primary-500 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Semua
                </button>
                <button
                  onClick={() => setFilterLocation('indoor')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filterLocation === 'indoor'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Indoor
                </button>
                <button
                  onClick={() => setFilterLocation('outdoor')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filterLocation === 'outdoor'
                      ? 'bg-orange-500 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Outdoor
                </button>
                <button
                  onClick={() => setFilterLocation('vip')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filterLocation === 'vip'
                      ? 'bg-purple-500 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  VIP
                </button>
              </div>
            </div>
          </div>

          {/* Tables Grid */}
          {filteredTables.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-cream-100 rounded-full mb-4">
                <UtensilsCrossed size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Tidak ada meja</h3>
              <p className="text-gray-500">Tidak ada meja dengan filter yang dipilih</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredTables.map((table) => (
                <TableCard
                  key={table.id}
                  table={table}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
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
              {editingTable ? 'Edit Meja' : 'Tambah Meja Baru'}
            </h2>
            <p className="text-gray-500 mb-4">Form untuk menambah/edit meja akan ada di sini</p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingTable(null);
                }}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  // TODO: Implement save logic
                  setShowAddModal(false);
                  setEditingTable(null);
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

export default TableManagement;