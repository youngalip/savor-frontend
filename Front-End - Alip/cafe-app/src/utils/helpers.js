export const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(price)
}

export const categories = [
  { id: 1, name: 'Special Burgers', color: 'bg-purple-600' },
  { id: 2, name: 'Chicken Burgers', color: 'bg-blue-600' },
  { id: 3, name: 'Wraps', color: 'bg-green-600' },
  { id: 4, name: 'Sides', color: 'bg-yellow-600' },
]

export const dummyMenus = [
  {
    id: 1,
    name: 'Double Bacon Cheeseburger',
    category: 'Special Burgers',
    price: 45000,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
    description: 'Double patty dengan bacon dan keju',
    stock: 20
  },
  {
    id: 2,
    name: 'Spicy Angus Burger',
    category: 'Special Burgers',
    price: 50000,
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400',
    description: 'Angus beef dengan saus pedas',
    stock: 15
  },
  {
    id: 3,
    name: 'Crispy Chicken Burger',
    category: 'Chicken Burgers',
    price: 35000,
    image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400',
    description: 'Ayam crispy dengan mayo',
    stock: 25
  },
  {
    id: 4,
    name: 'Chicken Wrap',
    category: 'Wraps',
    price: 30000,
    image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400',
    description: 'Wrap dengan chicken strips',
    stock: 18
  },
  {
    id: 5,
    name: 'French Fries',
    category: 'Sides',
    price: 15000,
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400',
    description: 'Kentang goreng crispy',
    stock: 50
  },
  {
    id: 6,
    name: 'Coca Cola',
    category: 'Drinks',
    price: 10000,
    image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400',
    description: 'Minuman soda dingin',
    stock: 100
  },
]