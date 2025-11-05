import api from './api';

/**
 * Kitchen Station API Service
 * Handles all API calls for kitchen, bar, and pastry stations (staff)
 */
export const kitchenApi = {
  /**
   * Get orders for specific station
   * @param {string} stationType - 'kitchen' | 'bar' | 'pastry'
   * @param {object} params - Query parameters (status, date)
   * @returns {Promise}
   */
  getOrders: (stationType, params = {}) => {
    return api.get(`/staff/stations/${stationType}/orders`, { params });
  },

  /**
   * Update single order item status
   * @param {number} itemId - Order item ID
   * @param {string} status - 'Pending' | 'Done'
   * @returns {Promise}
   */
  updateItemStatus: (itemId, status) => {
    return api.patch(`/staff/stations/items/${itemId}/status`, { status });
  },

  /**
   * Batch update multiple items status
   * @param {array} itemIds - Array of order item IDs
   * @param {string} status - 'Pending' | 'Done'
   * @returns {Promise}
   */
  batchUpdateStatus: (itemIds, status) => {
    return api.post('/staff/stations/items/batch-update-status', {
      item_ids: itemIds,
      status
    });
  },

  /**
   * Get menus for specific station
   * @param {string} stationType - 'kitchen' | 'bar' | 'pastry'
   * @returns {Promise}
   */
  getMenus: (stationType) => {
    return api.get(`/staff/stations/${stationType}/menus`);
  },

  /**
   * Update menu stock
   * @param {string} stationType - 'kitchen' | 'bar' | 'pastry'
   * @param {number} menuId - Menu ID
   * @param {object} data - { stock_quantity?, minimum_stock?, is_available? }
   * @returns {Promise}
   */
  updateMenuStock: (stationType, menuId, data) => {
    return api.patch(`/staff/stations/${stationType}/menus/${menuId}/stock`, data);
  },

  /**
   * Get station statistics
   * @param {string} stationType - 'kitchen' | 'bar' | 'pastry'
   * @param {object} params - Query parameters (date)
   * @returns {Promise}
   */
  getStats: (stationType, params = {}) => {
    return api.get(`/staff/stations/${stationType}/stats`, { params });
  }
};

export default kitchenApi;