// src/services/orderService.js
import { apiService } from './api'
import { sessionStorage } from './api'

// Transform cart items to backend format
const transformCartToOrderItems = (cartItems) => {
  return cartItems.map(item => ({
    menu_id: item.id,
    quantity: item.quantity,
    special_notes: item.notes || null
  }))
}

// Transform backend order to frontend format
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
  // Create order from cart
  createOrder: async (cartItems, customerEmail, orderNotes = null) => {
    try {
      const session = sessionStorage.getSession()
      
      if (!session.session_token) {
        throw new Error('No valid session found. Please scan QR code again.')
      }

      // Validate cart items
      if (!cartItems || cartItems.length === 0) {
        throw new Error('Cart is empty')
      }

      // Prepare order data
      const orderData = {
        session_token: session.session_token,
        email: customerEmail,
        items: transformCartToOrderItems(cartItems),
        notes: orderNotes
      }

      console.log('🛒 Creating order:', orderData)

      const response = await apiService.createOrder(orderData)

      if (response.success) {
        return {
          success: true,
          data: {
            order_uuid: response.data.order_uuid,
            order_number: response.data.order_number,
            total_amount: response.data.total_amount,
            payment_url: response.data.payment_url, // Midtrans payment URL
            redirect_url: response.data.redirect_url
          }
        }
      }

      throw new Error(response.message || 'Failed to create order')
    } catch (error) {
      console.error('❌ Error creating order:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message
      }
    }
  },

  // Get order details
  getOrder: async (orderUuid) => {
    try {
      const response = await apiService.getOrder(orderUuid)

      if (response.success) {
        return {
          success: true,
          data: transformOrder(response.data)
        }
      }

      throw new Error('Failed to get order details')
    } catch (error) {
      console.error('❌ Error getting order:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message
      }
    }
  },

  // Get order history for current session
  getOrderHistory: async () => {
    try {
      const session = sessionStorage.getSession()
      
      if (!session.session_token) {
        throw new Error('No valid session found')
      }

      const response = await apiService.getOrderHistory(session.session_token)

      if (response.success) {
        const transformedOrders = response.data.map(transformOrder)
        return {
          success: true,
          data: transformedOrders
        }
      }

      throw new Error('Failed to get order history')
    } catch (error) {
      console.error('❌ Error getting order history:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message
      }
    }
  },

  // Calculate cart totals (matching backend calculation)
  calculateCartTotals: (cartItems) => {
    const subtotal = cartItems.reduce((total, item) => {
      return total + (item.price * item.quantity)
    }, 0)

    const serviceFee = 15000 // Fixed service fee
    const total = subtotal + serviceFee

    return {
      subtotal,
      serviceFee,
      total
    }
  },

  // Validate cart before order
  validateCart: async (cartItems) => {
    try {
      const validationErrors = []

      // Check each item stock availability
      for (const item of cartItems) {
        const stockResponse = await apiService.checkStock(item.id)
        
        if (!stockResponse.success) {
          validationErrors.push(`${item.name}: Unable to check stock`)
          continue
        }

        if (!stockResponse.data.is_available) {
          validationErrors.push(`${item.name}: Out of stock`)
        } else if (stockResponse.data.stock_quantity < item.quantity) {
          validationErrors.push(
            `${item.name}: Only ${stockResponse.data.stock_quantity} items available, but ${item.quantity} requested`
          )
        }
      }

      return {
        isValid: validationErrors.length === 0,
        errors: validationErrors
      }
    } catch (error) {
      console.error('❌ Error validating cart:', error)
      return {
        isValid: false,
        errors: ['Unable to validate cart items']
      }
    }
  }
}

export default orderService