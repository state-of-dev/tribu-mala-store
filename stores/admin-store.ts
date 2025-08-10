import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

// Types
interface Order {
  id: string
  orderNumber: string
  customerName: string | null
  customerEmail: string
  total: number
  status: string
  paymentStatus: string
  createdAt: string
  // ... otros campos
}

interface Product {
  id: string
  name: string
  price: number
  stock: number
  image1: string
  isActive: boolean
  // ... otros campos
}

interface User {
  id: string
  email: string
  name: string | null
  role: string
  createdAt: string
  // ... otros campos
}

interface DashboardMetrics {
  orders: {
    total: number
    today: number
    pending: number
  }
  revenue: {
    total: number
    today: number
  }
  products: {
    total: number
    lowStock: number
  }
  users: {
    total: number
    newThisMonth: number
  }
}

interface AdminState {
  // Data
  orders: Order[]
  products: Product[]
  users: User[]
  dashboardMetrics: DashboardMetrics | null
  
  // Loading states
  isLoadingOrders: boolean
  isLoadingProducts: boolean
  isLoadingUsers: boolean
  isLoadingMetrics: boolean
  
  // Error states
  ordersError: string | null
  productsError: string | null
  usersError: string | null
  metricsError: string | null
  
  // Last fetch timestamps (para cache inteligente)
  lastOrdersFetch: number | null
  lastProductsFetch: number | null
  lastUsersFetch: number | null
  lastMetricsFetch: number | null
  
  // Actions
  setOrders: (orders: Order[]) => void
  setProducts: (products: Product[]) => void
  setUsers: (users: User[]) => void
  setDashboardMetrics: (metrics: DashboardMetrics) => void
  
  // Update individual items
  updateOrder: (id: string, updates: Partial<Order>) => void
  updateProduct: (id: string, updates: Partial<Product>) => void
  updateUser: (id: string, updates: Partial<User>) => void
  
  // Add new items
  addOrder: (order: Order) => void
  addProduct: (product: Product) => void
  addUser: (user: User) => void
  
  // Delete items
  removeOrder: (id: string) => void
  removeProduct: (id: string) => void
  removeUser: (id: string) => void
  
  // Loading setters
  setLoadingOrders: (loading: boolean) => void
  setLoadingProducts: (loading: boolean) => void
  setLoadingUsers: (loading: boolean) => void
  setLoadingMetrics: (loading: boolean) => void
  
  // Error setters
  setOrdersError: (error: string | null) => void
  setProductsError: (error: string | null) => void
  setUsersError: (error: string | null) => void
  setMetricsError: (error: string | null) => void
  
  // Helper methods
  getOrderById: (id: string) => Order | undefined
  getProductById: (id: string) => Product | undefined
  getUserById: (id: string) => User | undefined
  
  // Cache management
  shouldRefetchOrders: () => boolean
  shouldRefetchProducts: () => boolean
  shouldRefetchUsers: () => boolean
  shouldRefetchMetrics: () => boolean
  
  // Clear methods
  clearOrders: () => void
  clearProducts: () => void
  clearUsers: () => void
  clearAll: () => void
}

const CACHE_DURATION = 5 * 60 * 1000 // 5 minutos en milliseconds

