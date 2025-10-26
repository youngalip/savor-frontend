import React from 'react'

const BottomButton = ({ 
  onClick, 
  disabled = false, 
  loading = false, 
  children, 
  variant = 'primary',
  className = '' 
}) => {
  const baseClasses = "w-full font-bold py-4 rounded-2xl transition-colors duration-200 text-lg shadow-lg"
  
  const variantClasses = {
    primary: disabled || loading
      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
      : 'bg-primary-500 hover:bg-primary-600 text-white',
    secondary: disabled || loading
      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
      : 'bg-cream-100 hover:bg-cream-200 text-gray-700 border border-cream-200'
  }

  return (
    <div className="fixed bottom-20 left-0 right-0 bg-white border-t border-cream-200 p-4 z-50">
      <div className="max-w-md mx-auto">
        <button
          onClick={onClick}
          disabled={disabled || loading}
          className={`${baseClasses} ${variantClasses[variant]} ${className}`}
        >
          {loading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Memproses...</span>
            </div>
          ) : (
            children
          )}
        </button>
      </div>
    </div>
  )
}

export default BottomButton