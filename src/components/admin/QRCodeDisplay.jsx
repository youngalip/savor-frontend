// components/admin/QRCodeDisplay.jsx
import React, { useState, useEffect } from 'react'
import { Download, Eye, RefreshCw } from 'lucide-react'
import { apiService } from '../../services/api'

const QRCodeDisplay = ({ tableId, tableName, qrCode }) => {
  const [qrImageUrl, setQrImageUrl] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => {
    if (qrCode) {
      loadQRImage()
    }
  }, [qrCode])

  const loadQRImage = async () => {
    try {
      // Build URL to Laravel storage
      // Assuming your Laravel backend is at the same domain or configured CORS
      const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
      const imageUrl = `${baseURL}/storage/${qrCode}`
      setQrImageUrl(imageUrl)
    } catch (error) {
      console.error('Failed to load QR image:', error)
    }
  }

  const handleRegenerate = async () => {
    setLoading(true)
    try {
      const response = await apiService.post(`/admin/tables/${tableId}/generate-qr`)
      
      if (response.data.success) {
        // Reload the QR image
        await loadQRImage()
        alert('QR code regenerated successfully')
      }
    } catch (error) {
      console.error('Failed to regenerate QR:', error)
      alert('Failed to regenerate QR code')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    if (!qrImageUrl) return
    
    // Create download link
    const link = document.createElement('a')
    link.href = qrImageUrl
    link.download = `table-${tableName}-qr.svg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-3">
      {/* QR Image Preview */}
      {qrImageUrl && (
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <img 
            src={qrImageUrl} 
            alt={`QR Code for ${tableName}`}
            className="w-full h-auto max-w-xs mx-auto"
            onError={(e) => {
              console.error('QR image failed to load')
              e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23f0f0f0" width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" fill="%23999"%3ENo QR%3C/text%3E%3C/svg%3E'
            }}
          />
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-2">
        <button
          onClick={() => setShowPreview(true)}
          className="flex-1 flex items-center justify-center space-x-2 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Eye className="w-4 h-4" />
          <span>Preview</span>
        </button>

        <button
          onClick={handleDownload}
          disabled={!qrImageUrl}
          className="flex-1 flex items-center justify-center space-x-2 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-4 h-4" />
          <span>Download</span>
        </button>

        <button
          onClick={handleRegenerate}
          disabled={loading}
          className="flex items-center justify-center space-x-2 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowPreview(false)}
        >
          <div 
            className="bg-white rounded-xl p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold mb-4">QR Code - {tableName}</h3>
            <img 
              src={qrImageUrl} 
              alt={`QR Code for ${tableName}`}
              className="w-full h-auto"
            />
            <button
              onClick={() => setShowPreview(false)}
              className="mt-4 w-full bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default QRCodeDisplay