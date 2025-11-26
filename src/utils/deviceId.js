// src/utils/deviceId.js

/**
 * Get or generate device ID for tracking user across sessions
 * Device ID persists in localStorage until cleared
 * 
 * @returns {string} - UUID device identifier
 */
export const getDeviceId = () => {
  const STORAGE_KEY = 'device_id'
  let deviceId = localStorage.getItem(STORAGE_KEY)

  if (!deviceId) {
    // Gunakan crypto.randomUUID kalau tersedia, fallback ke generator sederhana
    deviceId = (crypto && crypto.randomUUID) 
      ? crypto.randomUUID()
      : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
          const r = (Math.random() * 16) | 0
          const v = c === 'x' ? r : (r & 0x3) | 0x8
          return v.toString(16)
        })

    localStorage.setItem(STORAGE_KEY, deviceId)
    console.log('🆕 New device ID generated:', deviceId)
  } else {
    console.log('📱 Existing device ID found:', deviceId)
  }

  return deviceId
}

/** Clear device ID (for testing or logout) */
export const clearDeviceId = () => {
  localStorage.removeItem('device_id')
  console.log('🗑️ Device ID cleared')
}

/** Check if device ID exists */
export const hasDeviceId = () => !!localStorage.getItem('device_id')

export default { getDeviceId, clearDeviceId, hasDeviceId }
