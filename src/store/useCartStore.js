// src/store/useCartStore.js
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { orderService } from '../services/orderService'

const useCartStore = create(
  persist(
    (set, get) => ({
      // Cart state
      items: [],
      
      // Session info
      sessionToken: null,
      customerUuid: null,
      tableInfo: null,
      
      // Order state
      currentOrder: null,
      orderHistory: [],
      
      // Loading states
      isCreatingOrder: false,
      isValidatingCart: false,

      // Cart actions
      addItem: (item) => set((state) => {
        const existingItemIndex = state.items.findIndex(i => 
          i.id === item.id && 
          JSON.stringify(i.selectedAddOns || []) === JSON.stringify(item.selectedAddOns || [])
        )
        
        if (existingItemIndex !== -1) {
          const newItems = [...state.items]
          newItems[existingItemIndex].quantity += item.quantity
          return { items: newItems }
        }
        
        return { 
          items: [...state.items, { 
            ...item, 
            cartId: Date.now() + Math.random(),
            notes: item.notes || '',
            addedAt: new Date().toISOString()
          }] 
        }
      }),
      
      removeItem: (cartId) => set((state) => ({
        items: state.items.filter(item => item.cartId !== cartId)
      })),
      
      updateQuantity: (cartId, quantity) => set((state) => ({
        items: quantity > 0 
          ? state.items.map(item => 
              item.cartId === cartId ? { ...item, quantity } : item
            )
          : state.items.filter(item => item.cartId !== cartId)
      })),

      updateItemNotes: (cartId, notes) => set((state) => ({
        items: state.items.map(item => 
          item.cartId === cartId ? { ...item, notes } : item
        )
      })),
      
      clearCart: () => set({ 
        items: [],
        currentOrder: null
      }),

      // Session actions
      setSessionInfo: (sessionToken, customerUuid, tableInfo) => set({ 
        sessionToken, 
        customerUuid, 
        tableInfo 
      }),

      clearSession: () => set({
        sessionToken: null,
        customerUuid: null,
        tableInfo: null,
        items: [],
        currentOrder: null,
        orderHistory: []
      }),

      // Cart calculations
      getSubtotal: () => {
        const { items } = get()
        return items.reduce((total, item) => {
          const basePrice = item.price
          const addOnsPrice = item.selectedAddOns?.reduce((sum, addOn) => sum + addOn.price, 0) || 0
          return total + ((basePrice + addOnsPrice) * item.quantity)
        }, 0)
      },
      
      getServiceFee: () => 15000, // Fixed service fee from backend
      
      getTotal: () => {
        const { getSubtotal, getServiceFee } = get()
        return getSubtotal() + getServiceFee()
      },
      
      getItemCount: () => {
        const { items } = get()
        return items.reduce((total, item) => total + item.quantity, 0)
      },

      // Backend integration actions
      validateCart: async () => {
        const { items } = get()
        
        if (items.length === 0) {
          return { isValid: false, errors: ['Cart is empty'] }
        }

        set({ isValidatingCart: true })
        
        try {
          const validation = await orderService.validateCart(items)
          return validation
        } catch (error) {
          console.error('Cart validation error:', error)
          return { 
            isValid: false, 
            errors: ['Unable to validate cart'] 
          }
        } finally {
          set({ isValidatingCart: false })
        }
      },

      createOrder: async (customerEmail, orderNotes = null) => {
        const { items, sessionToken } = get()
        
        if (!sessionToken) {
          return {
            success: false,
            error: 'No active session. Please scan QR code again.'
          }
        }

        if (items.length === 0) {
          return {
            success: false,
            error: 'Cart is empty'
          }
        }

        set({ isCreatingOrder: true })

        try {
          // Validate cart first
          const validation = await get().validateCart()
          if (!validation.isValid) {
            return {
              success: false,
              error: validation.errors.join(', ')
            }
          }

          // Create order
          const result = await orderService.createOrder(
            items, 
            customerEmail, 
            orderNotes
          )

          if (result.success) {
            set({ 
              currentOrder: result.data,
              // Don't clear cart yet - wait for payment success
            })
          }

          return result
        } catch (error) {
          console.error('Create order error:', error)
          return {
            success: false,
            error: error.message || 'Failed to create order'
          }
        } finally {
          set({ isCreatingOrder: false })
        }
      },

      // Get order status
      getOrderStatus: async (orderUuid) => {
        try {
          const result = await orderService.getOrder(orderUuid)
          
          if (result.success) {
            set({ currentOrder: result.data })
          }
          
          return result
        } catch (error) {
          console.error('Get order status error:', error)
          return {
            success: false,
            error: error.message
          }
        }
      },

      // Load order history
      loadOrderHistory: async () => {
        try {
          const result = await orderService.getOrderHistory()
          
          if (result.success) {
            set({ orderHistory: result.data })
          }
          
          return result
        } catch (error) {
          console.error('Load order history error:', error)
          return {
            success: false,
            error: error.message
          }
        }
      },

      // Complete order (after successful payment)
      completeOrder: () => set({
        items: [],
        currentOrder: null
      }),

      // Utility functions
      getCartSummary: () => {
        const state = get()
        return {
          itemCount: state.getItemCount(),
          subtotal: state.getSubtotal(),
          serviceFee: state.getServiceFee(),
          total: state.getTotal(),
          items: state.items
        }
      },

      // Check if item is already in cart
      isItemInCart: (itemId) => {
        const { items } = get()
        return items.some(item => item.id === itemId)
      },

      // Get item quantity in cart
      getItemQuantity: (itemId) => {
        const { items } = get()
        const item = items.find(item => item.id === itemId)
        return item ? item.quantity : 0
      }
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({
        items: state.items,
        sessionToken: state.sessionToken,
        customerUuid: state.customerUuid,
        tableInfo: state.tableInfo
      })
    }
  )
)

export default useCartStore