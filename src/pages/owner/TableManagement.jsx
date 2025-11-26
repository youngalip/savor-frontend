// src/pages/owner/TableManagement.jsx
import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import OwnerSidebar, { useOwnerSidebar } from '../../components/owner/OwnerSidebar'
import { 
  TableCard, 
  TableFormModal, 
  TableQRModal, 
  TableFilters,
  TableStats 
} from '../../components/owner/table'
import EmptyState from '../../components/common/EmptyState'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { useTableManagement } from '../../hooks/useTableManagement'

const TableManagement = () => {
  const { isCollapsed } = useOwnerSidebar()
  const {
    tables,
    loading,
    error,
    pagination,
    fetchTables,
    createTable,
    updateTable,
    deleteTable,
    regenerateQR
  } = useTableManagement()

  // Modal states
  const [showFormModal, setShowFormModal] = useState(false)
  const [showQRModal, setShowQRModal] = useState(false)
  const [editingTable, setEditingTable] = useState(null)
  const [selectedTable, setSelectedTable] = useState(null)

  // Filter states
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    limit: 20,
    page: 1
  })

  // Action loading states
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Fetch tables on mount and filter change
  useEffect(() => {
    fetchTables(filters)
  }, [filters.search, filters.status, filters.limit, filters.page])

  // Handlers
  const handleEdit = (table) => {
    setEditingTable(table)
    setShowFormModal(true)
  }

  const handleDelete = async (id) => {
    const table = tables.find(t => t.id === id)
    if (window.confirm(`Apakah Anda yakin ingin menghapus Meja ${table.table_number}?`)) {
      try {
        await deleteTable(id)
        alert('Meja berhasil dihapus!')
      } catch (error) {
        alert(error.message)
      }
    }
  }

  const handleShowQR = (table) => {
    setSelectedTable(table)
    setShowQRModal(true)
  }

  const handleRegenerateQR = async (tableId) => {
    if (window.confirm('Regenerate QR code?\n\nQR code lama akan tidak valid.')) {
      setIsRegenerating(true)
      try {
        const response = await regenerateQR(tableId)
        alert('QR code berhasil digenerate ulang!')
        
        // Update selected table jika sedang dibuka
        if (selectedTable?.id === tableId) {
          setSelectedTable(response.data.table)
        }
      } catch (error) {
        alert(error.message)
      } finally {
        setIsRegenerating(false)
      }
    }
  }

  const handleSaveTable = async (formData) => {
    setIsSaving(true)
    try {
      if (editingTable) {
        await updateTable(editingTable.id, formData)
        alert('Meja berhasil diupdate!')
      } else {
        const response = await createTable(formData)
        alert('Meja berhasil dibuat!')
        
        // Auto-open QR modal for new table
        if (response.data.table) {
          setTimeout(() => {
            setSelectedTable(response.data.table)
            setShowQRModal(true)
          }, 300)
        }
      }
      
      setShowFormModal(false)
      setEditingTable(null)
    } catch (error) {
      alert(error.message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleFilterChange = (newFilters) => {
    setFilters({ ...newFilters, page: 1 }) // Reset to page 1 on filter change
  }

  const handlePageChange = (newPage) => {
    setFilters({ ...filters, page: newPage })
  }

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
                setEditingTable(null)
                setShowFormModal(true)
              }}
              className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              <Plus size={18} />
              <span>Tambah Meja</span>
            </button>
          </div>

          {/* Error State */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Stats */}
          {!loading && tables.length > 0 && <TableStats tables={tables} />}

          {/* Filters */}
          <TableFilters filters={filters} onFilterChange={handleFilterChange} />

          {/* Content */}
          {loading ? (
            <LoadingSpinner text="Memuat data meja..." />
          ) : tables.length === 0 ? (
            <EmptyState
              title="Tidak ada meja"
              description={filters.search || filters.status ? 'Tidak ada meja yang sesuai filter' : 'Tambahkan meja baru untuk memulai'}
              action={
                !filters.search && !filters.status && (
                  <button
                    onClick={() => setShowFormModal(true)}
                    className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                  >
                    <Plus size={18} className="inline mr-2" />
                    Tambah Meja
                  </button>
                )
              }
            />
          ) : (
            <>
              {/* Tables Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
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

              {/* Pagination */}
              {pagination.total_pages > 1 && (
                <div className="flex items-center justify-between card p-4">
                  <p className="text-sm text-gray-600">
                    Menampilkan {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} dari {pagination.total} meja
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <span className="px-4 py-2 bg-primary-50 text-primary-600 rounded-lg font-medium">
                      {pagination.page} / {pagination.total_pages}
                    </span>
                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.total_pages}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modals */}
      {showFormModal && (
        <TableFormModal
          table={editingTable}
          onClose={() => {
            setShowFormModal(false)
            setEditingTable(null)
          }}
          onSave={handleSaveTable}
          isLoading={isSaving}
        />
      )}
      {showQRModal && (
        <TableQRModal
          table={selectedTable}
          onClose={() => {
            setShowQRModal(false)
            setSelectedTable(null)
          }}
          onRegenerate={handleRegenerateQR}
          isRegenerating={isRegenerating}
        />
      )}
    </div>
  )
}

export default TableManagement