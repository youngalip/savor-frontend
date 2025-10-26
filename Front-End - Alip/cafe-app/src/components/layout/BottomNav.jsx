import { NavLink } from 'react-router-dom'
import { Menu, ShoppingCart, Clock } from 'lucide-react'
import { useCart } from '../../context/CartContext'

const BottomNav = () => {
  const { getTotalItems } = useCart()
  const totalItems = getTotalItems()

  const navItems = [
    { path: '/', icon: Menu, label: 'Menu' },
    { path: '/cart', icon: ShoppingCart, label: 'Keranjang', badge: totalItems },
    { path: '/history', icon: Clock, label: 'History' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-20">
      <div className="max-w-md mx-auto flex justify-around">
        {navItems.map(({ path, icon: Icon, label, badge }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center py-3 relative ${
                isActive ? 'text-maroon-700' : 'text-gray-500'
              }`
            }
          >
            <div className="relative">
              <Icon size={24} />
              {badge > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {badge}
                </span>
              )}
            </div>
            <span className="text-xs mt-1">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

export default BottomNav