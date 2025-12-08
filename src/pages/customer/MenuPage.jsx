import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import useCartStore from '../../store/useCartStore'
import CategoryFilter from '../../components/common/CategoryFilter'
import DevQRScanner from '../../components/dev/DevQRScanner'
import { menuService } from '../../services/menuService'
import { qrService } from '../../services/qrService'
import { formatCurrency } from '../../utils/formatters'

const MenuPage = () => {
  const navigate = useNavigate()
  const { addItem, tableInfo, sessionToken, setSessionInfo } = useCartStore()
  
  // API Data states
  const [categories, setCategories] = useState({})
  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Filter states
  const [activeMainCategory, setActiveMainCategory] = useState('foods')
  const [activeSubCategory, setActiveSubCategory] = useState('mains')
  
  // Development state
  const [showDevTools, setShowDevTools] = useState(false)
  
  // Flying animation state
  const [flyingItems, setFlyingItems] = useState([])
  const cartIconRef = useRef(null)
  
  // Refs for sections
  const sectionRefs = useRef({})
  const isScrollingToSection = useRef(false)

  // Load session and data on mount
  useEffect(() => {
    checkForURLQR()
    initializeData()
    
    // Show dev tools in development
    if (process.env.NODE_ENV === 'development') {
      setShowDevTools(true)
    }
  }, [])

  // Check for QR code in URL parameters
  const checkForURLQR = async () => {
    const qrFromURL = qrService.dev.checkURLForQR()
    
    if (qrFromURL && !sessionToken) {
      console.log('🔗 QR found in URL, scanning...', qrFromURL)
      const result = await qrService.scanQRCode(qrFromURL)
      
      if (result.success) {
        handleQRScanSuccess(result.data)
        qrService.dev.clearURLQR()
      } else {
        console.error('URL QR scan failed:', result.error)
        setError('Invalid QR code in URL: ' + result.error)
      }
    }
  }

  const initializeData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Load categories and menu items in parallel
      const [categoriesResult, menuResult] = await Promise.all([
        menuService.getCategoryStructure(),
        menuService.getAllMenuItems()
      ])

      if (categoriesResult.success) {
        setCategories(categoriesResult.data)
        
        // Set first available category as active
        const firstCategory = Object.keys(categoriesResult.data)[0]
        if (firstCategory) {
          setActiveMainCategory(firstCategory)
          const firstSubcategory = categoriesResult.data[firstCategory].subsections[0]?.id
          if (firstSubcategory) {
            setActiveSubCategory(firstSubcategory)
          }
        }
      } else {
        setError('Failed to load categories')
      }

      if (menuResult.success) {
        setMenuItems(menuResult.data)
      } else {
        setError('Failed to load menu items')
      }

    } catch (err) {
      console.error('Error initializing data:', err)
      setError('Failed to load menu data')
    } finally {
      setLoading(false)
    }
  }

  // Handle successful QR scan
  const handleQRScanSuccess = (sessionData) => {
    console.log('✅ QR scan successful, updating store...', sessionData)
    
    // Update cart store with session info
    setSessionInfo(
      sessionData.sessionToken,
      sessionData.customerUuid,
      sessionData.table
    )
    
    // Setup auto-extend
    qrService.setupAutoExtend()
  }

  // Group items by main category and subcategory
  const itemsByMainCategory = React.useMemo(() => {
    if (!categories || !menuItems.length) return {}
    
    return menuService.groupItemsByCategory(menuItems, categories)
  }, [menuItems, categories])

  // Get current subsections based on active main category
  const currentSubsections = categories[activeMainCategory]?.subsections || []

  // Intersection Observer for auto-switching categories
  useEffect(() => {
    if (loading || !menuItems.length) return

    const observerOptions = {
      root: null,
      rootMargin: '-50% 0px -50% 0px',
      threshold: 0
    }

    const observerCallback = (entries) => {
      if (isScrollingToSection.current) return

      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const [mainCat, subCat] = entry.target.getAttribute('data-category').split('-')
          if (mainCat !== activeMainCategory || subCat !== activeSubCategory) {
            setActiveMainCategory(mainCat)
            setActiveSubCategory(subCat)
          }
        }
      })
    }

    const observer = new IntersectionObserver(observerCallback, observerOptions)

    // Observe all subsections
    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [activeMainCategory, activeSubCategory, loading, menuItems])

  // Handle main category change
  const handleMainCategoryChange = (mainCategory) => {
    const firstSubsection = categories[mainCategory]?.subsections[0]?.id
    if (firstSubsection) {
      handleCategoryScroll(mainCategory, firstSubsection)
    }
  }

  // Handle subsection change
  const handleSubCategoryChange = (subCategory) => {
    handleCategoryScroll(activeMainCategory, subCategory)
  }

  // Scroll to specific category/subsection
  const handleCategoryScroll = (mainCategory, subCategory) => {
    const targetSection = sectionRefs.current[`${mainCategory}-${subCategory}`]
    if (targetSection) {
      isScrollingToSection.current = true
      setActiveMainCategory(mainCategory)
      setActiveSubCategory(subCategory)
      
      // Calculate offset for sticky headers
      const headerHeight = 180
      const targetPosition = targetSection.offsetTop - headerHeight
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      })

      setTimeout(() => {
        isScrollingToSection.current = false
      }, 1000)
    }
  }

  const handleItemClick = (itemId) => {
    navigate(`/item/${itemId}`)
  }

  // Flying animation handler
  const triggerFlyingAnimation = (buttonRect, item) => {
    // Calculate cart icon position (center-bottom for bottom navigation bar)
    const cartPosition = {
      x: window.innerWidth / 2,
      y: window.innerHeight - 30
    }
    
    const flyingItem = {
      id: Date.now(),
      image: item.image,
      startX: buttonRect.left + buttonRect.width / 2,
      startY: buttonRect.top + buttonRect.height / 2,
      endX: cartPosition.x,
      endY: cartPosition.y,
      isAnimating: false
    }
    
    setFlyingItems(prev => [...prev, flyingItem])
    
    // Start animation after mount
    setTimeout(() => {
      setFlyingItems(prev => 
        prev.map(fi => fi.id === flyingItem.id ? { ...fi, isAnimating: true } : fi)
      )
    }, 10)
    
    // Remove flying item after animation completes
    setTimeout(() => {
      setFlyingItems(prev => prev.filter(fi => fi.id !== flyingItem.id))
    }, 800)
  }

  const handleQuickAdd = async (e, item) => {
    e.stopPropagation()
    
    // Save button position BEFORE any async operation
    const buttonRect = e.currentTarget.getBoundingClientRect()
    
    // Check if we have an active session
    if (!sessionToken) {
      alert('Please scan a QR code first to start your session')
      return
    }
    
    // Check stock availability FIRST before any animation
    const stockResult = await menuService.checkStock(item.id)
    
    if (!stockResult.success || !stockResult.data?.is_available) {
      alert(`Sorry, ${item.name} is currently out of stock`)
      return
    }

    if (stockResult.data.stock_quantity < 1) {
      alert(`Sorry, ${item.name} is currently out of stock`)
      return
    }
    
    // Only trigger animation if stock check passes
    triggerFlyingAnimation(buttonRect, item)
    
    const cartItem = {
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: 1,
      category: item.mainCategory,
      notes: ''
    }

    // Add to cart
    addItem(cartItem)
    console.log(`Added ${item.name} to cart`)
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading menu...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="text-center px-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to load menu</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={initializeData}
            className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-cream-50 min-h-screen">
      {/* Flying Items Animation Layer */}
      <div className="fixed inset-0 pointer-events-none z-[9999]">
        {flyingItems.map((flyingItem) => {
          const deltaX = flyingItem.endX - flyingItem.startX
          const deltaY = flyingItem.endY - flyingItem.startY
          
          return (
            <div
              key={flyingItem.id}
              className="absolute w-16 h-16 rounded-lg overflow-hidden shadow-2xl border-2 border-primary-500"
              style={{
                left: flyingItem.startX - 32,
                top: flyingItem.startY - 32,
                transform: flyingItem.isAnimating 
                  ? `translate(${deltaX}px, ${deltaY}px) scale(0.3)` 
                  : 'translate(0, 0) scale(1)',
                opacity: flyingItem.isAnimating ? 0 : 1,
                transition: 'all 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
              }}
            >
              <img 
                src={flyingItem.image} 
                alt="Flying item"
                className="w-full h-full object-cover"
              />
            </div>
          )
        })}
      </div>

      {/* Hero Section */}
      <div className="px-4 py-8 bg-gradient-to-br from-cream-50 to-cream-100">
        <div className="flex items-stretch justify-between gap-4 mb-6">
          {/* Left Side - Store Info */}
          <div className="flex-1 flex flex-col justify-center">
            <h1 className="text-4xl font-bold mb-2 font-serif- font-extrabold" style={{ color: '#8b1538' }}>
              Savor Bakery
            </h1>
            <p className="text-gray-700 text-base font-medium">
              Open today, 08:00-20:00
            </p>
          </div>
          
          {/* Right Side - Table Number Box */}
          {tableInfo && (
            <div className="flex items-center justify-center px-6 rounded-xl shadow-sm border-2" style={{ backgroundColor: '#8b1538', borderColor: '#8b1538' }}>
              <div className="text-center">
                <p className="text-white text-sm font-medium mb-1">Table</p>
                <p className="text-white text-2xl font-bold">{tableInfo.table_number}</p>
              </div>
            </div>
          )}
        </div>

        <div className="w-full h-48 rounded-xl overflow-hidden bg-gradient-to-r from-orange-100 to-orange-50">
          <img 
            src="/images/hero/savor_hero.png"
            alt="Savor Bakery"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Development QR Scanner */}
        {showDevTools && !sessionToken && (
          <DevQRScanner onQRScanned={handleQRScanSuccess} />
        )}
      </div>

      {/* Always Visible Table Info */}
      <div className="sticky top-0 z-40 bg-cream-100 border-b border-cream-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-gray-900 font-medium">Savor Bakery</h2>
            {tableInfo && (
              <p className="text-xs text-gray-600 font-medium">Table {tableInfo.table_number}</p>
            )}
          </div>
          <div className="text-sm text-gray-600 font-medium">
            {categories[activeMainCategory]?.label} • {currentSubsections.find(s => s.id === activeSubCategory)?.label}
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="sticky top-16 z-50">
        <CategoryFilter
          categoryStructure={categories}
          activeMainCategory={activeMainCategory}
          activeSubCategory={activeSubCategory}
          onMainCategoryChange={handleMainCategoryChange}
          onSubCategoryChange={handleSubCategoryChange}
        />
      </div>

      {/* No Session Warning */}
      {!sessionToken && (
        <div className="mx-4 mt-4 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <h3 className="font-semibold text-yellow-800 mb-1">Session Required</h3>
          <p className="text-sm text-yellow-700">
            Please scan a QR code from your table to start ordering. 
            {showDevTools && ' Use the development scanner above or add ?qr=QR_A1_1761053954 to the URL.'}
          </p>
        </div>
      )}

      {/* Menu Sections */}
      <div className="pb-24">
        {Object.entries(categories).map(([mainCategoryId, mainCategory]) => (
          mainCategory.subsections.map((subsection) => {
            const sectionItems = itemsByMainCategory[mainCategoryId]?.[subsection.id] || []
            
            return (
              <div
                key={`${mainCategoryId}-${subsection.id}`}
                ref={el => sectionRefs.current[`${mainCategoryId}-${subsection.id}`] = el}
                data-category={`${mainCategoryId}-${subsection.id}`}
                className="px-4 py-8"
                id={`section-${mainCategoryId}-${subsection.id}`}
              >
                {/* Section Header */}
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {mainCategory.label} - {subsection.label}
                  </h3>
                  <p className="text-gray-600">
                    {sectionItems.length} items available
                  </p>
                </div>

                {/* Items Grid */}
                {sectionItems.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4">
                    {sectionItems.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleItemClick(item.id)}
                        className="bg-white rounded-xl shadow-sm border border-cream-200 overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer group"
                      >
                        <div className="aspect-square bg-gradient-to-br from-cream-100 to-cream-200 overflow-hidden relative">
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          
                          {/* Stock status overlay */}
                          {!item.isAvailable && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                              <span className="text-white font-semibold text-sm">Out of Stock</span>
                            </div>
                          )}
                          
                          {/* Quick add button */}
                          {item.isAvailable && sessionToken && (
                            <button
                              onClick={(e) => handleQuickAdd(e, item)}
                              className="absolute bottom-2 right-2 w-8 h-8 bg-primary-500 hover:bg-primary-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100 active:scale-90"
                            >
                              <span className="text-lg font-bold">+</span>
                            </button>
                          )}
                        </div>
                        
                        <div className="p-4">
                          <h4 className="font-semibold text-gray-900 mb-1 text-sm leading-tight">
                            {item.name}
                          </h4>
                          <p className="text-primary-600 font-bold text-sm mb-2">
                            {formatCurrency(item.price)}
                          </p>
                          
                          {item.isAvailable && sessionToken ? (
                            <button
                              onClick={(e) => handleQuickAdd(e, item)}
                              className="w-full bg-cream-100 hover:bg-cream-200 text-gray-700 font-medium py-2 px-3 rounded-lg text-xs transition-all duration-200 border border-cream-200 active:scale-95"
                            >
                              Add to Cart
                            </button>
                          ) : !sessionToken ? (
                            <button
                              disabled
                              className="w-full bg-gray-100 text-gray-400 font-medium py-2 px-3 rounded-lg text-xs cursor-not-allowed border border-gray-200"
                            >
                              Scan QR First
                            </button>
                          ) : (
                            <button
                              disabled
                              className="w-full bg-gray-100 text-gray-400 font-medium py-2 px-3 rounded-lg text-xs cursor-not-allowed border border-gray-200"
                            >
                              Out of Stock
                            </button>
                          )}
                          
                          {item.stockQuantity <= 5 && item.isAvailable && (
                            <p className="text-xs text-orange-600 mt-1 text-center">
                              Only {item.stockQuantity} left
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-cream-100 rounded-full flex items-center justify-center mx-auto mb-4 border border-cream-200">
                      <span className="text-2xl">🍽️</span>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      Coming Soon
                    </h4>
                    <p className="text-gray-600 text-sm">
                      {subsection.label} items will be available soon
                    </p>
                  </div>
                )}
              </div>
            )
          })
        ))}
      </div>
    </div>
  )
}

export default MenuPage