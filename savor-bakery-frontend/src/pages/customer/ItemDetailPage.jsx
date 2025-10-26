import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Minus, Plus, Clock } from 'lucide-react'
import { formatCurrency } from '../../utils/formatters'
import useCartStore from '../../store/useCartStore'
import BottomButton from '../../components/common/BottomButton'
import { menuService } from '../../services/menuService'

const ItemDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addItem } = useCartStore()
  
  // State
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [stockInfo, setStockInfo] = useState(null)
  const [addingToCart, setAddingToCart] = useState(false)

  // Load item data on mount
  useEffect(() => {
    loadItemData()
  }, [id])

  const loadItemData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Load item details and stock info in parallel
      const [itemResult, stockResult] = await Promise.all([
        menuService.getMenuItem(parseInt(id)),
        menuService.checkStock(parseInt(id))
      ])

      if (itemResult.success) {
        setItem(itemResult.data)
      } else {
        setError('Menu item not found')
        return
      }

      if (stockResult.success) {
        setStockInfo(stockResult.data)
      }

    } catch (err) {
      console.error('Error loading item:', err)
      setError('Failed to load menu item')
    } finally {
      setLoading(false)
    }
  }

  // Handle back navigation
  const handleBack = () => {
    navigate(-1)
  }

  // Handle quantity change
  const handleQuantityChange = (type) => {
    if (type === 'increase') {
      const maxQuantity = stockInfo?.stock_quantity || 99
      if (quantity < maxQuantity) {
        setQuantity(prev => prev + 1)
      }
    } else if (type === 'decrease' && quantity > 1) {
      setQuantity(prev => prev - 1)
    }
  }

  // Handle add to cart
  const handleAddToCart = async () => {
    if (!item) return

    setAddingToCart(true)

    try {
      // Check stock availability again before adding
      const stockResult = await menuService.checkStock(item.id)
      
      if (!stockResult.success || !stockResult.data?.is_available) {
        alert(`Sorry, ${item.name} is currently out of stock`)
        return
      }

      if (stockResult.data.stock_quantity < quantity) {
        alert(`Sorry, only ${stockResult.data.stock_quantity} items available`)
        return
      }

      const cartItem = {
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity,
        category: item.mainCategory,
        notes: ''
      }

      addItem(cartItem)
      
      // Navigate back with success
      navigate(-1)
    } catch (error) {
      console.error('Error adding to cart:', error)
      alert('Failed to add item to cart')
    } finally {
      setAddingToCart(false)
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading menu item...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !item) {
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
            <h1 className="font-semibold text-gray-900">Menu Detail</h1>
            <div className="w-9" />
          </div>
        </div>

        {/* Error content */}
        <div className="flex items-center justify-center pt-20">
          <div className="text-center px-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">😕</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {error || 'Item not found'}
            </h3>
            <button 
              onClick={handleBack}
              className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors"
            >
              Go back
            </button>
          </div>
        </div>
      </div>
    )
  }

  const isOutOfStock = !item.isAvailable || stockInfo?.stock_quantity === 0
  const isLowStock = stockInfo?.stock_quantity <= 5 && !isOutOfStock
  const maxQuantity = stockInfo?.stock_quantity || 99

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
          <h1 className="font-semibold text-gray-900">Menu Detail</h1>
          <div className="w-9" />
        </div>
      </div>

      {/* Content with proper bottom spacing */}
      <div className="pb-40">
        {/* Item Image */}
        <div className="w-full h-80 bg-gradient-to-br from-cream-100 to-cream-200 relative">
          <img 
            src={item.image} 
            alt={item.name}
            className="w-full h-full object-cover"
          />
          
          {/* Stock status overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
              <div className="text-center">
                <span className="text-white font-bold text-lg">Out of Stock</span>
                <p className="text-white text-sm mt-1">Currently unavailable</p>
              </div>
            </div>
          )}
        </div>

        {/* Item Details */}
        <div className="bg-white rounded-t-3xl mt-[-1rem] relative z-10 px-6 py-8">
          {/* Store Name */}
          <div className="mb-4">
            <span className="text-sm text-gray-500">Savor Bakery</span>
          </div>

          {/* Item Name & Price */}
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">{item.name}</h2>
            <p className="text-2xl font-bold text-primary-600">
              {formatCurrency(item.price)}
            </p>
          </div>

          {/* Stock Status */}
          {stockInfo && (
            <div className="mb-6">
              <div className="flex items-center space-x-2">
                {isOutOfStock ? (
                  <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                    Out of Stock
                  </span>
                ) : isLowStock ? (
                  <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                    Only {stockInfo.stock_quantity} left
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    In Stock ({stockInfo.stock_quantity} available)
                  </span>
                )}
                
                {item.preparationTime && (
                  <span className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    <Clock className="w-4 h-4" />
                    <span>{item.preparationTime} mins</span>
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Description */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
            <p className="text-gray-600 leading-relaxed text-base">
              {item.description}
            </p>
          </div>

          {/* Category Info */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Category</h3>
            <div className="flex space-x-2">
              <span className="px-3 py-1 bg-cream-100 text-gray-700 rounded-full text-sm font-medium border border-cream-200">
                {item.category?.name || item.mainCategory?.toUpperCase()}
              </span>
              {item.subCategory && (
                <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium border border-primary-200">
                  {item.subCategory.replace('-', ' ').toUpperCase()}
                </span>
              )}
            </div>
          </div>

          {/* Quantity Selection */}
          {!isOutOfStock && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quantity</h3>
              
              <div className="flex items-center justify-center space-x-6 bg-cream-50 rounded-2xl py-4 border border-cream-200">
                <button
                  onClick={() => handleQuantityChange('decrease')}
                  disabled={quantity <= 1}
                  className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-colors ${
                    quantity <= 1 
                      ? 'border-gray-200 text-gray-300 cursor-not-allowed bg-gray-50' 
                      : 'border-primary-300 text-primary-600 hover:border-primary-400 hover:bg-primary-50 bg-white'
                  }`}
                >
                  <Minus className="w-5 h-5" />
                </button>
                
                <span className="text-2xl font-bold text-gray-900 min-w-[3rem] text-center">
                  {quantity}
                </span>
                
                <button
                  onClick={() => handleQuantityChange('increase')}
                  disabled={quantity >= maxQuantity}
                  className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-colors ${
                    quantity >= maxQuantity
                      ? 'border-gray-200 text-gray-300 cursor-not-allowed bg-gray-50'
                      : 'border-primary-300 text-primary-600 hover:border-primary-400 hover:bg-primary-50 bg-white'
                  }`}
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              
              {quantity >= maxQuantity && (
                <p className="text-center text-sm text-orange-600 mt-2">
                  Maximum quantity available: {maxQuantity}
                </p>
              )}
            </div>
          )}

          {/* Total Price Preview */}
          {!isOutOfStock && (
            <div className="mb-6 bg-cream-50 rounded-2xl p-4 border border-cream-200">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">Total</span>
                <span className="text-xl font-bold text-primary-600">
                  {formatCurrency(item.price * quantity)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Add to Cart Button */}
      {!isOutOfStock && (
        <BottomButton 
          onClick={handleAddToCart}
          loading={addingToCart}
          disabled={isOutOfStock}
        >
          Add to Cart - {formatCurrency(item.price * quantity)}
        </BottomButton>
      )}
      
      {/* Out of stock button */}
      {isOutOfStock && (
        <BottomButton 
          onClick={handleBack}
          variant="secondary"
          disabled={false}
        >
          Item Unavailable - Go Back
        </BottomButton>
      )}
    </div>
  )
}

export default ItemDetailPage