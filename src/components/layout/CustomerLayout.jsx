import React from 'react'
import { Outlet, useLocation, Link } from 'react-router-dom'
import { Home, Menu, ShoppingCart, User, History} from 'lucide-react'
import useCartStore from '../../store/useCartStore'

const CustomerLayout = () => {
  const location = useLocation()
  const { getItemCount } = useCartStore()
  const cartItemCount = getItemCount()

  const isActive = (path) => {
    if (path === '/' && (location.pathname === '/' || location.pathname === '/menu')) return true
    if (path !== '/' && location.pathname.startsWith(path)) return true
    return false
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Main Content - No top header, MenuPage handles its own */}
      <main className="max-w-md mx-auto bg-white min-h-screen">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="max-w-md mx-auto px-4">
          <div className="flex items-center justify-around py-2">
            {/* Home/Menu */}
            <Link
              to="/"
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                isActive('/') 
                  ? 'text-primary-600' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Home className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">Menu</span>
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors relative ${
                isActive('/cart') 
                  ? 'text-primary-600' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5 mb-1" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                    {cartItemCount > 99 ? '99+' : cartItemCount}
                  </span>
                )}
              </div>
              <span className="text-xs font-medium">Cart</span>
            </Link>

            {/* History */}
            <Link
              to="/order-history"
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                isActive('/profile') 
                  ? 'text-primary-600' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <History className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">History</span>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default CustomerLayout