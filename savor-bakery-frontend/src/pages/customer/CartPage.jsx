import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, Minus, Trash2, Edit3 } from 'lucide-react'
import useCartStore from '../../store/useCartStore'
import { storeInfo } from '../../data/menuData'
import { formatCurrency } from '../../utils/formatters'
import BottomButton from '../../components/common/BottomButton'

const CartPage = () => {
  const navigate = useNavigate()
  const { 
    items, 
    updateQuantity, 
    removeItem, 
    updateItemNotes,
    getSubtotal, 
    getTotal,
    clearCart 
  } = useCartStore()

  const [editingNotes, setEditingNotes] = useState(null)
  const [tempNotes, setTempNotes] = useState('')

  const handleBack = () => {
    navigate(-1)
  }

  const handleQuantityChange = (cartId, newQuantity) => {
    if (newQuantity === 0) {
      removeItem(cartId)
    } else {
      updateQuantity(cartId, newQuantity)
    }
  }

  const handleRemoveItem = (cartId) => {
    removeItem(cartId)
  }

  const handleCheckout = () => {
    navigate('/checkout')
  }

  const handleEditNotes = (cartId, currentNotes) => {
    setEditingNotes(cartId)
    setTempNotes(currentNotes || '')
  }

  const handleSaveNotes = (cartId) => {
    updateItemNotes(cartId, tempNotes)
    setEditingNotes(null)
    setTempNotes('')
  }

  const handleCancelNotes = () => {
    setEditingNotes(null)
    setTempNotes('')
  }

  // Empty cart state
  if (items.length === 0) {
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
            <h1 className="font-semibold text-gray-900">My Cart</h1>
            <div className="w-9" />
          </div>
        </div>

        {/* Empty State */}
        <div className="flex flex-col items-center justify-center px-4 py-20">
          <div className="w-24 h-24 bg-cream-100 rounded-full flex items-center justify-center mb-6 border border-cream-200">
            <span className="text-4xl">🛒</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h3>
          <p className="text-gray-500 text-center mb-8">
            Add some delicious items from our menu to get started
          </p>
          <button
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            Browse Menu
          </button>
        </div>
      </div>
    )
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
          <h1 className="font-semibold text-gray-900">My Cart</h1>
          <button 
            onClick={clearCart}
            className="p-2 hover:bg-cream-100 rounded-lg transition-colors"
          >
            <Trash2 className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Content with proper bottom spacing */}
      <div className="pb-40">
        {/* Orders Section */}
        <div className="px-4 py-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Your Orders</h2>

          {/* Cart Items */}
          <div className="space-y-6">
            {items.map((item) => (
              <div key={item.cartId} className="bg-white rounded-2xl p-5 shadow-sm border border-cream-200">
                {/* Store Name */}
                <div className="text-sm text-gray-500 mb-3">{storeInfo.name}</div>
                
                {/* Item Card */}
                <div className="flex items-start space-x-4">
                  {/* Item Image */}
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-gradient-to-br from-cream-100 to-cream-200 flex-shrink-0">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 mb-1">
                      {item.name}
                    </h3>
                    
                    <p className="text-primary-600 font-bold text-sm mb-3">
                      {formatCurrency(item.price)}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleQuantityChange(item.cartId, item.quantity - 1)}
                          className="w-8 h-8 rounded-lg border border-cream-300 flex items-center justify-center hover:bg-cream-50 transition-colors"
                        >
                          <Minus className="w-4 h-4 text-gray-600" />
                        </button>
                        
                        <span className="font-bold text-gray-900 min-w-[1.5rem] text-center">
                          {item.quantity}
                        </span>
                        
                        <button
                          onClick={() => handleQuantityChange(item.cartId, item.quantity + 1)}
                          className="w-8 h-8 rounded-lg border border-cream-300 flex items-center justify-center hover:bg-cream-50 transition-colors"
                        >
                          <Plus className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>

                      {/* Item Total Price */}
                      <div className="text-right">
                        <p className="font-bold text-gray-900">
                          {formatCurrency(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notes Section */}
                <div className="mt-4 pt-4 border-t border-cream-200">
                  {editingNotes === item.cartId ? (
                    /* Editing Notes */
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-gray-700">Add notes for this item:</label>
                      <textarea
                        value={tempNotes}
                        onChange={(e) => setTempNotes(e.target.value)}
                        placeholder="e.g., No ice, extra spicy, well done..."
                        className="w-full px-3 py-2 border border-cream-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                        rows={3}
                        maxLength={200}
                      />
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleSaveNotes(item.cartId)}
                          className="px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelNotes}
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Display Notes */
                    <div>
                      {item.notes ? (
                        <div className="flex items-start space-x-2">
                          <div className="flex-1">
                            <p className="text-sm text-gray-600 font-medium mb-1">Notes:</p>
                            <p className="text-sm text-gray-800 bg-cream-50 px-3 py-2 rounded-lg border border-cream-200">
                              {item.notes}
                            </p>
                          </div>
                          <button
                            onClick={() => handleEditNotes(item.cartId, item.notes)}
                            className="p-2 hover:bg-cream-100 rounded-lg transition-colors flex-shrink-0"
                          >
                            <Edit3 className="w-4 h-4 text-gray-400" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleEditNotes(item.cartId, '')}
                          className="flex items-center space-x-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                          <span>Add notes</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="px-4 py-6 bg-white mx-4 rounded-2xl shadow-sm border border-cream-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>
          
          <div className="space-y-3">
            {/* Subtotal */}
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-semibold text-gray-900">
                {formatCurrency(getSubtotal())}
              </span>
            </div>


            {/* Divider */}
            <div className="border-t border-cream-200 my-4" />

            {/* Total */}
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-gray-900">Total</span>
              <span className="text-lg font-bold text-primary-600">
                {formatCurrency(getTotal())}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Checkout Button using BottomButton component */}
      <BottomButton onClick={handleCheckout}>
        Proceed to Checkout - {formatCurrency(getTotal())}
      </BottomButton>
    </div>
  )
}

export default CartPage