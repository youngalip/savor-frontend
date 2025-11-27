/* eslint-disable no-unused-vars */
// src/services/qrService.js
import { apiService, sessionStorage } from './api'

// Get device info for QR scanning
const getDeviceInfo = () => {
  return {
    screen_width: window.screen.width,
    screen_height: window.screen.height,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  }
}

// Parse QR code (format: QR_B1_1761053954 or QR_VIP1_1761053954 or QR_OUT1_1761053954)
const parseQRCode = (qrCode) => {
  try {
    const parts = qrCode.split('_')
    if (parts.length >= 2 && parts[0] === 'QR') {
      const tableNumber = parts[1]
      const timestamp = parts[2] || null
      
      // Determine table type
      let tableType = 'regular'
      if (tableNumber.includes('VIP')) {
        tableType = 'vip'
      } else if (tableNumber.includes('OUT')) {
        tableType = 'outdoor'
      }
      
      return {
        tableNumber,
        timestamp,
        tableType,
        isValid: true,
        originalQR: qrCode
      }
    }
    return { isValid: false, originalQR: qrCode }
  } catch (error) {
    return { isValid: false, originalQR: qrCode }
  }
}

// Validate QR code format
const validateQRFormat = (qrCode) => {
  if (!qrCode || typeof qrCode !== 'string') {
    return { valid: false, error: 'QR code is required' }
  }
  
  const qrInfo = parseQRCode(qrCode)
  if (!qrInfo.isValid) {
    return { valid: false, error: 'Invalid QR code format' }
  }
  
  return { valid: true, qrInfo }
}

