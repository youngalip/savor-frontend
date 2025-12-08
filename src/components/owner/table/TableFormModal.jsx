// src/components/owner/table/TableFormModal.jsx
import { useState } from 'react'
import { X } from 'lucide-react'
import Modal from '../../common/Modal'

const TableFormModal = ({ table, onClose, onSave, isLoading }) => {
  const [formData, setFormData] = useState({
    table_number: table?.table_number || '',
    status: table?.status || 'Free'
  })
  
  const [errors, setErrors] = useState({})

  const validate = () => {
    const newErrors = {}
    
    if (!formData.table_number || formData.table_number < 1) {
      newErrors.table_number = 'Nomor meja harus diisi dengan benar'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validate()) return
    
    try {
      await onSave(formData)
      onClose()
    } catch (error) {
      setErrors({ submit: error.message })
    }
  }

  return (
    <Modal isOpen onClose={onClose} title={table ? 'Edit Meja' : 'Tambah Meja Baru'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Table Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nomor Meja <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.table_number}
            onChange={(e) => setFormData({ ...formData, table_number: e.target.value })}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              errors.table_number ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Contoh: A1, B2, VIP1"
            disabled={isLoading}
          />
          {errors.table_number && (
            <p className="text-sm text-red-500 mt-1">{errors.table_number}</p>
          )}
        </div>

        {/* Status (hanya untuk edit) */}
        {table && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              disabled={isLoading}
            >
              <option value="Free">Tersedia</option>
              <option value="Occupied">Terisi</option>
            </select>
          </div>
        )}

        {/* Error Message */}
        {errors.submit && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{errors.submit}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium disabled:opacity-50"
          >
            {isLoading ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default TableFormModal