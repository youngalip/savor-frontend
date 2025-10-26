// Updated category structure
export const categoryStructure = {
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

// Updated menu items with new category structure
export const menuItems = [
  // FOODS - Mains
  {
    id: 1,
    name: 'Beef Burger',
    price: 45000,
    mainCategory: 'foods',
    subCategory: 'mains',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
    description: 'Juicy beef burger with fresh vegetables and special sauce.',
    sizes: [
      { id: 'regular', name: 'Regular', price: 0 },
      { id: 'large', name: 'Large', price: 10000 }
    ],
    addOns: [
      { id: 'extra-cheese', name: 'Extra Cheese', price: 8000 },
      { id: 'bacon', name: 'Bacon', price: 12000 }
    ]
  },
  {
    id: 2,
    name: 'Chicken Pasta',
    price: 38000,
    mainCategory: 'foods',
    subCategory: 'mains',
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop',
    description: 'Creamy chicken pasta with herbs and parmesan cheese.',
    sizes: [
      { id: 'regular', name: 'Regular', price: 0 }
    ],
    addOns: [
      { id: 'extra-chicken', name: 'Extra Chicken', price: 15000 },
      { id: 'mushroom', name: 'Mushroom', price: 8000 }
    ]
  },

  // FOODS - Bites
  {
    id: 3,
    name: 'French Fries',
    price: 18000,
    mainCategory: 'foods',
    subCategory: 'bites',
    image: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?w=400&h=300&fit=crop',
    description: 'Crispy golden french fries with sea salt.',
    sizes: [
      { id: 'regular', name: 'Regular', price: 0 },
      { id: 'large', name: 'Large', price: 8000 }
    ],
    addOns: [
      { id: 'cheese-sauce', name: 'Cheese Sauce', price: 5000 },
      { id: 'chili-sauce', name: 'Chili Sauce', price: 3000 }
    ]
  },
  {
    id: 4,
    name: 'Chicken Wings',
    price: 25000,
    mainCategory: 'foods',
    subCategory: 'bites',
    image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400&h=300&fit=crop',
    description: 'Spicy chicken wings with buffalo sauce.',
    sizes: [
      { id: 'regular', name: '6 pieces', price: 0 },
      { id: 'large', name: '12 pieces', price: 20000 }
    ],
    addOns: [
      { id: 'extra-sauce', name: 'Extra Sauce', price: 5000 }
    ]
  },

  // DRINKS - Coffee
  {
    id: 5,
    name: 'Americano',
    price: 15000,
    mainCategory: 'drinks',
    subCategory: 'coffee',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop',
    description: 'Rich espresso with hot water.',
    sizes: [
      { id: 'regular', name: 'Regular', price: 0 },
      { id: 'large', name: 'Large', price: 5000 }
    ],
    addOns: [
      { id: 'extra-shot', name: 'Extra Shot', price: 8000 },
      { id: 'sugar', name: 'Sugar', price: 0 }
    ]
  },
  {
    id: 6,
    name: 'Cappuccino',
    price: 18000,
    mainCategory: 'drinks',
    subCategory: 'coffee',
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=300&fit=crop',
    description: 'Espresso with steamed milk foam.',
    sizes: [
      { id: 'regular', name: 'Regular', price: 0 },
      { id: 'large', name: 'Large', price: 5000 }
    ],
    addOns: [
      { id: 'vanilla-syrup', name: 'Vanilla Syrup', price: 5000 },
      { id: 'cinnamon', name: 'Cinnamon', price: 3000 }
    ]
  },

  // DRINKS - Ice Milk Coffee
  {
    id: 7,
    name: 'Iced Latte',
    price: 20000,
    mainCategory: 'drinks',
    subCategory: 'ice-milk-coffee',
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop',
    description: 'Cold espresso with milk over ice.',
    sizes: [
      { id: 'regular', name: 'Regular', price: 0 },
      { id: 'large', name: 'Large', price: 5000 }
    ],
    addOns: [
      { id: 'caramel-syrup', name: 'Caramel Syrup', price: 5000 },
      { id: 'whipped-cream', name: 'Whipped Cream', price: 7000 }
    ]
  },

  // DRINKS - Mocktail
  {
    id: 8,
    name: 'Virgin Mojito',
    price: 22000,
    mainCategory: 'drinks',
    subCategory: 'mocktail',
    image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=300&fit=crop',
    description: 'Refreshing mint and lime mocktail.',
    sizes: [
      { id: 'regular', name: 'Regular', price: 0 }
    ],
    addOns: [
      { id: 'extra-mint', name: 'Extra Mint', price: 3000 }
    ]
  },

  // SWEETS - Cake
  {
    id: 9,
    name: 'Chocolate Cake',
    price: 32000,
    mainCategory: 'sweets',
    subCategory: 'cake',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop',
    description: 'Rich chocolate cake with ganache.',
    sizes: [
      { id: 'slice', name: 'Slice', price: 0 },
      { id: 'whole', name: 'Whole Cake', price: 150000 }
    ],
    addOns: [
      { id: 'ice-cream', name: 'Vanilla Ice Cream', price: 8000 }
    ]
  },

  // SWEETS - Cookies
  {
    id: 10,
    name: 'Chocolate Chip Cookies',
    price: 15000,
    mainCategory: 'sweets',
    subCategory: 'cookies',
    image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=300&fit=crop',
    description: 'Freshly baked chocolate chip cookies.',
    sizes: [
      { id: '3-pieces', name: '3 pieces', price: 0 },
      { id: '6-pieces', name: '6 pieces', price: 12000 }
    ],
    addOns: []
  },

  // BREADS - Croissant
  {
    id: 11,
    name: 'Butter Croissant',
    price: 25000,
    mainCategory: 'breads',
    subCategory: 'croissant',
    image: 'https://images.unsplash.com/photo-1555507036-ab794f4ade5a?w=400&h=300&fit=crop',
    description: 'Flaky, buttery croissant freshly baked every morning.',
    sizes: [
      { id: 'regular', name: 'Regular', price: 0 }
    ],
    addOns: [
      { id: 'jam', name: 'Strawberry Jam', price: 5000 },
      { id: 'butter', name: 'Extra Butter', price: 3000 }
    ]
  },
  {
    id: 12,
    name: 'Chocolate Croissant',
    price: 28000,
    mainCategory: 'breads',
    subCategory: 'croissant',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    description: 'Buttery croissant filled with rich chocolate.',
    sizes: [
      { id: 'regular', name: 'Regular', price: 0 }
    ],
    addOns: [
      { id: 'extra-chocolate', name: 'Extra Chocolate', price: 5000 }
    ]
  },

  // BREADS - Bagel
  {
    id: 13,
    name: 'Plain Bagel',
    price: 18000,
    mainCategory: 'breads',
    subCategory: 'bagel',
    image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop',
    description: 'Classic plain bagel, perfect for breakfast.',
    sizes: [
      { id: 'regular', name: 'Regular', price: 0 }
    ],
    addOns: [
      { id: 'cream-cheese', name: 'Cream Cheese', price: 8000 },
      { id: 'smoked-salmon', name: 'Smoked Salmon', price: 25000 }
    ]
  }
]

export const storeInfo = {
  name: 'Savor Bakery',
  hours: 'Open today, 08:00-20:00',
  tableNumber: 10,
  deliveryFee: 15000
}

// Helper function to get items by category
export const getItemsByCategory = (mainCategory, subCategory = null) => {
  return menuItems.filter(item => {
    if (subCategory) {
      return item.mainCategory === mainCategory && item.subCategory === subCategory
    }
    return item.mainCategory === mainCategory
  })
}

// Helper function to get all subsections for a main category
export const getSubsections = (mainCategory) => {
  return categoryStructure[mainCategory]?.subsections || []
}