// src/components/owner/table/TableCard.jsx
import { Edit2, Trash2, QrCode, UtensilsCrossed } from 'lucide-react'

const TableCard = ({ table, onEdit, onDelete, onShowQR }) => {
  return (
    <div className="card p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-cream-100 rounded-lg flex items-center justify-center">
            <UtensilsCrossed size={24} className="text-primary-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              Meja {table.table_number}
            </h3>
            <span className={`text-xs px-2 py-1 rounded-full ${
              table.status === 'Free' 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              {table.status === 'Free' ? 'Tersedia' : 'Terisi'}
            </span>
          </div>
        </div>
        
        {/* Actions */}
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

      {/* QR Section */}
      <div className="pt-3 border-t border-cream-200">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-gray-500">QR Code:</p>
          <QrCode size={16} className="text-gray-400" />
        </div>
        <p className="text-xs font-mono text-gray-600 mb-3 truncate">
          {table.qr_code || 'Belum di-generate'}
        </p>
        <button
          onClick={() => onShowQR(table)}
          disabled={!table.qr_code}
          className="w-full py-2 bg-primary-50 text-primary-600 hover:bg-primary-100 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <QrCode size={16} />
          <span>Lihat QR Code</span>
        </button>
      </div>
    </div>
  )
}

export default TableCard