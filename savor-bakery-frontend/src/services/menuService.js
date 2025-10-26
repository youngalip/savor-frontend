// src/services/menuService.js
import { apiService } from './api'

// Mapping backend categories to frontend structure
const categoryMapping = {
  'Kitchen': 'foods',
  'Bar': 'drinks', 
  'Pastry': ['sweets', 'breads'] // Pastry splits into both
}

// Frontend category structure with subcategories
const categoryStructure = {
  foods: {
    label: 'FOODS',
    subsections: [
      { id: 'mains', label: 'Mains' },
      { id: 'bites', label: 'Bites' }
    ]
  },
  drinks: {
    label: 'DRINKS',
    subsections: [
      { id: 'coffee', label: 'Coffee' },
      { id: 'ice-milk-coffee', label: 'Ice Milk Coffee' },
      { id: 'mocktail', label: 'Mocktail' },
      { id: 'frappe', label: 'Frappe' },
      { id: 'seasonal', label: 'Seasonal' },
      { id: 'etc', label: 'ETC' }
    ]
  },
  sweets: {
    label: 'SWEETS',
    subsections: [
      { id: 'cake', label: 'Cake' },
      { id: 'cookies', label: 'Cookies' },
      { id: 'roll-cake', label: 'Roll Cake' },
      { id: 'cheese-cake', label: 'Cheese Cake' }
    ]
  },
  breads: {
    label: 'BREADS',
    subsections: [
      { id: 'bagel', label: 'Bagel' },
      { id: 'madeleine', label: 'Madeleine' },
      { id: 'scones', label: 'Scones' },
      { id: 'croissant', label: 'Croissant' },
      { id: 'roti-manis', label: 'Roti Manis' }
    ]
  }
}

// Subcategories that belong to sweets vs breads
const sweetsSubcategories = ['cake', 'cookies', 'roll-cake', 'cheese-cake']
const breadsSubcategories = ['bagel', 'madeleine', 'scones', 'croissant', 'roti-manis']

// Get default image based on category and subcategory
const getDefaultImage = (mainCategory, subCategory, itemName) => {
  const name = itemName.toLowerCase()
  
  // Foods images
  if (mainCategory === 'foods') {
    if (name.includes('nasi goreng')) return 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop'
    if (name.includes('mie ayam')) return 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop'
    if (name.includes('ayam geprek')) return 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=300&fit=crop'
    if (name.includes('gado')) return 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop'
    if (name.includes('rendang')) return 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400&h=300&fit=crop'
    if (name.includes('satay') || name.includes('sate')) return 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop'
    if (subCategory === 'bites') return 'https://images.unsplash.com/photo-1541014741259-de529411b96a?w=400&h=300&fit=crop'
    return 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop'
  }
  
  // Drinks images
  if (mainCategory === 'drinks') {
    if (subCategory === 'coffee') return 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop'
    if (subCategory === 'ice-milk-coffee') return 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop'
    if (subCategory === 'mocktail') return 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&h=300&fit=crop'
    if (subCategory === 'frappe') return 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&h=300&fit=crop'
    if (subCategory === 'seasonal') return 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=300&fit=crop'
    if (name.includes('teh') || name.includes('tea')) return 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop'
    if (name.includes('jus') || name.includes('juice')) return 'https://images.unsplash.com/photo-1553530979-d6cb6d6b0672?w=400&h=300&fit=crop'
    return 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=300&fit=crop'
  }
  
  // Sweets images
  if (mainCategory === 'sweets') {
    if (subCategory === 'cake') return 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop'
    if (subCategory === 'cookies') return 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=300&fit=crop'
    if (subCategory === 'roll-cake') return 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&h=300&fit=crop'
    if (subCategory === 'cheese-cake') return 'https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=400&h=300&fit=crop'
    return 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop'
  }
  
  // Breads images
  if (mainCategory === 'breads') {
    if (subCategory === 'bagel') return 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop'
    if (subCategory === 'madeleine') return 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=300&fit=crop'
    if (subCategory === 'scones') return 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=400&h=300&fit=crop'
    if (subCategory === 'croissant') return 'https://images.unsplash.com/photo-1555507036-ab794f4ade5a?w=400&h=300&fit=crop'
    if (subCategory === 'roti-manis') return 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop'
    return 'https://images.unsplash.com/photo-1555507036-ab794f4ade5a?w=400&h=300&fit=crop'
  }
  
  return 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop'
}

