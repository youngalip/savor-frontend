/**
 * Transform backend orders response to frontend format
 * @param {object} backendData - Backend API response (Axios response)
 * @returns {array} Transformed orders array
 */
export const transformBackendOrders = (backendData) => {
  // Handle Axios response structure: response.data.data.orders
  const orders = backendData?.data?.data?.orders || backendData?.data?.orders || [];
  
  if (!orders || orders.length === 0) return [];

  return orders.map(order => ({
    // Order level
    id: order.order_number, // Display ID (e.g., "ORD-001")
    orderId: order.order_id, // Actual database ID
    tableId: order.table_id,
    tableNumber: parseInt(order.table_number),
    orderTime: order.order_created_at,
    customerName: order.customer_name || 'Guest',
    
    // Items
    items: order.items.map(item => ({
      id: item.id, // order_item_id (untuk update status)
      menuId: item.menu_id,
      name: item.menu_name,
      category: item.category_name.toLowerCase(), // 'Kitchen' → 'kitchen'
      quantity: item.quantity,
      status: mapStatusToFrontend(item.status), // 'Pending' → 'pending'
      notes: item.special_notes || '',
      preparationTime: item.preparation_time,
      createdAt: item.created_at
    })),
    
    // Computed
    totalItems: order.items_count
  }));
};

/**
 * Map frontend status to backend status
 * @param {string} frontendStatus - 'pending' | 'done' | 'processing'
 * @returns {string} Backend status ('Pending' | 'Done')
 */
export const mapStatusToBackend = (frontendStatus) => {
  const statusMap = {
    'pending': 'Pending',
    'processing': 'Pending', // Backward compatibility
    'done': 'Done',
    'ready': 'Done' // Backward compatibility
  };
  return statusMap[frontendStatus.toLowerCase()] || 'Pending';
};

/**
 * Map backend status to frontend status
 * @param {string} backendStatus - 'Pending' | 'Done'
 * @returns {string} Frontend status ('pending' | 'done')
 */
export const mapStatusToFrontend = (backendStatus) => {
  const statusMap = {
    'Pending': 'pending',
    'Done': 'done'
  };
  return statusMap[backendStatus] || 'pending';
};

/**
 * Transform backend menus response to frontend format
 * @param {object} backendData - Backend API response (Axios response)
 * @returns {array} Transformed menus array
 */
export const transformBackendMenus = (backendData) => {
  // Handle Axios response structure: response.data.data.menus
  const menus = backendData?.data?.data?.menus || backendData?.data?.menus || [];
  
  if (!menus || menus.length === 0) return [];

  return menus.map(menu => ({
    id: menu.id,
    name: menu.name,
    categoryName: menu.category_name,
    subcategory: menu.subcategory || menu.category_name, // Fallback to category if no subcategory
    stockQuantity: menu.stock_quantity,
    minimumStock: menu.minimum_stock,
    isAvailable: menu.is_available,
    imageUrl: menu.image_url,
    preparationTime: menu.preparation_time,
    price: menu.price || 0
  }));
};

/**
 * Calculate time elapsed since order creation
 * @param {string} orderTime - ISO datetime string
 * @returns {string} Human readable time (e.g., "5 menit yang lalu")
 */
export const getTimeElapsed = (orderTime) => {
  const now = new Date();
  const orderDate = new Date(orderTime);
  const diffMs = now - orderDate;
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return 'Baru saja';
  if (diffMins < 60) return `${diffMins} menit yang lalu`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} jam yang lalu`;
  
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} hari yang lalu`;
};

/**
 * Get warning color based on preparation time
 * @param {string} orderTime - ISO datetime string
 * @param {number} preparationTime - Expected preparation time in minutes
 * @returns {string} Color class ('green' | 'yellow' | 'red')
 */
export const getTimeWarningColor = (orderTime, preparationTime = 15) => {
  const now = new Date();
  const orderDate = new Date(orderTime);
  const diffMs = now - orderDate;
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < preparationTime * 0.7) return 'green'; // < 70% waktu
  if (diffMins < preparationTime) return 'yellow'; // 70-100% waktu
  return 'red'; // > 100% waktu (terlambat)
};