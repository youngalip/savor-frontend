/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CreditCard,
  Smartphone,
  ChevronRight,
  Mail,
  QrCode,
  Wallet,
} from "lucide-react";
import useCartStore from "../../store/useCartStore";
import { formatCurrency } from "../../utils/formatters";
import BottomButton from "../../components/common/BottomButton";
import { paymentService } from "../../services/paymentService";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const {
    items,
    getSubtotal,
    getServiceFee,
    getTotal,
    validateCart,
    createOrder,
    sessionToken,
  } = useCartStore();

  // 2 metode: tunai & non-tunai
  const paymentMethods = [
    {
      id: "cash",
      name: "Tunai (Bayar di Kasir)",
      description: "Bayar langsung di kasir. Pesanan masuk sebagai pending.",
      icon: "Wallet",
    },
    {
      id: "non_cash",
      name: "Non-Tunai (Midtrans/QRIS)",
      description:
        "Bayar via QRIS / e-wallet / kartu. Email diperlukan untuk e-struk.",
      icon: "QrCode",
    },
  ];

  const [selectedPayment, setSelectedPayment] = useState("");
  const [email, setEmail] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);

  const handleBack = () => navigate(-1);

  const getPaymentIcon = (iconName) => {
    switch (iconName) {
      case "CreditCard":
        return <CreditCard className="w-6 h-6" />;
      case "Smartphone":
        return <Smartphone className="w-6 h-6" />;
      case "QrCode":
        return <QrCode className="w-6 h-6" />;
      case "Wallet":
        return <Wallet className="w-6 h-6" />;
      default:
        return <CreditCard className="w-6 h-6" />;
    }
  };

  const handlePayment = async () => {
    if (!selectedPayment) {
      alert("Silakan pilih metode pembayaran");
      return;
    }

    const isNonCash = selectedPayment === "non_cash";
    if (isNonCash) {
      if (!email || !email.includes("@")) {
        alert("Masukkan email yang valid untuk e-struk");
        return;
      }
    }

    if (!sessionToken) {
      alert("Session kadaluarsa. Silakan scan QR meja lagi.");
      navigate("/");
      return;
    }

    if (items.length === 0) {
      alert("Keranjang kamu kosong");
      navigate("/cart");
      return;
    }

    setIsProcessing(true);
    setValidationErrors([]);

    try {
      // 2) Buat order (SIGNATURE BENAR)
      const orderResult = await createOrder(
        isNonCash ? email : null, // email hanya non-tunai
        null,                     // notes
        isNonCash ? "non_cash" : "cash" // payment method
      );

      if (!orderResult?.success) {
        alert("Failed to create order: " + orderResult?.error);
        setIsProcessing(false);
        return;
      }

      const orderUuid = orderResult.data.order_uuid;

      if (!isNonCash) {
        // === TUNAI: langsung ke halaman "PaymentSuccess" yg akan tampil status Pending ===
        localStorage.setItem(
          "pending_order",
          JSON.stringify({
            orderUuid,
            paymentMethod: "cash",
            email: null,
            total: getTotal(),
          })
        );

        navigate("/payment-success", {
          state: {
            orderUuid,
            paymentMethod: "cash",
            email: null,
            total: getTotal(),
          },
        });
        return;
      }

      // === NON-TUNAI ===
      const paymentResult = await paymentService.processPayment(
        orderUuid,
        // mapping internal ke gateway; sesuaikan implementasi paymentService-mu
        "qris",
        email
      );

      if (!paymentResult?.success) {
        alert(
          "Pembayaran gagal diproses: " +
            (paymentResult?.error || "unknown error")
        );
        setIsProcessing(false);
        return;
      }

      if (paymentResult.data.redirectUrl) {
        // Akan kembali via return URL → PaymentSuccessPage
        window.location.href = paymentResult.data.redirectUrl;
      } else {
        // Fallback dev: simulasi success
        setTimeout(() => {
          navigate("/payment-success", {
            state: {
              orderUuid,
              paymentMethod: "non_cash",
              email,
              total: getTotal(),
            },
          });
        }, 1000);
      }
    } catch (error) {
      console.error("❌ Payment error:", error);
      alert("Terjadi kesalahan saat memproses pembayaran");
    } finally {
      setIsProcessing(false);
    }
  };

  const totalAmount = getTotal();
  const isNonCash = selectedPayment === "non_cash";

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

      {/* Content */}
      <div className="pb-40">
        {/* Total Payment */}
        <div className="bg-white px-4 py-6 border-b border-cream-200">
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium text-gray-600">
              Total Payment
            </span>
            <span className="text-2xl font-bold text-gray-900">
              {formatCurrency(totalAmount)}
            </span>
          </div>
        </div>

        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <div className="bg-red-50 border border-red-200 mx-4 mt-4 rounded-2xl p-4">
            <h4 className="font-semibold text-red-800 mb-2">
              Cart Validation Issues:
            </h4>
            <ul className="list-disc list-inside space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index} className="text-red-700 text-sm">
                  {error}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Payment Methods */}
        <div className="bg-white mt-4 mx-4 rounded-2xl shadow-sm border border-cream-200">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Select Payment Method
            </h2>

            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedPayment(method.id)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 ${
                    selectedPayment === method.id
                      ? "border-primary-500 bg-primary-50"
                      : "border-cream-200 bg-cream-50 hover:border-cream-300 hover:bg-cream-100"
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`p-2 rounded-lg ${
                        selectedPayment === method.id
                          ? "bg-primary-100 text-primary-600"
                          : "bg-cream-100 text-gray-600"
                      }`}
                    >
                      {getPaymentIcon(method.icon)}
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-gray-900">
                        {method.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {method.description}
                      </p>
                    </div>
                  </div>
                  <ChevronRight
                    className={`w-5 h-5 ${
                      selectedPayment === method.id
                        ? "text-primary-600"
                        : "text-gray-400"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Email (hanya non-tunai) */}
        {isNonCash && (
          <div className="bg-white mt-4 mx-4 rounded-2xl shadow-sm border border-cream-200">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Email for Digital Receipt
              </h3>
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
                />
              </div>

              {email && !email.includes("@") && (
                <p className="mt-2 text-sm text-red-600">
                  Invalid email format
                </p>
              )}
            </div>
          </div>
        )}

        {/* Order Summary */}
        <div className="bg-white mt-4 mx-4 rounded-2xl shadow-sm border border-cream-200">
          <div className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Order Summary
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">
                  Subtotal ({items.length} items)
                </span>
                <span className="font-medium">
                  {formatCurrency(getSubtotal())}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Service Fee</span>
                <span className="font-medium">
                  {formatCurrency(getServiceFee())}
                </span>
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

        {/* Petunjuk */}
        {selectedPayment && (
          <div className="bg-cream-100 mt-4 mx-4 rounded-2xl border border-cream-200">
            <div className="p-6">
              <h4 className="font-semibold text-gray-900 mb-2">
                Payment Instructions
              </h4>
              <div className="text-sm text-gray-600 space-y-1">
                {selectedPayment === "cash" && (
                  <p>
                    Pesananmu akan ditandai <b>Pending</b>. Silakan bayar ke
                    kasir agar pesanan diproses.
                  </p>
                )}
                {selectedPayment === "non_cash" && (
                  <p>
                    Kamu akan diarahkan ke pembayaran non-tunai
                    (Midtrans/QRIS). Setelah berhasil, kamu langsung ke halaman
                    sukses.
                  </p>
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
                <span className="font-medium">Session Active:</span> Your order
                will be linked to your table session.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Button */}
      <BottomButton
        onClick={handlePayment}
        disabled={
          !selectedPayment ||
          items.length === 0 ||
          (selectedPayment === "non_cash" && (!email || !email.includes("@")))
        }
        loading={isProcessing}
      >
        {isProcessing
          ? "Processing..."
          : `Pay Now - ${formatCurrency(totalAmount)}`}
      </BottomButton>
    </div>
  );
};

export default CheckoutPage;
