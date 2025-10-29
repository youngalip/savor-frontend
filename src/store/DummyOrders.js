// Dummy data for orders
export const dummyOrders = [
  {
    id: "12345",
    tableNumber: 1,
    orderTime: "2025-10-29T10:30:00",
    status: "pending", // pending, processing, ready, completed
    paymentStatus: "unpaid", // paid, unpaid
    items: [
      {
        id: 1,
        name: "Nasi Goreng Spesial",
        category: "kitchen",
        quantity: 2,
        price: 35000,
        notes: "Pedas level 3",
        status: "pending" // pending, processing, done
      },
      {
        id: 2,
        name: "Es Teh Manis",
        category: "bar",
        quantity: 2,
        price: 8000,
        notes: "Gula sedikit",
        status: "pending"
      }
    ],
    totalAmount: 86000
  },
  {
    id: "12346",
    tableNumber: 2,
    orderTime: "2025-10-29T10:45:00",
    status: "processing",
    paymentStatus: "paid",
    items: [
      {
        id: 3,
        name: "Mie Goreng",
        category: "kitchen",
        quantity: 1,
        price: 30000,
        notes: "",
        status: "processing"
      },
      {
        id: 4,
        name: "Cappuccino",
        category: "bar",
        quantity: 1,
        price: 25000,
        notes: "Less sugar",
        status: "done"
      },
      {
        id: 5,
        name: "Chocolate Cake",
        category: "pastry",
        quantity: 1,
        price: 35000,
        notes: "",
        status: "processing"
      }
    ],
    totalAmount: 90000
  },
  {
    id: "12347",
    tableNumber: 3,
    orderTime: "2025-10-29T11:00:00",
    status: "pending",
    paymentStatus: "unpaid",
    items: [
      {
        id: 6,
        name: "Spaghetti Carbonara",
        category: "kitchen",
        quantity: 1,
        price: 45000,
        notes: "Extra cheese",
        status: "pending"
      },
      {
        id: 7,
        name: "Orange Juice",
        category: "bar",
        quantity: 1,
        price: 15000,
        notes: "",
        status: "pending"
      }
    ],
    totalAmount: 60000
  },
  {
    id: "12348",
    tableNumber: 4,
    orderTime: "2025-10-29T11:15:00",
    status: "ready",
    paymentStatus: "paid",
    items: [
      {
        id: 8,
        name: "Chicken Wings",
        category: "kitchen",
        quantity: 1,
        price: 40000,
        notes: "Spicy",
        status: "done"
      },
      {
        id: 9,
        name: "Iced Coffee",
        category: "bar",
        quantity: 2,
        price: 20000,
        notes: "",
        status: "done"
      }
    ],
    totalAmount: 80000
  },
  {
    id: "12349",
    tableNumber: 5,
    orderTime: "2025-10-29T11:30:00",
    status: "pending",
    paymentStatus: "unpaid",
    items: [
      {
        id: 10,
        name: "Beef Burger",
        category: "kitchen",
        quantity: 2,
        price: 50000,
        notes: "No onion",
        status: "pending"
      },
      {
        id: 11,
        name: "French Fries",
        category: "kitchen",
        quantity: 2,
        price: 20000,
        notes: "",
        status: "pending"
      },
      {
        id: 12,
        name: "Milkshake Vanilla",
        category: "bar",
        quantity: 2,
        price: 25000,
        notes: "",
        status: "pending"
      }
    ],
    totalAmount: 190000
  },
  {
    id: "12350",
    tableNumber: 6,
    orderTime: "2025-10-29T09:00:00",
    status: "ready",
    paymentStatus: "paid",
    items: [
      {
        id: 13,
        name: "Pancakes",
        category: "pastry",
        quantity: 1,
        price: 35000,
        notes: "With honey",
        status: "done"
      },
      {
        id: 14,
        name: "Hot Chocolate",
        category: "bar",
        quantity: 1,
        price: 20000,
        notes: "",
        status: "done"
      }
    ],
    totalAmount: 55000
  },
  {
    id: "12351",
    tableNumber: 1,
    orderTime: "2025-10-29T08:30:00",
    status: "pending",
    paymentStatus: "unpaid",
    items: [
      {
        id: 15,
        name: "Fried Rice Special",
        category: "kitchen",
        quantity: 1,
        price: 35000,
        notes: "",
        status: "pending"
      },
      {
        id: 16,
        name: "Lemon Tea",
        category: "bar",
        quantity: 1,
        price: 12000,
        notes: "Less ice",
        status: "pending"
      }
    ],
    totalAmount: 47000
  },
  {
    id: "12352",
    tableNumber: 2,
    orderTime: "2025-10-29T08:00:00",
    status: "processing",
    paymentStatus: "paid",
    items: [
      {
        id: 17,
        name: "Club Sandwich",
        category: "kitchen",
        quantity: 1,
        price: 38000,
        notes: "",
        status: "processing"
      },
      {
        id: 18,
        name: "Americano",
        category: "bar",
        quantity: 1,
        price: 22000,
        notes: "Hot",
        status: "done"
      },
      {
        id: 19,
        name: "Tiramisu",
        category: "pastry",
        quantity: 1,
        price: 40000,
        notes: "",
        status: "processing"
      }
    ],
    totalAmount: 100000
  },
  {
    id: "12353",
    tableNumber: 7,
    orderTime: "2025-10-29T12:00:00",
    status: "ready",
    paymentStatus: "paid",
    items: [
      {
        id: 20,
        name: "Pizza Margherita",
        category: "kitchen",
        quantity: 1,
        price: 65000,
        notes: "Extra basil",
        status: "done"
      },
      {
        id: 21,
        name: "Mojito",
        category: "bar",
        quantity: 2,
        price: 30000,
        notes: "",
        status: "done"
      }
    ],
    totalAmount: 125000
  },
  {
    id: "12354",
    tableNumber: 8,
    orderTime: "2025-10-28T14:30:00",
    status: "completed",
    paymentStatus: "paid",
    items: [
      {
        id: 22,
        name: "Soto Ayam",
        category: "kitchen",
        quantity: 2,
        price: 30000,
        notes: "",
        status: "done"
      },
      {
        id: 23,
        name: "Es Jeruk",
        category: "bar",
        quantity: 2,
        price: 12000,
        notes: "",
        status: "done"
      }
    ],
    totalAmount: 84000,
    completedAt: "2025-10-28T15:15:00"
  },
  {
    id: "12355",
    tableNumber: 3,
    orderTime: "2025-10-28T13:00:00",
    status: "completed",
    paymentStatus: "paid",
    items: [
      {
        id: 24,
        name: "Rendang Rice",
        category: "kitchen",
        quantity: 1,
        price: 45000,
        notes: "",
        status: "done"
      },
      {
        id: 25,
        name: "Teh Tarik",
        category: "bar",
        quantity: 1,
        price: 15000,
        notes: "",
        status: "done"
      },
      {
        id: 26,
        name: "Brownies",
        category: "pastry",
        quantity: 1,
        price: 25000,
        notes: "",
        status: "done"
      }
    ],
    totalAmount: 85000,
    completedAt: "2025-10-28T14:00:00"
  },
  {
    id: "12356",
    tableNumber: 5,
    orderTime: "2025-10-27T11:30:00",
    status: "completed",
    paymentStatus: "paid",
    items: [
      {
        id: 27,
        name: "Grilled Chicken",
        category: "kitchen",
        quantity: 1,
        price: 55000,
        notes: "",
        status: "done"
      },
      {
        id: 28,
        name: "Mineral Water",
        category: "bar",
        quantity: 2,
        price: 5000,
        notes: "",
        status: "done"
      }
    ],
    totalAmount: 65000,
    completedAt: "2025-10-27T12:30:00"
  }
];

