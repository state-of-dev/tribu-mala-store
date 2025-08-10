import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// State para navegación y UI únicamente
interface AdminUIState {
  // 🧭 NAVEGACIÓN INSTANTÁNEA
  currentView: 'dashboard' | 'orders' | 'products' | 'users'
  selectedOrderId: string | null
  selectedProductId: number | null
  selectedUserId: string | null
  
  // 🔍 FILTROS LOCALES (aplicados sobre datos de Redux)
  filters: {
    orders: {
      search: string
      status: string
      paymentStatus: string
      dateFrom: string | null
      dateTo: string | null
    }
    products: {
      search: string
      category: string
      status: 'active' | 'inactive' | 'all'
      lowStock: boolean
    }
    users: {
      search: string
      role: string
    }
  }
  
  // 📄 PAGINACIÓN VIRTUAL (sin API calls)
  pagination: {
    orders: { page: number; limit: number }
    products: { page: number; limit: number }
    users: { page: number; limit: number }
  }
  
  // 🎨 UI STATES
  ui: {
    sidebarCollapsed: boolean
    showFilters: boolean
    activeModal: 'none' | 'createProduct' | 'editProduct' | 'deleteProduct' | 'orderDetails'
    loadingActions: {
      updatingOrderStatus: string | null
      updatingProduct: number | null
      creatingProduct: boolean
      deletingProduct: number | null
    }
  }
  
  // 📢 NOTIFICACIONES
  notifications: Array<{
    id: string
    type: 'success' | 'error' | 'warning' | 'info'
    title: string
    message?: string
    timestamp: number
    autoHide?: boolean
  }>
}