export const qrService = {
  // Scan QR code and establish session
  scanQRCode: async (qrCodeData) => {
    try {
      console.log('📱 Scanning QR Code:', qrCodeData)
      
      // Validate QR format
      const validation = validateQRFormat(qrCodeData)
      if (!validation.valid) {
        throw new Error(validation.error)
      }

      // Get device info
      const deviceInfo = getDeviceInfo()

      // Call backend API
      const response = await apiService.scanQR(qrCodeData, deviceInfo)

      if (response.success) {
        // Store session data locally
        sessionStorage.setSession(response.data)

        console.log('✅ QR scan successful:', response.data)

        return {
          success: true,
          data: {
            customerUuid: response.data.customer_uuid,
            sessionToken: response.data.session_token,
            table: response.data.table,
            sessionExpiresAt: response.data.session_expires_at,
            isReturningCustomer: response.data.is_returning_customer,
            qrInfo: validation.qrInfo
          }
        }
      }

      throw new Error(response.message || 'Failed to scan QR code')
    } catch (error) {
      console.error('❌ QR Scan Error:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message
      }
    }
  },

  // Validate current session
  validateSession: async () => {
    try {
      const session = sessionStorage.getSession()
      
      if (!session.session_token) {
        return {
          success: false,
          error: 'No session token found'
        }
      }

      // Check if session is expired locally first
      if (!sessionStorage.isSessionValid()) {
        sessionStorage.clearSession()
        return {
          success: false,
          error: 'Session expired'
        }
      }

      // Validate with backend
      const response = await apiService.validateSession(session.session_token)

      if (response.success) {
        return {
          success: true,
          data: response.data
        }
      }

      // Session invalid, clear local storage
      sessionStorage.clearSession()
      throw new Error('Session validation failed')
    } catch (error) {
      console.error('❌ Session Validation Error:', error)
      sessionStorage.clearSession()
      return {
        success: false,
        error: error.response?.data?.message || error.message
      }
    }
  },

  // Get current session info
  getCurrentSession: async () => {
    try {
      const session = sessionStorage.getSession()
      
      if (!session.session_token) {
        return {
          success: false,
          error: 'No active session'
        }
      }

      const response = await apiService.getSession(session.session_token)

      if (response.success) {
        return {
          success: true,
          data: {
            ...response.data,
            localTableInfo: session.table_info
          }
        }
      }

      throw new Error('Failed to get session info')
    } catch (error) {
      console.error('❌ Get Session Error:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message
      }
    }
  },

  // Extend session (auto-extend when user is active)
  extendSession: async () => {
    try {
      const session = sessionStorage.getSession()
      
      if (!session.session_token) {
        return {
          success: false,
          error: 'No session to extend'
        }
      }

      const response = await apiService.extendSession(session.session_token)

      if (response.success) {
        // Update local session expiry
        localStorage.setItem('session_expires_at', response.data.session_expires_at)
        
        return {
          success: true,
          data: response.data
        }
      }

      throw new Error('Failed to extend session')
    } catch (error) {
      console.error('❌ Extend Session Error:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message
      }
    }
  },

  // Clear session (logout)
  clearSession: () => {
    sessionStorage.clearSession()
    console.log('🚪 Session cleared')
  },

  // Check if user has active session
  hasActiveSession: () => {
    const session = sessionStorage.getSession()
    return !!(session.session_token && sessionStorage.isSessionValid())
  },

  // Get table info from session
  getTableInfo: () => {
    const session = sessionStorage.getSession()
    return session.table_info
  },

  // Auto-extend session on user activity
  setupAutoExtend: () => {
    let extendTimer
    
    const resetTimer = () => {
      clearTimeout(extendTimer)
      
      // Extend session every 30 minutes if user is active
      extendTimer = setTimeout(async () => {
        if (qrService.hasActiveSession()) {
          console.log('🔄 Auto-extending session...')
          await qrService.extendSession()
        }
      }, 30 * 60 * 1000) // 30 minutes
    }

    // Listen for user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart']
    events.forEach(event => {
      document.addEventListener(event, resetTimer, true)
    })

    // Start timer
    resetTimer()

    // Return cleanup function
    return () => {
      clearTimeout(extendTimer)
      events.forEach(event => {
        document.removeEventListener(event, resetTimer, true)
      })
    }
  },

  // Development helpers
  dev: {
    // Get available QR codes for development
    getAvailableQRCodes: () => [
      'QR_A1_1761053954',
      'QR_A2_1761053954',
      'QR_B2_1761053954',
      'QR_B3_1761053954',
      'QR_VIP1_1761053954',
      'QR_VIP2_1761053954',
      'QR_OUT1_1761053954',
      'QR_OUT2_1761053954'
    ],

    // Simulate QR scan for development
    simulateQRScan: async (tableNumber = 'A1') => {
      const qrCode = `QR_${tableNumber}_1761053954`
      return await qrService.scanQRCode(qrCode)
    },

    // Check for QR in URL parameters
    checkURLForQR: () => {
      const urlParams = new URLSearchParams(window.location.search)
      return urlParams.get('qr')
    },

    // Set QR in URL for sharing
    setURLQR: (qrCode) => {
      const url = new URL(window.location)
      url.searchParams.set('qr', qrCode)
      window.history.pushState({}, '', url)
    },

    // Clear QR from URL
    clearURLQR: () => {
      const url = new URL(window.location)
      url.searchParams.delete('qr')
      window.history.replaceState({}, '', url)
    },

    // Generate QR code URL for printing/testing
    generateQRCodeURL: (qrCode, size = 200) => {
      return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(qrCode)}`
    },

    // Get all tables from test endpoint
    getTables: async () => {
      try {
        const response = await apiService.get('/test/tables')
        return response.data
      } catch (error) {
        console.error('Failed to get tables:', error)
        return { success: false, error: error.message }
      }
    },

    // Reset all tables to Free status
    resetTables: async () => {
      try {
        const response = await apiService.post('/test/reset-tables')
        return response.data
      } catch (error) {
        console.error('Failed to reset tables:', error)
        return { success: false, error: error.message }
      }
    }
  },

  // Utility functions
  utils: {
    parseQRCode,
    validateQRFormat,
    getDeviceInfo,
    
    // Format QR code for display
    formatQRDisplay: (qrCode) => {
      const qrInfo = parseQRCode(qrCode)
      if (!qrInfo.isValid) return qrCode
      
      return `Table ${qrInfo.tableNumber} (${qrInfo.tableType.toUpperCase()})`
    },

    // Get table type from QR
    getTableType: (qrCode) => {
      const qrInfo = parseQRCode(qrCode)
      return qrInfo.isValid ? qrInfo.tableType : 'unknown'
    }
  }
}

export default qrService