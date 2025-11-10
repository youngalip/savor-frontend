import { useState } from 'react';
import OwnerSidebar, { useOwnerSidebar } from '../../components/owner/OwnerSidebar';
import { 
  Plus,
  Edit2,
  Trash2,
  QrCode,
  Download,
  RefreshCw,
  UtensilsCrossed,
  X
} from 'lucide-react';

// Dummy Tables Data (tanpa status & lokasi)
const initialTables = [
  { id: 1, number: 1, capacity: 2, qrCode: 'QR-TABLE-001-ABC123' },
  { id: 2, number: 2, capacity: 4, qrCode: 'QR-TABLE-002-DEF456' },
  { id: 3, number: 3, capacity: 4, qrCode: 'QR-TABLE-003-GHI789' },
  { id: 4, number: 4, capacity: 2, qrCode: 'QR-TABLE-004-JKL012' },
];

// Generate QR Code (unique identifier)
const generateQRCode = (tableNumber) => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `QR-TABLE-${String(tableNumber).padStart(3, '0')}-${random}${timestamp.slice(-3)}`;
};

// QR Code Modal Component
const QRCodeModal = ({ table, onClose, onRegenerate }) => {
  if (!table) return null;

  const qrUrl = `${window.location.origin}/menu?table=${table.number}&qr=${table.qrCode}`;

  const handleDownloadQR = () => {
    alert(`Download QR Code untuk Meja ${table.number}\nURL: ${qrUrl}\nQR Code: ${table.qrCode}`);
  };

  // ✅ Fungsi print QR code
  const handlePrintQR = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Print QR Meja ${table.number}</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              text-align: center; 
              padding: 40px; 
            }
            h1 { font-size: 22px; margin-bottom: 10px; }
            .qr-box {
              border: 3px solid #333; 
              border-radius: 12px;
              padding: 20px;
              display: inline-block;
            }
            .qr-code {
              width: 200px; 
              height: 200px; 
              background: #f9f9f9;
              border-radius: 8px;
              margin-bottom: 10px;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .qr-text { 
              font-size: 12px; 
              color: #666; 
              font-family: monospace;
            }
          </style>
        </head>
        <body>
          <div class="qr-box">
            <h1>Meja ${table.number}</h1>
            <div class="qr-code">
              <svg width="180" height="180"><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#aaa">QR</text></svg>
            </div>
            <p class="qr-text">${table.qrCode}</p>
            <p>${qrUrl}</p>
          </div>
          <script>
            window.print();
            window.onafterprint = () => window.close();
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">QR Code Meja {table.number}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* QR Code Placeholder */}
        <div className="bg-cream-50 rounded-xl p-8 mb-6 flex flex-col items-center">
          <div className="w-64 h-64 bg-white border-4 border-gray-300 rounded-xl flex items-center justify-center mb-4">
            <QrCode size={200} className="text-gray-400" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-900 mb-1">Meja {table.number}</p>
            <p className="text-xs text-gray-500 font-mono">{table.qrCode}</p>
          </div>
        </div>

        {/* Info URL */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <p className="text-xs text-blue-600 font-medium mb-2">URL untuk customer:</p>
          <p className="text-xs text-blue-900 font-mono break-all">{qrUrl}</p>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={handleDownloadQR}
            className="flex flex-col items-center gap-2 px-4 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            <Download size={20} />
            <span className="text-xs font-medium">Download</span>
          </button>
          <button
            onClick={handlePrintQR}
            className="flex flex-col items-center gap-2 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <span className="text-xl">🖨️</span>
            <span className="text-xs font-medium">Print</span>
          </button>
          <button
            onClick={() => onRegenerate(table.id)}
            className="flex flex-col items-center gap-2 px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            <RefreshCw size={20} />
            <span className="text-xs font-medium">Regenerate</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Add/Edit Table Modal
const TableFormModal = ({ table, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    number: table?.number || '',
    capacity: table?.capacity || 2
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.number || formData.number < 1) {
      alert('Nomor meja harus diisi dengan benar');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {table ? 'Edit Meja' : 'Tambah Meja Baru'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Table Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nomor Meja <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="1"
              value={formData.number}
              onChange={(e) => setFormData({ ...formData, number: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>

          {/* Capacity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kapasitas (orang) <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            >
              <option value={2}>2 Orang</option>
              <option value={4}>4 Orang</option>
              <option value={6}>6 Orang</option>
              <option value={8}>8 Orang</option>
              <option value={10}>10 Orang</option>
            </select>
          </div>

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

// Table Card Component
const TableCard = ({ table, onEdit, onDelete, onShowQR }) => (
  <div className="card p-5 hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-cream-100 rounded-lg flex items-center justify-center">
          <UtensilsCrossed size={24} className="text-primary-600" />
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
          title="Edit Meja"
        >
          <Edit2 size={16} className="text-gray-600" />
        </button>
        <button
          onClick={() => onDelete(table.id)}
          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
          title="Hapus Meja"
        >
          <Trash2 size={16} className="text-red-600" />
        </button>
      </div>
    </div>

    <div className="pt-3 border-t border-cream-200">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs text-gray-500">QR Code:</p>
        <QrCode size={16} className="text-gray-400" />
      </div>
      <p className="text-xs font-mono text-gray-600 mb-3 truncate">{table.qrCode}</p>
      <button
        onClick={() => onShowQR(table)}
        className="w-full py-2 bg-primary-50 text-primary-600 hover:bg-primary-100 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2"
      >
        <QrCode size={16} />
        <span>Lihat QR Code</span>
      </button>
    </div>
  </div>
);

// Main Component
const TableManagement = () => {
  const { isCollapsed } = useOwnerSidebar();
  const [tables, setTables] = useState(initialTables);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [editingTable, setEditingTable] = useState(null);
  const [selectedTable, setSelectedTable] = useState(null);

  const handleEdit = (table) => {
    setEditingTable(table);
    setShowFormModal(true);
  };

  const handleDelete = (id) => {
    const table = tables.find(t => t.id === id);
    if (window.confirm(`Apakah Anda yakin ingin menghapus Meja ${table.number}?`)) {
      setTables(tables.filter(t => t.id !== id));
    }
  };

  const handleShowQR = (table) => {
    setSelectedTable(table);
    setShowQRModal(true);
  };

  const handleRegenerateQR = (tableId) => {
    if (window.confirm('Regenerate QR code?\n\nQR code lama akan tidak valid.')) {
      setTables(tables.map(t => 
        t.id === tableId 
          ? { ...t, qrCode: generateQRCode(t.number) }
          : t
      ));
      alert('QR code berhasil digenerate ulang!');
    }
  };

  const handleSaveTable = (formData) => {
    if (editingTable) {
      setTables(tables.map(t => 
        t.id === editingTable.id 
          ? { ...t, ...formData }
          : t
      ));
    } else {
      const newTable = {
        id: Math.max(...tables.map(t => t.id), 0) + 1,
        ...formData,
        qrCode: generateQRCode(formData.number),
      };
      setTables([...tables, newTable]);
      setTimeout(() => {
        setSelectedTable(newTable);
        setShowQRModal(true);
      }, 300);
    }
    setShowFormModal(false);
    setEditingTable(null);
  };

  return (
    <div className="flex min-h-screen bg-cream-50">
      <OwnerSidebar />
      <div className={`flex-1 transition-all duration-300 ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <div className="p-8 mt-16 lg:mt-0">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manajemen Meja & QR Code</h1>
              <p className="text-gray-600 mt-1">Kelola meja dan QR code untuk customer ordering</p>
            </div>
            <button 
              onClick={() => {
                setEditingTable(null);
                setShowFormModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              <Plus size={18} />
              <span>Tambah Meja</span>
            </button>
          </div>

          {/* Tables Grid */}
          {tables.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-cream-100 rounded-full mb-4">
                <UtensilsCrossed size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Tidak ada meja</h3>
              <p className="text-gray-500">Tambahkan meja baru untuk memulai</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {tables.map((table) => (
                <TableCard
                  key={table.id}
                  table={table}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onShowQR={handleShowQR}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showFormModal && (
        <TableFormModal
          table={editingTable}
          onClose={() => {
            setShowFormModal(false);
            setEditingTable(null);
          }}
          onSave={handleSaveTable}
        />
      )}
      {showQRModal && (
        <QRCodeModal
          table={selectedTable}
          onClose={() => {
            setShowQRModal(false);
            setSelectedTable(null);
          }}
          onRegenerate={handleRegenerateQR}
        />
      )}
    </div>
  );
};

export default TableManagement;