const initialState: AdminUIState = {
  // Navigation
  currentView: 'dashboard',
  selectedOrderId: null,
  selectedProductId: null,
  selectedUserId: null,
  
  // Filters (aplicados localmente)
  filters: {
    orders: {
      search: '',
      status: '',
      paymentStatus: '',
      dateFrom: null,
      dateTo: null
    },
    products: {
      search: '',
      category: '',
      status: 'all',
      lowStock: false
    },
    users: {
      search: '',
      role: ''
    }
  },
  
  // Pagination virtual
  pagination: {
    orders: { page: 1, limit: 20 },
    products: { page: 1, limit: 20 },
    users: { page: 1, limit: 20 }
  },
  
  // UI
  ui: {
    sidebarCollapsed: false,
    showFilters: false,
    activeModal: 'none',
    loadingActions: {
      updatingOrderStatus: null,
      updatingProduct: null,
      creatingProduct: false,
      deletingProduct: null
    }
  },
  
  // Notifications
  notifications: []
}

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    // 🧭 NAVEGACIÓN
    setCurrentView: (state, action: PayloadAction<AdminUIState['currentView']>) => {
      state.currentView = action.payload
      // Reset pagination when changing views
      state.pagination[action.payload].page = 1
    },
    
    navigateToOrder: (state, action: PayloadAction<string>) => {
      state.currentView = 'orders'
      state.selectedOrderId = action.payload
    },
    
    navigateToProduct: (state, action: PayloadAction<number>) => {
      state.currentView = 'products'
      state.selectedProductId = action.payload
    },
    
    navigateToUser: (state, action: PayloadAction<string>) => {
      state.currentView = 'users'
      state.selectedUserId = action.payload
    },
    
    clearSelection: (state) => {
      state.selectedOrderId = null
      state.selectedProductId = null
      state.selectedUserId = null
    },
    
    // 🔍 FILTROS
    setOrderFilters: (state, action: PayloadAction<Partial<AdminUIState['filters']['orders']>>) => {
      state.filters.orders = { ...state.filters.orders, ...action.payload }
      state.pagination.orders.page = 1 // Reset pagination
    },
    
    setProductFilters: (state, action: PayloadAction<Partial<AdminUIState['filters']['products']>>) => {
      state.filters.products = { ...state.filters.products, ...action.payload }
      state.pagination.products.page = 1
    },
    
    setUserFilters: (state, action: PayloadAction<Partial<AdminUIState['filters']['users']>>) => {
      state.filters.users = { ...state.filters.users, ...action.payload }
      state.pagination.users.page = 1
    },
    
    clearOrderFilters: (state) => {
      state.filters.orders = {
        search: '',
        status: '',
        paymentStatus: '',
        dateFrom: null,
        dateTo: null
      }
      state.pagination.orders.page = 1
    },
    
    clearProductFilters: (state) => {
      state.filters.products = {
        search: '',
        category: '',
        status: 'all',
        lowStock: false
      }
      state.pagination.products.page = 1
    },
    
    clearUserFilters: (state) => {
      state.filters.users = {
        search: '',
        role: ''
      }
      state.pagination.users.page = 1
    },
    
    // 📄 PAGINACIÓN
    setOrdersPage: (state, action: PayloadAction<number>) => {
      state.pagination.orders.page = action.payload
    },
    
    setProductsPage: (state, action: PayloadAction<number>) => {
      state.pagination.products.page = action.payload
    },
    
    setUsersPage: (state, action: PayloadAction<number>) => {
      state.pagination.users.page = action.payload
    },
    
    setPaginationLimit: (state, action: PayloadAction<{ section: keyof AdminUIState['pagination']; limit: number }>) => {
      state.pagination[action.payload.section].limit = action.payload.limit
      state.pagination[action.payload.section].page = 1
    },
    
    // 🎨 UI STATES
    toggleSidebar: (state) => {
      state.ui.sidebarCollapsed = !state.ui.sidebarCollapsed
    },
    
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.ui.sidebarCollapsed = action.payload
    },
    
    toggleFilters: (state) => {
      state.ui.showFilters = !state.ui.showFilters
    },
    
    setShowFilters: (state, action: PayloadAction<boolean>) => {
      state.ui.showFilters = action.payload
    },
    
    setActiveModal: (state, action: PayloadAction<AdminUIState['ui']['activeModal']>) => {
      state.ui.activeModal = action.payload
    },
    
    closeModal: (state) => {
      state.ui.activeModal = 'none'
    },
    
    // ⏳ LOADING ACTIONS
    setOrderStatusUpdating: (state, action: PayloadAction<string | null>) => {
      state.ui.loadingActions.updatingOrderStatus = action.payload
    },
    
    setProductUpdating: (state, action: PayloadAction<number | null>) => {
      state.ui.loadingActions.updatingProduct = action.payload
    },
    
    setCreatingProduct: (state, action: PayloadAction<boolean>) => {
      state.ui.loadingActions.creatingProduct = action.payload
    },
    
    setDeletingProduct: (state, action: PayloadAction<number | null>) => {
      state.ui.loadingActions.deletingProduct = action.payload
    },
    
    // 📢 NOTIFICACIONES
    addNotification: (state, action: PayloadAction<Omit<AdminUIState['notifications'][0], 'id' | 'timestamp'>>) => {
      const notification = {
        ...action.payload,
        id: `${Date.now()}-${Math.random()}`,
        timestamp: Date.now()
      }
      
      // Agregar al inicio
      state.notifications.unshift(notification)
      
      // Mantener máximo 10 notificaciones
      if (state.notifications.length > 10) {
        state.notifications = state.notifications.slice(0, 10)
      }
    },
    
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload)
    },
    
    clearNotifications: (state) => {
      state.notifications = []
    },
    
    // 🔄 HELPERS
    resetToInitialState: () => initialState,
    
    // Quick actions
    quickNavigate: (state, action: PayloadAction<{ view: AdminUIState['currentView']; id?: string | number }>) => {
      state.currentView = action.payload.view
      
      // Clear previous selections
      state.selectedOrderId = null
      state.selectedProductId = null
      state.selectedUserId = null
      
      // Set new selection if provided
      if (action.payload.id) {
        switch (action.payload.view) {
          case 'orders':
            state.selectedOrderId = action.payload.id as string
            break
          case 'products':
            state.selectedProductId = action.payload.id as number
            break
          case 'users':
            state.selectedUserId = action.payload.id as string
            break
        }
      }
    }
  }
})

export const {
  // Navigation
  setCurrentView,
  navigateToOrder,
  navigateToProduct,
  navigateToUser,
  clearSelection,
  quickNavigate,
  
  // Filters
  setOrderFilters,
  setProductFilters,
  setUserFilters,
  clearOrderFilters,
  clearProductFilters,
  clearUserFilters,
  
  // Pagination
  setOrdersPage,
  setProductsPage,
  setUsersPage,
  setPaginationLimit,
  
  // UI
  toggleSidebar,
  setSidebarCollapsed,
  toggleFilters,
  setShowFilters,
  setActiveModal,
  closeModal,
  
  // Loading actions
  setOrderStatusUpdating,
  setProductUpdating,
  setCreatingProduct,
  setDeletingProduct,
  
  // Notifications
  addNotification,
  removeNotification,
  clearNotifications,
  
  // Utils
  resetToInitialState
} = adminSlice.actions

export default adminSlice.reducer