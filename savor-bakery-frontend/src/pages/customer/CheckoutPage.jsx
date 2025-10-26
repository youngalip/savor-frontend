import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, CreditCard, Smartphone, Building2, ChevronRight, Mail, QrCode } from 'lucide-react'
import useCartStore from '../../store/useCartStore'
import { formatCurrency } from '../../utils/formatters'
import BottomButton from '../../components/common/BottomButton'
import { orderService } from '../../services/orderService'
import { paymentService } from '../../services/paymentService'

const CheckoutPage = () => {
  const navigate = useNavigate()
  const { 
    items,
    getSubtotal, 
    getServiceFee, 
    getTotal,
    validateCart,
    createOrder,
    sessionToken
  } = useCartStore()
  
  const [selectedPayment, setSelectedPayment] = useState('')
  const [email, setEmail] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [validationErrors, setValidationErrors] = useState([])

  // Get payment methods from service
  const paymentMethods = paymentService.getPaymentMethods()

  const handleBack = () => {
    navigate(-1)
  }

  const handlePayment = async () => {
    if (!selectedPayment) {
      alert('Please select a payment method')
      return
    }

    if (!email || !email.includes('@')) {
      alert('Please enter a valid email address')
      return
    }

    if (!sessionToken) {
      alert('Session expired. Please scan QR code again.')
      navigate('/')
      return
    }

    if (items.length === 0) {
      alert('Your cart is empty')
      navigate('/cart')
      return
    }

    setIsProcessing(true)
    setValidationErrors([])

    try {
      // Step 1: Validate cart
      console.log('📋 Validating cart...')
      const validation = await validateCart()
      
      if (!validation.isValid) {
        setValidationErrors(validation.errors)
        alert('Cart validation failed:\n' + validation.errors.join('\n'))
        setIsProcessing(false)
        return
      }

      // Step 2: Create order
      console.log('🛒 Creating order...')
      const orderResult = await createOrder(email, null)
      
      if (!orderResult.success) {
        alert('Failed to create order: ' + orderResult.error)
        setIsProcessing(false)
        return
      }

      // Step 3: Process payment
      console.log('💳 Processing payment...')
      const paymentResult = await paymentService.processPayment(
        orderResult.data.order_uuid,
        selectedPayment,
        email
      )

      if (!paymentResult.success) {
        alert('Payment processing failed: ' + paymentResult.error)
        setIsProcessing(false)
        return
      }

      // Step 4: Redirect to payment gateway
      console.log('🚀 Redirecting to payment gateway...')
      
      // Store order info for success page
      localStorage.setItem('pending_order', JSON.stringify({
        orderUuid: orderResult.data.order_uuid,
        paymentMethod: selectedPayment,
        email: email,
        total: getTotal()
      }))

      // Open payment URL
      if (paymentResult.data.paymentUrl) {
        paymentService.openPayment(paymentResult.data.paymentUrl, selectedPayment)
      } else {
        // For testing, simulate payment success
        console.log('🧪 No payment URL, simulating success...')
        setTimeout(() => {
          navigate('/payment-success', {
            state: {
              orderUuid: orderResult.data.order_uuid,
              paymentMethod: selectedPayment,
              email: email,
              total: getTotal()
            }
          })
        }, 2000)
      }

    } catch (error) {
      console.error('❌ Payment error:', error)
      alert('An error occurred during payment processing')
    } finally {
      setIsProcessing(false)
    }
  }

  const totalAmount = getTotal()

  // Icon mapping for payment methods
  const getPaymentIcon = (iconName) => {
    switch (iconName) {
      case 'CreditCard': return <CreditCard className="w-6 h-6" />
      case 'Smartphone': return <Smartphone className="w-6 h-6" />
      case 'Building2': return <Building2 className="w-6 h-6" />
      case 'QrCode': return <QrCode className="w-6 h-6" />
      default: return <CreditCard className="w-6 h-6" />
    }
  }

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-cream-200 z-40">
        <div className="flex items-center justify-between px-4 py-4">
          <button 
            onClick={handleBack}
            className="p-2 hover:bg-cream-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Payment</h1>
          <div className="w-9" />
        </div>
      </div>

      {/* Content with proper bottom spacing */}
      <div className="pb-40">
        {/* Total Payment Section */}
        <div className="bg-white px-4 py-6 border-b border-cream-200">
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium text-gray-600">Total Payment</span>
            <span className="text-2xl font-bold text-gray-900">
              {formatCurrency(totalAmount)}
            </span>
          </div>
        </div>

        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <div className="bg-red-50 border border-red-200 mx-4 mt-4 rounded-2xl p-4">
            <h4 className="font-semibold text-red-800 mb-2">Cart Validation Issues:</h4>
            <ul className="list-disc list-inside space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index} className="text-red-700 text-sm">{error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Payment Methods Section */}
        <div className="bg-white mt-4 mx-4 rounded-2xl shadow-sm border border-cream-200">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Select Payment Method</h2>
            
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedPayment(method.id)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 ${
                    selectedPayment === method.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-cream-200 bg-cream-50 hover:border-cream-300 hover:bg-cream-100'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-lg ${
                      selectedPayment === method.id 
                        ? 'bg-primary-100 text-primary-600' 
                        : 'bg-cream-100 text-gray-600'
                    }`}>
                      {getPaymentIcon(method.icon)}
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-gray-900">{method.name}</p>
                      <p className="text-sm text-gray-500">{method.description}</p>
                    </div>
                  </div>
                  <ChevronRight className={`w-5 h-5 ${
                    selectedPayment === method.id ? 'text-primary-600' : 'text-gray-400'
                  }`} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Email Input Section */}
        <div className="bg-white mt-4 mx-4 rounded-2xl shadow-sm border border-cream-200">
          <div className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Email for Digital Receipt</h3>
            <p className="text-sm text-gray-600 mb-4">
              We will send your payment receipt to this email address
            </p>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                className="block w-full pl-10 pr-3 py-3 border border-cream-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>
            
            {email && !email.includes('@') && (
              <p className="mt-2 text-sm text-red-600">
                Invalid email format
              </p>
            )}
          </div>
        </div>

        {/* Order Summary Card */}
        <div className="bg-white mt-4 mx-4 rounded-2xl shadow-sm border border-cream-200">
          <div className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal ({items.length} items)</span>
                <span className="font-medium">{formatCurrency(getSubtotal())}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Service Fee</span>
                <span className="font-medium">{formatCurrency(getServiceFee())}</span>
              </div>
              <div className="border-t border-cream-200 pt-3">
                <div className="flex justify-between">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-lg font-bold text-primary-600">
                    {formatCurrency(totalAmount)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Instructions */}
        {selectedPayment && (
          <div className="bg-cream-100 mt-4 mx-4 rounded-2xl border border-cream-200">
            <div className="p-6">
              <h4 className="font-semibold text-gray-900 mb-2">Payment Instructions</h4>
              <div className="text-sm text-gray-600 space-y-1">
                {selectedPayment === 'credit_card' && (
                  <p>You will be redirected to a secure credit/debit card payment page.</p>
                )}
                {selectedPayment === 'gopay' && (
                  <p>Scan the QR code that appears with your Gojek app to complete payment.</p>
                )}
                {selectedPayment === 'ovo' && (
                  <p>Enter your OVO number and confirm payment in the OVO app.</p>
                )}
                {selectedPayment === 'dana' && (
                  <p>Scan the QR code or enter your DANA number to complete payment.</p>
                )}
                {selectedPayment === 'shopeepay' && (
                  <p>You will be redirected to ShopeePay to complete your payment.</p>
                )}
                {selectedPayment === 'bank_transfer' && (
                  <div>
                    <p className="font-medium">Transfer to account:</p>
                    <p>Various banks available (BCA, Mandiri, BNI, BRI)</p>
                    <p className="mt-1">Complete payment within 24 hours.</p>
                  </div>
                )}
                {selectedPayment === 'qris' && (
                  <p>Scan the QR code with any banking app that supports QRIS payments.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Session Info */}
        {sessionToken && (
          <div className="bg-blue-50 mt-4 mx-4 rounded-2xl border border-blue-200">
            <div className="p-4">
              <p className="text-sm text-blue-700">
                <span className="font-medium">Session Active:</span> Your order will be linked to your table session.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Payment Button */}
      <BottomButton
        onClick={handlePayment}
        disabled={!selectedPayment || !email || !email.includes('@') || items.length === 0}
        loading={isProcessing}
      >
        {isProcessing ? 'Processing...' : `Pay Now - ${formatCurrency(totalAmount)}`}
      </BottomButton>
    </div>
  )
}

export default CheckoutPage