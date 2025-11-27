// src/services/orderService.js
import { apiService } from './api'
import { sessionStorage } from './api'

// Ubah cart item ke format backend
const transformCartToOrderItems = (cartItems) => {
  return cartItems.map(item => ({
    menu_id: item.id,
    quantity: item.quantity,
    special_notes: item.notes || null
  }))
}

// Ubah order backend → format frontend
const transformOrder = (backendOrder) => {
  return {
    uuid: backendOrder.order_uuid,
    orderNumber: backendOrder.order_number,
    totalAmount: parseFloat(backendOrder.total_amount),
    paymentStatus: backendOrder.payment_status,
    notes: backendOrder.notes,
    paidAt: backendOrder.paid_at,
    items: backendOrder.items?.map(item => ({
      name: item.menu_name,
      quantity: item.quantity,
      price: parseFloat(item.price),
      subtotal: parseFloat(item.subtotal),
      status: item.status,
      notes: item.special_notes
    })) || [],
    table: backendOrder.table,
    customer: backendOrder.customer,
    createdAt: backendOrder.created_at,
    updatedAt: backendOrder.updated_at
  }
}

export const orderService = {
  /**
   * ✅ Create order - OPTIMIZED (No frontend validation)
   * @param {Array} cartItems
   * @param {string|null} customerEmail
   * @param {string|null} orderNotes
   * @param {'cash'|'non_cash'} paymentMethod
   */
  createOrder: async (cartItems, customerEmail, orderNotes = null, paymentMethod = 'cash') => {
    try {
      const session = sessionStorage.getSession()
      if (!session.session_token) {
        throw new Error('No valid session found. Please scan QR code again.')
      }

      if (!cartItems || cartItems.length === 0) {
        throw new Error('Cart is empty')
      }

      const items = transformCartToOrderItems(cartItems)

      // Bangun payload
      const base = {
        session_token: session.session_token,
        items,
        notes: orderNotes,
        payment_method: paymentMethod,
      }
      const orderData = (paymentMethod === 'non_cash' && customerEmail)
        ? { ...base, email: customerEmail }
        : base

      console.log('🛒 Creating order:', orderData)

      const response = await apiService.createOrder(orderData)

      if (response.success) {
        return {
          success: true,
          data: {
            order_uuid: response.data.order_uuid,
            order_number: response.data.order_number,
            total_amount: response.data.total_amount,
            table_number: response.data.table_number ?? null,
            payment_url: response.data.payment_url,
            redirect_url: response.data.redirect_url
          }
        }
      }

      // ✅ Backend error (termasuk stock errors)
      throw new Error(response.message || 'Failed to create order')
      
    } catch (error) {
      console.error('❌ Error creating order:', error)
      
      // ✅ Parse stock errors dari backend response
      const backendData = error?.response?.data?.data
      const stockErrors = backendData?.stock_errors || []
      
      return {
        success: false,
        error: error?.response?.data?.message || error.message,
        stockErrors: stockErrors // Pass ke UI untuk display
      }
    }
  },

  getPricingRates: async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/settings/rates')
      const data = await response.json()
      
      if (data.success) {
        return {
          success: true,
          data: {
            serviceChargeRate: data.data.service_charge_rate,
            taxRate: data.data.tax_rate,
            serviceChargePercentage: data.data.service_charge_percentage,
            taxPercentage: data.data.tax_percentage
          }
        }
      }
      throw new Error('Failed to get rates')
    } catch (error) {
      console.error('❌ Error getting rates:', error)
      return {
        success: false,
        error: error.message,
        data: {
          serviceChargeRate: 0.07,
          taxRate: 0.10,
          serviceChargePercentage: '7%',
          taxPercentage: '10%'
        }
      }
    }
  },

  // Detail order
  getOrder: async (orderUuid) => {
    try {
      const response = await apiService.getOrder(orderUuid)
      if (response.success) {
        return { success: true, data: transformOrder(response.data) }
      }
      throw new Error('Failed to get order details')
    } catch (error) {
      console.error('❌ Error getting order:', error)
      return { success: false, error: error?.response?.data?.message || error.message }
    }
  },

  // ✅ Get order history
  getOrderHistory: async () => {
    try {
      const session = sessionStorage.getSession();
      if (!session.session_token) {
        throw new Error('No valid session found');
      }

      const response = await apiService.getOrderHistory(session.session_token);

      if (!response.success) {
        throw new Error(response.message || 'Failed to get order history');
      }

      const payload = response.data || {};
      const sourceList = Array.isArray(payload.all_orders) ? payload.all_orders : [];

      const transformed = sourceList.map((backendOrder) => ({
        uuid: backendOrder.order_uuid,
        orderNumber: backendOrder.order_number,
        totalAmount: parseFloat(backendOrder.total_amount),
        paymentStatus: backendOrder.payment_status,
        notes: backendOrder.notes,
        paidAt: backendOrder.paid_at,
        items: (backendOrder.items || []).map(item => ({
          name: item.menu?.name ?? item.menu_name,
          quantity: item.quantity,
          price: parseFloat(item.price),
          subtotal: parseFloat(item.subtotal),
          status: item.status,
          notes: item.special_notes
        })),
        table: backendOrder.table,
        customer: backendOrder.customer,
        createdAt: backendOrder.created_at,
        updatedAt: backendOrder.updated_at
      }));

      return {
        success: true,
        data: transformed,
        meta: {
          total_orders: payload.total_orders ?? transformed.length,
          total_spent:  payload.total_spent ?? 0
        }
      };
    } catch (error) {
      console.error('❌ Error getting order history:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  },

  // Kasir: mark cash as paid
  markOrderPaidCash: async (orderUuid) => {
    try {
      const response = await apiService.payCashOrder(orderUuid);
      if (!response.success) {
        throw new Error(response.message || 'Failed to mark cash paid');
      }
      return {
        success: true,
        data: {
          order_uuid: response.data.order_uuid ?? orderUuid,
          payment_status: response.data.payment_status ?? 'Paid',
          paid_at: response.data.paid_at ?? new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('❌ Error marking cash paid:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  },

  // Perhitungan sederhana (legacy)
  calculateCartTotals: (cartItems) => {
    const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
    const serviceFee = 15000
    const total = subtotal + serviceFee
    return { subtotal, serviceFee, total }
  },

  // ✅ REMOVED: validateCart() function
  // Backend now handles all stock validation during order creation
  // This eliminates N HTTP calls and prevents race conditions
}

export default orderService