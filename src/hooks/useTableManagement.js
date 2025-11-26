// src/hooks/useTableManagement.js
import { useState, useCallback } from 'react'
import { tableService } from '../services/tableService'

/**
 * Custom Hook for Table Management
 * Handles state, API calls, and business logic
 */
export const useTableManagement = () => {
  // State
  const [tables, setTables] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    total_pages: 0
  })

  /**
   * Fetch tables with filters
   * @param {Object} params - { search, status, limit, page }
   */
  const fetchTables = useCallback(async (params = {}) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await tableService.getAllTables(params)
      
      if (response.success) {
        setTables(response.data.tables)
        setPagination(response.data.pagination)
      } else {
        setError('Gagal memuat data meja')
      }
    } catch (err) {
      setError(err.message)
      console.error('Error fetching tables:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Get single table by ID
   * @param {number} id - Table ID
   * @returns {Promise<Object>}
   */
  const getTableById = useCallback(async (id) => {
    try {
      const response = await tableService.getTableById(id)
      return response.data
    } catch (err) {
      throw new Error(err.message)
    }
  }, [])

  /**
   * Create new table
   * @param {Object} tableData - { table_number, status? }
   * @returns {Promise<Object>}
   */
  const createTable = useCallback(async (tableData) => {
    try {
      const response = await tableService.createTable(tableData)
      
      if (response.success) {
        // Optionally refetch or update local state
        return response
      }
      
      throw new Error('Gagal membuat meja')
    } catch (err) {
      throw new Error(err.message)
    }
  }, [])

  /**
   * Update existing table
   * @param {number} id - Table ID
   * @param {Object} tableData - { table_number?, status? }
   * @returns {Promise<Object>}
   */
  const updateTable = useCallback(async (id, tableData) => {
    try {
      const response = await tableService.updateTable(id, tableData)
      
      if (response.success) {
        // Update local state
        setTables(prevTables => 
          prevTables.map(table => 
            table.id === id ? response.data : table
          )
        )
        return response
      }
      
      throw new Error('Gagal mengupdate meja')
    } catch (err) {
      throw new Error(err.message)
    }
  }, [])

  /**
   * Delete table
   * @param {number} id - Table ID
   * @returns {Promise<Object>}
   */
  const deleteTable = useCallback(async (id) => {
    try {
      const response = await tableService.deleteTable(id)
      
      if (response.success) {
        // Remove from local state
        setTables(prevTables => prevTables.filter(table => table.id !== id))
        return response
      }
      
      throw new Error('Gagal menghapus meja')
    } catch (err) {
      throw new Error(err.message)
    }
  }, [])

  /**
   * Generate/Regenerate QR code
   * @param {number} id - Table ID
   * @returns {Promise<Object>}
   */
  const regenerateQR = useCallback(async (id) => {
    try {
      const response = await tableService.generateQRCode(id)
      
      if (response.success) {
        // Update local state with new QR
        setTables(prevTables => 
          prevTables.map(table => 
            table.id === id ? response.data.table : table
          )
        )
        return response
      }
      
      throw new Error('Gagal generate QR code')
    } catch (err) {
      throw new Error(err.message)
    }
  }, [])

  /**
   * Bulk generate QR codes
   * @param {Array<number>} tableIds - Array of table IDs
   * @returns {Promise<Object>}
   */
  const bulkGenerateQR = useCallback(async (tableIds) => {
    try {
      const response = await tableService.bulkGenerateQR(tableIds)
      
      if (response.success) {
        // Refetch to get updated data
        return response
      }
      
      throw new Error('Gagal bulk generate QR code')
    } catch (err) {
      throw new Error(err.message)
    }
  }, [])

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  /**
   * Refresh tables (re-fetch with current filters)
   */
  const refreshTables = useCallback(async () => {
    await fetchTables({ 
      page: pagination.page, 
      limit: pagination.limit 
    })
  }, [fetchTables, pagination.page, pagination.limit])

  return {
    // State
    tables,
    loading,
    error,
    pagination,
    
    // Actions
    fetchTables,
    getTableById,
    createTable,
    updateTable,
    deleteTable,
    regenerateQR,
    bulkGenerateQR,
    clearError,
    refreshTables
  }
}

export default useTableManagement