import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux'
import { useMemo } from 'react'
import type { RootState, AppDispatch } from './store'
import { useGetAllAdminDataQuery, type Order, type Product, type User } from './api/adminApi'
import { 
  setCurrentView, 
  setOrderFilters, 
  setProductFilters, 
  setUserFilters,
  clearOrderFilters,
  clearProductFilters,
  clearUserFilters,
  setOrdersPage,
  setProductsPage,
  setUsersPage,
  navigateToOrder,
  navigateToProduct,
  navigateToUser,
  addNotification,
  removeNotification,
  quickNavigate
} from './slices/adminSlice'

// Hooks básicos tipados
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

// 🎯 HOOK PRINCIPAL - Carga única de datos
export const useAdminData = () => {
  const { data, error, isLoading, isFetching, refetch } = useGetAllAdminDataQuery(undefined, {
    // Configuración ultra-agresiva de cache
    refetchOnMountOrArgChange: 60 * 60, // Solo refetch si pasó 1 hora
    refetchOnFocus: false, // No refetch al cambiar de tab
    refetchOnReconnect: false, // No refetch al reconectar
    skip: false
  })

  return {
    // Datos principales (siempre disponibles una vez cargados)
    orders: data?.orders || [],
    products: data?.products || [],
    users: data?.users || [],
    dashboard: data?.dashboard,
    data, // Datos completos
    
    // Estados de carga (solo en carga inicial)
    isLoading,
    isFetching, 
    error,
    
    // Función de refetch manual (para casos excepcionales)
    refetch,
    
    // Metadata
    meta: data?.meta,
    isEmpty: !data || (!data.orders.length && !data.products.length && !data.users.length)
  }
}

// 🧭 HOOK DE NAVEGACIÓN INSTANTÁNEA
export const useAdminNavigation = () => {
  const dispatch = useAppDispatch()
  const { currentView, selectedOrderId, selectedProductId, selectedUserId } = useAppSelector(state => state.admin)
  
  return {
    currentView,
    selectedOrderId,
    selectedProductId, 
    selectedUserId,
    
    // Navegación instantánea
    goToDashboard: () => dispatch(setCurrentView('dashboard')),
    goToOrders: () => dispatch(setCurrentView('orders')),
    goToProducts: () => dispatch(setCurrentView('products')),
    goToUsers: () => dispatch(setCurrentView('users')),
    
    // Navegación con selección
    viewOrder: (id: string) => dispatch(navigateToOrder(id)),
    viewProduct: (id: number) => dispatch(navigateToProduct(id)),
    viewUser: (id: string) => dispatch(navigateToUser(id)),
    
    // Quick navigate
    navigate: (view: typeof currentView, id?: string | number) => 
      dispatch(quickNavigate({ view, id }))
  }
}

// 📊 HOOK DE DATOS FILTRADOS (aplicados localmente)
export const useFilteredAdminData = () => {
  const { orders, products, users, isLoading } = useAdminData()
  const { filters, pagination } = useAppSelector(state => state.admin)
  const dispatch = useAppDispatch()
  
  // 🔍 FILTRADO DE ORDERS (en memoria, súper rápido)
  const filteredOrders = useMemo(() => {
    let filtered = orders
    
    // Filtro de búsqueda
    if (filters.orders.search) {
      const search = filters.orders.search.toLowerCase()
      filtered = filtered.filter(order => 
        order.orderNumber.toLowerCase().includes(search) ||
        order.customerEmail.toLowerCase().includes(search) ||
        order.customerName?.toLowerCase().includes(search)
      )
    }
    
    // Filtro de estado
    if (filters.orders.status) {
      filtered = filtered.filter(order => order.status === filters.orders.status)
    }
    
    // Filtro de estado de pago
    if (filters.orders.paymentStatus) {
      filtered = filtered.filter(order => order.paymentStatus === filters.orders.paymentStatus)
    }
    
    // Filtro de fecha
    if (filters.orders.dateFrom) {
      const fromDate = new Date(filters.orders.dateFrom)
      filtered = filtered.filter(order => new Date(order.createdAt) >= fromDate)
    }
    
    if (filters.orders.dateTo) {
      const toDate = new Date(filters.orders.dateTo)
      toDate.setHours(23, 59, 59, 999) // Final del día
      filtered = filtered.filter(order => new Date(order.createdAt) <= toDate)
    }
    
    return filtered
  }, [orders, filters.orders])
  
  // 🔍 FILTRADO DE PRODUCTS
  const filteredProducts = useMemo(() => {
    let filtered = products
    
    // Búsqueda
    if (filters.products.search) {
      const search = filters.products.search.toLowerCase()
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(search) ||
        product.description?.toLowerCase().includes(search) ||
        product.category?.toLowerCase().includes(search)
      )
    }
    
    // Categoría
    if (filters.products.category) {
      filtered = filtered.filter(product => product.category === filters.products.category)
    }
    
    // Estado
    if (filters.products.status !== 'all') {
      filtered = filtered.filter(product => 
        filters.products.status === 'active' ? product.isActive : !product.isActive
      )
    }
    
    // Stock bajo
    if (filters.products.lowStock) {
      filtered = filtered.filter(product => product.stock <= 5)
    }
    
    return filtered
  }, [products, filters.products])
  
  // 🔍 FILTRADO DE USERS
  const filteredUsers = useMemo(() => {
    let filtered = users
    
    // Búsqueda
    if (filters.users.search) {
      const search = filters.users.search.toLowerCase()
      filtered = filtered.filter(user => 
        user.email.toLowerCase().includes(search) ||
        user.name?.toLowerCase().includes(search)
      )
    }
    
    // Rol
    if (filters.users.role) {
      filtered = filtered.filter(user => user.role === filters.users.role)
    }
    
    return filtered
  }, [users, filters.users])
  
  // 📄 PAGINACIÓN VIRTUAL (en memoria)
  const paginatedOrders = useMemo(() => {
    const { page, limit } = pagination.orders
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    return filteredOrders.slice(startIndex, endIndex)
  }, [filteredOrders, pagination.orders])
  
  const paginatedProducts = useMemo(() => {
    const { page, limit } = pagination.products
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    return filteredProducts.slice(startIndex, endIndex)
  }, [filteredProducts, pagination.products])
  
  const paginatedUsers = useMemo(() => {
    const { page, limit } = pagination.users
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    return filteredUsers.slice(startIndex, endIndex)
  }, [filteredUsers, pagination.users])
  
  // 📊 ESTADÍSTICAS DE FILTRADO
  const stats = useMemo(() => ({
    orders: {
      total: orders.length,
      filtered: filteredOrders.length,
      currentPage: paginatedOrders.length,
      totalPages: Math.ceil(filteredOrders.length / pagination.orders.limit)
    },
    products: {
      total: products.length,
      filtered: filteredProducts.length,
      currentPage: paginatedProducts.length,
      totalPages: Math.ceil(filteredProducts.length / pagination.products.limit)
    },
    users: {
      total: users.length,
      filtered: filteredUsers.length,
      currentPage: paginatedUsers.length,
      totalPages: Math.ceil(filteredUsers.length / pagination.users.limit)
    }
  }), [orders, products, users, filteredOrders, filteredProducts, filteredUsers, paginatedOrders, paginatedProducts, paginatedUsers, pagination])
  
  return {
    // Datos paginados listos para mostrar
    orders: paginatedOrders,
    products: paginatedProducts,
    users: paginatedUsers,
    
    // Datos filtrados completos
    allFilteredOrders: filteredOrders,
    allFilteredProducts: filteredProducts,
    allFilteredUsers: filteredUsers,
    
    // Control de filtros
    filters,
    setOrderFilters: (newFilters: any) => dispatch(setOrderFilters(newFilters)),
    setProductFilters: (newFilters: any) => dispatch(setProductFilters(newFilters)),
    setUserFilters: (newFilters: any) => dispatch(setUserFilters(newFilters)),
    clearOrderFilters: () => dispatch(clearOrderFilters()),
    clearProductFilters: () => dispatch(clearProductFilters()),
    clearUserFilters: () => dispatch(clearUserFilters()),
    
    // Control de paginación
    pagination,
    setOrdersPage: (page: number) => dispatch(setOrdersPage(page)),
    setProductsPage: (page: number) => dispatch(setProductsPage(page)),
    setUsersPage: (page: number) => dispatch(setUsersPage(page)),
    
    // Estadísticas útiles
    stats,
    
    // Estado de carga
    isLoading
  }
}

