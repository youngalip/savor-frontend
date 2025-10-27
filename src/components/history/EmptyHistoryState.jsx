// src/components/history/EmptyHistoryState.jsx

import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ShoppingBag, ArrowRight } from 'lucide-react'

const EmptyHistoryState = () => {
  const navigate = useNavigate()

  const handleBrowseMenu = () => {
    navigate('/')
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="w-32 h-32 bg-cream-100 rounded-full flex items-center justify-center mb-6">
        <ShoppingBag className="w-16 h-16 text-cream-400" />
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-3">
        No Orders Yet
      </h2>
      
      <p className="text-gray-600 text-center mb-8 max-w-sm">
        Your order history will appear here once you make your first order
      </p>
      
      <button
        onClick={handleBrowseMenu}
        className="flex items-center space-x-2 bg-primary-500 hover:bg-primary-600 text-white font-bold px-8 py-4 rounded-2xl transition-colors duration-200"
      >
        <span>Browse Menu</span>
        <ArrowRight className="w-5 h-5" />
      </button>
      
      <div className="mt-12 text-center">
        <p className="text-sm text-gray-500 mb-2">
          💡 Tip: Scan QR code on your table to start ordering
        </p>
      </div>
    </div>
  )
}

export default EmptyHistoryState