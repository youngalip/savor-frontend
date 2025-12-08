import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { menuItems, menuCategories, storeInfo } from '../../data/menuData'
import { formatCurrency } from '../../utils/formatters'
import heroImage from '../../assets/images/hero/savor_hero.png'

const HomePage = () => {
  const navigate = useNavigate()
  
  // Get recommendation items (first 3 pastries)
  const recommendationItems = menuItems
    .filter(item => item.category === 'pastries')
    .slice(0, 3)

  const handleCategoryClick = (categoryId) => {
    navigate(`/menu?category=${categoryId}`)
  }

  const handleItemClick = (itemId) => {
    navigate(`/item/${itemId}`)
  }

  return (
    <div className="pb-6">
      {/* Store Info & Hero */}
      <div className="bg-white">
        <div className="px-4 py-6">
          {/* Store Info */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {storeInfo.name}
              </h2>
              <p className="text-gray-500 text-sm">
                {storeInfo.hours}
              </p>
              {storeInfo.tableNumber && (
                <div className="mt-2 inline-block bg-gray-100 px-2 py-1 rounded-lg">
                  <span className="text-sm text-gray-600">Table {storeInfo.tableNumber}</span>
                </div>
              )}
            </div>
            
            {/* Hero Image */}
              <div className="w-20 h-20 rounded-xl overflow-hidden ml-4 bg-orange-100">
                <img
                  src="/images/hero/savor_hero.png"
                  alt="Savor Bakery"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

          {/* Large Hero Image */}
          <div className="w-full h-48 rounded-xl overflow-hidden bg-gradient-to-r from-orange-100 to-orange-50">
            <img 
              src="/images/hero/savor_hero.png"
              alt="Savor Bakery"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="px-4 pb-6">
          <div className="flex space-x-1 overflow-x-auto scrollbar-hide">
            {menuCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  category.isActive
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="mt-6 px-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">Recommendation</h3>
          <Link 
            to="/menu"
            className="flex items-center text-primary-600 text-sm font-medium hover:text-primary-700 transition-colors"
          >
            See all
            <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        {/* Recommendation Grid */}
        <div className="grid grid-cols-2 gap-4">
          {recommendationItems.map((item) => (
            <div
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className="menu-item cursor-pointer"
            >
              {/* Item Image */}
              <div className="aspect-square bg-gradient-to-br from-orange-50 to-orange-100 overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              
              {/* Item Info */}
              <div className="p-4">
                <h4 className="font-semibold text-gray-900 mb-1 text-sm">
                  {item.name}
                </h4>
                <p className="text-primary-600 font-bold text-sm">
                  {formatCurrency(item.price)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 px-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-4">Quick Order</h3>
          <div className="space-y-3">
            <button 
              onClick={() => navigate('/menu?category=pastries')}
              className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <span className="font-medium text-gray-700">Fresh Pastries</span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
            
            <button 
              onClick={() => navigate('/menu?category=drinks')}
              className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <span className="font-medium text-gray-700">Hot Beverages</span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
            
            <button 
              onClick={() => navigate('/menu?category=breads')}
              className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <span className="font-medium text-gray-700">Artisan Breads</span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage