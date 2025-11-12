// PaymentSuccessPage.jsx - FINAL: handle Tunai & Non-Tunai (Midtrans callback)

import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import { CheckCircle, Mail, Download, Home, AlertCircle, Clock } from 'lucide-react'
import { formatCurrency } from '../../utils/formatters'
import useCartStore from '../../store/useCartStore'
import { orderService } from '../../services/orderService'

/**
 * CATATAN FLOW:
 * - Tunai:
 *   - Datang dari Checkout dengan state { paymentMethod: 'cash', orderUuid }
 *   - Tidak perlu email / Midtrans. Status ditampilkan "Pending", instruksi bayar ke kasir.
 *   - Jika kasir menandai lunas di backend, saat user buka lagi halaman ini → akan terbaca sebagai "Paid".
 *
 * - Non-Tunai:
 *   - Bisa datang dari redirect Midtrans (query: order_id, transaction_status, status_code)
 *     atau dari navigate state (fallback).
 *   - Kita panggil orderService.getOrder(orderUuid), cek paymentStatus dari backend:
 *       'Paid'   → success
 *       'Pending'→ pending
 *       lainnya  → failed
 */

const PaymentSuccessPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const { completeOrder, tableInfo } = useCartStore()

  // UI State
  const [paymentStatus, setPaymentStatus] = useState('verifying') // 'verifying' | 'success' | 'pending' | 'failed'
  const [orderData, setOrderData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // paymentMethod sumber kebenaran: URL (midtrans) → state → default 'non_cash'
  const urlOrderId = searchParams.get('order_id')
  const urlTransactionStatus = searchParams.get('transaction_status')
  const urlStatusCode = searchParams.get('status_code')
  const statePaymentMethod = location.state?.paymentMethod
  const initialPaymentMethod =
    statePaymentMethod ? statePaymentMethod :
    (urlOrderId || urlTransactionStatus || urlStatusCode) ? 'non_cash' : 'non_cash' // default non-cash
  // NB: untuk kedatangan dari Cash, Checkout harus mengirim state.paymentMethod='cash'

  useEffect(() => {
    verifyAndLoad()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const resolveOrderUuid = () => {
    // 1) Dari URL Midtrans
    let uuid = searchParams.get('order_id')
    // 2) Dari navigation state
    if (!uuid && location.state?.orderUuid) uuid = location.state.orderUuid
    // 3) Dari localStorage (fallback)
    if (!uuid) {
      const pending = localStorage.getItem('pending_order')
      if (pending) {
        try {
          const parsed = JSON.parse(pending)
          uuid = parsed.orderUuid
          localStorage.removeItem('pending_order')
        } catch {}
      }
    }
    return uuid
  }

  const verifyAndLoad = async () => {
    try {
      setLoading(true)
      setError(null)

      const orderUuid = resolveOrderUuid()
      if (!orderUuid) {
        throw new Error('No order information found')
      }

      // Ambil detail order dari backend
      const orderResult = await orderService.getOrder(orderUuid)
      if (!orderResult?.success || !orderResult?.data) {
        throw new Error('Order not found')
      }

      const order = orderResult.data
      const paymentMethod =
        statePaymentMethod || 'non_cash' // kalau dari Midtrans redirect biasanya tanpa state; asumsikan non_cash

      // Simpan untuk tampilan
      setOrderData({
        ...order,
        email: order.customer?.email || location.state?.email || null,
        paymentMethod, // 'cash' | 'non_cash' | 'midtrans'
      })

      // Tentukan status tampil
      // Backend sebaiknya mengirim field semacam paymentStatus: 'Paid' | 'Pending' | 'Failed'
      const status = (order.paymentStatus || '').toLowerCase()

      if (status === 'paid') {
        setPaymentStatus('success')
        // bersihkan keranjang
        completeOrder()
      } else if (status === 'pending') {
        setPaymentStatus('pending')
      } else {
        // Jika tunai, biasanya awalnya pending, tapi kalau backend kirim status lain → anggap failed
        setPaymentStatus('failed')
      }
    } catch (err) {
      console.error('❌ Payment verification error:', err)
      setError(err.message || 'Payment verification failed')
      setPaymentStatus('failed')
    } finally {
      setLoading(false)
    }
  }

  const handleBackToMenu = () => navigate('/')
  const handleDownloadReceipt = () => {
    alert('Digital receipt will be sent to your email within a few minutes')
  }
  const handleRetryPayment = () => navigate('/checkout')
  const handleRefreshStatus = () => window.location.reload()

  // ====== RENDER ======

  if (loading || paymentStatus === 'verifying') {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying payment...</p>
        </div>
      </div>
    )
  }

  const isCash = orderData?.paymentMethod === 'cash'

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Status Header */}
      <div className="bg-white pt-16 pb-8">
        <div className="text-center px-4">
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
              paymentStatus === 'success'
                ? 'bg-green-100'
                : paymentStatus === 'pending'
                ? 'bg-yellow-100'
                : 'bg-red-100'
            }`}
          >
            {paymentStatus === 'success' && (
              <CheckCircle className="w-12 h-12 text-green-600" />
            )}
            {paymentStatus === 'pending' && (
              <Clock className="w-12 h-12 text-yellow-600" />
            )}
            {paymentStatus === 'failed' && (
              <AlertCircle className="w-12 h-12 text-red-600" />
            )}
          </div>

          <h1
            className={`text-2xl font-bold mb-2 ${
              paymentStatus === 'success'
                ? 'text-gray-900'
                : paymentStatus === 'pending'
                ? 'text-yellow-800'
                : 'text-red-800'
            }`}
          >
            {paymentStatus === 'success' && 'Payment Successful!'}
            {paymentStatus === 'pending' && (isCash ? 'Payment Pending (Cashier)' : 'Payment Pending')}
            {paymentStatus === 'failed' && 'Payment Failed'}
          </h1>

          <p className="text-gray-600">
            {paymentStatus === 'success' && 'Thank you for your order'}
            {paymentStatus === 'pending' &&
              (isCash
                ? 'Please proceed to the cashier to complete your cash payment'
                : 'Please complete your payment')}
            {paymentStatus === 'failed' && (error || 'Please try again')}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-8">
        {/* Order Details */}
        {orderData && (
          <div className="bg-white rounded-2xl shadow-sm border border-cream-200 mb-4">
            <div className="p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Order Details</h2>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Number</span>
                  <span className="font-bold text-gray-900">{orderData.orderNumber}</span>
                </div>

                {orderData.createdAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date</span>
                    <span className="font-medium text-gray-900">
                      {new Date(orderData.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-gray-600">Restaurant</span>
                  <span className="font-medium text-gray-900">Savor Bakery</span>
                </div>

                {(orderData.table || tableInfo) && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Table</span>
                    <span className="font-medium text-gray-900">
                      Table {orderData.table?.table_number || tableInfo?.table_number}
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method</span>
                  <span className="font-medium text-gray-900">
                    {isCash ? 'Cash (Pay at cashier)' : 'Non-Cash (Midtrans)'}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Status</span>
                  <span
                    className={`font-medium ${
                      orderData.paymentStatus === 'Paid'
                        ? 'text-green-600'
                        : orderData.paymentStatus === 'Pending'
                        ? 'text-yellow-600'
                        : 'text-red-600'
                    }`}
                  >
                    {orderData.paymentStatus}
                  </span>
                </div>

                {orderData.breakdown && (
                  <div className="border-t border-cream-200 pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="text-gray-900">
                        {formatCurrency(orderData.breakdown.subtotal)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        Service Charge ({orderData.breakdown.serviceCharge.percentage})
                      </span>
                      <span className="text-gray-900">
                        {formatCurrency(orderData.breakdown.serviceCharge.amount)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        Tax ({orderData.breakdown.tax.percentage})
                      </span>
                      <span className="text-gray-900">
                        {formatCurrency(orderData.breakdown.tax.amount)}
                      </span>
                    </div>
                  </div>
                )}

                <div className="border-t border-cream-200 pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold text-gray-900">
                      {paymentStatus === 'success' ? 'Total Paid' : 'Total'}
                    </span>
                    <span
                      className={`text-lg font-bold ${
                        paymentStatus === 'success' ? 'text-green-600' : 'text-gray-900'
                      }`}
                    >
                      {formatCurrency(orderData.totalAmount)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Email Receipt Card (hanya non-tunai & sukses & ada email) */}
        {orderData?.email && !isCash && paymentStatus === 'success' && (
          <div className="bg-white rounded-2xl shadow-sm border border-cream-200 mb-4">
            <div className="p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-2">Digital Receipt</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Payment receipt will be sent to:
                  </p>
                  <p className="font-medium text-gray-900 mb-4">{orderData.email}</p>
                  <button
                    onClick={handleDownloadReceipt}
                    className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium text-sm"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Receipt</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Order Status Card */}
        {paymentStatus === 'success' && (
          <div className="bg-primary-50 rounded-2xl border border-primary-200 mb-6">
            <div className="p-6">
              <h3 className="font-bold text-gray-900 mb-2">Order Status</h3>
              <p className="text-gray-600 text-sm mb-3">
                Your order is being processed by the kitchen. Estimated preparation time:
              </p>
              <p className="text-xl font-bold text-primary-600">15-20 minutes</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          {paymentStatus === 'success' && (
            <button
              onClick={handleBackToMenu}
              className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-4 rounded-2xl transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <Home className="w-5 h-5" />
              <span>Back to Menu</span>
            </button>
          )}

          {paymentStatus === 'pending' && (
            <>
              <button
                onClick={handleRefreshStatus}
                className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-4 rounded-2xl transition-colors duration-200"
              >
                Check Payment Status
              </button>
              <button
                onClick={handleBackToMenu}
                className="w-full bg-cream-100 hover:bg-cream-200 text-gray-700 font-bold py-4 rounded-2xl transition-colors duration-200 border border-cream-200"
              >
                Back to Menu
              </button>
            </>
          )}

          {paymentStatus === 'failed' && (
            <>
              <button
                onClick={handleRetryPayment}
                className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-4 rounded-2xl transition-colors	duration-200"
              >
                Try Payment Again
              </button>
              <button
                onClick={handleBackToMenu}
                className="w-full bg-cream-100 hover:bg-cream-200 text-gray-700 font-bold py-4 rounded-2xl transition-colors duration-200 border border-cream-200"
              >
                Back to Menu
              </button>
            </>
          )}
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">Thank you for choosing Savor Bakery!</p>
        </div>
      </div>
    </div>
  )
}

export default PaymentSuccessPage
