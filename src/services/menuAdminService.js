// src/services/menuAdminService.js
import apiClient from './api';

/**
 * Menu Management Service
 * Handles all menu-related API calls for owner/admin
 */
export const menuService = {
  /**
   * Get all menus with pagination and filters
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number (default: 1)
   * @param {number} params.limit - Items per page (default: 20)
   * @param {number} params.category_id - Filter by category ID
   * @param {boolean} params.is_available - Filter by availability
   * @param {string} params.subcategory - Filter by subcategory
   * @param {string} params.search - Search by menu name
   * @returns {Promise<Object>} Response with menus array and pagination info
   */
  getMenus: async (params = {}) => {
    try {
      const { data } = await apiClient.get('/owner/menus', { params });
      return data;
    } catch (error) {
      console.error('❌ Failed to fetch menus:', error);
      throw error;
    }
  },

  /**
   * Get single menu by ID
   * @param {number} id - Menu ID
   * @returns {Promise<Object>} Response with menu data
   */
  getMenu: async (id) => {
    try {
      const { data } = await apiClient.get(`/owner/menus/${id}`);
      return data;
    } catch (error) {
      console.error(`❌ Failed to fetch menu ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create new menu
   * @param {Object} menuData - Menu data
   * @param {number} menuData.category_id - Category ID (required)
   * @param {string} menuData.name - Menu name (required)
   * @param {number} menuData.price - Price (required)
   * @param {string} menuData.description - Description (optional)
   * @param {number} menuData.stock_quantity - Stock quantity (optional, default: 0)
   * @param {number} menuData.minimum_stock - Minimum stock (optional, default: 0)
   * @param {string} menuData.image_url - Image URL (optional)
   * @param {boolean} menuData.is_available - Availability (optional, default: true)
   * @param {number} menuData.preparation_time - Prep time in minutes (optional, default: 15)
   * @param {string} menuData.subcategory - Subcategory slug (optional)
   * @param {number} menuData.display_order - Display order (optional, default: 0)
   * @returns {Promise<Object>} Response with created menu data
   */
  createMenu: async (menuData) => {
    try {
      const { data } = await apiClient.post('/owner/menus', menuData);
      console.log('✅ Menu created successfully:', data);
      return data;
    } catch (error) {
      console.error('❌ Failed to create menu:', error);
      throw error;
    }
  },

  /**
   * Update existing menu
   * @param {number} id - Menu ID
   * @param {Object} menuData - Menu data to update (partial update)
   * @returns {Promise<Object>} Response with updated menu data
   */
  updateMenu: async (id, menuData) => {
    try {
      const { data } = await apiClient.put(`/owner/menus/${id}`, menuData);
      console.log(`✅ Menu ${id} updated successfully:`, data);
      return data;
    } catch (error) {
      console.error(`❌ Failed to update menu ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete menu
   * @param {number} id - Menu ID
   * @returns {Promise<Object>} Success response
   */
  deleteMenu: async (id) => {
    try {
      const { data } = await apiClient.delete(`/owner/menus/${id}`);
      console.log(`✅ Menu ${id} deleted successfully`);
      return data;
    } catch (error) {
      console.error(`❌ Failed to delete menu ${id}:`, error);
      throw error;
    }
  },

  /**
   * Upload menu image
   * @param {number} id - Menu ID
   * @param {File} imageFile - Image file (max 5MB, jpg/jpeg/png/webp)
   * @returns {Promise<Object>} Response with image URL
   */
  uploadMenuImage: async (id, imageFile) => {
    try {
      // Validate file
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(imageFile.type)) {
        throw new Error('Format file tidak didukung. Gunakan JPG, PNG, atau WEBP');
      }

      const maxSize = 5 * 1024 * 1024; // 5MB
      if (imageFile.size > maxSize) {
        throw new Error('Ukuran file maksimal 5MB');
      }

      // Create FormData
      const formData = new FormData();
      formData.append('image', imageFile);

      // Upload - GANTI ENDPOINT INI
      const { data } = await apiClient.post(
        `/owner/menus/${id}/image`,  // ✅ Sesuai dengan backend route
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log(`✅ Image uploaded for menu ${id}:`, data);
      return data;
    } catch (error) {
      console.error(`❌ Failed to upload image for menu ${id}:`, error);
      throw error;
    }
  },

  /**
   * Get all categories (public endpoint)
   * @returns {Promise<Object>} Response with categories array
   */
  getCategories: async () => {
    try {
      const { data } = await apiClient.get('/categories');
      return data;
    } catch (error) {
      console.error('❌ Failed to fetch categories:', error);
      throw error;
    }
  },

  /**
   * Get list of available subcategories
   * @returns {Promise<Object>} Response with subcategories array
   */
  getSubcategories: async () => {
    try {
      // GANTI dari '/owner/menus/subcategories' ke '/owner/menus/subcategories/list'
      const { data } = await apiClient.get('/owner/menus/subcategories/list');
      return data;
    } catch (error) {
      console.error('❌ Failed to fetch subcategories:', error);
      throw error;
    }
  },

  /**
   * Batch update menu availability
   * @param {Array<number>} menuIds - Array of menu IDs
   * @param {boolean} isAvailable - New availability status
   * @returns {Promise<Object>} Success response
   */
  batchUpdateAvailability: async (menuIds, isAvailable) => {
    try {
      const promises = menuIds.map(id => 
        apiClient.put(`/owner/menus/${id}`, { is_available: isAvailable })
      );
      await Promise.all(promises);
      console.log(`✅ Batch updated ${menuIds.length} menus availability to ${isAvailable}`);
      return { success: true };
    } catch (error) {
      console.error('❌ Failed to batch update availability:', error);
      throw error;
    }
  },

  /**
   * Check stock status for a menu
   * @param {number} id - Menu ID
   * @returns {Promise<Object>} Stock status info
   */
  checkStock: async (id) => {
    try {
      const { data } = await apiClient.get(`/owner/menus/${id}`);
      
      if (data.success && data.data) {
        const menu = data.data;
        return {
          success: true,
          data: {
            menu_id: menu.id,
            name: menu.name,
            stock_quantity: menu.stock_quantity || 0,
            minimum_stock: menu.minimum_stock || 0,
            is_available: menu.is_available,
            is_low_stock: menu.stock_quantity <= menu.minimum_stock,
            is_out_of_stock: menu.stock_quantity === 0,
            stock_status: menu.stock_quantity === 0 
              ? 'out_of_stock' 
              : menu.stock_quantity <= menu.minimum_stock 
                ? 'low_stock' 
                : 'available'
          }
        };
      }
      throw new Error('Invalid response format');
    } catch (error) {
      console.error(`❌ Failed to check stock for menu ${id}:`, error);
      throw error;
    }
  }
};

export default menuService;