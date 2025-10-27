// src/utils/deviceId.js

/**
 * Get or generate device ID for tracking user across sessions
 * Device ID persists in localStorage until cleared
 * 
 * @returns {string} - UUID device identifier
 */
export const getDeviceId = () => {
  const STORAGE_KEY = 'device_id'
  
  // Try to get existing device ID
  let deviceId = localStorage.getItem(STORAGE_KEY)
  
  if (!deviceId) {
    // Generate new UUID
    deviceId = crypto.randomUUID()
    
    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, deviceId)
    
    console.log('📱 New device ID generated:', deviceId)
  } else {
    console.log('📱 Existing device ID found:', deviceId)
  }
  
  return deviceId
}

/**
 * Clear device ID (for testing or logout)
 */
export const clearDeviceId = () => {
  localStorage.removeItem('device_id')
  console.log('🗑️ Device ID cleared')
}

/**
 * Check if device ID exists
 * 
 * @returns {boolean}
 */
export const hasDeviceId = () => {
  return !!localStorage.getItem('device_id')
}

export default {
  getDeviceId,
  clearDeviceId,
  hasDeviceId
}