export const useAdminStore = create<AdminState>()(
  devtools(
    (set, get) => ({
      // Initial state
      orders: [],
      products: [],
      users: [],
      dashboardMetrics: null,
      
      isLoadingOrders: false,
      isLoadingProducts: false,
      isLoadingUsers: false,
      isLoadingMetrics: false,
      
      ordersError: null,
      productsError: null,
      usersError: null,
      metricsError: null,
      
      lastOrdersFetch: null,
      lastProductsFetch: null,
      lastUsersFetch: null,
      lastMetricsFetch: null,
      
      // Actions
      setOrders: (orders) => set({ orders, lastOrdersFetch: Date.now(), ordersError: null }),
      setProducts: (products) => set({ products, lastProductsFetch: Date.now(), productsError: null }),
      setUsers: (users) => set({ users, lastUsersFetch: Date.now(), usersError: null }),
      setDashboardMetrics: (dashboardMetrics) => set({ dashboardMetrics, lastMetricsFetch: Date.now(), metricsError: null }),
      
      // Update individual items
      updateOrder: (id, updates) => set((state) => ({
        orders: state.orders.map(order => 
          order.id === id ? { ...order, ...updates } : order
        )
      })),
      
      updateProduct: (id, updates) => set((state) => ({
        products: state.products.map(product => 
          product.id === id ? { ...product, ...updates } : product
        )
      })),
      
      updateUser: (id, updates) => set((state) => ({
        users: state.users.map(user => 
          user.id === id ? { ...user, ...updates } : user
        )
      })),
      
      // Add new items
      addOrder: (order) => set((state) => ({
        orders: [order, ...state.orders]
      })),
      
      addProduct: (product) => set((state) => ({
        products: [product, ...state.products]
      })),
      
      addUser: (user) => set((state) => ({
        users: [user, ...state.users]
      })),
      
      // Delete items
      removeOrder: (id) => set((state) => ({
        orders: state.orders.filter(order => order.id !== id)
      })),
      
      removeProduct: (id) => set((state) => ({
        products: state.products.filter(product => product.id !== id)
      })),
      
      removeUser: (id) => set((state) => ({
        users: state.users.filter(user => user.id !== id)
      })),
      
      // Loading setters
      setLoadingOrders: (isLoadingOrders) => set({ isLoadingOrders }),
      setLoadingProducts: (isLoadingProducts) => set({ isLoadingProducts }),
      setLoadingUsers: (isLoadingUsers) => set({ isLoadingUsers }),
      setLoadingMetrics: (isLoadingMetrics) => set({ isLoadingMetrics }),
      
      // Error setters
      setOrdersError: (ordersError) => set({ ordersError }),
      setProductsError: (productsError) => set({ productsError }),
      setUsersError: (usersError) => set({ usersError }),
      setMetricsError: (metricsError) => set({ metricsError }),
      
      // Helper methods
      getOrderById: (id) => get().orders.find(order => order.id === id),
      getProductById: (id) => get().products.find(product => product.id === id),
      getUserById: (id) => get().users.find(user => user.id === id),
      
      // Cache management
      shouldRefetchOrders: () => {
        const { lastOrdersFetch } = get()
        return !lastOrdersFetch || (Date.now() - lastOrdersFetch) > CACHE_DURATION
      },
      
      shouldRefetchProducts: () => {
        const { lastProductsFetch } = get()
        return !lastProductsFetch || (Date.now() - lastProductsFetch) > CACHE_DURATION
      },
      
      shouldRefetchUsers: () => {
        const { lastUsersFetch } = get()
        return !lastUsersFetch || (Date.now() - lastUsersFetch) > CACHE_DURATION
      },
      
      shouldRefetchMetrics: () => {
        const { lastMetricsFetch } = get()
        return !lastMetricsFetch || (Date.now() - lastMetricsFetch) > CACHE_DURATION
      },
      
      // Clear methods
      clearOrders: () => set({ orders: [], lastOrdersFetch: null, ordersError: null }),
      clearProducts: () => set({ products: [], lastProductsFetch: null, productsError: null }),
      clearUsers: () => set({ users: [], lastUsersFetch: null, usersError: null }),
      clearAll: () => set({
        orders: [],
        products: [],
        users: [],
        dashboardMetrics: null,
        lastOrdersFetch: null,
        lastProductsFetch: null,
        lastUsersFetch: null,
        lastMetricsFetch: null,
        ordersError: null,
        productsError: null,
        usersError: null,
        metricsError: null,
        isLoadingOrders: false,
        isLoadingProducts: false,
        isLoadingUsers: false,
        isLoadingMetrics: false
      })
    }),
    {
      name: 'admin-store', // Para debugging en DevTools
    }
  )
)