// Transform backend menu item to frontend format
const transformMenuItem = (backendItem) => {
  // Use subcategory from database directly
  const subcategory = backendItem.subcategory
  
  // Determine main category based on backend category and subcategory
  let mainCategory
  if (backendItem.category?.name === 'Kitchen') {
    mainCategory = 'foods'
  } else if (backendItem.category?.name === 'Bar') {
    mainCategory = 'drinks'
  } else if (backendItem.category?.name === 'Pastry') {
    // Split pastry items based on subcategory
    if (sweetsSubcategories.includes(subcategory)) {
      mainCategory = 'sweets'
    } else if (breadsSubcategories.includes(subcategory)) {
      mainCategory = 'breads'
    } else {
      // Fallback for any pastry items without proper subcategory
      mainCategory = 'sweets'
    }
  } else {
    mainCategory = 'foods' // Fallback
  }
  
  return {
    id: backendItem.id,
    name: backendItem.name,
    price: parseFloat(backendItem.price),
    mainCategory: mainCategory,
    subCategory: subcategory || 'mains', // Fallback subcategory
    image: backendItem.image_url || getDefaultImage(mainCategory, subcategory, backendItem.name),
    description: backendItem.description,
    isAvailable: backendItem.is_available,
    stockQuantity: backendItem.stock_quantity,
    preparationTime: backendItem.preparation_time,
    stockStatus: backendItem.stock_status,
    isLowStock: backendItem.is_low_stock,
    category: backendItem.category
  }
}

// Transform backend categories to frontend structure
const transformCategories = (backendCategories) => {
  const frontendStructure = {}
  
  backendCategories.forEach(category => {
    if (category.name === 'Kitchen') {
      frontendStructure.foods = {
        id: category.id,
        label: categoryStructure.foods.label,
        subsections: categoryStructure.foods.subsections,
        backendCategory: category
      }
    } else if (category.name === 'Bar') {
      frontendStructure.drinks = {
        id: category.id,
        label: categoryStructure.drinks.label,
        subsections: categoryStructure.drinks.subsections,
        backendCategory: category
      }
    } else if (category.name === 'Pastry') {
      // Split Pastry into Sweets and Breads
      frontendStructure.sweets = {
        id: category.id,
        label: categoryStructure.sweets.label,
        subsections: categoryStructure.sweets.subsections,
        backendCategory: category
      }
      
      frontendStructure.breads = {
        id: category.id,
        label: categoryStructure.breads.label,
        subsections: categoryStructure.breads.subsections,
        backendCategory: category
      }
    }
  })
  
  return frontendStructure
}