// 🔔 HOOK DE NOTIFICACIONES
export const useAdminNotifications = () => {
  const dispatch = useAppDispatch()
  const notifications = useAppSelector(state => state.admin.notifications)
  
  const showSuccess = (title: string, message?: string) => {
    dispatch(addNotification({ type: 'success', title, message, autoHide: true }))
  }
  
  const showError = (title: string, message?: string) => {
    dispatch(addNotification({ type: 'error', title, message, autoHide: false }))
  }
  
  const showWarning = (title: string, message?: string) => {
    dispatch(addNotification({ type: 'warning', title, message, autoHide: true }))
  }
  
  const showInfo = (title: string, message?: string) => {
    dispatch(addNotification({ type: 'info', title, message, autoHide: true }))
  }
  
  const dismiss = (id: string) => {
    dispatch(removeNotification(id))
  }
  
  return {
    notifications,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    dismiss
  }
}

// 🎯 HOOK PARA BUSCAR ELEMENTOS ESPECÍFICOS (súper rápido)
export const useAdminSearch = () => {
  const { orders, products, users } = useAdminData()
  
  // Funciones de búsqueda optimizadas
  const findOrder = (id: string): Order | undefined => {
    return orders.find(order => order.id === id)
  }
  
  const findProduct = (id: number): Product | undefined => {
    return products.find(product => product.id === id)
  }
  
  const findUser = (id: string): User | undefined => {
    return users.find(user => user.id === id)
  }
  
  const searchOrders = (query: string, limit = 10): Order[] => {
    if (!query.trim()) return []
    
    const search = query.toLowerCase()
    return orders
      .filter(order => 
        order.orderNumber.toLowerCase().includes(search) ||
        order.customerEmail.toLowerCase().includes(search) ||
        order.customerName?.toLowerCase().includes(search)
      )
      .slice(0, limit)
  }
  
  const searchProducts = (query: string, limit = 10): Product[] => {
    if (!query.trim()) return []
    
    const search = query.toLowerCase()
    return products
      .filter(product => 
        product.name.toLowerCase().includes(search) ||
        product.description?.toLowerCase().includes(search)
      )
      .slice(0, limit)
  }
  
  const searchUsers = (query: string, limit = 10): User[] => {
    if (!query.trim()) return []
    
    const search = query.toLowerCase()
    return users
      .filter(user => 
        user.email.toLowerCase().includes(search) ||
        user.name?.toLowerCase().includes(search)
      )
      .slice(0, limit)
  }
  
  return {
    // Búsqueda específica
    findOrder,
    findProduct,
    findUser,
    
    // Búsqueda por texto
    searchOrders,
    searchProducts,
    searchUsers,
    
    // Estadísticas rápidas
    totalOrders: orders.length,
    totalProducts: products.length,
    totalUsers: users.length
  }
}