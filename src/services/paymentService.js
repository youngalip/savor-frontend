// src/services/paymentService.js
import { apiService } from './api'

export const paymentService = {
  // Process payment (will redirect to Midtrans or other payment gateway)
  processPayment: async (orderUuid, paymentMethod, customerEmail) => {
    try {
      console.log('💳 Processing payment for order:', orderUuid)

      const paymentData = {
        order_uuid: orderUuid,
        payment_method: paymentMethod,
        customer_email: customerEmail,
        // Add any additional payment-specific data
        return_url: `${window.location.origin}/payment-success`,
        cancel_url: `${window.location.origin}/checkout`
      }

      const response = await apiService.processPayment(paymentData)

      if (response.success) {
        return {
            success: true,
            data: {
                redirectUrl: response.data.redirect_url,  // ← Yang dipake cuma ini
                snapToken: response.data.snap_token,
                orderNumber: response.data.order_number,
                orderUuid: response.data.order_uuid || orderUuid
            }
        }
      }

      throw new Error(response.message || 'Failed to process payment')
    } catch (error) {
      console.error('❌ Payment Processing Error:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message
      }
    }
  },

  // Handle payment completion (after redirect from payment gateway)
  finishPayment: async (queryParams) => {
    try {
      console.log('✅ Finishing payment with params:', queryParams)

      const response = await apiService.finishPayment(queryParams)

      if (response.success) {
        return {
          success: true,
          data: {
            orderUuid: response.data.order_uuid,
            paymentStatus: response.data.payment_status,
            transactionId: response.data.transaction_id,
            paidAmount: response.data.paid_amount,
            paidAt: response.data.paid_at
          }
        }
      }

      throw new Error(response.message || 'Payment verification failed')
    } catch (error) {
      console.error('❌ Payment Finish Error:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message
      }
    }
  },

  // Payment method configuration
  getPaymentMethods: () => {
    return [
      {
        id: 'credit_card',
        name: 'Kartu Kredit/Debit',
        icon: 'CreditCard',
        description: 'Visa, Mastercard, etc.',
        midtransMethod: 'credit_card'
      },
      {
        id: 'gopay',
        name: 'Gopay',
        icon: 'Smartphone',
        description: 'Bayar dengan Gopay',
        midtransMethod: 'gopay'
      },
      {
        id: 'ovo',
        name: 'OVO',
        icon: 'Smartphone',
        description: 'Bayar dengan OVO',
        midtransMethod: 'ovo'
      },
      {
        id: 'bank_transfer',
        name: 'Transfer Bank',
        icon: 'Building2',
        description: 'Transfer ke rekening bank',
        midtransMethod: 'bank_transfer'
      },
      {
        id: 'qris',
        name: 'QRIS',
        icon: 'QrCode',
        description: 'Scan QR dengan aplikasi bank',
        midtransMethod: 'qris'
      }
    ]
  },

  // Get payment method by id
  getPaymentMethod: (methodId) => {
    const methods = paymentService.getPaymentMethods()
    return methods.find(method => method.id === methodId)
  },

  // Open payment popup/redirect
  openPayment: (paymentUrl, paymentMethod) => {
    if (!paymentUrl) {
      throw new Error('Payment URL not provided')
    }

    // For mobile, always redirect to payment URL
    if (window.innerWidth <= 768) {
      window.location.href = paymentUrl
      return
    }

    // For desktop, open in popup for better UX
    const popup = window.open(
      paymentUrl,
      'payment',
      'width=600,height=700,scrollbars=yes,resizable=yes'
    )

    if (!popup) {
      // Popup blocked, fallback to redirect
      window.location.href = paymentUrl
      return
    }

    // Monitor popup for completion
    const checkClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkClosed)
        // Payment popup closed, check payment status
        console.log('Payment popup closed')
        // You might want to refresh order status here
      }
    }, 1000)

    return popup
  },

  // Simulate payment completion for testing
  simulatePayment: async (orderUuid) => {
    try {
      console.log('🧪 Simulating payment for order:', orderUuid)

      // Call test endpoint if available
      const response = await apiService.simulatePayment(orderUuid)

      if (response.success) {
        return {
          success: true,
          data: response.data
        }
      }

      throw new Error('Payment simulation failed')
    } catch (error) {
      console.error('❌ Payment Simulation Error:', error)
      return {
        success: false,
        error: error.message
      }
    }
  },

  // Parse payment callback URL parameters
  parsePaymentCallback: (url = window.location.href) => {
    try {
      const urlObj = new URL(url)
      const params = new URLSearchParams(urlObj.search)
      
      return {
        order_id: params.get('order_id'),
        status_code: params.get('status_code'),
        transaction_status: params.get('transaction_status'),
        transaction_id: params.get('transaction_id'),
        payment_type: params.get('payment_type')
      }
    } catch (error) {
      console.error('Error parsing payment callback:', error)
      return {}
    }
  },

  // Check if current URL is payment callback
  isPaymentCallback: () => {
    const params = paymentService.parsePaymentCallback()
    return !!(params.order_id && params.status_code)
  }
}

export default paymentService