export const menuService = {
  // Get category structure compatible with frontend
  getCategoryStructure: async () => {
    try {
      const response = await apiService.getCategories()
      
      if (response.success) {
        return {
          success: true,
          data: transformCategories(response.data)
        }
      }
      
      throw new Error('Failed to get categories')
    } catch (error) {
      console.error('Error getting categories:', error)
      return {
        success: false,
        error: error.message
      }
    }
  },

  // Get all menu items with frontend transformation
  getAllMenuItems: async () => {
    try {
      const response = await apiService.getMenus()
      
      if (response.success) {
        const transformedItems = response.data.map(transformMenuItem)
        return {
          success: true,
          data: transformedItems
        }
      }
      
      throw new Error('Failed to get menu items')
    } catch (error) {
      console.error('Error getting menu items:', error)
      return {
        success: false,
        error: error.message
      }
    }
  },

  // Get menu items by category
  getMenuItemsByCategory: async (categoryId) => {
    try {
      // Handle the special case where Pastry maps to both sweets and breads
      let backendCategoryName
      if (categoryId === 'foods') backendCategoryName = 'Kitchen'
      else if (categoryId === 'drinks') backendCategoryName = 'Bar'
      else if (categoryId === 'sweets' || categoryId === 'breads') backendCategoryName = 'Pastry'
      else throw new Error(`Unknown category: ${categoryId}`)

      // Get categories
      const categoriesResponse = await apiService.getCategories()
      if (!categoriesResponse.success) {
        throw new Error('Failed to get categories')
      }
      
      const backendCategory = categoriesResponse.data.find(cat => cat.name === backendCategoryName)
      if (!backendCategory) {
        throw new Error(`Backend category ${backendCategoryName} not found`)
      }
      
      // Get menus filtered by backend category_id
      const response = await apiService.getMenus({
        category_id: backendCategory.id
      })
      
      if (response.success) {
        const transformedItems = response.data.map(transformMenuItem)
        
        // Filter items for specific frontend category if it's sweets or breads
        let filteredItems = transformedItems
        if (categoryId === 'sweets') {
          filteredItems = transformedItems.filter(item => item.mainCategory === 'sweets')
        } else if (categoryId === 'breads') {
          filteredItems = transformedItems.filter(item => item.mainCategory === 'breads')
        }
        
        return {
          success: true,
          data: filteredItems
        }
      }
      
      throw new Error('Failed to get menu items by category')
    } catch (error) {
      console.error('Error getting menu items by category:', error)
      return {
        success: false,
        error: error.message
      }
    }
  },

  // Get single menu item
  getMenuItem: async (id) => {
    try {
      const response = await apiService.getMenu(id)
      
      if (response.success) {
        return {
          success: true,
          data: transformMenuItem(response.data)
        }
      }
      
      throw new Error('Failed to get menu item')
    } catch (error) {
      console.error('Error getting menu item:', error)
      return {
        success: false,
        error: error.message
      }
    }
  },

  // Check stock availability
  checkStock: async (menuId) => {
    try {
      const response = await apiService.checkStock(menuId)
      return response
    } catch (error) {
      console.error('Error checking stock:', error)
      return {
        success: false,
        error: error.message
      }
    }
  },

  // Helper function to group items by main category and subcategory
  groupItemsByCategory: (items, categoryStructure) => {
    const grouped = {}
    
    Object.keys(categoryStructure).forEach(mainCat => {
      grouped[mainCat] = {}
      categoryStructure[mainCat].subsections.forEach(sub => {
        grouped[mainCat][sub.id] = []
      })
    })
    
    items.forEach(item => {
      if (grouped[item.mainCategory] && grouped[item.mainCategory][item.subCategory]) {
        grouped[item.mainCategory][item.subCategory].push(item)
      } else {
        // If subcategory doesn't exist, try to find the best match or use first subsection
        const categoryData = categoryStructure[item.mainCategory]
        if (categoryData) {
          const fallbackSubsection = categoryData.subsections[0]?.id
          if (fallbackSubsection && grouped[item.mainCategory][fallbackSubsection]) {
            console.warn(`Item ${item.name} has invalid subcategory ${item.subCategory}, using fallback ${fallbackSubsection}`)
            grouped[item.mainCategory][fallbackSubsection].push({
              ...item, 
              subCategory: fallbackSubsection
            })
          }
        }
      }
    })
    
    return grouped
  },

  // Get statistics for debugging
  getMenuStatistics: async () => {
    try {
      const response = await apiService.getMenus()
      
      if (response.success) {
        const stats = {}
        response.data.forEach(item => {
          const category = item.category?.name || 'Unknown'
          const subcategory = item.subcategory || 'No Subcategory'
          
          if (!stats[category]) stats[category] = {}
          if (!stats[category][subcategory]) stats[category][subcategory] = 0
          stats[category][subcategory]++
        })
        
        return {
          success: true,
          data: stats
        }
      }
      
      throw new Error('Failed to get menu statistics')
    } catch (error) {
      console.error('Error getting menu statistics:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }
}

export default menuService