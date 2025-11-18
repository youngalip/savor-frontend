// src/services/tableService.js
import apiClient from './api'

/**
 * Table Management API Service
 * Endpoints: /api/v1/owner/tables
 */
export const tableService = {
  /**
   * Get all tables with pagination and filters
   * @param {Object} params - { search, status, limit, page }
   * @returns {Promise} Response with tables array and pagination
   */
  getAllTables: async (params = {}) => {
    try {
      const { data } = await apiClient.get('/owner/tables', { params })
      return data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Gagal memuat data meja')
    }
  },

  /**
   * Get single table by ID
   * @param {number} id - Table ID
   * @returns {Promise} Response with table data
   */
  getTableById: async (id) => {
    try {
      const { data } = await apiClient.get(`/owner/tables/${id}`)
      return data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Gagal memuat detail meja')
    }
  },

  /**
   * Create new table
   * @param {Object} tableData - { table_number, status? }
   * @returns {Promise} Response with created table and QR code
   */
  createTable: async (tableData) => {
    try {
      const { data } = await apiClient.post('/owner/tables', tableData)
      return data
    } catch (error) {
      const message = error.response?.data?.message || 'Gagal membuat meja'
      const errors = error.response?.data?.errors
      
      if (errors?.table_number) {
        throw new Error(errors.table_number[0])
      }
      
      throw new Error(message)
    }
  },

  /**
   * Update existing table
   * @param {number} id - Table ID
   * @param {Object} tableData - { table_number?, status? }
   * @returns {Promise} Response with updated table
   */
  updateTable: async (id, tableData) => {
    try {
      const { data } = await apiClient.put(`/owner/tables/${id}`, tableData)
      return data
    } catch (error) {
      const message = error.response?.data?.message || 'Gagal mengupdate meja'
      const errors = error.response?.data?.errors
      
      if (errors?.table_number) {
        throw new Error(errors.table_number[0])
      }
      
      throw new Error(message)
    }
  },

  /**
   * Delete table
   * @param {number} id - Table ID
   * @returns {Promise} Response with success message
   */
  deleteTable: async (id) => {
    try {
      const { data } = await apiClient.delete(`/owner/tables/${id}`)
      return data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Gagal menghapus meja')
    }
  },

  /**
   * Generate/Regenerate QR code for table
   * @param {number} id - Table ID
   * @returns {Promise} Response with new QR code data
   */
  generateQRCode: async (id) => {
    try {
      const { data } = await apiClient.post(`/owner/tables/${id}/generate-qr`)
      return data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Gagal generate QR code')
    }
  },

  /**
   * Bulk generate QR codes for multiple tables
   * @param {Array<number>} tableIds - Array of table IDs
   * @returns {Promise} Response with success/failed results
   */
  bulkGenerateQR: async (tableIds) => {
    try {
      const { data } = await apiClient.post('/owner/tables/generate-qr-bulk', {
        table_ids: tableIds
      })
      return data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Gagal bulk generate QR code')
    }
  }
}

export default tableService