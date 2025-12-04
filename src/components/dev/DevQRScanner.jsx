import React, { useState, useEffect, useRef } from 'react'
import { QrCode, Table, Users, MapPin, RefreshCw, Camera, X, ImageIcon } from 'lucide-react'
import { qrService } from '../../services/qrService'
import { apiService } from '../../services/api'
import useCartStore from '../../store/useCartStore'

const DevQRScanner = ({ onQRScanned }) => {
  const [tables, setTables] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedTable, setSelectedTable] = useState('')
  const [scanMode, setScanMode] = useState('select') // 'select', 'camera', 'image'
  const [cameraError, setCameraError] = useState(null)
  const [scanning, setScanning] = useState(false)
  const [jsQRLoaded, setJsQRLoaded] = useState(false)
  const [scanDebug, setScanDebug] = useState('')
  
  const { sessionToken, tableInfo } = useCartStore()
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)
  const scanIntervalRef = useRef(null)
  const jsQRRef = useRef(null)

  useEffect(() => {
    loadTables()
    checkURLQR()
    preloadJsQR()
    
    return () => {
      stopCamera()
    }
  }, [])

  // Preload jsQR library
  const preloadJsQR = async () => {
    try {
      const script = document.createElement('script')
      script.src = 'https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js'
      script.async = true
      script.onload = () => {
        jsQRRef.current = window.jsQR
        setJsQRLoaded(true)
        console.log('✅ jsQR library loaded')
      }
      script.onerror = () => {
        console.error('❌ Failed to load jsQR library')
      }
      document.body.appendChild(script)
    } catch (error) {
      console.error('Error loading jsQR:', error)
    }
  }

  // Check for QR in URL
  const checkURLQR = () => {
    const urlParams = new URLSearchParams(window.location.search)
    const qrParam = urlParams.get('qr')
    
    if (qrParam && !sessionToken) {
      console.log('🔗 QR found in URL:', qrParam)
      handleQRScan(qrParam)
    }
  }

  const loadTables = async () => {
    try {
      const response = await apiService.get('/test/tables')
      if (response.data.success) {
        setTables(response.data.data)
        console.log('📋 Tables loaded:', response.data.data)
      }
    } catch (error) {
      console.error('Failed to load tables:', error)
    }
  }

  const handleQRScan = async (qrCode) => {
    setLoading(true)
    console.log('🔍 Attempting to scan QR:', qrCode)
    
    try {
      const result = await qrService.scanQRCode(qrCode)
      
      if (result.success) {
        console.log('✅ QR scan successful:', result.data)
        
        if (onQRScanned) {
          onQRScanned(result.data)
        }
        
        await loadTables()
        
        // Clear URL parameter
        const url = new URL(window.location)
        url.searchParams.delete('qr')
        window.history.replaceState({}, '', url)
        
        // Stop camera if active
        stopCamera()
        setScanMode('select')
        
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
        qrService.clearSession()
      }
    } catch (error) {
      console.error('Failed to reset tables:', error)
      alert('Failed to reset tables')
    } finally {
      setLoading(false)
    }
  }

  // Camera Functions
  const startCamera = async () => {
    if (!jsQRLoaded) {
      alert('QR scanner library is still loading. Please wait a moment and try again.')
      return
    }

    setScanMode('camera')
    setCameraError(null)
    setScanDebug('Initializing camera...')
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      })
      
      streamRef.current = stream
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
        setScanning(true)
        setScanDebug('Camera active. Point at QR code...')
        
        // Wait a bit for camera to stabilize
        setTimeout(() => {
          startScanning()
        }, 500)
      }
    } catch (error) {
      console.error('Camera error:', error)
      setCameraError(error.message)
      setScanMode('select')
      alert('Camera access denied or not available. Please allow camera permissions.')
    }
  }

  const stopCamera = () => {
    setScanning(false)
    setScanDebug('')
    
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current)
      scanIntervalRef.current = null
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
  }

  const startScanning = () => {
    if (scanIntervalRef.current) return
    
    let scanCount = 0
    scanIntervalRef.current = setInterval(() => {
      scanCount++
      captureAndDecode(scanCount)
    }, 300) // Scan every 300ms for better performance
  }

  const captureAndDecode = async (scanCount) => {
    if (!videoRef.current || !canvasRef.current || !jsQRRef.current) return
    
    const video = videoRef.current
    const canvas = canvasRef.current
    
    // Check if video is ready
    if (video.readyState !== video.HAVE_ENOUGH_DATA) {
      return
    }
    
    const context = canvas.getContext('2d', { willReadFrequently: true })
    
    // Set canvas size to video size
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    
    if (canvas.width === 0 || canvas.height === 0) {
      return
    }
    
    // Draw current video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height)
    
    // Get image data
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
    
    try {
      // Decode QR code
      const code = jsQRRef.current(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "dontInvert",
      })
      
      if (code && code.data) {
        console.log('📷 QR Code detected:', code.data)
        setScanDebug(`QR detected: ${code.data.substring(0, 30)}...`)
        
        // Extract QR code from the data
        let qrCode = code.data
        
        // If it's a URL, extract the qr parameter
        if (qrCode.includes('?qr=')) {
          const urlParams = new URLSearchParams(qrCode.split('?')[1])
          qrCode = urlParams.get('qr')
        } else if (qrCode.includes('/scan/')) {
          qrCode = qrCode.split('/scan/').pop()
        } else if (qrCode.startsWith('http')) {
          // If it's a full URL but doesn't have ?qr=, might be encoded differently
          try {
            const url = new URL(qrCode)
            const qrParam = url.searchParams.get('qr')
            if (qrParam) qrCode = qrParam
          } catch (e) {
            // Not a valid URL, use as-is
          }
        }
        
        console.log('📷 Extracted QR value:', qrCode)
        
        // Stop scanning and process the QR
        stopCamera()
        handleQRScan(qrCode)
      } else {
        // Update debug info every 10 scans
        if (scanCount % 10 === 0) {
          setScanDebug(`Scanning... (${scanCount} attempts)`)
        }
      }
    } catch (error) {
      console.error('Decode error:', error)
      if (scanCount % 20 === 0) {
        setScanDebug(`Scanning... (${scanCount} attempts)`)
      }
    }
  }

  // Image Upload Functions
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    if (!jsQRLoaded) {
      alert('QR scanner library is still loading. Please wait a moment and try again.')
      return
    }
    
    setLoading(true)
    setScanMode('image')
    
    try {
      // ✅ FIX: Use document.createElement instead of new Image()
      const img = document.createElement('img')
      const reader = new FileReader()
      
      reader.onload = async (event) => {
        img.src = event.target.result
        
        img.onload = async () => {
          // Draw to canvas
          const canvas = canvasRef.current
          const context = canvas.getContext('2d')
          
          canvas.width = img.width
          canvas.height = img.height
          context.drawImage(img, 0, 0)
          
          // Get image data
          const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
          
          try {
            const code = jsQRRef.current(imageData.data, imageData.width, imageData.height)
            
            if (code && code.data) {
              let qrCode = code.data
              
              if (qrCode.includes('?qr=')) {
                const urlParams = new URLSearchParams(qrCode.split('?')[1])
                qrCode = urlParams.get('qr')
              } else if (qrCode.includes('/scan/')) {
                qrCode = qrCode.split('/scan/').pop()
              }
              
              console.log('🖼️ QR from image:', qrCode)
              setScanMode('select')
              handleQRScan(qrCode)
            } else {
              alert('No QR code found in the image')
              setScanMode('select')
            }
          } catch (error) {
            console.error('Image decode error:', error)
            alert('Failed to decode QR code from image')
            setScanMode('select')
          } finally {
            setLoading(false)
          }
        }
        
        img.onerror = () => {
          alert('Failed to load image')
          setScanMode('select')
          setLoading(false)
        }
      }
      
      reader.onerror = () => {
        alert('Failed to read file')
        setScanMode('select')
        setLoading(false)
      }
      
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Image upload error:', error)
      alert('Failed to process image: ' + error.message)
      setScanMode('select')
      setLoading(false)
    }
  }

  const getTableIcon = (tableNumber) => {
    if (tableNumber?.includes('VIP')) return <Users className="w-4 h-4" />
    if (tableNumber?.includes('OUT')) return <MapPin className="w-4 h-4" />
    return <Table className="w-4 h-4" />
  }

  const getTableType = (tableNumber) => {
    if (tableNumber?.includes('VIP')) return 'VIP'
    if (tableNumber?.includes('OUT')) return 'Outdoor'
    return 'Regular'
  }

  // Active session display
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
          <h3 className="font-bold text-gray-900">QR Scanner</h3>
          <p className="text-sm text-gray-600">
            Scan table QR code to start {!jsQRLoaded && '(Loading scanner...)'}
          </p>
        </div>
      </div>

      {/* Scan Mode Selector */}
      {scanMode === 'select' && (
        <>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <button
              onClick={startCamera}
              disabled={!jsQRLoaded}
              className="flex flex-col items-center justify-center p-4 border-2 border-primary-300 rounded-lg hover:bg-primary-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Camera className="w-6 h-6 text-primary-600 mb-2" />
              <span className="text-sm font-medium text-gray-700">Camera</span>
            </button>
            
            <label className={`flex flex-col items-center justify-center p-4 border-2 border-cream-300 rounded-lg hover:bg-cream-50 transition-colors ${!jsQRLoaded ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
              <ImageIcon className="w-6 h-6 text-gray-600 mb-2" />
              <span className="text-sm font-medium text-gray-700">Upload</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={!jsQRLoaded}
                className="hidden"
              />
            </label>
            
            <button
              onClick={() => setScanMode('select')}
              className="flex flex-col items-center justify-center p-4 border-2 border-cream-300 rounded-lg hover:bg-cream-50 transition-colors"
            >
              <Table className="w-6 h-6 text-gray-600 mb-2" />
              <span className="text-sm font-medium text-gray-700">Select</span>
            </button>
          </div>

          {/* Table Selector */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Or select table manually:
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
                  <option key={table.id} value={table.qr_value}>
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
                onClick={() => table.status === 'Tersedia' && table.qr_value && handleQRScan(table.qr_value)}
                disabled={table.status === 'Terisi' || loading || !table.qr_value}
                className={`p-3 rounded-lg border-2 text-left transition-all duration-200 ${
                  table.status === 'Free' && table.qr_value
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

          {/* Reset Button */}
          <button
            onClick={resetTables}
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset All Tables</span>
          </button>
        </>
      )}

      {/* Camera View */}
      {scanMode === 'camera' && (
        <div className="space-y-4">
          <div className="relative bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '4/3' }}>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            
            {scanning && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="relative w-64 h-64">
                  {/* Scanning frame */}
                  <div className="absolute inset-0 border-4 border-primary-500 rounded-lg"></div>
                  {/* Corner markers */}
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white"></div>
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white"></div>
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white"></div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white"></div>
                  
                  {/* Scanning line animation */}
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="h-1 bg-primary-400 animate-scan"></div>
                  </div>
                </div>
              </div>
            )}
            
            {cameraError && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75">
                <div className="text-center text-white p-4">
                  <p className="font-semibold mb-2">Camera Error</p>
                  <p className="text-sm">{cameraError}</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Debug info */}
          {scanDebug && (
            <div className="text-center text-sm text-gray-600 bg-gray-50 p-2 rounded">
              {scanDebug}
            </div>
          )}
          
          <div className="flex space-x-3">
            <button
              onClick={() => {
                stopCamera()
                setScanMode('select')
              }}
              className="flex-1 flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              <X className="w-5 h-5" />
              <span>Cancel</span>
            </button>
          </div>
          
          <p className="text-center text-sm text-gray-600">
            {scanning ? 'Point camera at QR code...' : 'Initializing camera...'}
          </p>
        </div>
      )}

      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Status */}
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          {tables.filter(t => t.status === 'Free').length} of {tables.length} tables available
        </p>
      </div>
      
      <style>{`
        @keyframes scan {
          0% { transform: translateY(0); }
          100% { transform: translateY(256px); }
        }
        .animate-scan {
          animation: scan 2s linear infinite;
        }
      `}</style>
    </div>
  )
}

export default DevQRScanner