// Helper functions
export const getOrdersByStatus = (status) => {
  return dummyOrders.filter(order => order.status === status);
};

export const getOrdersByCategory = (orders, category) => {
  return orders.filter(order => 
    order.items.some(item => item.category === category)
  );
};

export const getOrdersByTable = (orders, tableNumber) => {
  return orders.filter(order => order.tableNumber === tableNumber);
};

export const getOrdersByDateRange = (orders, startDate, endDate) => {
  return orders.filter(order => {
    const orderDate = new Date(order.orderTime);
    return orderDate >= new Date(startDate) && orderDate <= new Date(endDate);
  });
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
};

export const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

export const getCategoryBadgeColor = (category) => {
  const colors = {
    kitchen: 'bg-orange-100 text-orange-800 border-orange-200',
    bar: 'bg-blue-100 text-blue-800 border-blue-200',
    pastry: 'bg-pink-100 text-pink-800 border-pink-200'
  };
  return colors[category] || 'bg-gray-100 text-gray-800 border-gray-200';
};

export const getStatusBadgeColor = (status) => {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    processing: 'bg-blue-100 text-blue-800 border-blue-200',
    ready: 'bg-green-100 text-green-800 border-green-200',
    completed: 'bg-gray-100 text-gray-800 border-gray-200',
    done: 'bg-green-100 text-green-800 border-green-200'
  };
  return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
};

export const getPaymentBadgeColor = (status) => {
  const colors = {
    paid: 'bg-green-100 text-green-800 border-green-200',
    unpaid: 'bg-red-100 text-red-800 border-red-200'
  };
  return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
};