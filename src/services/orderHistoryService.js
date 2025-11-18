// src/services/orderHistoryService.js
import { apiService } from './api'
import { getDeviceId } from '../utils/deviceId'

// Ubah satu order dari backend → bentuk UI
const normalizeOrder = (o) => {
  if (!o) return null

  const items = Array.isArray(o.items)
    ? o.items.map(it => ({
        menu_id: it.menu_id,
        menu_name: it.menu?.name ?? it.menu_name ?? 'Unknown Item',
        quantity: Number(it.quantity) || 0,
        price: Number(it.price) || 0,
        subtotal: Number(it.subtotal) || 0,
        special_notes: it.special_notes ?? null,
        status: it.status ?? 'Pending',
      }))
    : []

  return {
    uuid: o.order_uuid ?? o.uuid,
    order_uuid: o.order_uuid ?? o.uuid,
    order_number: o.order_number,
    payment_status: o.payment_status ?? 'Pending',
    payment_reference: o.payment_reference ?? null,

    created_at: o.created_at ?? null,
    updated_at: o.updated_at ?? null,
    paid_at: o.paid_at ?? null,

    table_number: o.table?.table_number ?? o.table_number ?? null,

    subtotal: Number(o.subtotal) || 0,
    service_charge: Number(o.service_charge_amount) || 0,
    tax: Number(o.tax_amount) || 0,
    total_amount: Number(o.total_amount) || 0,

    notes: o.notes ?? null,

    items,
    items_count: items.length,
  }
}

const normalizeList = (orders) => (Array.isArray(orders) ? orders.map(normalizeOrder) : [])

export const orderHistoryService = {
  getDeviceHistory: async () => {
    try {
      const deviceId = getDeviceId()
      const response = await apiService.get('/orders/history/device', {
        params: { device_id: deviceId },
      })
      const payload = response.data
      if (payload?.success) {
        const raw = payload.data ?? {}
        const normalizedOrders = normalizeList(raw.orders)
        return {
          success: true,
          data: {
            orders: normalizedOrders,
            total_orders: raw.total_orders ?? normalizedOrders.length,
            total_spent: Number(raw.total_spent) || 0,
          },
        }
      }
      throw new Error(payload?.message || 'Failed to fetch order history')
    } catch (error) {
      console.error('❌ Failed to fetch order history:', error)
      return {
        success: false,
        error: error?.response?.data?.message || error.message || 'Failed to fetch order history',
      }
    }
  },

  getOrderDetail: async (orderUuid) => {
    try {
      const response = await apiService.get(`/orders/${orderUuid}`)
      const payload = response.data
      if (payload?.success && payload?.data) {
        const o = payload.data
        const normalized = normalizeOrder({
          ...o,
          subtotal: o.subtotal ?? o.breakdown?.subtotal,
          service_charge_amount: o.service_charge_amount ?? o.breakdown?.service_charge?.amount,
          tax_amount: o.tax_amount ?? o.breakdown?.tax?.amount,
          total_amount: o.total_amount ?? o.breakdown?.total,
        })
        return { success: true, data: normalized }
      }
      throw new Error(payload?.message || 'Failed to fetch order detail')
    } catch (error) {
      console.error('❌ Failed to fetch order detail:', error)
      return {
        success: false,
        error: error?.response?.data?.message || error.message,
      }
    }
  },

  reorder: async (items) => {
    try {
      return { success: true, message: 'Items added to cart', data: { items } }
    } catch (error) {
      return { success: false, error: error.message }
    }
  },
}

export default orderHistoryService
