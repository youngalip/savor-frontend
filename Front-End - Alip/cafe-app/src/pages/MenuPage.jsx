import { useState } from 'react'
import { Search, Plus } from 'lucide-react'

// Dummy data
const categories = [
  { id: 'all', name: 'Semua', color: 'bg-maroon-700' },
  { id: 'special', name: 'Special', color: 'bg-pink-600' },
  { id: 'chicken', name: 'Chicken', color: 'bg-blue-600' },
  { id: 'wraps', name: 'Wraps', color: 'bg-green-600' },
  { id: 'sides', name: 'Sides', color: 'bg-yellow-600' },
]

const dummyMenus = [
  {
    id: 1,
    name: 'Double Bacon Cheeseburger',
    category: 'special',
    price: 45000,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
    badge: 'BEST'
  },
  {
    id: 2,
    name: 'Spicy Angus Burger',
    category: 'special',
    price: 50000,
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&h=300&fit=crop'
  },
  {
    id: 3,
    name: 'Crispy Chicken Burger',
    category: 'chicken',
    price: 35000,
    image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400&h=300&fit=crop'
  },
  {
    id: 4,
    name: 'Grilled Chicken',
    category: 'chicken',
    price: 40000,
    image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400&h=300&fit=crop'
  },
  {
    id: 5,
    name: 'Chicken Wrap',
    category: 'wraps',
    price: 30000,
    image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=300&fit=crop'
  },
  {
    id: 6,
    name: 'French Fries',
    category: 'sides',
    price: 15000,
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop'
  },
]

const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(price)
}

const MenuPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [cart, setCart] = useState([])

  const filteredMenus = dummyMenus.filter(menu => {
    const matchCategory = selectedCategory === 'all' || menu.category === selectedCategory
    const matchSearch = menu.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchCategory && matchSearch
  })

  const addToCart = (menu) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === menu.id)
      if (existing) {
        return prev.map(item => 
          item.id === menu.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { ...menu, quantity: 1 }]
    })
  }

  const getCartCount = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0)
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-maroon-800 text-white p-4 fixed top-0 left-0 right-0 z-10 shadow-lg">
        <div className="max-w-md mx-auto">
          <div className="flex justify-between items-center mb-3">
            <div>
              <h1 className="text-xl font-bold">☕ Kafe App</h1>
              <p className="text-sm text-maroon-200">Meja A1</p>
            </div>
            <div className="bg-maroon-700 px-3 py-1 rounded-full text-sm">
              Session: 1j 15m
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Cari menu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-maroon-500"
            />
          </div>
        </div>
      </header>

      {/* Categories */}
      <div className="pt-32 px-4 max-w-md mx-auto">
        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition-all ${
                selectedCategory === cat.id
                  ? `${cat.color} text-white shadow-lg scale-105`
                  : 'bg-white text-gray-700 border border-gray-300'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          {filteredMenus.map(menu => (
            <div key={menu.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative">
                <img 
                  src={menu.image} 
                  alt={menu.name}
                  className="w-full h-32 object-cover"
                />
                {menu.badge && (
                  <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                    {menu.badge}
                  </span>
                )}
              </div>
              <div className="p-3">
                <h3 className="font-semibold text-sm mb-1 line-clamp-2">{menu.name}</h3>
                <div className="flex justify-between items-center">
                  <span className="text-maroon-700 font-bold text-sm">
                    {formatPrice(menu.price)}
                  </span>
                  <button
                    onClick={() => addToCart(menu)}
                    className="bg-maroon-700 text-white p-1.5 rounded-full hover:bg-maroon-800 transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredMenus.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p>Tidak ada menu ditemukan</p>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-20">
        <div className="max-w-md mx-auto flex justify-around">
          <button className="flex-1 flex flex-col items-center py-3 text-maroon-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <span className="text-xs mt-1">Menu</span>
          </button>
          
          <button className="flex-1 flex flex-col items-center py-3 text-gray-500 relative">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {getCartCount() > 0 && (
              <span className="absolute top-1 right-1/3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {getCartCount()}
              </span>
            )}
            <span className="text-xs mt-1">Keranjang</span>
          </button>
          
          <button className="flex-1 flex flex-col items-center py-3 text-gray-500">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs mt-1">History</span>
          </button>
        </div>
      </nav>
    </div>
  )
}

export default MenuPage