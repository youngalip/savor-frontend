import React, { useState, useEffect } from 'react'
import { QrCode, Table, Users, MapPin, RefreshCw } from 'lucide-react'
import { qrService } from '../../services/qrService'
import { apiService } from '../../services/api'
import useCartStore from '../../store/useCartStore'

const DevQRScanner = ({ onQRScanned }) => {
  const [tables, setTables] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedTable, setSelectedTable] = useState('')
  const { sessionToken, tableInfo } = useCartStore()

  // Load available tables on mount
  useEffect(() => {
    loadTables()
  }, [])

  // Check for QR in URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const qrParam = urlParams.get('qr')
    
    if (qrParam && !sessionToken) {
      console.log('🔗 QR found in URL:', qrParam)
      handleQRScan(qrParam)
    }
  }, [sessionToken])

  const loadTables = async () => {
    try {
      const response = await apiService.get('/test/tables')
      if (response.data.success) {
        setTables(response.data.data)
      }
    } catch (error) {
      console.error('Failed to load tables:', error)
    }
  }

  const handleQRScan = async (qrCode) => {
    setLoading(true)
    
    try {
      const result = await qrService.scanQRCode(qrCode)
      
      if (result.success) {
        console.log('✅ QR scan successful:', result.data)
        
        // Call callback if provided
        if (onQRScanned) {
          onQRScanned(result.data)
        }
        
        // Reload tables to update status
        await loadTables()
        
        // Clear URL parameter
        const url = new URL(window.location)
        url.searchParams.delete('qr')
        window.history.replaceState({}, '', url)
        
      } else {
        alert(`QR Scan Failed: ${result.error}`)
      }
    } catch (error) {
      console.error('QR scan error:', error)
      alert('QR scan failed. Please try again.')
    } finally {
      setLoading(false)
      setSelectedTable('')
    }
  }

  const handleTableSelect = (e) => {
    const qrCode = e.target.value
    setSelectedTable(qrCode)
    
    if (qrCode) {
      handleQRScan(qrCode)
    }
  }

  const resetTables = async () => {
    try {
      setLoading(true)
      const response = await apiService.post('/test/reset-tables')
      
      if (response.data.success) {
        alert('All tables reset to Free status')
        await loadTables()
        
        // Clear current session if exists
        qrService.clearSession()
      }
    } catch (error) {
      console.error('Failed to reset tables:', error)
      alert('Failed to reset tables')
    } finally {
      setLoading(false)
    }
  }

  const getTableIcon = (tableNumber) => {
    if (tableNumber.includes('VIP')) return <Users className="w-4 h-4" />
    if (tableNumber.includes('OUT')) return <MapPin className="w-4 h-4" />
    return <Table className="w-4 h-4" />
  }

  const getTableType = (tableNumber) => {
    if (tableNumber.includes('VIP')) return 'VIP'
    if (tableNumber.includes('OUT')) return 'Outdoor'
    return 'Regular'
  }

  // Don't show if already have session
  if (sessionToken && tableInfo) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <QrCode className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-green-800">Session Active</h3>
            <p className="text-sm text-green-600">
              Table {tableInfo.table_number} • {getTableType(tableInfo.table_number)}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-cream-200 p-6 mb-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
          <QrCode className="w-5 h-5 text-primary-600" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900">Development QR Scanner</h3>
          <p className="text-sm text-gray-600">Select a table to simulate QR scan</p>
        </div>
      </div>

      {/* Table Selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Table QR Code:
        </label>
        <select
          value={selectedTable}
          onChange={handleTableSelect}
          disabled={loading}
          className="w-full px-3 py-2 border border-cream-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100"
        >
          <option value="">Choose a table...</option>
          {tables
            .filter(table => table.status === 'Free')
            .map((table) => (
              <option key={table.id} value={table.qr_code}>
                Table {table.table_number} - {getTableType(table.table_number)} ({table.status})
              </option>
            ))}
        </select>
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {tables.slice(0, 6).map((table) => (
          <button
            key={table.id}
            onClick={() => table.status === 'Free' && handleQRScan(table.qr_code)}
            disabled={table.status === 'Occupied' || loading}
            className={`p-3 rounded-lg border-2 text-left transition-all duration-200 ${
              table.status === 'Free'
                ? 'border-cream-200 hover:border-primary-300 hover:bg-primary-50 cursor-pointer'
                : 'border-red-200 bg-red-50 cursor-not-allowed opacity-60'
            }`}
          >
            <div className="flex items-center space-x-2 mb-1">
              {getTableIcon(table.table_number)}
              <span className="font-semibold text-sm">Table {table.table_number}</span>
            </div>
            <p className="text-xs text-gray-500">{getTableType(table.table_number)}</p>
            <p className={`text-xs font-medium ${
              table.status === 'Free' ? 'text-green-600' : 'text-red-600'
            }`}>
              {table.status}
            </p>
          </button>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="flex space-x-3">
        <button
          onClick={() => handleQRScan('QR_A1_1761053954')}
          disabled={loading}
          className="flex-1 bg-primary-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-primary-600 transition-colors disabled:opacity-50"
        >
          {loading ? 'Scanning...' : 'Quick Scan A1'}
        </button>
        
        <button
          onClick={resetTables}
          disabled={loading}
          className="flex items-center space-x-2 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Reset All</span>
        </button>
      </div>

      {/* URL Helper */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-700 mb-2">
          <strong>Quick URL Access:</strong>
        </p>
        <div className="space-y-1">
          <code className="text-xs text-blue-600 block">
            ?qr=QR_A1_1761053954 (Table A1)
          </code>
          <code className="text-xs text-blue-600 block">
            ?qr=QR_VIP1_1761053954 (VIP Table)
          </code>
          <code className="text-xs text-blue-600 block">
            ?qr=QR_OUT1_1761053954 (Outdoor)
          </code>
        </div>
      </div>

      {/* Current Status */}
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          {tables.filter(t => t.status === 'Free').length} of {tables.length} tables available
        </p>
      </div>
    </div>
  )
}

export default DevQRScanner