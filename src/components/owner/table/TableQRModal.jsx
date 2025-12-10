// src/components/owner/table/TableQRModal.jsx
import { useState, useEffect } from 'react'
import { Download, RefreshCw, Printer, AlertCircle } from 'lucide-react'
import Modal from '../../common/Modal'

const TableQRModal = ({ table, onClose, onRegenerate, isRegenerating }) => {
  const [imageError, setImageError] = useState(false)
  const [qrDisplay, setQrDisplay] = useState(null)

  const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'

  useEffect(() => {
    if (table) {
      // Debug: Log table data
      console.log('Table QR Data:', {
        qr_code: table.qr_code,
        qr_svg: table.qr_svg ? 'SVG Available' : 'No SVG',
        table_number: table.table_number
      })
      
      setImageError(false)
      prepareQRDisplay()
    }
  }, [table])

  const prepareQRDisplay = () => {
    // Priority 1: Use raw SVG if available (from backend response)
    if (table.qr_svg) {
      setQrDisplay({
        type: 'svg',
        content: table.qr_svg
      })
      console.log('✅ Using raw SVG content')
      return
    }

    // Priority 2: Use image URL
    if (table.qr_code) {
      const imageUrl = `${API_URL}${table.qr_code}`
      setQrDisplay({
        type: 'image',
        url: imageUrl
      })
      console.log('✅ Using image URL:', imageUrl)
      return
    }

    // No QR available
    setQrDisplay(null)
    console.log('❌ No QR code available')
  }

  const handleImageError = (e) => {
    console.error('❌ Image failed to load:', e.target.src)
    setImageError(true)
  }

  const handleDownload = () => {
    if (!table.qr_code) return

    // Try to download from backend
    const link = document.createElement('a')
    link.href = `${API_URL}${table.qr_code}`
    link.download = `QR_Meja_${table.table_number}.svg`
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handlePrint = () => {
    if (!qrDisplay) return

    const printWindow = window.open('', '_blank')
    
    let qrContent = ''
    if (qrDisplay.type === 'svg') {
      qrContent = qrDisplay.content
    } else if (qrDisplay.type === 'image') {
      qrContent = `<img src="${qrDisplay.url}" style="max-width: 400px;" />`
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>QR Code - Meja ${table.table_number}</title>
          <style>
            body { 
              font-family: Arial, sans-serif;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
            }
            .qr-container {
              text-align: center;
              padding: 40px;
            }
            h1 { margin-bottom: 20px; }
            svg, img { max-width: 400px; height: auto; }
          </style>
        </head>
        <body>
          <div class="qr-container">
            <h1>Meja ${table.table_number}</h1>
            ${qrContent}
            <p>Scan untuk mulai order</p>
          </div>
          <script>
            window.onload = () => {
              setTimeout(() => window.print(), 500)
            }
          </script>
        </body>
      </html>
    `)
    printWindow.document.close()
  }

  if (!table) return null

  return (
    <Modal 
      isOpen 
      onClose={onClose} 
      title={`QR Code - Meja ${table.table_number}`}
      size="lg"
    >
      <div className="space-y-6">
        {/* QR Code Display */}
        <div className="flex justify-center bg-gray-50 rounded-lg p-8 min-h-[300px] items-center">
          {!qrDisplay ? (
            // No QR Code
            <div className="text-center">
              <div className="w-64 h-64 bg-gray-200 rounded flex items-center justify-center">
                <p className="text-gray-500">QR Code belum di-generate</p>
              </div>
            </div>
          ) : qrDisplay.type === 'svg' ? (
            // Display Raw SVG
            <div 
              className="w-64 h-64"
              dangerouslySetInnerHTML={{ __html: qrDisplay.content }}
            />
          ) : qrDisplay.type === 'image' && !imageError ? (
            // Display Image
            <img 
              src={qrDisplay.url}
              alt={`QR Meja ${table.table_number}`}
              className="w-64 h-64"
              onError={handleImageError}
            />
          ) : (
            // Image Load Error
            <div className="text-center">
              <div className="w-64 h-64 bg-red-50 border-2 border-red-200 rounded flex flex-col items-center justify-center p-4">
                <AlertCircle size={48} className="text-red-500 mb-4" />
                <p className="text-red-600 font-medium mb-2">Gagal memuat QR Code</p>
                <p className="text-sm text-red-500">Path: {table.qr_code}</p>
                <p className="text-xs text-gray-500 mt-2">URL: {qrDisplay.url}</p>
              </div>
            </div>
          )}
        </div>

        {/* Debug Info (Hapus di production) */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-xs">
          <p className="font-bold text-yellow-800 mb-1">Debug Info:</p>
          <p className="text-yellow-700">QR Path: {table.qr_code || 'N/A'}</p>
          <p className="text-yellow-700">Display Type: {qrDisplay?.type || 'None'}</p>
          <p className="text-yellow-700">API URL: {API_URL}</p>
          {qrDisplay?.type === 'image' && (
            <p className="text-yellow-700">Full URL: {qrDisplay.url}</p>
          )}
        </div>

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Info:</strong> Customer dapat scan QR code ini untuk mulai melakukan order di meja {table.table_number}
          </p>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={handleDownload}
            disabled={!qrDisplay}
            className="flex flex-col items-center gap-2 px-4 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download size={20} />
            <span className="text-xs font-medium">Download</span>
          </button>
          <button
            onClick={handlePrint}
            disabled={!qrDisplay}
            className="flex flex-col items-center gap-2 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Printer size={20} />
            <span className="text-xs font-medium">Print</span>
          </button>
          <button
            onClick={() => onRegenerate(table.id)}
            disabled={isRegenerating}
            className="flex flex-col items-center gap-2 px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={20} className={isRegenerating ? 'animate-spin' : ''} />
            <span className="text-xs font-medium">
              {isRegenerating ? 'Generating...' : 'Regenerate'}
            </span>
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default TableQRModal