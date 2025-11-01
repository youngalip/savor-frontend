const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

const cashierApi = {
  // Get orders with filters
  getOrders: async (filters = {}) => {
    const params = new URLSearchParams();
    
    // Handle exclude_completed special filter
    if (filters.exclude_completed) {
      // Don't send status filter, backend will handle excluding completed
      delete filters.exclude_completed;
      params.append('exclude_completed', 'true');
    }
    
    // Add other filters
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
        params.append(key, filters[key]);
      }
    });
    
    const url = `${API_BASE}/cashier/orders${params.toString() ? '?' + params.toString() : ''}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch orders: ${response.status}`); // ✅ FIXED
    }
    
    return response.json();
  },

  // Get single order detail
  getOrder: async (id) => {
    const response = await fetch(`${API_BASE}/cashier/orders/${id}`, { // ✅ FIXED
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch order: ${response.status}`); // ✅ FIXED
    }
    
    return response.json();
  },

  // Validate cash payment
  validatePayment: async (id) => {
    const response = await fetch(`${API_BASE}/cashier/orders/${id}/validate-payment`, { // ✅ FIXED
      method: 'PATCH',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to validate payment');
    }
    
    return response.json();
  },

  // Mark order as completed
  markCompleted: async (id) => {
    console.log('🔄 cashierApi.markCompleted called with id:', id); // ✅ Added logging
    
    const response = await fetch(`${API_BASE}/cashier/orders/${id}/complete`, { // ✅ FIXED
      method: 'PATCH',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    
    console.log('📡 Response status:', response.status); // ✅ Added logging
    
    if (!response.ok) {
      const error = await response.json();
      console.error('❌ API Error:', error); // ✅ Added logging
      throw new Error(error.message || 'Failed to complete order');
    }
    
    const data = await response.json();
    console.log('✅ API Success:', data); // ✅ Added logging
    return data;
  },

  // Get statistics
  getStatistics: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
        params.append(key, filters[key]);
      }
    });
    
    const url = `${API_BASE}/cashier/statistics${params.toString() ? '?' + params.toString() : ''}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch statistics: ${response.status}`); // ✅ FIXED
    }
    
    return response.json();
  },

  // Reopen completed order (undo complete) - Optional feature
  reopenOrder: async (id) => {
    const response = await fetch(`${API_BASE}/cashier/orders/${id}/reopen`, { // ✅ FIXED
      method: 'PATCH',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to reopen order');
    }
    
    return response.json();
  }
};

export default cashierApi;